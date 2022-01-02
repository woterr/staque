let mouseCursor = document.querySelector(".cursor");
const links = document.getElementsByTagName("a");
const nav_btns = document.querySelectorAll(".hover_element");

window.addEventListener("mousemove", cursor);

function cursor(e) {
  mouseCursor.style.top = `${e.pageY}px`;
  mouseCursor.style.left = `${e.pageX}px`;
}

Array.from(links).forEach((link) => {
  link.addEventListener("mouseover", () => {
    mouseCursor.classList.add("focus");
  });

  link.addEventListener("mouseleave", () => {
    mouseCursor.classList.remove("focus");
  });
});

Array.from(nav_btns).forEach((btn) => {
  btn.addEventListener("mouseover", () => {
    mouseCursor.classList.add("focus");
  });

  btn.addEventListener("mouseleave", () => {
    mouseCursor.classList.remove("focus");
  });
});

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
  const scrolltop = document.getElementById("scroll-top");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 200) {
    nav.classList.add("scroll-header");
    scrolltop.classList.add("scroll-top-show");
  } else {
    nav.classList.remove("scroll-header");
    scrolltop.classList.remove("scroll-top-show");
  }
}

window.addEventListener("scroll", scrollHeader);

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

const scrolltop1 = document.getElementById("scroll-top");
scrolltop1.addEventListener("click", topFunction);
