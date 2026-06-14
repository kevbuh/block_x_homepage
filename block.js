// Blocks ONLY https://x.com/home (and its trailing-slash form).
// x.com is a single-page app, so we watch both the initial load and every
// client-side navigation.

function isHome() {
  // Match exactly /home — not /home/foo, /homepage, etc.
  const path = location.pathname.replace(/\/+$/, ""); // strip trailing slash(es)
  return location.hostname === "x.com" && path === "/home";
}

function renderBlock() {
  // Stop the page from doing anything else.
  try {
    window.stop();
  } catch (e) {}

  const html =
    '<meta charset="utf-8">' +
    '<style>' +
    'html,body{margin:0;height:100%;background:#000;color:#e7e9ea;' +
    'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}' +
    '.wrap{display:flex;align-items:center;justify-content:center;' +
    'height:100%;font-size:12px;}' +
    '</style>' +
    '<div class="wrap">403: x.com/home not allowed</div>';

  document.documentElement.innerHTML = "<head></head><body></body>";
  document.title = "403";
  document.body.innerHTML = html;
}

function check() {
  if (isHome()) {
    renderBlock();
  }
}

// Initial load.
check();

// SPA navigation: patch history methods and listen for popstate.
const fire = () => check();

const origPush = history.pushState;
history.pushState = function () {
  const r = origPush.apply(this, arguments);
  fire();
  return r;
};

const origReplace = history.replaceState;
history.replaceState = function () {
  const r = origReplace.apply(this, arguments);
  fire();
  return r;
};

window.addEventListener("popstate", fire);

// Fallback: catch any URL change the above might miss.
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    check();
  }
}, 300);
