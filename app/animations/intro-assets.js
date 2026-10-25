const HERO_FONTS = ['400 1em "Hanken Grotesk"', '600 1em "Hanken Grotesk"'];

function waitForFont(font, fonts, signal) {
  return new Promise(resolve => {
    let settled = false;
    let retry;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(retry);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const load = () => {
      if (signal.aborted) return finish();
      Promise.resolve().then(() => fonts.load(font, "Kiks Okiki Oriola ı")).then(faces => {
        if (settled) return;
        if (faces.length) finish();
        // The Google Fonts stylesheet may still be arriving. An empty result
        // means the face is not registered yet, rather than that it is ready.
        else retry = setTimeout(load, 50);
      }, finish);
    };
    signal.addEventListener("abort", finish, { once: true });
    load();
  });
}

function waitForImage(image, signal) {
  return new Promise(resolve => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      image.removeEventListener("load", decode);
      image.removeEventListener("error", finish);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const decode = () => {
      // A loaded image can still need decoding before it is ready to paint.
      Promise.resolve().then(() => image.decode?.()).catch(() => {}).then(finish);
    };

    if (signal.aborted) {
      finish();
      return;
    }

    image.addEventListener("load", decode, { once: true });
    image.addEventListener("error", finish, { once: true });
    signal.addEventListener("abort", finish, { once: true });
    if (image.complete) decode();
  });
}

// Wait only for the first screen, with one deadline shared by all assets.
export function waitForIntroAssets(images, fonts, { timeoutMs = 8000, signal } = {}) {
  return new Promise(resolve => {
    const controller = new AbortController();
    let settled = false;
    let timer;
    const onAbort = () => finish("aborted");
    const finish = reason => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      controller.abort();
      resolve(reason);
    };

    if (signal?.aborted) {
      finish("aborted");
      return;
    }

    signal?.addEventListener("abort", onAbort, { once: true });
    timer = setTimeout(() => finish("timeout"), timeoutMs);

    const imageJobs = [...images].map(image => waitForImage(image, controller.signal));
    const fontJobs = fonts?.load
      ? HERO_FONTS.map(font => waitForFont(font, fonts, controller.signal))
      : [];

    // Failed assets release the intro too; a failed request must never lock the page.
    Promise.allSettled([...imageJobs, ...fontJobs]).then(() => finish("ready"));
  });
}
