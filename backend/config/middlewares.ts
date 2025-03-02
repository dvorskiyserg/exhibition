export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false,  // спрощена політика на час розробки
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000'], // Додай свій фронтенд URL сюди
      headers: '*',
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
