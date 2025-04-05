import { factories } from '@strapi/strapi';

const updateByDocumentId = async (ctx) => {
  const { documentId } = ctx.params;

  // Знаходимо запис за documentId
  const items = await strapi.entityService.findMany('api::slider-item.slider-item', {
    filters: { documentId } as any, // обхід типів для TypeScript
  });

  if (!items || items.length === 0) {
    return ctx.notFound('Слайд з таким documentId не знайдено');
  }

  const entityId = items[0].id;

  // Оновлюємо запис за ID
  const updated = await strapi.entityService.update('api::slider-item.slider-item', entityId, {
    data: ctx.request.body.data,
  });

  return { data: updated };
};

export default factories.createCoreController('api::slider-item.slider-item', ({ strapi }) => ({
  updateByDocumentId,
}));
