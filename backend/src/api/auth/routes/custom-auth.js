module.exports = {
  routes: [
    {
      method: "POST",
      path: "/custom-register",
      handler: "custom-auth.register",
      config: {
        auth: false, // Доступно без аутентифікації
      },
    },
  ],
};
