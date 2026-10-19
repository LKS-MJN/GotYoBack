---
name: gsap-animation
preamble-tier: 2
description: GSAP (GreenSock Animation Platform) animation guidance for high-performance web animations.
triggers:
  - gsap
  - gsop
  - scrolltrigger
  - motion path
  - timeline animation
---

## When to invoke this skill

- The user asks for GSAP/GSOP animations
- High-performance scroll-triggered animations are needed
- Complex timeline-based motion sequences
- SVG morphing, motion path, or FLIP animations
- When framer-motion feels limiting for scroll-driven or timeline-heavy use cases

## Installation

```bash
npm install gsap
# Optional: React hooks
npm install @gsap/react
```

## Core Exports

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Flip, TextPlugin);
```

## Patterns

### Scroll-triggered section reveal
```js
useGSAP(() => {
  gsap.from('.section-reveal', {
    scrollTrigger: {
      trigger: '.section-reveal',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.1,
  });
}, []);
```

### Timeline with stagger
```js
const tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'power2.out' } });
tl.from('.hero-title', { y: 30, opacity: 0 })
  .from('.hero-subtitle', { y: 20, opacity: 0 }, '-=0.2')
  .from('.hero-cta', { y: 15, opacity: 0, scale: 0.95 }, '-=0.15');
```

### FLIP animation (layout animation)
```js
const state = Flip.getState('.card');
// ... rearrange DOM ...
Flip.from(state, { duration: 0.5, ease: 'power2.inOut' });
```

### Motion path
```js
gsap.to('.plane', {
  motionPath: {
    path: '#flightPath',
    align: '#flightPath',
    alignOrigin: [0.5, 0.5],
  },
  duration: 3,
  ease: 'power1.inOut',
});
```

## When NOT to use GSAP

- Simple fade/slide transitions already handled by framer-motion
- Layout animations in React (use framer-motion's `layout` prop instead)
- Single-element entrance animations (framer-motion is adequate)

Use GSAP when: scroll-driven, timeline-heavy, SVG animation, FLIP, or needing frame-perfect control.
