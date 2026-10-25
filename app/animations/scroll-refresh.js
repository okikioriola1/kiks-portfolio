import ScrollTrigger from "gsap/ScrollTrigger";

// Late fonts/images can finish during a swipe. Wait for native scrolling to
// settle before rebuilding measurements, and discard work for a departed page.
export function createScrollRefresh(isActive) {
  let pending = false;
  let frame = 0;

  function cancel() {
    pending = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
  }

  function flush() {
    frame = 0;
    if (!pending || !isActive()) return cancel();
    if (ScrollTrigger.isScrolling()) {
      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
      return;
    }
    cancel();
    ScrollTrigger.refresh();
  }

  function onScrollEnd() {
    ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
    frame = requestAnimationFrame(flush);
  }

  return {
    request() {
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(flush);
    },
    cancel,
  };
}
