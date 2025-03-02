export default (plugin) => {
  const originalLogin = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    console.log("=== Custom callback is working ===");
    await originalLogin(ctx);

    if (ctx.response && ctx.response.body && ctx.response.body.user) {
      const user = ctx.response.body.user;
      console.log("User after login:", user);

      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
          populate: ["role"],
        }
      );

      console.log("Full user with role:", fullUser);
      ctx.response.body.user = fullUser;
    }
  };

  return plugin;
};
