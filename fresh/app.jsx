// app.jsx — assembles FRESH (production: Tweaks panel removed)
const { useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = { heroDir: "terminal", accent: "both", motion: true };

function scrollToApply(){
  const el=document.getElementById('apply');
  if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-20,behavior:'smooth'});
}

function App(){
  const t = TWEAK_DEFAULTS;

  // apply accent mode + motion as global side-effects
  useEffectA(()=>{ document.documentElement.setAttribute('data-accent', t.accent||'both'); },[]);
  useEffectA(()=>{ document.body.classList.toggle('motion-on', !!t.motion); },[]);

  const motion=!!t.motion;

  return (
    <>
      <Nav onApply={scrollToApply}/>
      <main>
        <Hero dir={t.heroDir} onApply={scrollToApply} motion={motion}/>
        <HooksSection/>
        <HowSection/>
        <ShowcaseSection/>
        <SafetySection motion={motion}/>
        <PocketSection/>
        <ResearchSection motion={motion}/>
        <WhoSection/>
        <AboutSection/>
        <CTASection/>
      </main>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
