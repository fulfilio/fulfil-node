'use strict';

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
  this.session.context = {};
  this.session.sessionId = '';
  this._options = {
    dev: false
  };
}

/**
 * @param {string} model_name Model name of the fulfil resource
 */
client.prototype.model = function(model_name) {
  return new Model(model_name, this);
};

client.prototype.getContext = function(){
  return this.session.context;
}

/**
 * @param {object} _context Context for accessing fulfil resources
 */
client.prototype.setContext = function(_context){
  this.session.context = _context;
}

/**
 * @param username
 * @param password
 */
client.prototype.doLogin = function(username, password){
  return this.rpc('common.db.login',[username, password])
    .done(function (result) {
      if (_.isArray(result)){
        var sessionId = btoa(username + ':' + result[0] + ':' + result[1]);
        this.session.userId = result[0] || null;
        this.session.login = username || null;
        this.session.sessionId = sessionId || null;
      }
    }.bind(this))
    .fail(function (err) {
      console.log(err);
    });
}

client.prototype.doLogout = function(){
  return this.rpc('common.db.logout', [])
    .done(function (response) {
      console.log(response);
    }).fail(function (err) {
      console.log(err);
    });
}

client.prototype.getPreferences = function(){
  return this.rpc('model.res.user.get_preferences', [true])
    .done(function (response) {
      this.setContext(response);
    }.bind(this))
    .fail(function (err) {
      console.log(err);
    });
}

client.prototype.transformResponse = function(response) {
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
    return error['message'];
  }
  return response;
}

/**
 * @param {string} method An RPC method that need to be called.
 * @param {array} params Parameters to be passed to the `method` including the
 *                       user ID and session key.
 * @param {string} context Context for accessing fulfil resources
 */
client.prototype.rpc = function(method, params, context){
  var defer = new jQuery.Deferred();

  if ( _.isObject(context) ) {
    this.setContext(_.extend(this.getContext(),context));
  }
  if( !method.endsWith("login") && !method.endsWith("logout") ) {
    params.push(this.getContext());
  }
  var _params = Fulfil.transformRequest(params);
  $.ajax({
    url: this.base_url,
    type: "POST",
    headers: {
      'Authorization': 'Session ' + this.session.sessionId,
      'content-type': "application/json;charset=UTF-8"
    },
    data: JSON.stringify({
      'method': method,
      'params': _params || []
    })
  })
  .done(function (result) {
    defer.resolve(this.transformResponse(result));
  }.bind(this))
  .fail(function (reason) {
    defer.reject(reason);
  }.bind(this));

  return defer.promise();
}
