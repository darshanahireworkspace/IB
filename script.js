"use strict";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const body = document.body;

const header =
  document.getElementById("siteHeader");

const menuToggle =
  document.getElementById("menuToggle");

const mobileMenu =
  document.getElementById("mobileMenu");

const desktopNavLinks =
  document.querySelectorAll(".nav-link");

const mobileNavLinks =
  document.querySelectorAll(".mobile-nav a");

const internalLinks =
  document.querySelectorAll('a[href^="#"]');

const revealElements =
  document.querySelectorAll(".reveal");

const heroVideo =
  document.getElementById("heroVideo");

const backToTop =
  document.getElementById("backToTop");

const currentYear =
  document.getElementById("currentYear");


/* =========================================================
   BRAND INTRO
========================================================= */

const brandIntro =
  document.getElementById("brandIntro");

const introSkipButton =
  document.getElementById("introSkipButton");

const introLogo =
  document.querySelector(".intro-brand-logo");

let brandIntroClosed = false;
let brandIntroTimer = null;


/*
  Intro active class लगेच add करतो.
  त्यामुळे page open होताना hero आधी flash होणार नाही.
*/

if (brandIntro) {
  body.classList.add("brand-intro-active");
}


/*
  Intro close करून header आणि hero reveal करतो.
*/

function closeBrandIntro() {
  if (brandIntroClosed) return;

  brandIntroClosed = true;

  window.clearTimeout(brandIntroTimer);

  brandIntro?.classList.add("intro-hidden");

  body.classList.remove("brand-intro-active");
  body.classList.add("brand-intro-complete");
  body.classList.add("loaded");

  window.setTimeout(() => {
    brandIntro?.remove();
  }, 900);
}


/*
  Intro 8 seconds दिसेल.
*/

if (brandIntro) {
  brandIntroTimer =
    window.setTimeout(
      closeBrandIntro,
      5000
    );
} else {
  /*
    Intro HTML नसेल तरी hero animations चालतील.
  */
  body.classList.add("loaded");
  body.classList.add("brand-intro-complete");
}


/*
  Skip button.
*/

introSkipButton?.addEventListener(
  "click",
  closeBrandIntro
);


/*
  Escape key ने intro किंवा mobile menu close होईल.
*/

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") return;

    if (
      brandIntro &&
      !brandIntroClosed
    ) {
      closeBrandIntro();
      return;
    }

    closeMobileMenu();
  }
);


/*
  Logo load झाला नाही तरी intro अडकणार नाही.
*/

introLogo?.addEventListener(
  "error",
  () => {
    window.setTimeout(
      closeBrandIntro,
      500
    );
  },
  {
    once: true
  }
);


/* =========================================================
   HERO VIDEO
========================================================= */

function startHeroVideo() {
  if (!heroVideo) return;

  heroVideo.muted = true;

  const playRequest =
    heroVideo.play();

  if (
    playRequest &&
    typeof playRequest.catch === "function"
  ) {
    playRequest.catch(() => {
      /*
        Browser autoplay block केल्यास
        first interaction वर पुन्हा प्रयत्न होईल.
      */
    });
  }
}


/*
  Page load वर video play.
*/

startHeroVideo();


/*
  User interaction नंतर autoplay retry.
*/

document.addEventListener(
  "pointerdown",
  () => {
    if (
      heroVideo &&
      heroVideo.paused
    ) {
      startHeroVideo();
    }
  },
  {
    once: true,
    passive: true
  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {
  menuToggle?.classList.add("active");
  mobileMenu?.classList.add("open");
  body.classList.add("menu-open");

  menuToggle?.setAttribute(
    "aria-expanded",
    "true"
  );

  menuToggle?.setAttribute(
    "aria-label",
    "Close menu"
  );
}


function closeMobileMenu() {
  menuToggle?.classList.remove("active");
  mobileMenu?.classList.remove("open");
  body.classList.remove("menu-open");

  menuToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle?.setAttribute(
    "aria-label",
    "Open menu"
  );
}


function toggleMobileMenu() {
  const menuIsOpen =
    mobileMenu?.classList.contains("open");

  if (menuIsOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}


menuToggle?.addEventListener(
  "click",
  toggleMobileMenu
);


mobileNavLinks.forEach((link) => {
  link.addEventListener(
    "click",
    closeMobileMenu
  );
});


/* =========================================================
   SMOOTH INTERNAL NAVIGATION
========================================================= */

internalLinks.forEach((link) => {
  link.addEventListener(
    "click",
    (event) => {
      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        event.preventDefault();
        return;
      }

      const targetElement =
        document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      closeMobileMenu();

      /*
        Header चा actual current height वापरतो.
      */

      const headerHeight =
        header?.offsetHeight || 0;

      const targetPosition =
        targetElement
          .getBoundingClientRect()
          .top +
        window.scrollY -
        headerHeight +
        2;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  );
});


/* =========================================================
   SECTION DATA
========================================================= */

const sections = [
  "home",
  "stores",
  "collections",
  "wedding",
  "gallery",
  "visit"
]
  .map((sectionId) => {
    return document.getElementById(
      sectionId
    );
  })
  .filter(Boolean);


/* =========================================================
   HEADER AND ACTIVE NAVIGATION
========================================================= */

let lastScrollPosition = -1;
let activeSectionId = "";
let scrollFrameRequested = false;


function updateScrollUI() {
  const scrollPosition =
    window.scrollY ||
    document.documentElement.scrollTop ||
    0;

  /*
    Header background update.
  */

  header?.classList.toggle(
    "scrolled",
    scrollPosition > 35
  );


  /*
    Active section शोधणे.
  */

  let nextActiveSection = "home";

  const headerHeight =
    header?.offsetHeight || 0;

  const activationPosition =
    scrollPosition +
    headerHeight +
    100;

  for (
    let index = 0;
    index < sections.length;
    index += 1
  ) {
    const section =
      sections[index];

    if (
      activationPosition >=
      section.offsetTop
    ) {
      nextActiveSection = section.id;
    } else {
      break;
    }
  }


  /*
    Section बदलली असेल तेव्हाच nav classes update.
  */

  if (
    nextActiveSection !==
    activeSectionId
  ) {
    activeSectionId =
      nextActiveSection;

    desktopNavLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") ===
          `#${activeSectionId}`
      );
    });
  }


  lastScrollPosition =
    scrollPosition;

  scrollFrameRequested = false;
}


function handleScroll() {
  if (scrollFrameRequested) return;

  scrollFrameRequested = true;

  window.requestAnimationFrame(
    updateScrollUI
  );
}


window.addEventListener(
  "scroll",
  handleScroll,
  {
    passive: true
  }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

if ("IntersectionObserver" in window) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.1,
        rootMargin:
          "0px 0px -45px 0px"
      }
    );


  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* =========================================================
   IMAGE PERFORMANCE
========================================================= */

const pageImages =
  document.querySelectorAll("img");


pageImages.forEach((image) => {
  image.decoding = "async";

  /*
    Hero slider images eager load ठेवतो.
    बाकी section images lazy load.
  */

  const isHeroLookImage =
    image.classList.contains("look-slide");

  const isIntroLogo =
    image.classList.contains(
      "intro-brand-logo"
    );

  if (
    !isHeroLookImage &&
    !isIntroLogo
  ) {
    image.loading = "lazy";
  }


  image.addEventListener(
    "error",
    () => {
      image.classList.add(
        "image-load-error"
      );
    },
    {
      once: true
    }
  );
});


/* =========================================================
   HERO VIDEO PERFORMANCE
========================================================= */

if (
  "IntersectionObserver" in window &&
  heroVideo
) {
  const videoObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startHeroVideo();
          } else {
            heroVideo.pause();
          }
        });
      },
      {
        threshold: 0.08
      }
    );

  videoObserver.observe(heroVideo);
}


/* =========================================================
   CONTINUOUS HERO LOOK SLIDER
========================================================= */

const heroLookSlides =
  document.querySelectorAll(".look-slide");

const lookSlider =
  document.querySelector(".look-slider");

const lookCurrentNumber =
  document.getElementById(
    "lookCurrentNumber"
  );

const lookCategory =
  document.getElementById(
    "lookCategory"
  );

const lookTitle =
  document.getElementById(
    "lookTitle"
  );

const lookProgressBar =
  document.getElementById(
    "lookProgressBar"
  );


const heroLookImagePaths = [
  "assets/image1.jpg",
  "assets/image2.jpg",
  "assets/image3.jpg",
  "assets/image4.jpg",
  "assets/image5.jpg",
  "assets/image6.jpg",
  "assets/image7.jpg"
];


const heroLookData = [
  {
    category: "Featured",
    title: "Wedding Edit"
  },
  {
    category: "Signature",
    title: "Royal Occasion"
  },
  {
    category: "Celebration",
    title: "Festive Edit"
  },
  {
    category: "Modern",
    title: "Contemporary"
  },
  {
    category: "Wedding",
    title: "Grand Collection"
  },
  {
    category: "Curated",
    title: "Occasion Wear"
  },
  {
    category: "New Arrival",
    title: "Latest Edit"
  }
];


let currentLookIndex = 0;
let heroLookTimer = null;

const heroLookDuration = 3000;


/*
  Slider images preload.
*/

heroLookImagePaths.forEach(
  (imagePath) => {
    const preloadImage =
      new Image();

    preloadImage.src = imagePath;
  }
);


/*
  Progress bar restart.
*/

function restartLookProgress() {
  if (!lookProgressBar) return;

  lookProgressBar.classList.remove(
    "animate"
  );

  void lookProgressBar.offsetWidth;

  lookProgressBar.classList.add(
    "animate"
  );
}


/*
  Selected hero look show करतो.
*/

function showHeroLook(index) {
  if (!heroLookSlides.length) return;

  /*
    Negative index किंवा last slide नंतर
    loop safely first slide वर जाईल.
  */

  currentLookIndex =
    (
      index +
      heroLookSlides.length
    ) %
    heroLookSlides.length;


  heroLookSlides.forEach(
    (slide, slideIndex) => {
      const isActive =
        slideIndex ===
        currentLookIndex;

      slide.classList.toggle(
        "active",
        isActive
      );

      slide.setAttribute(
        "aria-hidden",
        String(!isActive)
      );
    }
  );


  /*
    Current photo blurred background
    म्हणून update करतो.
  */

  const currentImagePath =
    heroLookImagePaths[
      currentLookIndex
    ];

  if (
    lookSlider &&
    currentImagePath
  ) {
    lookSlider.style.setProperty(
      "--active-look-image",
      `url("${currentImagePath}")`
    );
  }


  const currentData =
    heroLookData[
      currentLookIndex
    ];


  if (lookCurrentNumber) {
    lookCurrentNumber.textContent =
      String(
        currentLookIndex + 1
      ).padStart(2, "0");
  }


  if (
    lookCategory &&
    currentData
  ) {
    lookCategory.textContent =
      currentData.category;
  }


  if (
    lookTitle &&
    currentData
  ) {
    lookTitle.textContent =
      currentData.title;
  }


  restartLookProgress();
}


/*
  Continuous loop:
  7व्या photo नंतर पुन्हा image1.
*/

function scheduleNextHeroLook() {
  window.clearTimeout(heroLookTimer);

  if (heroLookSlides.length < 2) {
    return;
  }

  heroLookTimer =
    window.setTimeout(() => {
      showHeroLook(
        currentLookIndex + 1
      );

      scheduleNextHeroLook();
    }, heroLookDuration);
}


/*
  Slider start.
*/

if (heroLookSlides.length > 0) {
  showHeroLook(0);
  scheduleNextHeroLook();
}


/*
  Tab inactive असताना timer stop.
  Tab open झाल्यावर पुन्हा continuous loop.
*/

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      window.clearTimeout(
        heroLookTimer
      );

      return;
    }

    scheduleNextHeroLook();
  }
);


/* =========================================================
   RESPONSIVE RESIZE
========================================================= */

let resizeTimer = null;


window.addEventListener(
  "resize",
  () => {
    window.clearTimeout(
      resizeTimer
    );

    resizeTimer =
      window.setTimeout(() => {
        if (
          window.innerWidth > 1100
        ) {
          closeMobileMenu();
        }

        lastScrollPosition = -1;
        activeSectionId = "";

        updateScrollUI();
      }, 140);
  },
  {
    passive: true
  }
);


/* =========================================================
   BACK TO TOP
========================================================= */

backToTop?.addEventListener(
  "click",
  () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);


/* =========================================================
   CURRENT YEAR
========================================================= */

if (currentYear) {
  currentYear.textContent =
    String(
      new Date().getFullYear()
    );
}


/* =========================================================
   INITIAL STATE
========================================================= */

if (typeof updateScrollUI === "function") {
  updateScrollUI();
}


/* =========================================================
   AUTOMATIC INTERACTIVE FLOOR GUIDE
   3 SECOND CONTINUOUS LOOP
========================================================= */

/* Floor guide elements */

const floorTabs =
  document.querySelectorAll(".floor-tab");

const floorPreview =
  document.querySelector(".floor-preview");

const floorPreviewImageWrapper =
  document.querySelector(".floor-preview-image");

const floorPreviewImage =
  document.getElementById("floorPreviewImage");

const floorPreviewNumber =
  document.getElementById("floorPreviewNumber");

const floorPreviewLabel =
  document.getElementById("floorPreviewLabel");

const floorPreviewTitle =
  document.getElementById("floorPreviewTitle");

const floorPreviewDescription =
  document.getElementById("floorPreviewDescription");

const floorProductList =
  document.getElementById("floorProductList");

const floorAutoProgress =
  document.getElementById("floorAutoProgress");


/* Floor order */

const floorOrder = [
  "basement",
  "ground",
  "first",
  "second",
  "third",
  "fourth"
];


/* Floor data with matching images */

const floorData = {
  basement: {
    number: "B",
    label: "Basement",
    title: "Casual Essentials",

    description:
      "Explore premium casual wear, everyday essentials and modern menswear styles.",

    image: "assets/image10.jpg",

    products: [
      "Casual Shirts",
      "T-Shirts",
      "Denim",
      "Everyday Wear"
    ]
  },

  ground: {
    number: "G",
    label: "Ground Floor",
    title: "Jeans & T-Shirts",

    description:
      "Discover modern denim, premium jeans, polos and everyday T-shirt collections.",

    image: "assets/image11.jpg",

    products: [
      "Jeans",
      "Denim",
      "T-Shirts",
      "Polo T-Shirts"
    ]
  },

  first: {
    number: "01",
    label: "First Floor",
    title: "Premium Shirts",

    description:
      "Formal, casual and premium occasion shirts from leading fashion brands.",

    image: "assets/image12.jpg",

    products: [
      "Formal Shirts",
      "Casual Shirts",
      "Party Shirts",
      "Premium Brands"
    ]
  },

  second: {
    number: "02",
    label: "Second Floor",
    title: "Suiting & Shirting",

    description:
      "Premium suiting and shirting fabrics created for refined formal dressing.",

    image: "assets/image13.jpg",

    products: [
      "Suiting",
      "Shirting",
      "Premium Fabrics",
      "Formal Collection"
    ]
  },

  third: {
    number: "03",
    label: "Third Floor",
    title: "Jodhpuri & Kurta Pajama",

    description:
      "Elegant ethnic and festive styles for weddings, celebrations and special occasions.",

    image: "assets/image14.jpg",

    products: [
      "Jodhpuri",
      "Kurta Pajama",
      "Ethnic Wear",
      "Festive Styles"
    ]
  },

  fourth: {
    number: "04",
    label: "Fourth Floor",
    title: "Sherwani & Coat Suits",

    description:
      "Premium sherwanis, groom collections and sophisticated coat suits for grand occasions.",

    image: "assets/image15.jpg",

    products: [
      "Sherwani",
      "Coat Suit",
      "Groom Wear",
      "Wedding Collection"
    ]
  }
};


/* Slider state */

let currentFloorIndex = 0;
let floorAutoTimer = null;
let floorImageChangeTimer = null;
let floorGuideIsVisible = false;

const floorChangeDuration = 3000;


/* =========================================================
   PRELOAD FLOOR IMAGES
========================================================= */

Object.values(floorData).forEach((floor) => {
  const preloadImage = new Image();

  preloadImage.src = floor.image;
});


/* =========================================================
   FLOOR PROGRESS ANIMATION
========================================================= */

function restartFloorProgress() {
  if (!floorAutoProgress) return;

  floorAutoProgress.classList.remove("animate");

  void floorAutoProgress.offsetWidth;

  floorAutoProgress.classList.add("animate");
}


function stopFloorProgress() {
  floorAutoProgress?.classList.remove("animate");
}


/* =========================================================
   UPDATE FLOOR CONTENT
========================================================= */

function showFloor(floorKey) {
  const selectedFloor = floorData[floorKey];

  if (!selectedFloor) return;

  const selectedIndex =
    floorOrder.indexOf(floorKey);

  if (selectedIndex !== -1) {
    currentFloorIndex = selectedIndex;
  }


  /* Active floor tab */

  floorTabs.forEach((tab) => {
    const isSelected =
      tab.dataset.floor === floorKey;

    tab.classList.toggle(
      "active",
      isSelected
    );

    tab.setAttribute(
      "aria-selected",
      String(isSelected)
    );

    tab.tabIndex =
      isSelected ? 0 : -1;
  });


  /* Start image transition */

  floorPreviewImageWrapper?.classList.add(
    "is-changing"
  );

  window.clearTimeout(
    floorImageChangeTimer
  );


  floorImageChangeTimer =
    window.setTimeout(() => {

      /* Change image */

      if (floorPreviewImage) {
        floorPreviewImage.src =
          selectedFloor.image;

        floorPreviewImage.alt =
          `${selectedFloor.title} collection at Indians Boutique`;
      }


      /* Change blurred image background */

      floorPreviewImageWrapper?.style.setProperty(
        "--floor-active-image",
        `url("${selectedFloor.image}")`
      );


      /* Change floor number */

      if (floorPreviewNumber) {
        floorPreviewNumber.textContent =
          selectedFloor.number;
      }


      /* Change floor label */

      if (floorPreviewLabel) {
        floorPreviewLabel.textContent =
          selectedFloor.label;
      }


      /* Change floor title */

      if (floorPreviewTitle) {
        floorPreviewTitle.textContent =
          selectedFloor.title;
      }


      /* Change description */

      if (floorPreviewDescription) {
        floorPreviewDescription.textContent =
          selectedFloor.description;
      }


      /* Change product tags */

      if (floorProductList) {
        floorProductList.replaceChildren(
          ...selectedFloor.products.map(
            (product) => {
              const productTag =
                document.createElement("span");

              productTag.textContent =
                product;

              return productTag;
            }
          )
        );
      }


      floorPreviewImageWrapper?.classList.remove(
        "is-changing"
      );


      if (
        floorGuideIsVisible &&
        !document.hidden
      ) {
        restartFloorProgress();
      }

    }, 220);
}


/* =========================================================
   AUTOMATIC FLOOR LOOP
========================================================= */

function stopFloorSlider() {
  window.clearTimeout(
    floorAutoTimer
  );

  floorAutoTimer = null;

  stopFloorProgress();
}


function scheduleNextFloor() {
  window.clearTimeout(
    floorAutoTimer
  );

  if (
    floorTabs.length < 2 ||
    !floorGuideIsVisible ||
    document.hidden
  ) {
    return;
  }

  restartFloorProgress();


  floorAutoTimer =
    window.setTimeout(() => {

      currentFloorIndex =
        (
          currentFloorIndex + 1
        ) %
        floorOrder.length;


      showFloor(
        floorOrder[currentFloorIndex]
      );


      scheduleNextFloor();

    }, floorChangeDuration);
}


/* =========================================================
   MANUAL FLOOR SELECTION
========================================================= */

floorTabs.forEach((tab) => {

  tab.addEventListener(
    "click",
    () => {

      const selectedFloor =
        tab.dataset.floor;

      if (!selectedFloor) return;

      showFloor(selectedFloor);

      scheduleNextFloor();
    }
  );


  /*
    Keyboard support:
    Left/Up = previous floor
    Right/Down = next floor
  */

  tab.addEventListener(
    "keydown",
    (event) => {

      const supportedKeys = [
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown"
      ];

      if (
        !supportedKeys.includes(
          event.key
        )
      ) {
        return;
      }

      event.preventDefault();


      const direction =
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
          ? -1
          : 1;


      currentFloorIndex =
        (
          currentFloorIndex +
          direction +
          floorOrder.length
        ) %
        floorOrder.length;


      const nextFloorKey =
        floorOrder[currentFloorIndex];


      showFloor(nextFloorKey);

      scheduleNextFloor();


      const nextFloorTab =
        document.querySelector(
          `.floor-tab[data-floor="${nextFloorKey}"]`
        );

      nextFloorTab?.focus();
    }
  );

});


/* =========================================================
   RUN ONLY WHEN FLOOR SECTION IS VISIBLE
========================================================= */

if (
  "IntersectionObserver" in window &&
  floorPreview
) {

  const floorSectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          floorGuideIsVisible =
            entry.isIntersecting;


          if (entry.isIntersecting) {
            scheduleNextFloor();
          } else {
            stopFloorSlider();
          }

        });

      },
      {
        threshold: 0.12
      }
    );


  floorSectionObserver.observe(
    floorPreview
  );

} else {

  floorGuideIsVisible = true;

  scheduleNextFloor();
}


/* =========================================================
   BROWSER TAB VISIBILITY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {
      stopFloorSlider();
      return;
    }


    if (floorGuideIsVisible) {
      scheduleNextFloor();
    }

  }
);


/* =========================================================
   INITIAL FLOOR
========================================================= */

if (
  floorTabs.length &&
  floorPreview
) {
  showFloor("basement");
}


/* =========================================================
   STORE STATS COUNTER
========================================================= */

const counterElements =
  document.querySelectorAll(
    "[data-counter]"
  );


function animateCounter(element) {
  if (
    element.dataset.animated === "true"
  ) {
    return;
  }

  const target =
    Number(element.dataset.counter);

  if (!Number.isFinite(target)) {
    return;
  }

  element.dataset.animated = "true";

  const duration = 1400;
  const startTime = performance.now();


  function updateCounter(currentTime) {
    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    const easedProgress =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    const currentValue =
      Math.round(
        target * easedProgress
      );


    element.textContent =
      target >= 25
        ? `${currentValue}+`
        : String(currentValue);


    if (progress < 1) {
      window.requestAnimationFrame(
        updateCounter
      );
    }
  }


  window.requestAnimationFrame(
    updateCounter
  );
}


if (
  "IntersectionObserver" in window
) {

  const counterObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          animateCounter(
            entry.target
          );


          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.35
      }
    );


  counterElements.forEach(
    (counter) => {
      counterObserver.observe(
        counter
      );
    }
  );

} else {

  counterElements.forEach(
    animateCounter
  );

}


/* =========================================================
   FINAL PAGE SCROLL UNLOCK FIX
========================================================= */

function unlockPageScroll() {
  const menuIsCurrentlyOpen =
    document
      .getElementById("mobileMenu")
      ?.classList
      .contains("open");


  const introElement =
    document.getElementById(
      "brandIntro"
    );


  const introIsCurrentlyOpen =
    introElement &&
    !introElement.classList.contains(
      "intro-hidden"
    );


  if (
    menuIsCurrentlyOpen ||
    introIsCurrentlyOpen
  ) {
    return;
  }


  document.documentElement.style.removeProperty(
    "overflow"
  );

  document.documentElement.style.removeProperty(
    "overflow-y"
  );

  document.documentElement.style.removeProperty(
    "height"
  );


  document.body.style.removeProperty(
    "overflow"
  );

  document.body.style.removeProperty(
    "overflow-y"
  );

  document.body.style.removeProperty(
    "height"
  );

  document.body.style.removeProperty(
    "position"
  );

  document.body.style.removeProperty(
    "top"
  );

  document.body.style.removeProperty(
    "width"
  );


  document.body.classList.remove(
    "menu-open"
  );


  if (
    !introElement ||
    introElement.classList.contains(
      "intro-hidden"
    )
  ) {
    document.body.classList.remove(
      "brand-intro-active"
    );

    document.body.classList.add(
      "brand-intro-complete"
    );
  }
}


/* Unlock after page load */

window.addEventListener(
  "load",
  () => {

    window.setTimeout(
      unlockPageScroll,
      8500
    );

  },
  {
    once: true
  }
);


/* Unlock on browser back/forward */

window.addEventListener(
  "pageshow",
  () => {

    window.setTimeout(
      unlockPageScroll,
      150
    );

  }
);


/*
  Watch intro and mobile-menu classes.
  त्यांच्या close झाल्यानंतर page scroll unlock होईल.
*/

const scrollLockObserver =
  new MutationObserver(() => {

    window.requestAnimationFrame(
      unlockPageScroll
    );

  });


const observedMobileMenu =
  document.getElementById(
    "mobileMenu"
  );

const observedBrandIntro =
  document.getElementById(
    "brandIntro"
  );


if (observedMobileMenu) {
  scrollLockObserver.observe(
    observedMobileMenu,
    {
      attributes: true,
      attributeFilter: ["class"]
    }
  );
}


if (observedBrandIntro) {
  scrollLockObserver.observe(
    observedBrandIntro,
    {
      attributes: true,
      attributeFilter: ["class"]
    }
  );
}


/* Final immediate fallback */

window.setTimeout(
  unlockPageScroll,
  100
);
