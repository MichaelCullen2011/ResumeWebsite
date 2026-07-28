const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const navScript = path.resolve(__dirname, '../src/static/js/nav.js');

function fakeElement() {
  const listeners = {};
  const classes = new Set();

  return {
    attributes: {},
    focused: false,
    listeners,
    style: {},
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    classList: {
      contains(name) {
        return classes.has(name);
      },
      toggle(name, force) {
        const enabled = force === undefined ? !classes.has(name) : force;
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      },
    },
    focus() {
      this.focused = true;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
}

function loadNavigation() {
  const burger = fakeElement();
  const navLinks = fakeElement();
  const spans = [fakeElement(), fakeElement(), fakeElement()];
  const links = [fakeElement(), fakeElement()];
  const documentListeners = {};
  let viewportChangeListener;

  burger.querySelectorAll = () => spans;
  navLinks.querySelectorAll = () => links;

  const context = vm.createContext({
    document: {
      addEventListener(type, listener) {
        documentListeners[type] = listener;
      },
      getElementById() {
        return burger;
      },
      querySelector() {
        return navLinks;
      },
    },
    window: {
      matchMedia() {
        return {
          addEventListener(_type, listener) {
            viewportChangeListener = listener;
          },
        };
      },
    },
  });

  vm.runInContext(fs.readFileSync(navScript, 'utf8'), context, {
    filename: navScript,
  });

  return {
    burger,
    documentListeners,
    links,
    navLinks,
    spans,
    viewportChangeListener: event => viewportChangeListener(event),
  };
}

test('mobile navigation exposes state and supports Escape', () => {
  const navigation = loadNavigation();

  navigation.burger.listeners.click();
  assert.equal(navigation.navLinks.classList.contains('open'), true);
  assert.equal(navigation.burger.attributes['aria-expanded'], 'true');
  assert.equal(navigation.burger.attributes['aria-label'], 'Close navigation');
  assert.equal(navigation.links[0].focused, true);

  navigation.documentListeners.keydown({ key: 'Escape' });
  assert.equal(navigation.navLinks.classList.contains('open'), false);
  assert.equal(navigation.burger.attributes['aria-expanded'], 'false');
  assert.equal(navigation.burger.attributes['aria-label'], 'Open navigation');
  assert.equal(navigation.burger.focused, true);
  assert.equal(navigation.spans[0].style.transform, '');
});

test('mobile navigation closes after navigation or desktop resize', () => {
  const navigation = loadNavigation();

  navigation.burger.listeners.click();
  navigation.links[1].listeners.click();
  assert.equal(navigation.navLinks.classList.contains('open'), false);

  navigation.burger.listeners.click();
  navigation.viewportChangeListener({ matches: true });
  assert.equal(navigation.navLinks.classList.contains('open'), false);
  assert.equal(navigation.burger.attributes['aria-expanded'], 'false');
});
