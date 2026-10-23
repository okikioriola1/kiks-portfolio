import LocomotiveScroll from "locomotive-scroll";

export default class Scroll {
  constructor({ element }) {
    this.element = element;

    this.lscroll = new LocomotiveScroll({
      el: document.querySelector(this.element),
      smooth: true,
      direction: "horizontal",
    });
  }
}