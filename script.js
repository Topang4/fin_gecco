// === MOBILE NAVIGATION ===
const hamburger = document.getElementById("hamburger");
let mobileMenu = null;
let overlay = null;

function createMobileMenu() {
  if (!mobileMenu) {
    mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-menu";
    mobileMenu.innerHTML = `
      <a href="index.html#top">Home</a>
      <a href="projects.html">Projects</a>
      <a href="index.html#about">About</a>
      <a href="index.html#services">Our Services</a>
      <a href="#contact">Contact Us</a>
    `;
    document.body.appendChild(mobileMenu);
  }
}

function toggleOverlay(show) {
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    document.body.appendChild(overlay);
  }
  overlay.classList.toggle("active", show);
  document.body.classList.toggle("menu-open", show);
}

hamburger.addEventListener("click", () => {
  // Create menu if it doesn't exist
  createMobileMenu();

  const isActive = mobileMenu.classList.toggle("active");
  hamburger.classList.toggle("active", isActive);
  toggleOverlay(isActive);

  // Attach click listeners to links only once
  if (!mobileMenu.linksSetup) {
    const links = mobileMenu.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        hamburger.classList.remove("active");
        toggleOverlay(false);
      });
    });
    mobileMenu.linksSetup = true; // mark as done
  }
});

document.addEventListener("click", (e) => {
  if (
    mobileMenu &&
    mobileMenu.classList.contains("active") &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
    toggleOverlay(false);
  }
});

// === LIGHTBOX WITH MULTI-IMAGE GROUPS ===
const images = document.querySelectorAll(".image-card img");
const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
lightbox.innerHTML = `
  <span class="lightbox-close">&times;</span>
  <img src="" alt="Expanded image">
  <div class="lightbox-controls">
    <button id="prev">Prev</button>
    <button id="next">Next</button>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");
const closeBtn = lightbox.querySelector(".lightbox-close");
const prevBtn = lightbox.querySelector("#prev");
const nextBtn = lightbox.querySelector("#next");

let currentGroup = [];
let currentIndex = 0;

// On clicking any image
images.forEach((img) => {
  img.addEventListener("click", () => {
    const groupName = img.parentElement.dataset.group; // get data-group
    // Select all images with the same data-group
    currentGroup = Array.from(
      document.querySelectorAll(`.image-card[data-group="${groupName}"] img`)
    );
    currentIndex = currentGroup.indexOf(img);

    lightbox.classList.add("active");
    showImage(currentIndex); // show the clicked image
  });
});

function showImage(index) {
  // Clamp index between 0 and last
  if (index < 0) index = 0;
  if (index >= currentGroup.length) index = currentGroup.length - 1;
  currentIndex = index;

  lightboxImg.src = currentGroup[currentIndex].src;

  // Show/hide prev/next buttons at edges
  prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
  nextBtn.style.display =
    currentIndex === currentGroup.length - 1 ? "none" : "inline-block";
}

// Prev/Next button clicks
prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

// Close lightbox
closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("active");
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") lightbox.classList.remove("active");
  else if (e.key === "ArrowLeft" && currentIndex > 0)
    showImage(currentIndex - 1);
  else if (e.key === "ArrowRight" && currentIndex < currentGroup.length - 1)
    showImage(currentIndex + 1);
});

// Preload first image of each card
document.querySelectorAll(".image-card").forEach((card) => {
  const firstImg = card.querySelector("img");
  if (firstImg) new Image().src = firstImg.src;
});

// Preload full group on hover
document.querySelectorAll(".image-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const groupName = card.dataset.group;
    const groupImages = Array.from(
      document.querySelectorAll(`.image-card[data-group="${groupName}"] img`)
    );
    groupImages.forEach((img) => (new Image().src = img.src));
  });
});

const cards = document.querySelectorAll(".image-card");
cards.forEach((card, i) => {
  setTimeout(() => card.classList.add("visible"), i * 120);
});

/* =========================
   Back to Top Button
========================= */

const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* =========================
   Back to Top – Footer Detection
========================= */

const footer = document.querySelector("footer");

if (footer && backToTopBtn) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        backToTopBtn.classList.add("footer-contrast");
      } else {
        backToTopBtn.classList.remove("footer-contrast");
      }
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(footer);
}

/* =========================
   Preloader Control (Timed)
========================= */

const preloader = document.getElementById("preloader");
const isProjectsPage = document.body.classList.contains("projects-page");

// Shorter loader for projects page
const loaderTime = isProjectsPage ? 900 : 1500;

if (preloader) {
  setTimeout(() => {
    preloader.classList.add("hide");

    // Remove from DOM after fade-out
    setTimeout(() => {
      preloader.remove();
    }, 600); // must match CSS transition
  }, loaderTime);
}
