import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createScrollRefresh } from "./scroll-refresh";
import { clampProgress, nearestProject, projectScrollPosition } from "./gallery-position";

gsap.registerPlugin(ScrollTrigger);

export function animateProjectGallery(container = document, ready = Promise.resolve()) {
  const page = container.matches?.(".projects-page") ? container : container.querySelector(".projects-page");
  if (!page) return () => {};
  const gallery = page.querySelector(".project-gallery");
  const stage = gallery.querySelector(".project-gallery__stage");
  const viewport = gallery.querySelector(".project-gallery__viewport");
  const track = gallery.querySelector(".project-gallery__track");
  const cards = Array.from(track.children);
  const navigation = gallery.querySelector(".project-gallery__navigation");
  const previous = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  const current = gallery.querySelector("[data-gallery-current]");
  const progress = gallery.querySelector(".project-gallery__progress");
  const fill = progress.firstElementChild;
  let active = true;
  const refresh = createScrollRefresh(() => active && page.isConnected);
  const media = gsap.matchMedia();

  // Rebuild the pin when the card layout changes, including phone rotation.
  media.add({
    narrow: "(max-width: 999px)",
    wide: "(min-width: 1000px)",
    landscape: "(max-height: 600px) and (min-width: 600px)",
    motion: "(prefers-reduced-motion: no-preference)",
  }, context => {
    if (!context.conditions.motion) return;
    let mounted = true;
    let index = 0;
    let horizontal;
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const cardOffset = i => Math.min(distance(), cards[i].offsetLeft - cards[0].offsetLeft);

    function update(fraction) {
      fraction = clampProgress(fraction);
      const travelled = fraction * distance();
      index = nearestProject(cards.map((card, i) => cardOffset(i)), travelled, distance());
      current.textContent = String(index + 1).padStart(2, "0");
      previous.disabled = index === 0;
      next.disabled = index === cards.length - 1;
      fill.style.transform = `scaleX(${fraction})`;
      progress.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
    }

    const hero = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    hero.fromTo(page.querySelectorAll(".projects-title-line > span"), { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .045, clearProps: "transform" }, 0)
      .fromTo(page.querySelectorAll("[data-project-intro], .projects-intro__bottom"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .04, clearProps: "transform,opacity" }, .15);

    function goTo(i, animate = false) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      const offset = cardOffset(i);
      if (horizontal) {
        const trigger = horizontal.scrollTrigger;
        viewport.scrollLeft = 0;
        window.scrollTo({ top: projectScrollPosition(offset, distance(), trigger.start, trigger.end), behavior: animate ? "smooth" : "instant" });
        if (!animate) {
          ScrollTrigger.update();
          trigger.getTween()?.progress(1);
        }
      } else {
        viewport.scrollTo({ left: offset, behavior: animate ? "smooth" : "instant" });
      }
    }

    const onPrevious = event => goTo(index - 1, event.detail > 0);
    const onNext = event => goTo(index + 1, event.detail > 0);
    const onFocus = event => {
      hero.progress(1);
      const card = event.target.closest(".work-project");
      if (card) goTo(cards.indexOf(card));
    };
    const onKey = event => {
      if (event.target !== viewport) return;
      const destination = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: cards.length - 1 }[event.key];
      if (destination === undefined) return;
      event.preventDefault();
      goTo(destination);
    };
    const after = page.querySelector("#after-projects");
    const onSkip = event => {
      event.preventDefault();
      after.scrollIntoView({ behavior: "instant", block: "start" });
      after.focus({ preventScroll: true });
    };

    context.add("startGallery", () => {
      hero.play();
      gallery.classList.add("is-horizontal");
      navigation.hidden = false;
      if (distance() > 0) {
        horizontal = gsap.to(track, {
          x: () => -distance(), ease: "none",
          scrollTrigger: {
            trigger: gallery, pin: stage, start: "top 98px", end: () => `+=${distance()}`,
            scrub: .45, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: trigger => update(trigger.progress),
            onRefresh: trigger => update(trigger.progress),
          },
        });
      }
      previous.addEventListener("click", onPrevious);
      next.addEventListener("click", onNext);
      viewport.addEventListener("focusin", onFocus);
      viewport.addEventListener("keydown", onKey);
      gallery.querySelector(".project-gallery__skip").addEventListener("click", onSkip);
      update(0);
      refresh.request();
    });
    ready.then(() => { if (active && mounted && page.isConnected) context.startGallery(); });

    return () => {
      mounted = false;
      previous.removeEventListener("click", onPrevious);
      next.removeEventListener("click", onNext);
      viewport.removeEventListener("focusin", onFocus);
      viewport.removeEventListener("keydown", onKey);
      gallery.querySelector(".project-gallery__skip").removeEventListener("click", onSkip);
      gallery.classList.remove("is-horizontal");
      viewport.scrollLeft = 0;
      navigation.hidden = true;
      fill.style.removeProperty("transform");
    };
  }, page);

  // Images have fixed dimensions; refresh again for font wrapping and late decodes.
  Promise.allSettled([ready, document.fonts?.ready, ...Array.from(track.querySelectorAll("img"), img => img.decode?.())]).then(() => {
    refresh.request();
  });
  return () => { active = false; refresh.cancel(); media.revert(); };
}
