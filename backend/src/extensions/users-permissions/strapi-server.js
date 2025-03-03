export default (plugin) => {
  console.log("=== Custom users-permissions extension loaded ===");

  const originalLogin = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    console.log("=== CALLBACK TRIGGERED ===");

    await originalLogin(ctx);

    if (ctx.response && ctx.response.body && ctx.response.body.user) {
      const user = ctx.response.body.user;

      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
          populate: ["role"],
        }
      );

      console.log("Full user з роллю:", fullUser);

      ctx.response.body.user = fullUser;
    }
  };

  return plugin;
};
