import React from 'react';

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }>=({ children, delay=0 })=>{
  const ref = React.useRef<HTMLDivElement>(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(()=>{
    const node = ref.current; if(!node) return;
    const io = new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting){ setVis(true); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(node); return ()=> io.disconnect();
  },[]);
  return (
    <div ref={ref} className={`reveal ${vis?'is-visible':''}`} style={{ transitionDelay: vis? `${delay}ms`: undefined }}>
      {children}
    </div>
  );
};

export default Reveal;

