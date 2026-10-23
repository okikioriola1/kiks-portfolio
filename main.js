import "./style.scss";
import { Cursor } from "./app/components/cursor";
import { split } from "./app/animations/text";
// import Home from "./app/pages/home";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import { gsap } from "gsap";
import { IO } from "./app/animations/observe";
import Splitting from "splitting";
import { forEach } from "lodash";
import ScrollTrigger from "gsap/ScrollTrigger";
import barba from "@barba/core";
gsap.registerPlugin(ScrollTrigger);

window.onload = () => {
  localStorage.removeItem("pageloadcount");
};

split();
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}



class App {
  constructor() {
    this.createCursor();
    // this.createPage();
    this.addEventListener();
    this.update();

    // this.menu();
    // this.loader();
    // this.pageTransition();
    // this.contentAnimation();
    // this.barbaSetup();
    // this.scroll();

    // this.transformPrefix = Prefix("transform");

    // console.log(this.transformPrefix);

    // this.arr = [];

  }

  createCursor() {
    this.cursor = document.querySelector(".cursor");
    // this.nextCursor = document.querySelector(".next-cursor");
    // this.prevCursor = document.querySelector(".prev-cursor");
    // this.visitCursor = document.querySelector(".visit-cursor");
    this.create = new Cursor(this.cursor);
    // this.nextCreate = new Cursor2(this.nextCursor);
    // this.prevCreate = new Cursor2(this.prevCursor);
    // this.visitCreate = new Cursor2(this.visitCursor);

    document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("mouseenter", () => this.create.enter());
      link.addEventListener("mouseleave", () => this.create.leave());
    });
    document.querySelectorAll("button").forEach((link) => {
      link.addEventListener("mouseenter", () => this.create.enter());
      link.addEventListener("mouseleave", () => this.create.leave());
    });
    document.querySelectorAll(".arrow__right").forEach((link) => {
      link.addEventListener("mouseenter", () => this.create.nextEnter());
      link.addEventListener("mouseleave", () => this.create.leave());
      link.addEventListener("mouseenter", () => this.nextCreate.enter());
      link.addEventListener("mouseleave", () => this.nextCreate.leave());
    });

    document.querySelectorAll(".arrow__left").forEach((link) => {
      link.addEventListener("mouseenter", () => this.create.nextEnter());
      link.addEventListener("mouseleave", () => this.create.leave());
      link.addEventListener("mouseenter", () => this.prevCreate.enter());
      link.addEventListener("mouseleave", () => this.prevCreate.leave());
    });

    document.querySelectorAll(".blog__card a").forEach((link) => {
      link.addEventListener("mouseenter", () => this.create.nextEnter());
      link.addEventListener("mouseleave", () => this.create.leave());
      link.addEventListener("mouseenter", () => this.visitCreate.enter());
      link.addEventListener("mouseleave", () => this.visitCreate.leave());
    });
    // this.
  }
// //   contentAnimation(){
// //     //console.log('hello from contentAnimation')
// //     this.loader();

// //     var herotl = gsap.timeline()
// //     var heroptl = gsap.timeline()

// //     herotl.set(["#hero-text-1","#hero-text-2"],{opacity:0, y:"100%"})
// //     herotl
// //     .to(["#hero-text-1","#hero-text-2"], {  y: "0%", delay: 13, opacity:1 })

// //     heroptl.set("#hero-p",  {  y: "100%", delay: 0.9, opacity:0 })
// //     heroptl
// //     .to("#hero-p", {  y: "0%", delay: 0.5, opacity:1 })

// //     let tween = gsap.to("#scroll-text", {xPercent: -100, repeat: -1, duration: 10, ease: "linear"}).totalProgress(0.5);
// //     let tween2 = gsap.to("#scroll-text-2", {xPercent: -100, repeat: -1, duration: 10, ease: "linear"}).totalProgress(0.5);

// //     gsap.set([".creativity-wrapper", ".creativity-wrapper-2"], {xPercent: -50})
// //     gsap.to(tween, {
// //       timeScale: 1
// //     });
// //     gsap.to(tween2, {
// //       timeScale: -1
// //     });

// //   }

// //   menu() {
// //     var menuToggles = document.querySelectorAll("#menuToggle");

// //     var navtl = gsap.timeline();

// //     navtl.set("#fullpageMenu .navbar", {
// //       opacity: 0,
// //     });

// //     navtl.to("#fullpageMenu", {
// //       duration: 0.7,
// //       height: "100vh",
// //       opacity: 1,
// //       ease: "Power4.easeInOut",
// //     });
// //     navtl.to("#fullpageMenuInner", {
// //       duration: 0.5,
// //       display: "flex",
// //       ease: "Power4.easeInOut",
// //     });
// //     navtl.to("#fullpageMenuInner .navbar", {
// //       duration: 0.5,
// //       // display: "flex",
// //       opacity: 1,
// //       ease: "Power4.easeInOut",
// //     });
// //     navtl.to(["#word", "#word2", "#word3"], {
// //       y: "0%",
// //       duration: 0.5,
// //       stagger: {
// //         each: 0.2,
// //       },
// //     });

// //     navtl.reverse();

// //     menuToggles.forEach((menuToggle) => {
// //       menuToggle.onclick = () => {
// //         navtl.reversed(!navtl.reversed());
// //       };
// //     });
// //   }
// //   loader(){
// //     var loderTl = gsap.timeline();
// //     const images = document.querySelectorAll('img');

// //   console.log(images)

// //     if (
// //       window.location.pathname === "/index.html" ||
// //       window.location.pathname === "/"
// //     ) {
// //       loderTl.from(".load-bar", { delay: 0.5, opacity: 0, duration: 1 });
// //       loderTl
// //         .to(".word1", { duration: 0.7, y: "0%" })
// //         .to(".word1", {
// //           delay: 0.3,
// //           duration: 0.5,
// //           opacity: 0,
// //         })
// //         .to(".word2", { duration: 0.7, y: "0%" })
// //         .to(".word2", {
// //           delay: 0.7,
// //           duration: 0.5,
// //           opacity: 0,
// //         })
// //         .to(".word3", { duration: 0.7, y: "0%" })
// //         .to(".word3", {
// //           delay: 0.7,
// //           duration: 0.5,
// //           opacity: 0,
// //         })
// //         .to(".word4", { duration: 0.7, y: "0%" })
// //         .to(".word4", {
// //           delay: 0.7,
// //           duration: 0.5,
// //           opacity: 0,
// //         })
// //         .to(".word5", { duration: 0.7, y: "0%" })
// //         .to(".word5", {
// //           delay: 0.5,
// //           duration: 0.5,
// //           opacity: 0,
// //         })

// //       loderTl
// //         .to(
// //           ".loading-bar",
// //           {
// //             width: "30%",
// //             duration: 4.5,
// //             ease: "power4.out",
// //           },
// //            "-=9"
// //         )
// //         .to(
// //           ".loading-bar",
// //           {
// //             width: "70%",
// //             duration: 4.5,
// //             ease: "power4.out",
// //           },
// //            "-=7"
// //         )
// //         .to(
// //           ".loading-bar",
// //           {
// //             width: "100%",
// //             duration: 4.5,
// //             ease: "power4.out",
// //           },
// //            "-=4"
// //         );
// //       loderTl.to([".load-words", ".load-bar"], { delay: 0, opacity: 0 }).to(
// //         ".home-loader",
// //         {
// //           delay: 0.9,
// //           opacity: 0,
// //           height: 0,
// //           duration: 1,
// //           ease: "Expo.easeInOut",
// //         },
// //         "-=1"
// //       )
// //       .to([".hero", ".banner"], {display:"flex"}, "-=1")
// //   }
// // }

// // pageTransition() {

// //   var tl = gsap.timeline();

// //   gsap.set(".exit-transition", {
// //     zIndex: 100,
// //     top: "unset",
// //     bottom: 0,
// //   });
// //   gsap.set(".exit-span", {
// //     opacity: 1,
// //   });
// //   tl.to(".exit-transition", {
// //     height: window.innerHeight,
// //     duration: 1.5,
// //     ease: "Expo.easeInOut",
// //   })
// //     .set(".exit-transition", {
// //       top: 0,
// //       bottom: "unset",
// //     })
// //     .from(
// //       ".exit-span",
// //       {
// //         yPercent: 110,
// //         duration: 1,
// //         skewY: 10,
// //         stagger: {
// //           amount: 0.3,
// //         },
// //         ease: "power2.out",
// //       },
// //       "-=.9"
// //     )
// //     .to(".exit-span", {
// //       opacity: 0,
// //       duration: 1,
// //       ease: "power4.out",
// //     })
// //     .to(
// //       ".exit-transition",
// //       {
// //         height: 0,
// //         duration: 1.5,
// //         ease: "Expo.easeInOut",
// //       },
// //       "-=1"
// //     )
// //     .to([".about",".about-info .about-info-wrapper"], {display:"flex"}, "-=1")
// // }

  onWheel(event) {}

  update() {}

  addEventListener() {}

  removeEventListener() {}

 }

 new App();

function moveTop(){
  {
    window.scrollTo(0, 0);

  }
}


function contentAnimation() {
  

  if (
    window.location.pathname === "/index.html" ||
    window.location.pathname === "/"
  ) {
    
    moveTop();
    menu();
    loader();

  var herotl = gsap.timeline();

    var heroptl = gsap.timeline();

    herotl.from(["#hero-text-1", "#hero-text-2"], { opacity: 0, y: "100%", delay:12});
    herotl.to(["#hero-text-1", "#hero-text-2"], {
      y: "0%",
      delay: 1,
      opacity: 1,
    })

    // heroptl.set("#hero-p", { y: "100%", delay: 0.9, opacity: 0 });
    // heroptl.to("#hero-p", { y: "0%", delay: 0.5, opacity: 1 });

    let tween = gsap
      .to("#scroll-text", {
        xPercent: -100,
        repeat: -1,
        duration: 10,
        ease: "linear",
      })
      .totalProgress(0.5);
    let tween2 = gsap
      .to("#scroll-text-2", {
        xPercent: -100,
        repeat: -1,
        duration: 10,
        ease: "linear",
      })
      .totalProgress(0.5);

    gsap.set([".creativity-wrapper", ".creativity-wrapper-2"], {
      xPercent: -50,
    });
    gsap.to(tween, {
      timeScale: 1,
    });
    gsap.to(tween2, {
      timeScale: -1,
    });
  }


  // gsap.set([".hero", ".banner"], { display: "flex" });

  if (
    window.location.pathname === "/home.html" ||
    window.location.pathname === "/home"
  ) {
    
    moveTop();
    menu();
    var herotl = gsap.timeline();

    var heroptl = gsap.timeline();

    herotl.from(["#hero-text-1", "#hero-text-2"], { opacity: 0, y: "100%", delay:1});
    herotl.to(["#hero-text-1", "#hero-text-2"], {
      y: "0%",
      delay: 1,
      opacity: 1,
    });

    // heroptl.set("#hero-p", { y: "100%", delay: 0.9, opacity: 0 });
    // heroptl.to("#hero-p", { y: "0%", delay: 0.5, opacity: 1 });

    let tween = gsap
      .to("#scroll-text", {
        xPercent: -100,
        repeat: -1,
        duration: 10,
        ease: "linear",
      })
      .totalProgress(0.5);
    let tween2 = gsap
      .to("#scroll-text-2", {
        xPercent: -100,
        repeat: -1,
        duration: 10,
        ease: "linear",
      })
      .totalProgress(0.5);

    gsap.set([".creativity-wrapper", ".creativity-wrapper-2"], {
      xPercent: -50,
    });
    gsap.to(tween, {
      timeScale: 1,
    });
    gsap.to(tween2, {
      timeScale: -1,
    });
  }
  

  if (
    window.location.pathname === "/about.html" ||
    window.location.pathname === "/about"
  ) {
    
    moveTop();
    menu();
    var herotl = gsap.timeline();
    var heroptl = gsap.timeline();

    herotl.set(["#hero-text-1", "#hero-text-2"], { opacity: 0, y: "100%" });
    herotl.to(["#hero-text-1", "#hero-text-2"], {
      y: "0%",
      delay: 1,
      opacity: 1,
    });
  }

  if (
    window.location.pathname === "/projects.html" ||
    window.location.pathname === "/projects"
  ) {
    
    moveTop();
    menu();
    var herotl = gsap.timeline();
    var heroptl = gsap.timeline();

    herotl.set(["#hero-text-1", "#hero-text-2"], { opacity: 0, y: "100%" });
    herotl.to(["#hero-text-1", "#hero-text-2"], {
      y: "0%",
      delay: 1,
      opacity: 1,
    });
  }

}

function menu() {
  var menuToggles = document.querySelectorAll("#menuToggle");

  console.log('menu clicked')

  var navtl = gsap.timeline();

  navtl.set("#fullpageMenu .navbar", {
    opacity: 0,
  });

  navtl.to("#fullpageMenu", {
    duration: 0.7,
    height: "100vh",
    opacity: 1,
    ease: "Power4.easeInOut",
  });
  navtl.to("#fullpageMenuInner", {
    duration: 0.5,
    display: "flex",
    ease: "Power4.easeInOut",
  });
  navtl.to("#fullpageMenuInner .navbar", {
    duration: 0.5,
    // display: "flex",
    opacity: 1,
    ease: "Power4.easeInOut",
  });
  navtl.to(["#word", "#word2", "#word3"], {
    y: "0%",
    duration: 0.5,
    stagger: {
      each: 0.2,
    },
  });

  navtl.reverse();

  menuToggles.forEach((menuToggle) => {
    menuToggle.onclick = () => {
      navtl.reversed(!navtl.reversed());
    };
  });
}
var tl = gsap.timeline();
var loderTl = gsap.timeline();

function loader() {


  // (    window.location.pathname === "/index.html" ||
  //   window.location.pathname === "/") 

    loderTl.from(".load-bar", { delay: 0.5, opacity: 0, duration: 1 });
    loderTl
      .to(".word1", { duration: 0.7, y: "0%" })
      .to(".word1", {
        delay: 0.3,
        duration: 0.5,
        opacity: 0,
      })
      .to(".word2", { duration: 0.7, y: "0%" })
      .to(".word2", {
        delay: 0.7,
        duration: 0.5,
        opacity: 0,
      })
      .to(".word3", { duration: 0.7, y: "0%" })
      .to(".word3", {
        delay: 0.7,
        duration: 0.5,
        opacity: 0,
      })
      .to(".word4", { duration: 0.7, y: "0%" })
      .to(".word4", {
        delay: 0.7,
        duration: 0.5,
        opacity: 0,
      })
      .to(".word5", { duration: 0.7, y: "0%" })
      .to(".word5", {
        delay: 0.5,
        duration: 0.5,
        opacity: 0,
      });

    loderTl
      .to(
        ".loading-bar",
        {
          width: "30%",
          duration: 4.5,
          ease: "power4.out",
        },
        "-=9"
      )
      .to(
        ".loading-bar",
        {
          width: "70%",
          duration: 4.5,
          ease: "power4.out",
        },
        "-=7"
      )
      .to(
        ".loading-bar",
        {
          width: "100%",
          duration: 4.5,
          ease: "power4.out",
        },
        "-=4"
      );
    loderTl
      .to([".load-words", ".load-bar"], { delay: 0, opacity: 0 })
      .to(
        ".home-loader",
        {
          delay: 0.9,
          opacity: 0,
          height: 0,
          duration: 1,
          ease: "Expo.easeInOut",
        },
        "-=1"
      )
   
     
   
      tl.from([".hero", ".banner"], { display:'none', delay:11});
      tl.to([".hero", ".banner"], { display:'flex' }); 

}

function pageTransition() {
  var tl = gsap.timeline();
  const element = document.getElementById("exitText");

  if ( window.location.pathname === "/index.html" ||
  window.location.pathname === "/"){
    element.innerHTML=" "
    gsap.set(".exit-transition", {
      zIndex: 30,
      top: "unset",
      bottom: 0,
    });
    gsap.set(".exit-span", {
      opacity: 1,
    });
    tl.to(".exit-transition", {
      height: window.innerHeight,
      duration: 1,
      ease: "Expo.easeInOut",
    })
      .set(".exit-transition", {
        top: 0,
        bottom: "unset",
      })
      .from(
        ".exit-span",
        {
          yPercent: 110,
          duration: 1,
          skewY: 10,
          stagger: {
            amount: 0.3,
          },
          ease: "power2.out",
        },
        "-=.5"
      )
      .to(".exit-span", {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .to(
        ".exit-transition",
        {
          height: 0,
          duration: 1.5,
          ease: "Expo.easeInOut",
        },
        "-=1"
      );

  }

  if ( window.location.pathname === "/about.html" ||
  window.location.pathname === "/about"){
    element.innerHTML="Get to know me :) "
    gsap.set(".exit-transition", {
      zIndex: 30,
      top: "unset",
      bottom: 0,
    });
    gsap.set(".exit-span", {
      opacity: 1,
    });
    tl.to(".exit-transition", {
      height: window.innerHeight,
      duration: 1,
      ease: "Expo.easeInOut",
    })
      .set(".exit-transition", {
        top: 0,
        bottom: "unset",
      })
      .from(
        ".exit-span",
        {
          yPercent: 110,
          duration: 1,
          skewY: 10,
          stagger: {
            amount: 0.3,
          },
          ease: "power2.out",
        },
        "-=.5"
      )
      .to(".exit-span", {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .to(
        ".exit-transition",
        {
          height: 0,
          duration: 1.5,
          ease: "Expo.easeInOut",
        },
        "-=1"
      );

  }
  if ( window.location.pathname === "/projects.html" ||
  window.location.pathname === "/projects"){
    element.innerHTML=" Step into my world of web Creations"
    gsap.set(".exit-transition", {
      zIndex: 30,
      top: "unset",
      bottom: 0,
    });
    gsap.set(".exit-span", {
      opacity: 1,
    });
    tl.to(".exit-transition", {
      height: window.innerHeight,
      duration: 1,
      ease: "Expo.easeInOut",
    })
      .set(".exit-transition", {
        top: 0,
        bottom: "unset",
      })
      .from(
        ".exit-span",
        {
          yPercent: 110,
          duration: 1,
          skewY: 10,
          stagger: {
            amount: 0.3,
          },
          ease: "power2.out",
        },
        "-=.5"
      )
      .to(".exit-span", {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .to(
        ".exit-transition",
        {
          height: 0,
          duration: 1.5,
          ease: "Expo.easeInOut",
        },
        "-=1"
      );

  }
  if ( window.location.pathname === "/home.html" ||
       window.location.pathname === "/home"){
    element.innerHTML=" "
    gsap.set(".exit-transition", {
      zIndex: 30,
      top: "unset",
      bottom: 0,
    });
    gsap.set(".exit-span", {
      opacity: 1,
    });
    tl.to(".exit-transition", {
      height: window.innerHeight,
      duration: 1,
      ease: "Expo.easeInOut",
    })
      .set(".exit-transition", {
        top: 0,
        bottom: "unset",
      })
      .from(
        ".exit-span",
        {
          yPercent: 110,
          duration: 1,
          skewY: 10,
          stagger: {
            amount: 0.3,
          },
          ease: "power2.out",
        },
        "-=.5"
      )
      .to(".exit-span", {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .to(
        ".exit-transition",
        {
          height: 0,
          duration: 1.5,
          ease: "Expo.easeInOut",
        },
        "-=1"
      );

  }


}



barba.init({
  sync: true,

  transitions: [
    {
      
      async leave(data) {
        const done = this.async();

        pageTransition();
        await delay(1500);
        done();
      },

      async enter(data) {
        contentAnimation();
      },

      async once(data) {
        contentAnimation();
      },
    },
   
  ],
});
