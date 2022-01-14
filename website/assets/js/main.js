<<<<<<< HEAD
const showMenu = (toggleId, navId, dropDownId, dropToggleId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    dropDown = document.getElementById(dropDownId),
    dropToggle = document.getElementById(dropToggleId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
    });
  }

  if (dropToggle && dropDown) {
    dropToggle.addEventListener("click", () => {
      dropDown.classList.toggle("dropdown-cont-show");
    });
  }
};

showMenu("nav-toggle", "nav-menu", "dropdown-cont", "drop-toggle");

function scrollHeader() {
  const nav = document.getElementById("header");
=======
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  // Validate that variables exist
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      // We add the show-menu class to the div tag with the nav__menu class
      nav.classList.toggle("show-menu");
    });
  }
};

showMenu("nav-toggle", "nav-menu");

function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
>>>>>>> 58edd843316baa9d7e06ac31ceec1c0369ac077c
  if (this.scrollY >= 200) {
    nav.classList.add("scroll-header");
  } else {
    nav.classList.remove("scroll-header");
  }
}

window.addEventListener("scroll", scrollHeader);
<<<<<<< HEAD

function scrollup() {
  const scrollup = document.getElementById("scroll-up");
  if (this.scrollY >= 200) scrollup.classList.add("show-scroll");
  else scrollup.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollup);

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const scrolltop1 = document.getElementById("scroll-up");
scrolltop1.addEventListener("click", topFunction);
=======
>>>>>>> 58edd843316baa9d7e06ac31ceec1c0369ac077c
