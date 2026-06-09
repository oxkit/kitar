// hero.jsx — three switchable hero directions
const HERO_CSS = `
.hero{position:relative;padding:148px 0 70px;overflow:hidden;}
.hero-glow{position:absolute;top:-160px;left:50%;transform:translateX(-50%);
  width:1100px;height:560px;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 16%,transparent),transparent 62%);
  opacity:.6;filter:blur(8px);}
.hero .wrap{position:relative;z-index:1;}
.hero-head{font-size:clamp(38px,5.6vw,74px);font-weight:600;letter-spacing:-.03em;
  line-height:1.0;max-width:16ch;}
.hero-head .hl{color:var(--accent);}
.hero-sub{margin-top:26px;font-size:clamp(16px,1.5vw,19px);color:var(--tx-mut);
  max-width:60ch;line-height:1.6;}
.hero-sub b{color:var(--tx);font-weight:500;}
.hero-cta{margin-top:34px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.hero-meta{margin-top:30px;display:flex;gap:26px;flex-wrap:wrap;
  font-family:var(--mono);font-size:12px;color:var(--tx-dim);letter-spacing:.04em;}
.hero-meta span{display:flex;align-items:center;gap:8px;}

/* layout A: terminal (split) */
.hero-split{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;}
@media(max-width:920px){.hero-split{grid-template-columns:1fr;gap:40px;}}

/* mini status board (A) */
.board{font-family:var(--mono);}
.board-top{display:flex;align-items:center;justify-content:space-between;
  padding:13px 16px;border:1px solid var(--line);border-bottom:0;border-radius:12px 12px 0 0;
  background:var(--bg-2);font-size:12px;color:var(--tx-mut);letter-spacing:.05em;}
.board-body{border:1px solid var(--line);border-radius:0 0 12px 12px;background:var(--bg-2);
  padding:6px;}
.board-row{display:flex;align-items:center;gap:14px;padding:13px 14px;border-radius:8px;
  font-size:13px;}
.board-row+.board-row{border-top:1px solid var(--line);}
.board-row .bk{color:var(--tx-dim);width:118px;flex:0 0 auto;letter-spacing:.04em;}
.board-row .bv{color:var(--tx);flex:1;min-width:0;}
.board-row .bs{display:flex;align-items:center;gap:7px;color:var(--ok);font-size:12px;letter-spacing:.06em;}
.board-row .bs.warn{color:var(--warn);}
.board-flow{display:flex;align-items:center;gap:9px;padding:14px;justify-content:center;
  font-size:12px;color:var(--tx-mut);border-top:1px solid var(--line);flex-wrap:wrap;}
.board-chip{padding:5px 10px;border-radius:6px;border:1px solid var(--line);background:var(--bg-3);}
.board-chip.on{border-color:color-mix(in srgb,var(--accent) 55%,transparent);color:var(--accent);}
.board-arr{color:var(--tx-dim);}

/* layout B: tape (centered) */
.hero-center{text-align:center;display:flex;flex-direction:column;align-items:center;}
.hero-center .hero-head{max-width:20ch;}
.hero-center .hero-sub{margin-left:auto;margin-right:auto;}
.hero-center .hero-cta{justify-content:center;}
.hero-tape{margin-top:48px;width:100vw;position:relative;left:50%;transform:translateX(-50%);}
.tape-cap{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;
  font-family:var(--mono);font-size:12px;color:var(--tx-dim);letter-spacing:.08em;text-transform:uppercase;}

/* layout C: gate (split, visual right) */
.hero-gatewrap .panel{padding:20px;}
.hero-gatewrap .gate{padding:12px 15px;}
.hero-gatewrap .gate-name{font-size:14px;}
.gw-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;
  font-family:var(--mono);font-size:12px;color:var(--tx-mut);letter-spacing:.06em;}

/* mobile polish */
@media(max-width:600px){
  .hero{padding:116px 0 48px;}
  .hero-cta{gap:10px;width:100%;}
  .hero-cta .btn{width:100%;justify-content:center;}
  .hero-meta{gap:12px 18px;margin-top:24px;}
  .board-row{gap:10px;}
  .board-row .bk{width:96px;font-size:11px;}
  .board-row .bv{font-size:12px;}
  .board-row .bs{font-size:11px;}
  .board-flow{gap:7px;padding:12px;}
}
`;
(function(){const s=document.createElement('style');s.id='fresh-hero-css';s.textContent=HERO_CSS;document.head.appendChild(s);})();

const HERO_HEAD = (<>The operations layer your <span className="hl">MotiveWave</span> strategy deserves.</>);
const HERO_SUB = (<>FRESH wires your MotiveWave strategy into <b>NinjaTrader, TopStepX and HyperLiquid</b> — locally, on your machine. It validates signal evidence, enforces copy-execution discipline, and turns every session into research. <b>It does not pick your trades.</b></>);

function HeroCTAs({onApply}){
  return (
    <div className="hero-cta">
      <a className="btn btn-primary" href="https://app.kitar.co/">Open Live Terminal →</a>
      <a className="btn btn-ghost" href="#how">See the architecture</a>
    </div>
  );
}
function HeroMeta(){
  return (
    <div className="hero-meta">
      <span><span className="sdot ok live"></span>runs 100% local</span>
      <span><span className="sdot ok"></span>4 venues, one control plane</span>
      <span><span className="sdot warn"></span>safety is the default</span>
    </div>
  );
}

/* ── A · terminal ── */
function HeroTerminal({onApply}){
  return (
    <div className="hero-split">
      <div>
        <div className="kicker reveal in" style={{marginBottom:22}}><span className="dot"></span>Local trading operations platform</div>
        <h1 className="hero-head">{HERO_HEAD}</h1>
        <p className="hero-sub">{HERO_SUB}</p>
        <HeroCTAs onApply={onApply}/>
        <HeroMeta/>
      </div>
      <div className="board">
        <div className="board-top"><span>FRESH · control plane</span><span style={{display:'flex',alignItems:'center',gap:7}}><span className="sdot ok live"></span>operating</span></div>
        <div className="board-body">
          <div className="board-row"><span className="bk">strategy state</span><span className="bv">ES · long · 2 cts</span><span className="bs"><span className="sdot ok"></span>tracked</span></div>
          <div className="board-row"><span className="bk">signal source</span><span className="bv">bar-close only</span><span className="bs"><span className="sdot ok"></span>no ghosts</span></div>
          <div className="board-row"><span className="bk">execution hub</span><span className="bv">lifecycle fills</span><span className="bs"><span className="sdot ok"></span>gated</span></div>
          <div className="board-row"><span className="bk">kill switch</span><span className="bv">disarmed</span><span className="bs warn"><span className="sdot warn"></span>armed-ready</span></div>
          <div className="board-flow">
            <span className="board-chip on">MotiveWave</span><span className="board-arr">→</span>
            <span className="board-chip on">FRESH</span><span className="board-arr">→</span>
            <span className="board-chip">NinjaTrader</span>
            <span className="board-chip">TopStepX</span>
            <span className="board-chip">HyperLiquid</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── B · tape ── */
function HeroTape({onApply}){
  return (
    <div className="hero-center">
      <div className="kicker reveal in" style={{marginBottom:22}}><span className="dot"></span>Local trading operations platform</div>
      <h1 className="hero-head">{HERO_HEAD}</h1>
      <p className="hero-sub">{HERO_SUB}</p>
      <HeroCTAs onApply={onApply}/>
      <div className="hero-tape">
        <div className="tape-cap"><span className="sdot ok live"></span>live signal intake · bar-close evaluation</div>
        <SignalTicker/>
      </div>
    </div>
  );
}

/* ── C · gate ── */
function HeroGate({onApply,motion}){
  return (
    <div className="hero-split hero-gatewrap">
      <div>
        <div className="kicker reveal in" style={{marginBottom:22}}><span className="dot"></span>Local trading operations platform</div>
        <h1 className="hero-head">{HERO_HEAD}</h1>
        <p className="hero-sub">{HERO_SUB}</p>
        <HeroCTAs onApply={onApply}/>
        <HeroMeta/>
      </div>
      <div className="panel">
        <div className="gw-head"><span>execution hub · copy-safety stack</span><span style={{display:'flex',alignItems:'center',gap:7}}><span className="sdot ok live"></span>live</span></div>
        <GateStack motion={motion}/>
      </div>
    </div>
  );
}

function Hero({dir,onApply,motion}){
  return (
    <header className="hero" id="top">
      <div className="hero-glow"></div>
      <div className="wrap">
        {dir==="tape" ? <HeroTape onApply={onApply}/>
          : dir==="gate" ? <HeroGate onApply={onApply} motion={motion}/>
          : <HeroTerminal onApply={onApply}/>}
      </div>
    </header>
  );
}

Object.assign(window,{Hero});
