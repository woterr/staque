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
  if (this.scrollY >= 200) {
    nav.classList.add("scroll-header");
  } else {
    nav.classList.remove("scroll-header");
  }
}

window.addEventListener("scroll", scrollHeader);

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
