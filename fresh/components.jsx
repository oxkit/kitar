// components.jsx — shared FRESH building blocks (exported to window)
const { useState, useEffect, useRef, useMemo } = React;

/* ── component-scoped styles ─────────────────────────────────────────────── */
const FRESH_CSS = `
/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 32px;transition:background .3s ease,border-color .3s ease,padding .3s ease;
  border-bottom:1px solid transparent;}
.nav.scrolled{background:rgba(6,8,11,.82);-webkit-backdrop-filter:blur(14px);
  backdrop-filter:blur(14px);border-bottom-color:var(--line);padding:11px 32px;}
.wordmark{display:flex;align-items:center;gap:11px;}
.wordmark .wm-glyph{width:30px;height:30px;flex:0 0 auto;border-radius:7px;display:block;}
.wordmark .wm-text{height:17px;width:auto;display:block;}
.nav.scrolled .wordmark .wm-glyph{width:27px;height:27px;}
.nav.scrolled .wordmark .wm-text{height:16px;}
.nav-right{display:flex;align-items:center;gap:22px;}
.nav-stat{display:none;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;
  color:var(--tx-mut);letter-spacing:.04em;}
@media(min-width:760px){.nav-stat{display:flex;}}
.nav-link{font-family:var(--mono);font-size:12.5px;letter-spacing:.04em;color:var(--tx-mut);
  transition:color .15s;}
.nav-link:hover{color:var(--tx);}
@media(max-width:560px){
  .nav{padding:13px 18px;}
  .nav.scrolled{padding:10px 18px;}
  .nav-right{gap:14px;}
  .nav-link{display:none;}
}

/* SIGNAL TICKER */
.ticker{position:relative;overflow:hidden;border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);background:var(--bg-2);}
.ticker::before,.ticker::after{content:"";position:absolute;top:0;bottom:0;width:90px;z-index:2;pointer-events:none;}
.ticker::before{left:0;background:linear-gradient(90deg,var(--bg-2),transparent);}
.ticker::after{right:0;background:linear-gradient(270deg,var(--bg-2),transparent);}
.ticker-track{display:flex;gap:0;width:max-content;}
body.motion-on .ticker-track{animation:ticker-scroll 46s linear infinite;}
@keyframes ticker-scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.ticker:hover .ticker-track{animation-play-state:paused;}
.tk-item{display:flex;align-items:center;gap:12px;padding:13px 26px;
  border-right:1px solid var(--line);font-family:var(--mono);font-size:12.5px;white-space:nowrap;}
.tk-time{color:var(--tx-dim);}
.tk-sym{color:var(--tx);font-weight:600;letter-spacing:.03em;}
.tk-tag{color:var(--tx-mut);}
.tk-ok{color:var(--ok);display:flex;align-items:center;gap:6px;}
.tk-ghost{color:var(--warn);display:flex;align-items:center;gap:6px;text-decoration:line-through;
  text-decoration-color:rgba(245,177,61,.5);}

/* generic schematic node */
.node{background:var(--bg-3);border:1px solid var(--line);border-radius:10px;padding:16px 18px;
  position:relative;transition:border-color .3s,box-shadow .3s;}
.node .nlabel{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--tx-dim);margin-bottom:7px;display:flex;align-items:center;gap:8px;}
.node .ntitle{font-size:16px;font-weight:600;letter-spacing:-.01em;}
.node .ndesc{font-size:13px;color:var(--tx-mut);margin-top:5px;line-height:1.45;font-family:var(--mono);}
.node.accent{border-color:color-mix(in srgb,var(--accent) 55%,transparent);
  box-shadow:0 0 0 1px color-mix(in srgb,var(--accent) 22%,transparent),0 12px 40px -18px var(--accent);}

/* ARCH FLOW */
.arch{position:relative;}
.arch-svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;}
.arch-tier{position:relative;z-index:1;display:grid;gap:18px;}
.arch-tier.t1{grid-template-columns:1fr;max-width:440px;margin:0 auto;}
.arch-tier.t2{grid-template-columns:repeat(3,1fr);margin:64px 0;}
.arch-tier.t3{grid-template-columns:repeat(3,1fr);}
.flow-dot{fill:var(--accent);}
body.motion-on .flow-dash{stroke-dasharray:5 7;animation:dashmove 1.1s linear infinite;}
@keyframes dashmove{to{stroke-dashoffset:-24;}}
@media(max-width:760px){
  .arch-tier.t2,.arch-tier.t3{grid-template-columns:1fr;}
  .arch-tier.t2{margin:30px 0;}
  .arch-svg{display:none;}
}

/* GATE STACK */
.gates{display:grid;grid-template-columns:1fr;gap:10px;position:relative;}
.gate{display:flex;align-items:center;gap:16px;padding:15px 18px;border-radius:10px;
  border:1px solid var(--line);background:var(--bg-3);transition:.32s ease;}
.gate.active{border-color:color-mix(in srgb,var(--ok) 60%,transparent);
  background:color-mix(in srgb,var(--ok) 9%,var(--bg-3));}
.gate.blocked{border-color:color-mix(in srgb,var(--bad) 60%,transparent);
  background:color-mix(in srgb,var(--bad) 10%,var(--bg-3));}
.gate.pending{opacity:.5;}
.gate-ix{font-family:var(--mono);font-size:12px;color:var(--tx-dim);width:26px;flex:0 0 auto;}
.gate-body{flex:1;min-width:0;}
.gate-name{font-size:15px;font-weight:600;letter-spacing:-.01em;}
.gate-sub{font-family:var(--mono);font-size:12px;color:var(--tx-mut);margin-top:2px;}
.gate-state{font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;
  display:flex;align-items:center;gap:7px;flex:0 0 auto;color:var(--tx-dim);}
.gate.active .gate-state{color:var(--ok);}
.gate.blocked .gate-state{color:var(--bad);}
.gate-readout{margin-top:18px;display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;border-radius:10px;font-family:var(--mono);font-size:13px;
  border:1px solid var(--line);background:var(--bg-2);transition:.3s;}
.gate-readout.pass{border-color:color-mix(in srgb,var(--ok) 55%,transparent);color:var(--ok);}
.gate-readout.fail{border-color:color-mix(in srgb,var(--bad) 55%,transparent);color:var(--bad);}

/* FLYWHEEL */
.fly{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;position:relative;}
.fly-step{position:relative;padding:22px 20px;border-radius:12px;border:1px solid var(--line);
  background:var(--bg-3);transition:.3s;}
.fly-step.lit{border-color:color-mix(in srgb,var(--accent) 60%,transparent);
  box-shadow:0 0 0 1px color-mix(in srgb,var(--accent) 22%,transparent);}
.fly-ix{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--tx-dim);}
.fly-step.lit .fly-ix{color:var(--accent);}
.fly-name{font-size:18px;font-weight:600;margin-top:10px;letter-spacing:-.01em;}
.fly-desc{font-family:var(--mono);font-size:12px;color:var(--tx-mut);margin-top:8px;line-height:1.5;}
.fly-arrow{position:absolute;right:-12px;top:50%;transform:translateY(-50%);z-index:2;
  color:var(--tx-dim);font-size:14px;}
.fly-loop{margin-top:14px;text-align:center;font-family:var(--mono);font-size:12px;
  color:var(--tx-mut);letter-spacing:.04em;}
.fly-loop b{color:var(--accent);font-weight:500;}
@media(max-width:760px){.fly{grid-template-columns:1fr;}.fly-arrow{display:none;}}
`;
(function injectCSS(){
  const s=document.createElement('style'); s.id='fresh-components-css'; s.textContent=FRESH_CSS;
  document.head.appendChild(s);
})();

/* ── hooks ───────────────────────────────────────────────────────────────── */
function useReveal(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const els=el.matches?.('.reveal')?[el]:[...el.querySelectorAll('.reveal')];
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
    els.forEach(n=>io.observe(n));
    return ()=>io.disconnect();
  },[]);
  return ref;
}

/* ── primitives ──────────────────────────────────────────────────────────── */
function Wordmark(){
  return (
    <a className="wordmark" href="#top" aria-label="FRESH home">
      <img className="wm-glyph" src="fresh/assets/fresh-glyph-v2.png" alt="" />
      <img className="wm-text" src="fresh/assets/fresh-wordmark.png" alt="FRESH" />
    </a>
  );
}

function Nav({onApply}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const f=()=>setScrolled(window.scrollY>24);
    f(); window.addEventListener('scroll',f,{passive:true});
    return ()=>window.removeEventListener('scroll',f);
  },[]);
  return (
    <nav className={"nav"+(scrolled?" scrolled":"")}>
      <Wordmark/>
      <div className="nav-right">
        <span className="nav-stat"><span className="sdot ok live"></span>local · 4 venues linked</span>
        <a className="btn btn-primary" style={{padding:'10px 16px'}} href="https://app.kitar.co/">Live Terminal →</a>
      </div>
    </nav>
  );
}

/* ── Signal ticker ───────────────────────────────────────────────────────── */
const TICKER_EVENTS=[
  {t:"14:32:00",s:"ES",tag:"long entry · bar-close",ok:true},
  {t:"14:31:45",s:"NQ",tag:"forming-bar marker",ghost:true},
  {t:"14:31:30",s:"ES",tag:"lifecycle fill confirmed",ok:true},
  {t:"14:30:15",s:"NQ",tag:"exit · bar-close",ok:true},
  {t:"14:29:58",s:"ES",tag:"retracted study signal",ghost:true},
  {t:"14:29:30",s:"MES",tag:"scale-in confirmed",ok:true},
  {t:"14:28:45",s:"NQ",tag:"long entry · bar-close",ok:true},
  {t:"14:28:02",s:"ES",tag:"phantom tick marker",ghost:true},
  {t:"14:27:30",s:"MNQ",tag:"flat · session close",ok:true},
  {t:"14:26:50",s:"ES",tag:"lifecycle fill confirmed",ok:true},
];
function SignalTicker(){
  const items=[...TICKER_EVENTS,...TICKER_EVENTS];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((e,i)=>(
          <div className="tk-item" key={i}>
            <span className="tk-time">{e.t}</span>
            <span className="tk-sym">{e.s}</span>
            <span className="tk-tag">{e.tag}</span>
            {e.ok
              ? <span className="tk-ok"><span className="sdot ok"></span>accepted</span>
              : <span className="tk-ghost">ghost · rejected</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Architecture flow ───────────────────────────────────────────────────── */
function ArchFlow(){
  return (
    <div className="arch" style={{padding:'8px 0'}}>
      <svg className="arch-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* source(50%,top) -> bus -> hubs(16.7/50/83.3) */}
        <g fill="none" stroke="var(--line-2)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M50 18 L50 30 M16.7 30 L83.3 30 M16.7 30 L16.7 40 M50 30 L50 40 M83.3 30 L83.3 40"/>
          {/* execution hub(83.3) -> bus -> venues */}
          <path d="M83.3 62 L83.3 72 M16.7 72 L83.3 72 M16.7 72 L16.7 82 M50 72 L50 82 M83.3 72 L83.3 82"/>
        </g>
        <g fill="none" stroke="var(--accent)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" className="flow-dash" opacity="0.85">
          <path d="M50 18 L50 30 M16.7 30 L83.3 30 M16.7 30 L16.7 40 M50 30 L50 40 M83.3 30 L83.3 40"/>
          <path d="M83.3 62 L83.3 72 M16.7 72 L83.3 72 M16.7 72 L16.7 82 M50 72 L50 82 M83.3 72 L83.3 82"/>
        </g>
      </svg>

      <div className="arch-tier t1">
        <div className="node accent">
          <div className="nlabel"><span className="sdot ok live"></span>source · strategy state</div>
          <div className="ntitle">MotiveWave → FRESH Strategy</div>
          <div className="ndesc">Your strategy fires. FRESH ingests bar-close state only.</div>
        </div>
      </div>

      <div className="arch-tier t2">
        <div className="node">
          <div className="nlabel">component 01</div>
          <div className="ntitle">Strategy Hub</div>
          <div className="ndesc">Tracks live strategy &amp; position state across instruments.</div>
        </div>
        <div className="node">
          <div className="nlabel">component 02</div>
          <div className="ntitle">Research Hub</div>
          <div className="ndesc">Turns each session into a structured evidence packet.</div>
        </div>
        <div className="node accent">
          <div className="nlabel"><span className="sdot ok live"></span>component 03</div>
          <div className="ntitle">Execution Hub</div>
          <div className="ndesc">Routes confirmed fills through the safety-gate stack.</div>
        </div>
      </div>

      <div className="arch-tier t3">
        {[["NinjaTrader","copy execution"],["TopStepX","prop accounts"],["HyperLiquid","crypto futures"]].map(([n,d],i)=>(
          <div className="node" key={i}>
            <div className="nlabel"><span className="sdot idle"></span>venue</div>
            <div className="ntitle" style={{fontSize:15}}>{n}</div>
            <div className="ndesc">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Gate stack sequence ─────────────────────────────────────────────────── */
const GATES=[
  {name:"Kill switch",sub:"global halt must be disarmed"},
  {name:"Stale-event check",sub:"event age within tolerance"},
  {name:"Enabled-account routing",sub:"target account explicitly enabled"},
  {name:"Risk gates",sub:"size, exposure & loss limits pass"},
  {name:"Confirmed fill — not intent",sub:"mirror lifecycle fills only"},
];
function GateStack({motion}){
  const [step,setStep]=useState(GATES.length); // index reached; >=len = done
  const [blockAt,setBlockAt]=useState(-1);
  const timer=useRef(null);
  useEffect(()=>{
    if(!motion){ setStep(GATES.length); setBlockAt(-1); return; }
    let i=0; let block=-1; let runs=0;
    const tick=()=>{
      // start of a run
      if(i===0){ runs++; block = (runs%3===0) ? (1+Math.floor(Math.random()*(GATES.length-1))) : -1; setBlockAt(-1); }
      setStep(i);
      if(block===i){ setBlockAt(i); i=0; timer.current=setTimeout(tick,2200); return; }
      i++;
      if(i>GATES.length){ i=0; timer.current=setTimeout(tick,2400); return; }
      timer.current=setTimeout(tick,720);
    };
    tick();
    return ()=>clearTimeout(timer.current);
  },[motion]);

  const done = step>=GATES.length && blockAt<0;
  return (
    <div>
      <div className="gates">
        {GATES.map((g,i)=>{
          let cls="gate pending";
          if(blockAt>=0){ cls = i<blockAt?"gate active":(i===blockAt?"gate blocked":"gate pending"); }
          else { cls = i<=step?"gate active":"gate pending"; }
          if(!motion) cls="gate active";
          const blocked = blockAt===i;
          return (
            <div className={cls} key={i}>
              <span className="gate-ix">G{String(i+1).padStart(2,'0')}</span>
              <div className="gate-body">
                <div className="gate-name">{g.name}</div>
                <div className="gate-sub">{g.sub}</div>
              </div>
              <span className="gate-state">
                {blocked
                  ? <><span className="sdot bad"></span>blocked</>
                  : (cls.includes("active")
                      ? <><span className="sdot ok"></span>pass</>
                      : <><span className="sdot idle"></span>—</>)}
              </span>
            </div>
          );
        })}
      </div>
      <div className={"gate-readout "+(blockAt>=0?"fail":(done?"pass":""))}>
        <span>{blockAt>=0
          ? "→ manual_reconciliation_required · copy withheld"
          : (done? "→ confirmed fill mirrored to enabled accounts" : "→ evaluating event…")}</span>
        <span>{blockAt>=0?"UNSAFE · STOPPED":"SAFE"}</span>
      </div>
    </div>
  );
}

/* ── Research flywheel ───────────────────────────────────────────────────── */
const FLY=[
  {n:"Session",d:"A day of live trading — every signal, fill & regime shift."},
  {n:"Packet",d:"Auto-built evidence: signal counts, coverage, telemetry."},
  {n:"Research",d:"Local AI runs walk-forward analysis on the packet."},
  {n:"Decision",d:"You learn what's edge and what's noise — and adjust."},
];
function ResearchFlywheel({motion}){
  const [lit,setLit]=useState(motion?0:-1);
  useEffect(()=>{
    if(!motion){ setLit(-1); return; }
    const id=setInterval(()=>setLit(p=>(p+1)%FLY.length),1300);
    return ()=>clearInterval(id);
  },[motion]);
  return (
    <div>
      <div className="fly">
        {FLY.map((s,i)=>(
          <div className={"fly-step"+(lit===i?" lit":"")} key={i}>
            <div className="fly-ix">{String(i+1).padStart(2,'0')} / {motion&&lit===i?"active":"step"}</div>
            <div className="fly-name">{s.n}</div>
            <div className="fly-desc">{s.d}</div>
            {i<FLY.length-1 && <span className="fly-arrow">→</span>}
          </div>
        ))}
      </div>
      <div className="fly-loop">↻ &nbsp;evidence compounds — <b>better decisions feed the next session</b></div>
    </div>
  );
}

Object.assign(window,{useReveal,Wordmark,Nav,SignalTicker,ArchFlow,GateStack,ResearchFlywheel});
