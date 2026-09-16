/**
 * Runs synchronously in <head>, before the body paints.
 *
 * Reveal elements start at opacity:0 so GSAP can fade them in — but that hiding
 * must NEVER apply unless the motion layer is actually going to run. Otherwise
 * JS being disabled, a chunk failing to load, or an error before hydration
 * leaves the entire page below the hero permanently invisible.
 *
 * So: CSS hides reveals only under `html.js-motion`, and this script is the only
 * thing that adds that class — never under reduced motion, and it takes the
 * class back off if the motion layer hasn't reported in.
 *
 * No imports on purpose: this is a plain string inlined into the document, and
 * keeping it dependency-free stops GSAP being pulled into the server bundle.
 */
export const motionBootScript = `(function(){try{
var d=document.documentElement;
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('js-motion');
setTimeout(function(){if(!window.__motionReady)d.classList.remove('js-motion');},6000);
}catch(e){}})();`;
