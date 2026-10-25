import { gsap } from "gsap";
import { waitForIntroAssets } from "./intro-assets";

let activeIntro;

export function playIntro() {
  activeIntro?.();

  const loader = document.querySelector(".kiks-intro");
  if (!loader) return;

  const main = document.querySelector("main[data-barba='container']");
  const headings = [...document.querySelectorAll(".hero .hero-word-container h1")];
  const tagline = [...document.querySelectorAll(".hero [data-animation='slideIn']")];
  const heroImage = [...document.querySelectorAll(".hero + .banner [data-animation='img']")];
  const description = [...document.querySelectorAll(".hero [data-animation='paragraph'] .word")];
  const heroElements = [...headings, ...tagline, ...heroImage, ...description];
  const wasInert = main?.inert ?? false;
  const controller = new AbortController();
  const status = loader.querySelector("[role='status']");
  let finished = false;
  let assetsReady = false;
  let timeline;
  let waitingAnimation;

  const finish = () => {
    if (finished) return;
    finished = true;
    controller.abort();
    timeline?.kill();
    waitingAnimation?.kill();
    loader.hidden = true;
    loader.classList.remove("is-waiting");
    document.documentElement.classList.remove("is-intro-playing");
    if (main) main.inert = wasInert;
    gsap.set(heroElements, { clearProps: "transform,opacity,visibility,transformStyle" });
    activeIntro = null;
  };

  activeIntro = finish;
  loader.hidden = false;
  document.documentElement.classList.add("is-intro-playing");
  if (main) main.inert = true;

  const ready = waitForIntroAssets(heroImage, document.fonts, { signal: controller.signal })
    .then(reason => {
      assetsReady = true;
      return reason;
    });

  const panels = loader.querySelectorAll(".kiks-intro__panel");
  const letters = loader.querySelectorAll(".kiks-intro__letter");
  const dot = loader.querySelector(".kiks-intro__dot");
  const asterisk = loader.querySelector(".kiks-intro__asterisk");
  const word = loader.querySelector(".kiks-intro__word");
  const caption = loader.querySelector(".kiks-intro__caption");
  const details = loader.querySelectorAll(".kiks-intro__detail");
  const dash = loader.querySelector(".kiks-intro__dash");

  gsap.set(panels, { yPercent: 0 });
  gsap.set(word, { yPercent: 0, opacity: 1 });
  gsap.set(letters, { yPercent: 120, x: index => (index - 1.5) * 28, rotation: index => (index - 1.5) * 6 });
  gsap.set(dot, { xPercent: -50, x: 110, y: -150, scale: 0.25 });
  gsap.set(asterisk, { scale: 0, rotation: -100, opacity: 0 });
  gsap.set(details, { y: 10, opacity: 0 });
  gsap.set(caption, { y: 15, opacity: 0 });
  gsap.set(dash, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(headings, { yPercent: 110, opacity: 0 });
  gsap.set(tagline, { yPercent: 30, opacity: 0 });
  gsap.set(heroImage, { yPercent: 12, opacity: 0 });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(letters, { yPercent: 0, x: 0, rotation: 0 });
    gsap.set(dot, { x: 0, y: 0, scale: 1 });
    gsap.set(asterisk, { scale: 1, rotation: 0, opacity: 1 });
    gsap.set(details, { y: 0, opacity: 1 });
    gsap.set(caption, { y: 0, opacity: 1 });
    gsap.set(dash, { scaleX: 1 });
    loader.classList.add("is-waiting");
    status.textContent = "Getting the first page ready.";
    ready.then(finish);
    return;
  }

  status.textContent = "Opening Kiks, the portfolio of Okiki Oriola.";

  timeline = gsap.timeline({ onComplete: finish });
  timeline
    .to(details, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.05)
    .to(letters, { yPercent: 0, x: 0, rotation: 0, duration: 0.85, stagger: 0.045, ease: "power4.out" }, 0.2)
    .to(dot, { x: 0, y: 0, scale: 1, duration: 0.85, ease: "bounce.out" }, 0.8)
    .to(asterisk, { scale: 1, rotation: 0, opacity: 1, duration: 0.65, ease: "back.out(1.5)" }, 1)
    .to(caption, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 1.25)
    .to(dash, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 1.3)
    .to(asterisk, { rotation: 90, duration: 0.8, ease: "power3.inOut" }, 1.8)
    .addLabel("open", 2.65)
    .addPause("open", () => {
      if (!assetsReady) {
        loader.classList.add("is-waiting");
        status.textContent = "Getting the first page ready.";
        waitingAnimation = gsap.to(asterisk, { rotation: "+=180", duration: 1.6, repeat: -1, ease: "none" });
      }
      ready.then(() => {
        if (finished) return;
        waitingAnimation?.kill();
        loader.classList.remove("is-waiting");
        timeline.play();
      });
    })
    .to([details, caption], { y: -12, opacity: 0, duration: 0.3, ease: "power2.in" }, "open")
    .to(word, { yPercent: -115, opacity: 0, duration: 0.6, ease: "power3.in" }, "open")
    .to(panels, { yPercent: index => index === 0 ? -100 : 100, duration: 0.95, ease: "power3.inOut" }, "open+=0.2")
    .to(headings, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.04, ease: "power3.out" }, "open+=0.65")
    .to(heroImage, { yPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "open+=0.9")
    .to(tagline, { yPercent: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "open+=1.15")
    .to(description, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.75, stagger: 0.025, ease: "power3.out" }, "open+=1.15");

  return timeline;
}
