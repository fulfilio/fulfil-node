'use strict';

var request = require('request-promise');

function Model(name, client) {
  /**
   * @private {string} _name Model name for fulfil resources
   * @private {object} _client Fulfil client object
   */
  this._name = name;
  this._client = client;
};

/**
 * @param method
 * @param args
 * @param context
 */
Model.prototype.runMethod = function (method, args, context) {
  return this._client.rpc(
    'model.' + this._name + '.' + method,
    args, context
  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (err) {
    console.log(err);
  });
}

module.exports = Model;
