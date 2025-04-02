export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false,  // спрощена політика на час розробки
    },
  },
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: "*", // Дозволити запити з будь-якого джерела (можна вказати конкретні домени)
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Дозволені методи
      credentials: true,
      headers: ['Content-Type', 'Authorization'], // додати явно!
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];