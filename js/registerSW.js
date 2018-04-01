/**
 * Register sw.
 */

if (navigator.serviceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((registration) => {
        console.log('SW registration successful at scope', registration.scope);
        let sw;
        if (registration.installing) {
          sw = registration.installing;
          console.log('SW installing!');
        } else if (registration.waiting) {
          sw = registration.waiting;
          console.log('SW installed and waiting!');
        } else if (registration.active) {
          sw = registration.active;
          console.log('SW active!');
        }

        if (sw) {
          console.log(sw.state);
          sw.addEventListener('statechange', (e) => {
            console.log(e.target.state);
          });
        }
      }).catch(() => {
        console.log('SW Registration failed!');
      });
  });
}
