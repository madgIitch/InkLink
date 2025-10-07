// lib/sw-register.ts
export function registerSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const swUrl = "/service-worker.js";

  const doRegister = () => {
    navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .then((registration) => {
        console.log("[PWA] SW registrado en:", registration.scope);
        registration.addEventListener("updatefound", () => {
          const nw = registration.installing;
          nw?.addEventListener("statechange", () => {
            if (nw.state === "installed") {
              console.log(
                navigator.serviceWorker.controller
                  ? "[PWA] Nueva versión instalada."
                  : "[PWA] SW instalado por primera vez.",
              );
            }
          });
        });
      })
      .catch((err) => console.error("[PWA] Error registrando SW:", err));
  };

  // En dev, el 'load' puede haber ocurrido antes de montar el componente
  if (document.readyState === "complete") {
    doRegister();
  } else {
    window.addEventListener("load", doRegister, { once: true });
  }
}
