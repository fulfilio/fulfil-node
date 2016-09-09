'use strict';

var request = require('request-promise');

/**
 * @param {string} subdomain Company subdomain under fulfil.io
 */
function client(subdomain) {
  if (!(this instanceof client)) {
    return new client(subdomain);
  }
  /**
   * @private {string} base_url Model name for fulfil resources
   * @private {object} session Current session object
   * @private {string} sessionId SessionId obtained after logging in
   * @private {object} _options Other optional fields
   */
  this.base_url = 'https://' + subdomain + '.fulfil.io/';
  this.session = {};
  this.sessionId = '';
  this._options = {
    dev: false
  };
}

var Model = require('./model.js');
var Fulfil = require('./fulfil.js');

/**
 * @param {string} model_name Model name of the fulfil resource
 */
client.prototype.model = function(model_name) {
  return new Model(model_name, this);
};

/**
 * @param username
 * @param password
 */
client.prototype.doLogin = function(username, password){
  return this.rpc('common.db.login',[username, password])
    .then(function (result) {
      this.sessionId = new Buffer(
        username + ':' +
        result[0] + ':' +
        result[1]
      ).toString('base64');
    }.bind(this))
    .catch(function (err) {
      console.log(err);
    });
}

client.prototype.doLogout = function(){
  return this.rpc('common.db.logout', [], null, this.sessionId)
    .then(function (response) {
      console.log(response);
    }).catch(function (err) {
      console.log(err);
    });
}

/**
 * @param method An RPC method that need to be called.
 * @param {array} params Parameters to be passed to the `method` including the
 *                       user ID and session key.
 * @param context Context for accessing fulfil resources
 */
client.prototype.rpc = function(method, params, context){
  var _params = Fulfil.transformRequest(params);
  return request.post({
    uri: this.base_url,
    transform: function(response) {
      if (response && response.hasOwnProperty('result')) {
        return Fulfil.transformResponse(response.result);
      } else if (response && response.hasOwnProperty('error')) {
        var error = response.error;
        if (error[0].startsWith('401') || error[0].startsWith('403')) {
          error['message'] = ['tryton:Unauthorized'];
        } else if (error[0] == 'UserError') {
          error['message'] = ['tryton:UserError', error[1], error[2]];
        } else if (error[0] == 'UserWarning') {
          error['message'] = ['tryton:UserWarning', error[1], error[2], error[3]];
        } else if (error[0] == 'ConcurrencyException') {
          error['message'] = ['tryton:ConcurrencyException', error[1]];
        } else {
          error['message'] = ['tryton:Exception', error];
        }
        error['__error__'] = true;
        return error;
      }
      return response;
    },
    body: {
      'method': method,
      'params': _params || [],
    },
    json: true
  })
}

module.exports = client;

module.exports.client = client;
