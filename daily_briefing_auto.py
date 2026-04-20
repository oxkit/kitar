#!/usr/bin/env python3
"""
daily_briefing_auto.py
─────────────────────────────────────────────────────────────────────────────
Parses a Daily Economic Briefing Google Doc (supplied as HTML via stdin or
--html-file), updates the Daily tab (pane-daily) of index.html, then git
commits & pushes.

This script no longer handles Google Drive authentication — that is done
by the Claude scheduled task using the connected Google Drive MCP connector.

Usage:
  python daily_briefing_auto.py "Daily Economic Briefing 2026-04-20" < briefing.html
  python daily_briefing_auto.py "Daily Economic Briefing 2026-04-20" --html-file briefing.html
─────────────────────────────────────────────────────────────────────────────
"""

import os, re, subprocess, sys, argparse
from datetime import datetime

# ── Auto-install dependencies ─────────────────────────────────────────────────
def _pip(*pkgs):
    subprocess.run([sys.executable, "-m", "pip", "install", "--quiet",
                    "--break-system-packages", *pkgs], check=True)

try:
    from bs4 import BeautifulSoup
except ImportError:
    _pip("beautifulsoup4")
    from bs4 import BeautifulSoup

# ── Config ────────────────────────────────────────────────────────────────────
REPO_PATH       = os.path.dirname(os.path.abspath(__file__))
INDEX_HTML_PATH = os.path.join(REPO_PATH, "index.html")

# Read GitHub token from env var or local .github_token file (never committed)
_token_file = os.path.join(REPO_PATH, ".github_token")
GITHUB_TOKEN = (
    os.environ.get("GITHUB_TOKEN")
    or (open(_token_file).read().strip() if os.path.exists(_token_file) else "")
)

# ── Parsing helpers ────────────────────────────────────────────────────────────
STATUS_MAP = {
    "calm":       ("green",  "Calm"),
    "healthy":    ("green",  "Healthy"),
    "normal":     ("green",  "Normal"),
    "loose":      ("blue",   "Loose"),
    "supportive": ("blue",   "Supportive"),
    "neutral":    ("amber",  "Neutral"),
    "elevated":   ("amber",  "Elevated"),
    "tight":      ("red",    "Tight"),
    "stress":     ("red",    "Stress"),
    "high":       ("red",    "High"),
    "medium":     ("amber",  "Medium"),
    "low":        ("gray",   "Low"),
}

def resolve_status(raw):
    key = raw.strip().lower()
    return STATUS_MAP.get(key, ("gray", raw.strip()))

def parse_tables(soup):
    """Return all doc tables as list[ list[list[str]] ]."""
    out = []
    for tbl in soup.find_all("table"):
        rows = []
        for tr in tbl.find_all("tr"):
            cells = [td.get_text(" ", strip=True) for td in tr.find_all(["td","th"])]
            if any(c for c in cells):
                rows.append(cells)
        if rows:
            out.append(rows)
    return out

def heading_text(el):
    return el.get_text(" ", strip=True)

def bullets_under(soup, heading_pattern):
    """Collect bullet-point texts that follow a heading matching the pattern."""
    items, capture = [], False
    for el in soup.find_all(["h1","h2","h3","h4","p","li","ul"]):
        if el.name in ("h1","h2","h3","h4"):
            txt = heading_text(el)
            if re.search(heading_pattern, txt, re.IGNORECASE):
                capture, items = True, []
            elif capture:
                break
        elif capture and el.name in ("li","p"):
            t = el.get_text(" ", strip=True)
            if t:
                items.append(t)
    return items

def para_under(soup, heading_pattern):
    """Collect paragraph text that follows a heading matching the pattern."""
    return " ".join(bullets_under(soup, heading_pattern))

# ── Main parser ───────────────────────────────────────────────────────────────
def parse_briefing(html, doc_name):
    soup = BeautifulSoup(html, "html.parser")

    # ── Date ─────────────────────────────────────────────────────────────────
    m = re.search(r"(\d{4}-\d{2}-\d{2})", doc_name)
    if m:
        date_obj     = datetime.strptime(m.group(1), "%Y-%m-%d")
        date_display = date_obj.strftime("%A, %d %B %Y")
    else:
        date_display = datetime.now().strftime("%A, %d %B %Y")

    # ── Tables ────────────────────────────────────────────────────────────────
    tables = parse_tables(soup)

    # Metrics table: Metric | Value | Status | Market Context  (first table)
    metrics = []
    for tbl in tables:
        if not tbl:
            continue
        header = " ".join(tbl[0]).lower()
        if any(k in header for k in ("metric","move","sofr","nfci")):
            for row in tbl[1:]:
                if len(row) >= 4:
                    metrics.append({
                        "name":    row[0],
                        "value":   row[1],
                        "status":  resolve_status(row[2]),
                        "context": row[3],
                    })
            break

    # Fallback: regex scrape from plain text
    if not metrics:
        txt = soup.get_text("\n")
        for name, pat in (
            ("MOVE Index", r"MOVE[^:\d]*[:\s]+(\d+\.?\d*)"),
            ("SOFR Rate",  r"SOFR[^:\d%]*[:\s]+(\d+\.?\d*)%?"),
            ("NFCI",       r"NFCI[^:\d-]*[:\s]+(-?\d+\.?\d*)"),
        ):
            mo = re.search(pat, txt, re.IGNORECASE)
            val = mo.group(1) if mo else "N/A"
            metrics.append({"name": name, "value": val,
                             "status": ("gray","N/A"), "context": ""})

    # Calendar table: Event | EST | GMT+8 | Importance  (second table)
    calendar_events = []
    for i, tbl in enumerate(tables):
        if not tbl:
            continue
        header = " ".join(tbl[0]).lower()
        if any(k in header for k in ("event","est","gmt","importance","calendar")):
            for row in tbl[1:]:
                if len(row) >= 3:
                    calendar_events.append(row)
            break

    # ── Gnosis / Liquidity Analysis paragraph ─────────────────────────────────
    gnosis = ""
    for el in soup.find_all(["p","li"]):
        t = el.get_text(" ", strip=True)
        if re.search(r"liquidity analysis|gnosis|goldilocks", t, re.IGNORECASE):
            gnosis = re.sub(r"^Liquidity Analysis\s*[:\-]*\s*", "", t, flags=re.IGNORECASE).strip()
            break
    if not gnosis and metrics:
        mv = metrics[0]
        gnosis = f"MOVE at {mv['value']} and NFCI conditions define the current macro backdrop."

    # ── Geopolitical subsections ───────────────────────────────────────────────
    geo_sections = []
    capturing    = False
    cur_title    = None
    cur_bullets  = []
    STOP_SECTION = re.compile(r"trading strategy|economic calendar|liquidity", re.IGNORECASE)

    for el in soup.find_all(["h1","h2","h3","h4","li","p"]):
        txt = el.get_text(" ", strip=True)
        if not txt:
            continue
        if el.name in ("h1","h2","h3","h4"):
            if re.search(r"geopolit|policy watch|fed.*watch", txt, re.IGNORECASE):
                capturing = True
                continue
            if capturing:
                if STOP_SECTION.search(txt):
                    break
                if cur_title and cur_bullets:
                    geo_sections.append({"title": cur_title, "bullets": cur_bullets})
                cur_title, cur_bullets = txt, []
        elif capturing and el.name in ("li","p"):
            if STOP_SECTION.search(txt):
                break
            if cur_title:
                cur_bullets.append(txt)

    if cur_title and cur_bullets:
        geo_sections.append({"title": cur_title, "bullets": cur_bullets})

    # ── Trading Strategy ───────────────────────────────────────────────────────
    strategy_bullets = bullets_under(soup, r"trading strategy")

    return {
        "date_display":     date_display,
        "metrics":          metrics,
        "gnosis":           gnosis,
        "calendar_events":  calendar_events,
        "geo_sections":     geo_sections,
        "strategy_bullets": strategy_bullets,
    }

# ── HTML generation ────────────────────────────────────────────────────────────
COLOR_MAP = {
    "green":  ("#34d399", "rgba(52,211,153,0.12)",  "rgba(52,211,153,0.25)"),
    "red":    ("#f87171", "rgba(239,68,68,0.12)",   "rgba(239,68,68,0.3)"),
    "blue":   ("#60a5fa", "rgba(96,165,250,0.12)",  "rgba(96,165,250,0.25)"),
    "amber":  ("#fbbf24", "rgba(251,191,36,0.12)",  "rgba(251,191,36,0.25)"),
    "purple": ("#a78bfa", "rgba(139,92,246,0.12)",  "rgba(139,92,246,0.25)"),
    "gray":   ("#94a3b8", "rgba(148,163,184,0.12)", "rgba(148,163,184,0.25)"),
}

def badge(color, text):
    c, bg, bdr = COLOR_MAP.get(color, COLOR_MAP["gray"])
    return (f'<span style="background:{bg}; border:1px solid {bdr}; color:{c};'
            f' padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600;">{text}</span>')

def top_badge(color, text):
    c, bg, bdr = COLOR_MAP.get(color, COLOR_MAP["gray"])
    return (f'<span style="background:{bg}; border:1px solid {bdr}; color:{c};'
            f' padding:4px 12px; border-radius:6px; font-size:11px; font-weight:600;">{text}</span>')

def imp_badge(raw):
    return badge(resolve_status(raw)[0], resolve_status(raw)[1])

GEO_COLORS   = [("red","#f87171"), ("amber","#fbbf24"), ("blue","#60a5fa"), ("purple","#a78bfa")]
STRAT_COLORS = ["blue","green","amber","purple"]

def bullets_html(items):
    rows = "".join(f'<li style="margin-bottom:6px; color:#94a3b8; line-height:1.6;">{i}</li>'
                   for i in items)
    return f'<ul style="margin:0; padding-left:18px;">{rows}</ul>'

def generate_pane(d):
    # ── Top badges ────────────────────────────────────────────────────────────
    top_badges_html = ""
    for m in d["metrics"]:
        sc, st = m["status"]
        top_badges_html += "          " + top_badge(sc, f"{m['name'].split()[0]} {m['value']} {st}") + "\n"

    # ── Metrics table rows ────────────────────────────────────────────────────
    metric_rows = ""
    last_idx = len(d["metrics"]) - 1
    for i, m in enumerate(d["metrics"]):
        sc, st  = m["status"]
        mc, *_  = COLOR_MAP.get(sc, COLOR_MAP["gray"])
        border  = ' style="border-bottom:1px solid #1e293b;"' if i < last_idx else ""
        metric_rows += f"""
              <tr{border}>
                <td style="padding:10px 12px; color:#e2e8f0; font-weight:500;">{m['name']}</td>
                <td style="padding:10px 12px; text-align:right; color:{mc}; font-weight:700;">{m['value']}</td>
                <td style="padding:10px 12px; color:#94a3b8;">{m['context']}</td>
                <td style="padding:10px 12px; text-align:center;">{badge(sc, st)}</td>
              </tr>"""

    # ── Calendar rows ─────────────────────────────────────────────────────────
    cal_rows = ""
    events = d["calendar_events"]
    for i, row in enumerate(events):
        event = row[0] if len(row) > 0 else ""
        est   = row[1] if len(row) > 1 else ""
        gmt8  = row[2] if len(row) > 2 else ""
        imp   = row[3] if len(row) > 3 else ""
        notes = row[4] if len(row) > 4 else ""
        brd   = ' style="border-bottom:1px solid #1e293b;"' if i < len(events)-1 else ""
        cal_rows += f"""
              <tr{brd}>
                <td style="padding:10px 12px; color:#e2e8f0; font-weight:500;">{event}</td>
                <td style="padding:10px 12px; text-align:center; color:#94a3b8;">{est}</td>
                <td style="padding:10px 12px; text-align:center; color:#94a3b8;">{gmt8}</td>
                <td style="padding:10px 12px; text-align:center;">{imp_badge(imp)}</td>
                <td style="padding:10px 12px; color:#94a3b8;">{notes}</td>
              </tr>"""
    if not cal_rows:
        cal_rows = ('<tr><td colspan="5" style="padding:10px 12px; color:#64748b;'
                    ' text-align:center;">No scheduled events</td></tr>')

    # ── Geo blocks ────────────────────────────────────────────────────────────
    geo_html = ""
    for i, sec in enumerate(d["geo_sections"]):
        cidx       = i % len(GEO_COLORS)
        ck, ctxt   = GEO_COLORS[cidx]
        _, bg, bdr = COLOR_MAP[ck]
        is_last    = (i == len(d["geo_sections"]) - 1)
        mb         = "" if is_last else ' margin-bottom:16px;'
        geo_html  += f"""
          <div style="padding:14px; background:{bg}; border:1px solid {bdr}; border-radius:8px;{mb}">
            <div style="font-size:12px; font-weight:700; color:{ctxt}; margin-bottom:8px;">{sec['title']}</div>
            {bullets_html(sec['bullets'])}
          </div>"""

    # ── Strategy blocks ───────────────────────────────────────────────────────
    strat_html = ""
    for i, bullet in enumerate(d["strategy_bullets"]):
        ck         = STRAT_COLORS[i % len(STRAT_COLORS)]
        c, bg, bdr = COLOR_MAP[ck]
        if ":" in bullet:
            title, body = bullet.split(":", 1)
        else:
            title, body = f"Point {i+1}", bullet
        strat_html += f"""
            <div style="padding:12px 14px; background:{bg}; border:1px solid {bdr}; border-radius:8px;">
              <div style="font-size:11px; font-weight:600; color:{c}; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.4px;">{title.strip()}</div>
              <div style="font-size:13px; color:#94a3b8; line-height:1.6;">{body.strip()}</div>
            </div>"""

    return f"""
    <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <div>
          <div style="font-size:11px; font-weight:600; color:#60a5fa; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px;">Daily Economic Briefing</div>
          <h2 style="margin:0; font-size:20px; font-weight:700; color:#e2e8f0;">{d['date_display']}</h2>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
{top_badges_html}        </div>
      </div>

      <div style="background:#1a1f2e; border:1px solid #2d3748; border-radius:12px; padding:20px; margin-bottom:20px;">
        <div style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:14px;">📊 Liquidity &amp; Stress Metrics — The "Gnosis" Pulse</div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="border-bottom:1px solid #2d3748;">
                <th style="text-align:left; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Metric</th>
                <th style="text-align:right; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Value</th>
                <th style="text-align:left; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Market Context</th>
                <th style="text-align:center; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Status</th>
              </tr>
            </thead>
            <tbody>{metric_rows}
            </tbody>
          </table>
        </div>
        <div style="margin-top:14px; padding:12px 14px; background:rgba(96,165,250,0.06); border-left:3px solid #60a5fa; border-radius:0 6px 6px 0;">
          <span style="font-size:11px; font-weight:600; color:#60a5fa; text-transform:uppercase; letter-spacing:0.5px;">Gnosis Interpretation</span>
          <p style="margin:6px 0 0; font-size:13px; color:#94a3b8; line-height:1.6;">{d['gnosis']}</p>
        </div>
      </div>

      <div style="background:#1a1f2e; border:1px solid #2d3748; border-radius:12px; padding:20px; margin-bottom:20px;">
        <div style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:14px;">📅 Economic Calendar — Dual-Timezone Schedule</div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="border-bottom:1px solid #2d3748;">
                <th style="text-align:left; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Event</th>
                <th style="text-align:center; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">EST (US)</th>
                <th style="text-align:center; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">GMT+8 (Local)</th>
                <th style="text-align:center; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Importance</th>
                <th style="text-align:left; padding:8px 12px; color:#64748b; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.5px;">Notes</th>
              </tr>
            </thead>
            <tbody>{cal_rows}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background:#1a1f2e; border:1px solid #2d3748; border-radius:12px; padding:20px; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:16px;">🏛️ Geopolitical &amp; Policy Watch</div>
          {geo_html}
      </div>

      <div style="background:#1a1f2e; border:1px solid #2d3748; border-radius:12px; padding:20px; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:16px;">📈 Trading Strategy — ES Futures</div>
          <div style="display:flex; flex-direction:column; gap:12px;">{strat_html}
          </div>
      </div>
"""

# ── index.html update ─────────────────────────────────────────────────────────
PANE_START      = '<div id="pane-daily" class="tab-pane active">'
PANE_END_MARKER = '<div id="pane-navigator"'

def update_index_html(new_pane):
    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    start = html.find(PANE_START)
    end   = html.find(PANE_END_MARKER)
    if start == -1 or end == -1:
        raise ValueError("Cannot locate pane-daily boundaries in index.html")

    updated = (
        html[: start + len(PANE_START)]
        + "\n"
        + new_pane
        + "\n  </div>\n\n  "
        + html[end:]
    )

    with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(updated)
    print(f"  Updated: {INDEX_HTML_PATH}")

# ── Git commit & push ─────────────────────────────────────────────────────────
def git_push(doc_name):
    def run(args, **kw):
        r = subprocess.run(args, capture_output=True, text=True, **kw)
        out = (r.stdout + r.stderr).strip()
        if out:
            print("  git:", out)
        return r

    # Support both Windows host path and Linux sandbox mount path
    git_repo = REPO_PATH
    for candidate in [
        "/sessions/" + s + "/mnt/kitar"
        for s in (os.environ.get("SESSION_NAME", ""),) if s
    ]:
        if os.path.isdir(candidate):
            git_repo = candidate
            break

    if GITHUB_TOKEN:
        run(["git", "-C", git_repo, "remote", "set-url", "origin",
             f"https://{GITHUB_TOKEN}@github.com/oxkit/kitar.git"])

    run(["git", "-C", git_repo, "add", "index.html"])
    r = run(["git", "-C", git_repo, "commit", "-m",
             f"auto: update briefing — {doc_name}"])

    if "nothing to commit" not in (r.stdout + r.stderr):
        run(["git", "-C", git_repo, "push", "origin", "main"])

    if GITHUB_TOKEN:
        run(["git", "-C", git_repo, "remote", "set-url", "origin",
             "https://github.com/oxkit/kitar.git"])

# ── Entry point ───────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="Parse a Daily Economic Briefing HTML export and update index.html")
    parser.add_argument("doc_name", help="Name of the Google Doc (used for date extraction)")
    parser.add_argument("--html-file", help="Path to HTML file (default: read from stdin)")
    args = parser.parse_args()

    if args.html_file:
        with open(args.html_file, "r", encoding="utf-8") as f:
            html = f.read()
    else:
        html = sys.stdin.read()

    if not html.strip():
        print("ERROR: No HTML content received.", file=sys.stderr)
        sys.exit(1)

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    print(f"=== Daily Briefing Auto-Update  [{ts}] ===")
    print(f"  Doc: {args.doc_name}")

    data = parse_briefing(html, args.doc_name)

    print(f"  Date:             {data['date_display']}")
    for m in data["metrics"]:
        print(f"  {m['name']}: {m['value']}  ({m['status'][1]})")
    print(f"  Cal events:       {len(data['calendar_events'])}")
    print(f"  Geo sections:     {len(data['geo_sections'])}")
   