export default {
  routes: [
    {
      method: 'PUT',
      path: '/slider-items/documentId/:documentId',
      handler: 'slider-item.updateByDocumentId',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
