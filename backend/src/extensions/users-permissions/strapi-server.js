export default (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    await originalCallback(ctx);

    if (ctx.response?.body?.user) {
      const user = ctx.response.body.user;

      // Лог для перевірки
      console.log("Користувач після стандартного логіну:", user);

      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
          populate: ["role"], // Тут ми тягнемо зв'язану роль
        }
      );

      console.log("Користувач з повною інформацією (з роллю):", fullUser);
      ctx.response.body.user = fullUser;
    }
  };

  return plugin;
};
