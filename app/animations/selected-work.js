import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createScrollRefresh } from "./scroll-refresh";

gsap.registerPlugin(ScrollTrigger);

export function animateSelectedWork(container = document, ready = Promise.resolve()) {
  const section = container.querySelector(".selected-work");
  if (!section) return () => {};

  let active = true;
  const refresh = createScrollRefresh(() => active && section.isConnected);
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", context => {
    let mounted = true;
    const projectAnimations = new Map();

    // Barba mounts the next page below the outgoing one in sync mode.
    // Measure and hide projects only after that page and its curtain are gone.
    context.add("revealWork", () => {
      gsap.fromTo(section.querySelectorAll("[data-work-heading]"),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.04, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: section, start: "top 87%", once: true } },
      );
      gsap.fromTo(section.querySelector("[data-work-rule]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut", clearProps: "transform", scrollTrigger: { trigger: section, start: "top 87%", once: true } },
      );

      section.querySelectorAll(".work-project").forEach(project => {
        const visual = project.querySelector(".work-project__visual");
        const image = project.querySelector(".work-project__image-motion");
        const meta = project.querySelector(".work-project__meta");
        const reveal = gsap.timeline({ scrollTrigger: { trigger: visual, start: "top 90%", once: true } });
        reveal
          .fromTo(visual, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", clearProps: "transform,opacity" }, 0)
          .fromTo(image, { yPercent: 5, scale: 1.06 }, { yPercent: 0, scale: 1, duration: 1, ease: "power3.out", clearProps: "transform" }, 0);

        // Captions get their own trigger so their reveal is seen below tall images.
        const captionReveal = gsap.fromTo(meta.children,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: meta, start: "top 96%", once: true } },
        );
        projectAnimations.set(project, [reveal, captionReveal]);
      });
      refresh.request();
    });
    ready.then(() => {
      if (active && mounted && section.isConnected) context.revealWork();
    });

    const showFocusedProject = event => {
      const project = event.target.closest(".work-project");
      projectAnimations.get(project)?.forEach(animation => {
        animation.progress(1);
        animation.scrollTrigger?.kill(false);
      });
    };
    section.addEventListener("focusin", showFocusedProject);
    return () => {
      mounted = false;
      section.removeEventListener("focusin", showFocusedProject);
    };
  }, section);

  Promise.allSettled([ready, document.fonts?.ready]).then(() => {
    refresh.request();
  });

  return () => {
    active = false;
    refresh.cancel();
    media.revert();
  };
}
