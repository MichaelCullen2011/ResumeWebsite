const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
const menuLinks = navLinks.querySelectorAll('a');
const spans = burger.querySelectorAll('span');

function setMenuOpen(open, restoreFocus = false) {
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';

  if (open) {
    menuLinks[0].focus();
  } else if (restoreFocus) {
    burger.focus();
  }
}

burger.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('open'));
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenuOpen(false, true);
  }
});

window.matchMedia('(min-width: 769px)').addEventListener('change', event => {
  if (event.matches) setMenuOpen(false);
});
