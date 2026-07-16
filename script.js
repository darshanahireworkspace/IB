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
      7000
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

updateScrollUI();


/* =========================================================
   INDIANS BOUTIQUE INTERACTIVE FLOOR GUIDE
========================================================= */

/* =========================================================
   AUTOMATIC INTERACTIVE FLOOR GUIDE
   3 SECOND CONTINUOUS LOOP
========================================================= */

const floorTabs =
  document.querySelectorAll(".floor-tab");

const floorPreview =
  document.querySelector(".floor-preview");

const floorPreviewImage =
  document.getElementById("floorPreviewImage");

const floorPreviewNumber =
  document.getElementById("floorPreviewNumber");

const floorPreviewLabel =
  document.getElementById("floorPreviewLabel");

const floorPreviewTitle =
  document.getElementById("floorPreviewTitle");

const floorPreviewDescription =
  document.getElementById(
    "floorPreviewDescription"
  );

const floorProductList =
  document.getElementById(
    "floorProductList"
  );

const floorPreviewImageWrapper =
  document.querySelector(
    ".floor-preview-image"
  );

const floorAutoProgress =
  document.getElementById(
    "floorAutoProgress"
  );


const floorOrder = [
  "basement",
  "ground",
  "first",
  "second",
  "third",
  "fourth"
];


const floorData = {
  basement: {
    number: "B",
    label: "Basement",
    title: "Casual Essentials",

    description:
      "Explore jeans, T-shirts, shirts and everyday casual styles.",

    image: "assets/image1.jpg",

    products: [
      "Jeans",
      "T-Shirts",
      "Shirts",
      "Casual Wear"
    ]
  },

  ground: {
    number: "G",
    label: "Ground Floor",
    title: "Jeans & T-Shirts",

    description:
      "Contemporary denim, premium T-shirts and everyday menswear essentials.",

    image: "assets/image2.jpg",

    products: [
      "Jeans",
      "Denim",
      "T-Shirts",
      "Casual Wear"
    ]
  },

  first: {
    number: "01",
    label: "First Floor",
    title: "Premium Shirts",

    description:
      "Formal, casual and occasion shirts from premium fashion brands.",

    image: "assets/image3.jpg",

    products: [
      "Formal Shirts",
      "Casual Shirts",
      "Party Shirts"
    ]
  },

  second: {
    number: "02",
    label: "Second Floor",
    title: "Suiting & Shirting",

    description:
      "Premium fabrics and refined formal dressing collections.",

    image: "assets/image4.jpg",

    products: [
      "Suiting",
      "Shirting",
      "Premium Fabric",
      "Formal Wear"
    ]
  },

  third: {
    number: "03",
    label: "Third Floor",
    title: "Jodhpuri & Kurta Pajama",

    description:
      "Traditional and contemporary Indian occasion wear.",

    image: "assets/image5.jpg",

    products: [
      "Jodhpuri",
      "Kurta Pajama",
      "Ethnic Wear"
    ]
  },

  fourth: {
    number: "04",
    label: "Fourth Floor",
    title: "Sherwani & Coat Suits",

    description:
      "Wedding sherwanis, coat suits and premium groom collections.",

    image: "assets/image6.jpg",

    products: [
      "Sherwani",
      "Coat Suit",
      "Groom Wear",
      "Wedding"
    ]
  }
};


let currentFloorIndex = 0;
let floorAutoTimer = null;

const floorChangeDuration = 3000;


/* Preload images */

Object.values(floorData).forEach(
  (floor) => {
    const preloadImage =
      new Image();

    preloadImage.src =
      floor.image;
  }
);


/* Restart progress */

function restartFloorProgress() {
  if (!floorAutoProgress) return;

  floorAutoProgress.classList.remove(
    "animate"
  );

  void floorAutoProgress.offsetWidth;

  floorAutoProgress.classList.add(
    "animate"
  );
}


/* Show selected floor */

function showFloor(floorKey) {
  const selectedFloor =
    floorData[floorKey];

  if (!selectedFloor) return;

  const selectedIndex =
    floorOrder.indexOf(floorKey);

  if (selectedIndex !== -1) {
    currentFloorIndex =
      selectedIndex;
  }


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
  });


  floorPreviewImageWrapper
    ?.classList
    .add("is-changing");


  window.setTimeout(() => {
    if (floorPreviewImage) {
      floorPreviewImage.src =
        selectedFloor.image;

      floorPreviewImage.alt =
        `${selectedFloor.title} at Indians Boutique`;
    }


    floorPreviewImageWrapper
      ?.style
      .setProperty(
        "--floor-active-image",
        `url("${selectedFloor.image}")`
      );


    if (floorPreviewNumber) {
      floorPreviewNumber.textContent =
        selectedFloor.number;
    }


    if (floorPreviewLabel) {
      floorPreviewLabel.textContent =
        selectedFloor.label;
    }


    if (floorPreviewTitle) {
      floorPreviewTitle.textContent =
        selectedFloor.title;
    }


    if (floorPreviewDescription) {
      floorPreviewDescription.textContent =
        selectedFloor.description;
    }


    if (floorProductList) {
      floorProductList.innerHTML =
        selectedFloor.products
          .map(
            (product) =>
              `<span>${product}</span>`
          )
          .join("");
    }


    floorPreviewImageWrapper
      ?.classList
      .remove("is-changing");


    restartFloorProgress();

  }, 220);
}


/* Automatic next floor */

function scheduleNextFloor() {
  window.clearTimeout(
    floorAutoTimer
  );

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


/* Manual floor click */

floorTabs.forEach((tab) => {
  tab.addEventListener(
    "click",
    () => {
      showFloor(
        tab.dataset.floor
      );

      scheduleNextFloor();
    }
  );
});


/* Pause when section is outside viewport */

if (
  "IntersectionObserver" in window &&
  floorPreview
) {
  const floorSectionObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scheduleNextFloor();
            restartFloorProgress();
          } else {
            window.clearTimeout(
              floorAutoTimer
            );

            floorAutoProgress
              ?.classList
              .remove("animate");
          }
        });
      },
      {
        threshold: 0.15
      }
    );

  floorSectionObserver.observe(
    floorPreview
  );
} else {
  scheduleNextFloor();
}


/* Browser tab inactive */

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      window.clearTimeout(
        floorAutoTimer
      );

      return;
    }

    scheduleNextFloor();
  }
);


/* Initial floor */

showFloor("basement");


/* =========================================================
   STORE STATS COUNTER
========================================================= */

const counterElements =
  document.querySelectorAll(
    "[data-counter]"
  );


function animateCounter(element) {

  const target =
    Number(
      element.dataset.counter
    );

  if (!Number.isFinite(target)) {
    return;
  }


  const duration = 1400;

  const startTime =
    performance.now();


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


if ("IntersectionObserver" in window) {

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
        threshold: 0.45
      }
    );


  counterElements.forEach((counter) => {
    counterObserver.observe(counter);
  });

} else {

  counterElements.forEach(
    animateCounter
  );

}


/* Initial floor */

showFloor("basement");

/* =========================================================
   FINAL PAGE SCROLL UNLOCK FIX
========================================================= */

function unlockPageScroll() {
  const menuIsOpen =
    mobileMenu?.classList.contains("open");

  const introIsOpen =
    brandIntro &&
    !brandIntroClosed;

  if (
    menuIsOpen ||
    introIsOpen
  ) {
    return;
  }

  document.documentElement.style.removeProperty(
    "overflow"
  );

  document.documentElement.style.removeProperty(
    "height"
  );

  document.body.style.removeProperty(
    "overflow"
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

  document.body.classList.remove(
    "menu-open"
  );
}


/*
  Intro close झाल्यावर scroll unlock.
*/

const originalCloseBrandIntro =
  typeof closeBrandIntro === "function"
    ? closeBrandIntro
    : null;

if (originalCloseBrandIntro) {
  closeBrandIntro = function () {
    originalCloseBrandIntro();

    window.setTimeout(
      unlockPageScroll,
      950
    );
  };
}


/*
  Mobile menu close झाल्यावर scroll unlock.
*/

const originalCloseMobileMenu =
  typeof closeMobileMenu === "function"
    ? closeMobileMenu
    : null;

if (originalCloseMobileMenu) {
  closeMobileMenu = function () {
    originalCloseMobileMenu();

    window.setTimeout(
      unlockPageScroll,
      50
    );
  };
}


/*
  Page load fallback.
*/

window.addEventListener(
  "load",
  () => {
    window.setTimeout(
      unlockPageScroll,
      9000
    );
  }
);


/*
  Browser back/forward नंतरही scroll सुरू राहील.
*/

window.addEventListener(
  "pageshow",
  () => {
    window.setTimeout(
      unlockPageScroll,
      100
    );
  }
);

