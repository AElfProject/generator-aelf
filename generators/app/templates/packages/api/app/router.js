/**
 * @file router
 */

module.exports = app => {
  const {
    router,
    controller
  } = app;

  router.get('/api/<%= name %>/initCsrfToken', controller.initCsrfToken.initToken);
};
