export async function loadOptions() {
  const loadedOptions = await globalThis.browser.storage.sync.get();
  const options = new Map();
  if (loadedOptions) {
    Object.entries(loadedOptions).forEach(([key, value]) => {
      options.set(key, value);
    });
  }
  return options;
}

export async function updateOptions(overrides) {
  browser.storage.sync.set(overrides);
}
