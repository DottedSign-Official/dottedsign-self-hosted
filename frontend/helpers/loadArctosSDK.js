const SCRIPT_URLS = [
  "/libs/arctos-sign-sdk/html2canvas.min.js",
  "/libs/arctos-sign-sdk/capture.min.js",
  "/libs/arctos-sign-sdk/arctos-signature-sdk.min.js",
];

let loadPromise = null;

const isLoaded = (src) => !!document.querySelector(`script[src="${src}"]`);

const loadOne = (src) =>
  new Promise((resolve, reject) => {
    if (isLoaded(src)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`load failed: ${src}`));
    document.head.appendChild(s);
  });

const loadArctosSDK = () => {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = SCRIPT_URLS.reduce(
    (p, url) => p.then(() => loadOne(url)),
    Promise.resolve(),
  );

  return loadPromise;
};

export default loadArctosSDK;
