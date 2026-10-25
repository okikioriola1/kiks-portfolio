import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAbout(container = document, ready = Promise.resolve()) {
  const page = container.matches?.(".about-page") ? container : container.querySelector(".about-page");
  if (!page) return () => {};

  let active = true;
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", context => {
    let mounted = true;
    const reveals = new Map();
    const hero = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    hero
      .fromTo(page.querySelectorAll(".profile-line > span"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.045, clearProps: "transform" }, 0)
      .fromTo(page.querySelector(".profile-hero__portrait"), { x: 36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, clearProps: "transform,opacity" }, 0.08)
      .fromTo(page.querySelectorAll("[data-profile-intro]"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.04, clearProps: "transform,opacity" }, 0.2);

    // Enter only after the existing page curtain has cleared, including Barba navigation.
    context.add("revealPage", () => {
      hero.play();
      page.querySelectorAll("[data-profile-reveal]").forEach(element => {
        const tween = gsap.fromTo(element,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 94%", once: true } },
        );
        reveals.set(element, tween);
      });
      ScrollTrigger.refresh();
    });
    ready.then(() => { if (active && mounted && page.isConnected) context.revealPage(); });

    const showFocusedContent = event => {
      hero.progress(1);
      reveals.forEach((tween, element) => {
        if (element.contains(event.target)) {
          tween.progress(1);
          tween.scrollTrigger?.kill(false);
        }
      });
    };
    page.addEventListener("focusin", showFocusedContent);
    return () => {
      mounted = false;
      page.removeEventListener("focusin", showFocusedContent);
    };
  }, page);

  document.fonts?.ready.then(() => { if (active && page.isConnected) ScrollTrigger.refresh(); });
  return () => { active = false; media.revert(); };
}
