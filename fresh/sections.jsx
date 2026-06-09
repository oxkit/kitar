// sections.jsx — body sections B–H
const SECTIONS_CSS = `
.shead{max-width:780px;margin-bottom:54px;}
.shead .ey{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--tx-dim);display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.shead .ey::before{content:"";width:26px;height:1px;background:var(--accent);}
.shead h2{font-size:clamp(28px,3.6vw,44px);letter-spacing:-.025em;line-height:1.04;}
.shead .lead{margin-top:18px;font-size:18px;color:var(--tx-mut);line-height:1.6;max-width:64ch;}

/* hooks */
.hooks{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
@media(max-width:860px){.hooks{grid-template-columns:1fr;}}
.hook{padding:26px;border:1px solid var(--line);border-radius:14px;background:var(--bg-2);
  display:flex;flex-direction:column;gap:14px;transition:border-color .25s,transform .25s;}
.hook:hover{border-color:var(--line-2);transform:translateY(-3px);}
.hook-ix{font-family:var(--mono);font-size:12px;color:var(--warn);letter-spacing:.1em;
  display:flex;align-items:center;gap:9px;}
.hook-ix .sdot{box-shadow:0 0 9px var(--warn);}
.hook h3{font-size:21px;letter-spacing:-.015em;line-height:1.12;}
.hook .pain{color:var(--tx-mut);font-size:15px;line-height:1.55;}
.hook .fix{margin-top:auto;padding-top:14px;border-top:1px solid var(--line);
  font-family:var(--mono);font-size:13px;color:var(--ok);line-height:1.5;display:flex;gap:9px;}
.hook .fix .sdot{margin-top:5px;flex:0 0 auto;}

/* safety bullets */
.safety-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:48px;align-items:start;}
@media(max-width:920px){.safety-grid{grid-template-columns:1fr;gap:34px;}}
.safety-lead{font-size:22px;font-weight:500;letter-spacing:-.01em;line-height:1.35;}
.safety-lead .mono{color:var(--accent);}
.safety-note{margin-top:20px;font-family:var(--mono);font-size:13px;color:var(--tx-mut);
  line-height:1.6;padding:16px;border-left:2px solid var(--line-2);}
.safety-note b{color:var(--tx);font-weight:500;}

/* who / about */
.split-2{display:grid;grid-template-columns:1fr 1fr;gap:48px;}
@media(max-width:860px){.split-2{grid-template-columns:1fr;gap:32px;}}
.prose{font-size:18px;line-height:1.62;color:var(--tx-mut);}
.prose b{color:var(--tx);font-weight:500;}
.callout{margin-top:24px;padding:22px 24px;border-radius:12px;border:1px solid var(--line);
  background:var(--bg-2);font-size:18px;line-height:1.5;}
.callout .mono{color:var(--warn);font-size:13px;letter-spacing:.04em;display:block;margin-bottom:10px;text-transform:uppercase;}
.fits{display:flex;flex-direction:column;gap:12px;}
.fit{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--line);}
.fit .sdot{margin-top:7px;flex:0 0 auto;}
.fit-t{font-size:16px;color:var(--tx);}
.fit-d{font-family:var(--mono);font-size:13px;color:var(--tx-dim);margin-top:3px;}

/* pocket / telegram */
.pocket-grid{display:grid;grid-template-columns:.82fr 1.18fr;gap:48px;align-items:start;}
@media(max-width:920px){.pocket-grid{grid-template-columns:1fr;gap:36px;}}
.phone{position:relative;margin:0 auto;width:300px;max-width:100%;border-radius:42px;
  border:11px solid #0c0f14;background:#0c0f14;padding:0;overflow:hidden;
  box-shadow:0 40px 100px -34px #000,0 0 0 1px rgba(255,255,255,.05),inset 0 1px 0 rgba(255,255,255,.04);}
.phone-screen{position:relative;border-radius:31px;background:#0e1621;overflow:hidden;}
/* iOS status bar */
.ios-bar{display:flex;align-items:center;justify-content:space-between;padding:9px 24px 4px;
  background:#17212b;font-family:var(--sans);font-size:13px;font-weight:600;color:#fff;}
.ios-bar .ico-row{display:flex;align-items:center;gap:5px;}
.ios-bar svg{display:block;}
/* telegram header */
.tg-top{display:flex;align-items:center;gap:11px;padding:7px 12px 9px;background:#17212b;
  border-bottom:1px solid rgba(255,255,255,.04);}
.tg-back{display:flex;align-items:center;gap:5px;color:#62a0dc;font-family:var(--sans);font-size:14px;flex:0 0 auto;}
.tg-back .cnt{background:#62a0dc;color:#17212b;font-size:11px;font-weight:700;border-radius:50%;
  width:19px;height:19px;display:grid;place-items:center;}
.tg-title{flex:1;text-align:center;line-height:1.15;}
.tg-title b{font-size:15px;color:#fff;font-weight:600;letter-spacing:.01em;}
.tg-title span{display:block;font-size:11px;color:#7d8e9e;margin-top:1px;}
.tg-ava{width:33px;height:33px;border-radius:50%;flex:0 0 auto;display:grid;place-items:center;
  background:color-mix(in srgb,var(--accent) 18%,#0e1621);border:1px solid color-mix(in srgb,var(--accent) 50%,transparent);}
.tg-ava .glyph{position:relative;width:14px;height:14px;}
.tg-ava .glyph::before{content:"";position:absolute;inset:0;border:1.6px solid var(--accent);border-radius:3px;transform:rotate(45deg);}
/* chat feed with doodle backdrop */
.tg-feed{padding:13px 11px 10px;display:flex;flex-direction:column;gap:7px;min-height:430px;
  background-color:#0e1621;
  background-image:radial-gradient(circle at 18% 12%,rgba(255,255,255,.022) 0 9px,transparent 10px),
    radial-gradient(circle at 78% 22%,rgba(255,255,255,.02) 0 7px,transparent 8px),
    radial-gradient(circle at 42% 38%,rgba(255,255,255,.018) 0 11px,transparent 12px),
    radial-gradient(circle at 88% 56%,rgba(255,255,255,.02) 0 8px,transparent 9px),
    radial-gradient(circle at 24% 64%,rgba(255,255,255,.018) 0 10px,transparent 11px),
    radial-gradient(circle at 64% 82%,rgba(255,255,255,.02) 0 7px,transparent 8px),
    radial-gradient(circle at 12% 90%,rgba(255,255,255,.016) 0 9px,transparent 10px);
  background-size:240px 240px;}
.tg-date{align-self:center;background:rgba(0,0,0,.4);color:#cdd6df;font-family:var(--sans);
  font-size:11px;font-weight:500;padding:3px 12px;border-radius:12px;margin:3px 0;}
.tg-msg{align-self:flex-start;max-width:88%;background:#1c2733;border-radius:13px 13px 13px 5px;
  padding:8px 11px 6px;font-family:var(--sans);font-size:13px;line-height:1.34;color:#e9edf0;
  box-shadow:0 1px 1px rgba(0,0,0,.18);}
.tg-msg .h{font-weight:700;font-size:13.5px;color:#fff;line-height:1.3;}
.tg-msg .h .em{margin-right:6px;}
.tg-msg .h .pl{font-weight:500;color:#8aa0b3;font-size:12.5px;}
.tg-msg .d{font-family:var(--mono);font-size:11.5px;color:#aab8c5;margin-top:3px;letter-spacing:-.01em;}
.tg-msg .d b{color:#e9edf0;font-weight:600;}
.tg-msg .d .pos{color:#5fd38d;font-weight:600;} .tg-msg .d .neg{color:#ff6b6b;font-weight:600;}
.tg-msg .chk{color:#5fd38d;}
.tg-msg .t{font-size:10px;color:#5d6d7b;text-align:right;margin-top:1px;}
/* input bar */
.tg-input{display:flex;align-items:center;gap:9px;padding:9px 11px;background:#17212b;border-top:1px solid rgba(255,255,255,.04);}
.tg-menu{background:#3390ec;color:#fff;border-radius:17px;padding:7px 13px;font-family:var(--sans);
  font-size:12.5px;font-weight:600;display:flex;align-items:center;gap:6px;flex:0 0 auto;}
.tg-field{flex:1;color:#5d6d7b;font-family:var(--sans);font-size:13.5px;}
.tg-input .mic{color:#62a0dc;flex:0 0 auto;}

.pocket-cards{display:flex;flex-direction:column;gap:14px;}
.pcard{padding:22px 24px;border:1px solid var(--line);border-radius:14px;background:var(--bg-2);
  display:flex;gap:18px;align-items:flex-start;transition:border-color .25s,transform .25s;}
.pcard:hover{border-color:var(--line-2);transform:translateY(-2px);}
.pcard-ix{font-family:var(--mono);font-size:12px;color:var(--accent);letter-spacing:.1em;
  flex:0 0 auto;padding-top:3px;display:flex;align-items:center;gap:9px;}
.pcard-ix .sdot{box-shadow:0 0 9px var(--accent);}
.pcard h3{font-size:18px;letter-spacing:-.015em;line-height:1.15;}
.pcard p{color:var(--tx-mut);font-size:14.5px;line-height:1.55;margin-top:7px;}

/* about card */
.about-card{border:1px solid var(--line);border-radius:16px;background:var(--bg-2);padding:34px;}

/* product showcase */
.showcase{position:relative;}
.showcase .frame-glow{position:absolute;left:50%;top:18%;transform:translateX(-50%);width:80%;height:70%;z-index:0;
  background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 13%,transparent),transparent 65%);filter:blur(10px);pointer-events:none;}
.app-frame{position:relative;z-index:1;border:1px solid var(--line-2);border-radius:14px;overflow:hidden;
  background:var(--bg-2);box-shadow:0 40px 120px -40px rgba(0,0,0,.8),0 0 0 1px var(--line);}
.app-bar{display:flex;align-items:center;gap:13px;padding:11px 16px;background:var(--bg-3);border-bottom:1px solid var(--line);}
.app-dots{display:flex;gap:7px;}
.app-dots i{width:11px;height:11px;border-radius:50%;display:block;}
/* browser chrome variant */
.bro-url{flex:1;display:flex;align-items:center;gap:9px;justify-content:center;max-width:340px;margin:0 auto;
  font-family:var(--mono);font-size:11.5px;color:var(--tx-mut);background:var(--bg);border:1px solid var(--line);
  border-radius:7px;padding:6px 14px;letter-spacing:.01em;}
.bro-url .lock{color:var(--ok);font-size:10px;}
.bro-url b{color:var(--tx);font-weight:500;}
.app-bar .right{margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--tx-dim);display:flex;align-items:center;gap:7px;}
.app-bar .live-tag{color:var(--ok);}
.app-shot{display:block;width:100%;height:auto;}
.shot-scroll{display:block;width:100%;}
.shot-scroll .app-shot{width:100%;}
.showcase-caps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px;position:relative;z-index:1;}
@media(max-width:760px){.showcase-caps{grid-template-columns:1fr;}}
.scap{padding:15px 17px;border:1px solid var(--line);border-radius:11px;background:var(--bg-2);}
.scap .n{font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:.08em;display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.scap .t{font-size:14.5px;font-weight:600;letter-spacing:-.01em;}
.scap .d{font-family:var(--mono);font-size:12px;color:var(--tx-mut);margin-top:4px;line-height:1.5;}
/* secondary shot (MW chart) */
.showcase-second{display:grid;grid-template-columns:.9fr 1.1fr;gap:32px;align-items:center;margin-top:34px;position:relative;z-index:1;}
@media(max-width:860px){.showcase-second{grid-template-columns:1fr;gap:22px;}}
.showcase-second .ss-copy .lab{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--tx-dim);display:flex;align-items:center;gap:9px;margin-bottom:13px;}
.showcase-second .ss-copy h3{font-size:21px;letter-spacing:-.02em;line-height:1.12;}
.showcase-second .ss-copy p{margin-top:12px;font-size:15px;color:var(--tx-mut);line-height:1.6;}
/* mobile: keep wide product shots legible via horizontal scroll */
@media(max-width:760px){
  .shot-scroll.wide{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;}
  .shot-scroll.wide .app-shot{width:680px;min-width:680px;max-width:none;}
  .shot-scroll.wide::-webkit-scrollbar{height:6px;}
  .shot-scroll.wide::-webkit-scrollbar-thumb{background:var(--line-2);border-radius:6px;}
  .shot-scroll.wide::-webkit-scrollbar-track{background:var(--bg-3);}
}
.about-tag{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--tx-dim);margin-bottom:18px;}
.about-card .big{font-size:24px;font-weight:500;letter-spacing:-.015em;line-height:1.4;}
.about-card .domain{margin-top:22px;font-family:var(--mono);font-size:14px;color:var(--accent);
  display:flex;align-items:center;gap:9px;}

/* CTA */
.cta{position:relative;border-top:1px solid var(--line);padding:120px 0 90px;overflow:hidden;}
.cta-glow{position:absolute;bottom:-220px;left:50%;transform:translateX(-50%);width:1000px;height:480px;
  background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 14%,transparent),transparent 64%);
  z-index:0;pointer-events:none;filter:blur(6px);}
.cta .wrap{position:relative;z-index:1;text-align:center;}
.cta h2{font-size:clamp(32px,4.4vw,56px);letter-spacing:-.03em;line-height:1.02;max-width:18ch;margin:0 auto;}
.cta-sub{margin:20px auto 0;font-size:18px;color:var(--tx-mut);max-width:52ch;line-height:1.6;}
.cta-form{margin:38px auto 0;display:flex;gap:10px;max-width:520px;width:100%;}
.cta-form input{flex:1;min-width:0;background:var(--bg-2);border:1px solid var(--line-2);border-radius:9px;
  color:var(--tx);font-family:var(--mono);font-size:14.5px;padding:15px 16px;outline:none;transition:.18s;}
.cta-form input::placeholder{color:var(--tx-dim);}
.cta-form input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
.cta-form input.bad{border-color:var(--bad);box-shadow:0 0 0 3px rgba(255,94,87,.14);}
.cta-form input:disabled{background:var(--bg-3);border-color:var(--line);color:var(--tx-dim);cursor:not-allowed;}
.cta-form .btn-primary{flex:0 0 auto;}
@media(max-width:560px){.cta-form{flex-direction:column;}}
.cta-actions{margin:38px auto 0;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.cta-actions .btn{padding:15px 24px;font-size:14px;}
.x-btn{display:inline-flex;align-items:center;gap:10px;}
.x-glyph{display:inline-grid;place-items:center;width:20px;height:20px;border:1px solid currentColor;
  border-radius:5px;font-weight:700;font-size:12px;line-height:1;font-family:var(--sans);}
@media(max-width:560px){.cta-actions{flex-direction:column;}.cta-actions .btn{width:100%;justify-content:center;}}
.cta-msg{min-height:22px;margin-top:14px;font-family:var(--mono);font-size:13px;letter-spacing:.02em;}
.cta-msg.err{color:var(--bad);}
.cta-msg.ok{color:var(--ok);}
.cta-fine{margin-top:30px;font-family:var(--mono);font-size:12px;color:var(--tx-dim);letter-spacing:.04em;}

/* footer */
.foot{border-top:1px solid var(--line);padding:40px 0;}
.foot .wrap{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.foot-meta{font-family:var(--mono);font-size:12px;color:var(--tx-dim);letter-spacing:.05em;
  display:flex;gap:22px;flex-wrap:wrap;}
`;
(function(){const s=document.createElement('style');s.id='fresh-sections-css';s.textContent=SECTIONS_CSS;document.head.appendChild(s);})();

function SHead({eyebrow,title,lead}){
  return (
    <div className="shead reveal">
      <div className="ey">{eyebrow}</div>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

/* B · Hooks */
const HOOKS=[
  {t:"Ghost signals cost you real money.",
   pain:"Most MotiveWave vendor studies evaluate on the forming bar, then retract. You take the fill; the marker vanishes.",
   fix:"FRESH ingests bar-close data only — ghosts are impossible by design."},
  {t:"Copy execution is a liability without gates.",
   pain:"Fire into NinjaTrader, TopStepX and HyperLiquid at once and a single bad event compounds across every account.",
   fix:"The Execution Hub mirrors confirmed lifecycle fills only — through a stack of safety gates nothing in the UI can bypass."},
  {t:"Your edge should be evidence, not memory.",
   pain:"A good week feels like edge. It isn't. Without an audit trail you're trading on a feeling.",
   fix:"The Research Hub turns every session into a structured evidence packet for walk-forward analysis."},
];
function HooksSection(){
  const ref=useReveal();
  return (
    <section className="sec" id="problem" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="The problem" title="Three ways the machine breaks downstream of your strategy."
          lead="You're running a tiny trading desk with no operations infrastructure. Here's where it bites."/>
        <div className="hooks">
          {HOOKS.map((h,i)=>(
            <div className="hook reveal" key={i} style={{transitionDelay:(i*90)+'ms'}}>
              <div className="hook-ix"><span className="sdot warn"></span>HOOK {String(i+1).padStart(2,'0')}</div>
              <h3>{h.t}</h3>
              <p className="pain">{h.pain}</p>
              <div className="fix"><span className="sdot ok"></span><span>{h.fix}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* C · Architecture */
function HowSection(){
  const ref=useReveal();
  return (
    <section className="sec" id="how" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="What FRESH does" title="One control plane, from strategy state to every venue."
          lead="MotiveWave fires. FRESH takes it from there — three hubs that track state, build evidence, and route execution safely across four venues."/>
        <div className="reveal"><ArchFlow/></div>
      </div>
    </section>
  );
}

/* C2 · Live product showcase */
function ShowcaseSection(){
  const ref=useReveal();
  return (
    <section className="sec" id="live" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="Live on the desk" title="One system, the surfaces you actually use."
          lead="Not a mockup. Build plans with real depth in MotiveWave, watch them run on your chart, and monitor — or stop — everything from the FRESH terminal at app.kitar.co."/>
        <div className="showcase reveal">
          <div className="frame-glow"></div>
          <div className="app-frame">
            <div className="app-bar">
              <span className="app-dots"><i style={{background:'#ff5f57'}}></i><i style={{background:'#febc2e'}}></i><i style={{background:'#28c840'}}></i></span>
              <span className="bro-url"><span className="lock">⬢</span>app.kitar.co<b>/overview</b></span>
              <span className="right"><span className="live-tag">●</span>live</span>
            </div>
            <div className="shot-scroll wide"><img className="app-shot" src="fresh/assets/fresh-terminal.png" alt="FRESH terminal command-center overview — persistent vitals bar, performance scoreboard, and a needs-attention triage list"/></div>
          </div>
          <div className="showcase-caps">
            <div className="scap"><div className="n"><span className="sdot ok live"></span>command center</div>
              <div className="t">Triage, not a data dump</div>
              <div className="d">System posture up top; blocked copy and reconciliation surface as action items.</div></div>
            <div className="scap"><div className="n"><span className="sdot ok"></span>live vitals, every view</div>
              <div className="t">P&amp;L, venues, packet — at a glance</div>
              <div className="d">A persistent bar keeps today's ticks, venue health and copy state always on screen.</div></div>
            <div className="scap"><div className="n"><span className="sdot warn"></span>kill switch, one tap</div>
              <div className="t">Stop everything, instantly</div>
              <div className="d">Halt copy across every venue from the terminal — or from Telegram in your pocket.</div></div>
          </div>

          <div className="showcase-second">
            <div className="ss-copy">
              <div className="lab"><span className="sdot ok"></span>where the edge is defined</div>
              <h3>Plans with real depth — no black box.</h3>
              <p>Each plan slot is fully specified: direction, up to six gated conditions, plan-wide market &amp; time gates, stop and breakeven logic, and T1/T2/T3 targets. You see — and own — exactly why a trade fires.</p>
            </div>
            <div className="app-frame">
              <div className="app-bar">
                <span className="app-dots"><i style={{background:'#ff5f57'}}></i><i style={{background:'#febc2e'}}></i><i style={{background:'#28c840'}}></i></span>
                <span className="app-title" style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--tx-mut)',margin:'0 auto'}}>FRESH MW Strategy — Plan 7</span>
                <span className="right">MotiveWave</span>
              </div>
              <img className="app-shot" src="fresh/assets/fresh-plan.png" alt="FRESH MW Strategy Plan 7 configuration — conditions, plan gates, stop and targets"/>
            </div>
          </div>

          <div className="showcase-second" style={{gridTemplateColumns:'1.1fr .9fr'}}>
            <div className="app-frame">
              <div className="app-bar">
                <span className="app-dots"><i style={{background:'#ff5f57'}}></i><i style={{background:'#febc2e'}}></i><i style={{background:'#28c840'}}></i></span>
                <span className="app-title" style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--tx-mut)',margin:'0 auto'}}>ESM6 — Vol(1.5K)<span className="live-tag" style={{marginLeft:9}}>●&nbsp;feed live</span></span>
                <span className="right">MotiveWave</span>
              </div>
              <div className="shot-scroll wide"><img className="app-shot" src="fresh/assets/fresh-chart.png" alt="FRESH MW Strategy panel overlaid on a live ESM6 chart, showing 12 plan slots with per-plan net ticks and pause controls"/></div>
            </div>
            <div className="ss-copy">
              <div className="lab"><span className="sdot ok live"></span>where it runs</div>
              <h3>The panel lives on your chart.</h3>
              <p>Every plan slot, its entry/exit direction, live per-plan net ticks, and pause-longs / pause-shorts controls — overlaid right on the MotiveWave chart, in sync with the terminal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* D · Safety */
function SafetySection({motion}){
  const ref=useReveal();
  return (
    <section className="sec" id="safety" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="Safety by design" title="FRESH will not copy a trade unless every gate passes."
          lead="Retail copy products almost never talk about this. Capital preservation isn't a setting in FRESH — it's the architecture."/>
        <div className="safety-grid">
          <div className="reveal">
            <div className="safety-lead">Every path prefers <span className="mono">blocked</span>, <span className="mono">stale</span> or <span className="mono">manual_reconciliation_required</span> over an unsafe action.</div>
            <div className="safety-note">A trade event runs the full stack on the right, every time. <b>No shortcut in the UI can bypass it.</b> If any gate fails, copy is withheld and flagged for a human — nothing fires.</div>
          </div>
          <div className="reveal panel" style={{padding:20}}>
            <div className="gw-head" style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,fontFamily:'var(--mono)',fontSize:12,color:'var(--tx-mut)',letterSpacing:'.06em'}}>
              <span>execution hub · gate stack</span>
              <span style={{display:'flex',alignItems:'center',gap:7}}><span className="sdot ok live"></span>evaluating</span>
            </div>
            <GateStack motion={motion}/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* D2 · FRESH in your pocket */
const POCKET_CARDS=[
  {t:"Live trade alerts",
   d:"Every lifecycle event — plan fired, entry filled, breakeven set, target hit, stopped out — pushed to mobile as it happens."},
  {t:"Mobile controls",
   d:"Flip adapters on/off, switch execution mode, engage the kill switch or trading lock — directly from Telegram. No dashboard."},
  {t:"Research delivered",
   d:"Daily packet, morning brief, weekly summary, Saturday walk-forward — auto-delivered as file attachments. Research arrives; you don't fetch it."},
];
function PocketSection(){
  const ref=useReveal();
  return (
    <section className="sec" id="pocket" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="FRESH in your pocket" title="Your strategy fires. You hear it — anywhere."
          lead="Live fill alerts, kill-switch access, and your daily research packet — all delivered to Telegram. You don't need to be at your desk to know what's happening, or to stop something that shouldn't be happening."/>
        <div className="pocket-grid">
          <div className="reveal">
            <div className="phone">
              <div className="phone-screen">
                <div className="ios-bar">
                  <span>13:38</span>
                  <span className="ico-row">
                    <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
                    <span style={{fontSize:'11px',fontWeight:700}}>5G</span>
                    <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="2.5" stroke="#fff" strokeOpacity="0.5"/><rect x="2.5" y="2.5" width="13" height="7" rx="1" fill="#fff"/><rect x="22" y="4" width="1.6" height="4" rx="0.8" fill="#fff" fillOpacity="0.5"/></svg>
                  </span>
                </div>
                <div className="tg-top">
                  <span className="tg-back"><span style={{fontSize:'20px',lineHeight:1}}>‹</span><span className="cnt">6</span></span>
                  <span className="tg-title"><b>FRESH</b><span>bot</span></span>
                  <span className="tg-ava"><span className="glyph"></span></span>
                </div>
                <div className="tg-feed">
                  <div className="tg-msg">
                    <div className="h"><span className="em">✅</span>ENTRY FILLED<span className="pl">— Plan 1 LONG</span></div>
                    <div className="d">Fill: <b>7,471.00</b>  |  Qty: 1</div>
                    <div className="d">Bracket: attached <span className="chk">✓</span></div>
                    <div className="t">21:22</div>
                  </div>
                  <div className="tg-msg">
                    <div className="h"><span className="em">🔴</span>STOPPED OUT<span className="pl">— Plan 1 LONG</span></div>
                    <div className="d">Stop: <b>7,464.75</b>  |  <span className="neg">−6.25 pts (−25 ticks)</span></div>
                    <div className="t">21:25</div>
                  </div>
                  <span className="tg-date">Today</span>
                  <div className="tg-msg">
                    <div className="h"><span className="em">🔔</span>PLAN FIRED<span className="pl">— Plan 1 LONG</span></div>
                    <div className="d">Symbol: MESM6  |  Qty: 1</div>
                    <div className="d">Intent px: <b>7,437.50</b></div>
                    <div className="t">01:29</div>
                  </div>
                  <div className="tg-msg">
                    <div className="h"><span className="em">🔵</span>BREAKEVEN SET<span className="pl">— Plan 1 LONG</span></div>
                    <div className="d">Stop moved to: <b>7,437.75</b> (entry)</div>
                    <div className="t">01:29</div>
                  </div>
                  <div className="tg-msg">
                    <div className="h"><span className="em">🎯</span>TARGET FILLED<span className="pl">— Plan 1 LONG</span></div>
                    <div className="d">Exit: <b>7,441.50</b>  |  <span className="pos">+4.00 pts (+16 ticks)</span></div>
                    <div className="t">01:29</div>
                  </div>
                </div>
                <div className="tg-input">
                  <span className="tg-menu">☰ Menu</span>
                  <span className="tg-field">Message</span>
                  <span className="mic">🎤</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="pocket-cards">
              {POCKET_CARDS.map((c,i)=>(
                <div className="pcard reveal" key={i} style={{transitionDelay:(i*80)+'ms'}}>
                  <div className="pcard-ix"><span className="sdot ok"></span>{String(i+1).padStart(2,'0')}</div>
                  <div><h3>{c.t}</h3><p>{c.d}</p></div>
                </div>
              ))}
            </div>
            <div className="callout reveal" style={{marginTop:16}}>
              <span className="mono">// what it is not</span>
              The bot <b>cannot place trades, modify orders, or make any execution decision.</b> It controls copy dispatch and delivers research. MotiveWave remains the execution master.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* E · Research */
function ResearchSection({motion}){
  const ref=useReveal();
  return (
    <section className="sec" id="research" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="Research that compounds" title="Every session becomes evidence. Evidence becomes edge."
          lead="The Research Hub turns trading days into structured packets your local AI analyzes — so over time you actually know whether your strategies work."/>
        <div className="reveal"><ResearchFlywheel motion={motion}/></div>
      </div>
    </section>
  );
}

/* F · Who it's for */
const FITS=[
  {t:"Run systematic strategies in MotiveWave",d:"ES, NQ or similar — trading as a craft, not a hobby"},
  {t:"Trade prop accounts on TopStepX",d:"and want clean, auditable execution discipline"},
  {t:"Use or want NinjaTrader copy execution",d:"with gates instead of duct tape"},
  {t:"Are exploring HyperLiquid for crypto futures",d:"one control plane across every venue"},
];
function WhoSection(){
  const ref=useReveal();
  return (
    <section className="sec" id="who" ref={ref}>
      <div className="wrap">
        <SHead eyebrow="Who it's for" title="Built for traders who already operate like a desk."/>
        <div className="split-2">
          <div className="reveal">
            <p className="prose">If you take signals seriously, run prop accounts, and want systematic discipline across venues — <b>FRESH is the operations layer you've been hand-building in spreadsheets.</b> You respect technical depth. You've been burned by black boxes.</p>
            <div className="callout">
              <span className="mono">// what FRESH is not</span>
              If you're looking for an AI to pick your trades, <b>FRESH isn't it.</b> No signal service. No black box. No cloud lock-in. Local AI advises in the research path — it never touches the order path.
            </div>
          </div>
          <div className="reveal fits">
            {FITS.map((f,i)=>(
              <div className="fit" key={i}>
                <span className="sdot ok"></span>
                <div><div className="fit-t">{f.t}</div><div className="fit-d">{f.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* G · About */
function AboutSection(){
  const ref=useReveal();
  return (
    <section className="sec" id="about" ref={ref}>
      <div className="wrap">
        <div className="split-2" style={{alignItems:'center'}}>
          <div className="reveal">
            <SHead eyebrow="About kitar" title="A one-person quant company, building the missing layer."/>
          </div>
          <div className="reveal about-card">
            <div className="about-tag">// kitar</div>
            <p className="big">FRESH exists because the gap between retail and institutional operations infrastructure was too wide. So I built the control plane I wanted: local-first, evidence-driven, safe by default. No team, no cloud, no black box — just the machine that should sit between your strategy and your venues.</p>
            <div className="domain"><span className="sdot ok live"></span>oxkit</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* H · CTA + footer */
function CTASection(){
  const ref=useReveal();
  return (
    <section className="cta" id="apply" ref={ref}>
      <div className="cta-glow"></div>
      <div className="wrap">
        <div className="kicker reveal" style={{justifyContent:'center',marginBottom:22}}><span className="dot"></span>Live now</div>
        <h2 className="reveal">The FRESH terminal is live.</h2>
        <p className="cta-sub reveal">Built for serious systematic traders running MotiveWave across NinjaTrader, TopStepX and HyperLiquid. Open the live command center — or reach out directly.</p>
        <div className="cta-actions reveal">
          <a className="btn btn-primary" href="https://app.kitar.co/">Open Live Terminal →</a>
          <a className="btn btn-ghost x-btn" href="https://x.com/oxkitng" target="_blank" rel="noopener">
            <span className="x-glyph">X</span>@oxkitng
          </a>
        </div>
        <div className="cta-fine reveal">enquiries via X DM · no guaranteed returns · not a trading bot · runs on your machine</div>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="foot">
      <div className="wrap">
        <Wordmark/>
        <div className="foot-meta">
          <span>Futures Research, Execution &amp; Strategy Hub</span>
          <span>kitar.co</span>
          <span>© 2026 kitar</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window,{HooksSection,HowSection,ShowcaseSection,SafetySection,PocketSection,ResearchSection,WhoSection,AboutSection,CTASection,Footer});
