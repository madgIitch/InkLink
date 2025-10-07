/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Si usas imágenes desde otros dominios, configúralos en images.domains
  async headers() {
    return [
      {
        source: "/service-worker.js",
        headers: [
          // Permitir controlar toda la app si decides cambiar el scope
          { key: "Service-Worker-Allowed", value: "/" },
          // Asegurar el tipo correcto
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // Recomendado para seguridad básica (ajusta según necesidades)
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=*, microphone=(), camera=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
