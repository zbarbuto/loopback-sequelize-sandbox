'use strict';

module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();
  return server.dataSources.postgres.automigrate()
  .then(function() {
    return server.models.customer.create({
      name: 'john'
    });
  })
  .then(function(customer) {
    return Promise.all([
      customer.purchases.create({ item: 'Item a', amount: 100 }),
      customer.purchases.create({ item: 'Item a', amount: 100 }),
      customer.purchases.create({ item: 'Item b', amount: 50 })
    ])
  });
};
