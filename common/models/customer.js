'use strict';

module.exports = function(Customer) {
  Customer.remoteMethod('getCusts', {
    http: {
      verb: 'get',
      path: '/getCusts'
    },
    accepts: {
      arg: 'amount',
      type: 'string',
      http: {
        source: 'query'
      }
    },
    returns: {
      arg: 'customers',
      root: true,
      type: ['customer']
    }
  })

  Customer.getCusts = function(amount) {
    return Customer.sequelize.models.customer.findAll({
      include: [{
        model: Customer.sequelize.models.purchase,
        where: {
          amount: amount
        }
      }]
    })
    .then(function(res) {
      return res.map(res => res.dataValues);
    });
  }
};
