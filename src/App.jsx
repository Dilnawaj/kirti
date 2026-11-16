import { useEffect, useRef, useState } from "react";

const SENDER = "Dilnawaj"; // change this to however you sign off

const CARDS = [
  ["🥺", "It was my mistake", "I hurt you, but I promise next time se repeat nhi krunga Kirti "],
  ["🌙", "I miss you", "You are Good Girl or mein acche dosto ko khona nhi chahta Kirti."]
];

function Hearts() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const x = c.getContext("2d");
    let w, hh, raf;
    const size = () => {
      w = c.width = window.innerWidth;
      hh = c.height = window.innerHeight;
    };
    size();
    window.addEventListener("resize", size);
    const E = ["💗", "💖", "🌸", "✨", "💕"];
    const P = Array.from({ length: 34 }, () => ({
      x: Math.random() * w,
      y: Math.random() * hh,
      s: 12 + Math.random() * 26,
      v: 0.3 + Math.random() * 0.9,
      p: Math.random() * 6,
      e: E[(Math.random() * 5) | 0],
      a: 0.25 + Math.random() * 0.5,
    }));
    const loop = (t) => {
      x.clearRect(0, 0, w, hh);
      P.forEach((q) => {
        q.y -= q.v;
        if (q.y < -40) {
          q.y = hh + 40;
          q.x = Math.random() * w;
        }
        x.globalAlpha = q.a;
        x.font = q.s + "px serif";
        x.fillText(q.e, q.x + Math.sin(t / 900 + q.p) * 24, q.y);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" />;
}

function useTyped(text, speed, delay) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0, t;
    const s = setTimeout(function go() {
      i++;
      setN(i);
      if (i < text.length) t = setTimeout(go, speed);
    }, delay);
    return () => {
      clearTimeout(s);
      clearTimeout(t);
    };
  }, [text, speed, delay]);
  return text.slice(0, n);
}

function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        o.disconnect();
      }
    }, { threshold: 0.25 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`rv ${className}${on ? " in" : ""}`} style={{ transitionDelay: delay + "ms" }}>
      {children}
    </Tag>
  );
}

export default function App() {
  const typed = useTyped("I am sorry…", 110, 1800);
  const [yes, setYes] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [burst, setBurst] = useState([]);

  const dodge = () =>
    setPos({
      x: (Math.random() - 0.5) * Math.min(300, window.innerWidth - 160),
      y: (Math.random() - 0.5) * 160,
    });

  const forgive = () => {
    setYes(true);
    const E = ["💗", "💖", "💕", "🌸", "✨", "🥹"];
    setBurst(
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        e: E[i % 6],
        dx: (Math.random() - 0.5) * 130 + "vw",
        dy: -(20 + Math.random() * 80) + "vh",
        r: (Math.random() - 0.5) * 720 + "deg",
      }))
    );
    setTimeout(() => setBurst([]), 2600);
  };

  return (
    <div>
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <Hearts />
      {burst.map((b) => (
        <span key={b.id} className="fly" style={{ "--dx": b.dx, "--dy": b.dy, "--r": b.r }}>{b.e}</span>
      ))}

      <main>
        <section>
          <p className="hello">A small message, only for you</p>
          <h1 className="name">Kirti,</h1>
          <p className="sorry" aria-label="I am sorry">
            {typed}<span className="caret" />
          </p>
          <a href="#why" className="cue">scroll down, please read ↓</a>
        </section>

        <section id="why">
          <Reveal as="h2">From my heart, <span className="hl">with honesty</span></Reveal>
          <div className="cards">
            {CARDS.map((c, i) => (
              <Reveal key={i} className="card" delay={i * 180}>
                <span>{c[0]}</span>
                <b>{c[1]}</b>
                <p>{c[2]}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <p className="plea">Please, <em>never block me</em> forever.</p>
            <p className="sub">
              Give me one more chance to <span className="hl">make things right</span>. I only want to be a part of your life, even a small one.
            </p>
          </Reveal>
        </section>

        <section>
          {yes ? (
            <div>
              <p className="thanks">Thank you, Kirti 💗</p>
              <p className="sub" style={{ margin: "1rem auto" }}>
                You just made my whole day. I promise I’ll value you and your trust, always.
              </p>
              <p className="sign">— {SENDER}</p>
            </div>
          ) : (
            <div>
              <h2 style={{ margin: "0 auto" }}>So, can you <span className="hl">forgive me?</span></h2>
              <div className="btns">
                <button className="yes" onClick={forgive}>💗 Yes, I forgive you</button>
                <button
                  className="no"
                  style={{ transform: `translate(${pos.x}px,${pos.y}px)` }}
                  onMouseEnter={dodge}
                  onTouchStart={(e) => { e.preventDefault(); dodge(); }}
                  onFocus={dodge}
                >
                  🚫 Block him
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
