/* Fetch + compile JSX with Babel (more reliable than external text/babel src tags). */
function loadJsx(src) {
  return fetch(src)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(function (code) {
      var out = Babel.transform(code, { presets: ['react'] }).code;
      var el = document.createElement('script');
      el.text = out;
      document.body.appendChild(el);
    })
    .catch(function (err) {
      console.error('Failed to load ' + src, err);
      var root = document.getElementById('root');
      if (root) {
        root.innerHTML =
          '<div style="padding:2rem;font-family:system-ui,sans-serif;max-width:32rem">' +
          '<p><strong>Page failed to load.</strong></p>' +
          '<p>Start a local server from the project folder, then open this site over HTTP:</p>' +
          '<pre style="background:#f4f4f4;padding:0.75rem;border-radius:6px">python3 -m http.server 8080</pre>' +
          '</div>';
      }
    });
}
