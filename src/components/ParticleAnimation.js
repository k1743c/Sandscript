import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const sketch = (p) => {
  let particles = [];
  let drawing = false;
  let lastX, lastY;

  p.setup = () => {
    p.createCanvas(2388, 1668);
    p.background(0, 0, 255, 0);
    p.noStroke();
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.backgroundColor) {
      const [r, g, b] = hexToRgb(props.backgroundColor);
      p.background(r, g, b, 0);
    }
  };

  p.canvas.ontouchstart = (e) => handleStart(e);
  p.canvas.ontouchmove = (e) => handleMove(e);
  p.canvas.ontouchend = (e) => handleEnd(e);

  function handleStart(e) {
    drawing = true;
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
  }

  function handleMove(e) {
    if (!drawing) return;
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    p.stroke(0);
    p.strokeWeight(1);
    p.line(lastX, lastY, x, y);

    const distance = p.dist(lastX, lastY, x, y);
    const steps = Math.floor(distance / 5);
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const px = p.lerp(lastX, x, t);
      const py = p.lerp(lastY, y, t);
      particles.push(new Particle(p, px, py, touch.force || 1));
    }

    lastX = x;
    lastY = y;
  }

  function handleEnd(e) {
    drawing = false;
  }

  p.draw = () => {
    for (let particle of particles) {
      particle.show();
    }
  };

  class Particle {
    constructor(p, x, y, pressure) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.sizeX = 6; // 6 пікселів ≈ 1,5 мм
      this.sizeY = 7; // 7 пікселів ≈ 1,7 мм
      this.color = interpolateColor(p, pressure);
    }

    show() {
      this.p.noStroke();
      this.p.fill(this.color.r, this.color.g, this.color.b, 255);
      this.p.rect(this.x, this.y, this.sizeX, this.sizeY);
    }
  };
};

// Інтерполяція кольору між пензлем і фоном
function interpolateColor(p, pressure) {
  const brushColor = p._userNode.getAttribute('data-color') || '#000000';
  const bgColor = p._userNode.getAttribute('data-background') || '#0000ff';
  const [r1, g1, b1] = hexToRgb(brushColor);
  const [r2, g2, b2] = hexToRgb(bgColor);

  // Випадковий коефіцієнт для градієнта з урахуванням тиску
  const t = p.random(0, 1) * (pressure || 1) / 2;
  const r = p.lerp(r1, r2, t) + p.random(-20, 20);
  const g = p.lerp(g1, g2, t) + p.random(-20, 20);
  const b = p.lerp(b1, b2, t) + p.random(-20, 20);

  return { r: p.constrain(r, 0, 255), g: p.constrain(g, 0, 255), b: p.constrain(b, 0, 255) };
}

// Конвертація hex у RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 255];
}

const ParticleAnimation = ({ color, backgroundColor }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const p5Instance = new p5(sketch, sketchRef.current);
    if (sketchRef.current) {
      sketchRef.current.setAttribute('data-color', color);
      sketchRef.current.setAttribute('data-background', backgroundColor);
    }
    return () => p5Instance.remove();
  }, [color, backgroundColor]);

  return <div ref={sketchRef} className="w-full h-full" />;
};

export default ParticleAnimation;