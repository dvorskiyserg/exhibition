export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
