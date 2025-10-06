const HTML = document.documentElement;

const cache = {};
let url = '';

const DEFAULT_OPTIONS = {
  'global-on': 'true',
};

/**
 * As the script runs on document_start, the `main` tag is not yet rendered on the page during the content_script run.
 * We set the `main` global state on `DOMContentLoaded` event listener.
 */
let main = null;

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

  /**
   * On `main` change checks if the `url` has changed and if so, updates the state, reapplies options and re-attaches the observer to the new `main` element.
   */
  const observer = new MutationObserver(() => {
    const newUrl = window.location.href;
    if (newUrl === url) {
      return;
    }
    url = newUrl;
    setPage();
    const newMain = document.querySelector('main');
    if (newMain && newMain !== main) {
      observer.disconnect();
      observer.observe(newMain, { childList: true });
    }
  });

  /**
   * Without the event listener, the `main` element is null
   */
  document.addEventListener('DOMContentLoaded', async () => {
    main = document.querySelector('main');
    if (!main) {
      await new Promise((res, rej) => {
        setTimeout(() => {
          main = document.querySelector('main');
          if (!main) {
            console.error('<main/> not found, not able to detect navigation');
            rej(false);
          }
          res(true);
        }, 1000);
      });
      return;
    }
    observer.observe(main, { childList: true });
  });

  browser.storage.onChanged.addListener(() => {
    applyOptions();
  });

  url = window.location.href;
  setPage();
  applyOptions();
})();
