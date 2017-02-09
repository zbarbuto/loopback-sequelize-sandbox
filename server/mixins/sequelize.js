var Sequelize = require('sequelize');
var config = require('../datasources.json');
var app = require('../server');
var sequelize = new Sequelize(
  config.postgres.database,
  config.postgres.username,
  config.postgres.password, {
    host: config.host,
    dialect: 'postgres'
  }
);
module.exports = function Sequelize(Model) {
  Model.sequelize = sequelize;
  let propDefs = {};
  Object.keys(Model.definition.properties).forEach(function(prop) {
    let propDef = Model.definition.properties[prop];
    prop = prop.toLowerCase();
    propDefs[prop] = {};
    propDefs[prop].type = getSequelizePropForLoopbackProp(propDef.type);
    if(propDef.id) {
      propDefs[prop].primaryKey = true;
    }
  });
  modelConfig = {
    tableName: Model.definition.tableName(),
    createdAt: false,
    updatedAt: false
  };
  let SModel = sequelize.define(Model.definition.name, propDefs, modelConfig);
  app.once('booted', function() {
    Object.keys(Model.relations).forEach(function(key) {
      let relation = Model.relations[key];
      SModel[relation.type](sequelize.models[relation.modelTo.modelName], {
        foreignKey: relation.keyTo.toLowerCase(),
        constraints: false
      });
    });
  });
}

function getSequelizePropForLoopbackProp(propType) {
  switch (propType) {
    case 'number':
      return Sequelize.INTEGER
    default:
      return Sequelize.STRING
  }
}