const HTML = document.documentElement;

const cache = {};
let url = '';

const DEFAULT_OPTIONS = {
  'global-on': 'true',
};

const ELEMENT_TO_SPY_ON_SELECTOR = 'body';

/**
 * Element to spy on is used to detect navigation changes
 */
const getElementToSpyOn = () =>
  document.querySelector(ELEMENT_TO_SPY_ON_SELECTOR);

const PAGE_REGEXES = {
  home: /^https:\/\/(www\.)?instagram\.com\/?$/,
  dms: /^https:\/\/(www\.)?instagram\.com\/direct\/inbox\/?$/,
};

const REDIRECTS = {
  dms: 'https://www.instagram.com/direct/inbox/',
};

(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  const browser = globalThis.browser;

  /**
   * Having access to the current page through the `page` global attribute is crucial to set correct styles
   */
  function setPage() {
    const newUrl = window.location.href;
    if (PAGE_REGEXES.home.test(newUrl)) {
      HTML.setAttribute('page', 'home');
      cache['page'] = 'home';
    }
    if (PAGE_REGEXES.dms.test(newUrl)) {
      HTML.setAttribute('page', 'dms');
      cache['page'] = 'dms';
    }
  }

  async function applyOptions() {
    /**
     * We check and apply cache first, because storage.get is async
     */
    if (Object.entries({ ...DEFAULT_OPTIONS, ...cache }).length) {
      for (const [key, value] of Object.entries(cache)) {
        HTML.setAttribute(key, value.toString());
      }
    }
    browser.storage.sync.get(options => {
      for (const [key, value] of Object.entries(options)) {
        cache[key] = value;
        HTML.setAttribute(key, value);
      }
      handleRedirects();
    });
    handleRedirects();
  }

  function handleRedirects() {
    const onHome = cache['page'] === 'home';
    if (onHome && cache['redirect-dms']) {
      window.location.href = REDIRECTS.dms;
    }
  }

  const observer = new MutationObserver(() => {
    const newUrl = window.location.href;
    if (newUrl === url) {
      return;
    }
    url = newUrl;
    setPage();
    const newElementToSpyOn = getElementToSpyOn();
    observer.disconnect();
    observer.observe(newElementToSpyOn, { childList: true });
  });

  /**
   * Without the event listener, the `main` element is null
   */
  document.addEventListener('DOMContentLoaded', async () => {
    let elementToSpyOn = getElementToSpyOn();
    if (!elementToSpyOn) {
      console.error(
        'element to spy on not found, not able to detect navigation'
      );
      return;
    }
    observer.observe(elementToSpyOn, { childList: true });
  });

  browser.storage.onChanged.addListener(() => {
    applyOptions();
  });

  url = window.location.href;
  setPage();
  applyOptions();
})();
