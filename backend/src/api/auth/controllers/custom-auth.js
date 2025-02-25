"use strict";

const utils = require("@strapi/utils");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

module.exports = {
  async register(ctx) {
    try {
      // Отримуємо дані з запиту
      const { email, password, username } = ctx.request.body;

      if (!email || !password || !username) {
        return ctx.badRequest("Будь ласка, заповніть всі обов'язкові поля.");
      }

      // Отримуємо роль `authenticated`
      const authenticatedRole = await strapi.db
        .query("plugin::users-permissions.role")
        .findOne({
          where: { type: "authenticated" },
        });

      if (!authenticatedRole) {
        return ctx.badRequest("Роль 'authenticated' не знайдена.");
      }

      // Створюємо нового користувача
      const newUser = await getService("user").add({
        email,
        password,
        username,
        role: authenticatedRole.id, // Встановлюємо роль
        confirmed: true, // Автоматично підтверджуємо реєстрацію
      });

      // Повертаємо відповідь
      return ctx.send({
        message: "Користувач успішно зареєстрований!",
        user: newUser,
      });
    } catch (error) {
      console.error("❌ Помилка реєстрації:", error);
      return ctx.internalServerError("Помилка сервера.");
    }
  },
};
