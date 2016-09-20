'use strict';

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
 */
Model.prototype.runMethod = function (method, args, context) {
  return this._client.rpc(
    'model.' + this._name + '.' + method,
    args, context
  )
  .done(function (response) {
    console.log(response);
  })
  .fail(function (err) {
    console.log(err);
  });
}

Model.prototype.read = function (ids, fields, context) {
  return this.runMethod('read', [ids, fields], context);
}

Model.prototype.create = function (recordObjs, context) {
  return this.runMethod('create', [recordObjs], context);
}

Model.prototype.write = function (ids, recordObj, context) {
  return this.runMethod('write', [ids, recordObj], context);
}

Model.prototype.copy = function (ids, context) {
  return this.runMethod('copy', [ids], context);
}

Model.prototype.delete = function(ids, context) {
  return this.runMethod('delete', [ids], context);
}

Model.prototype.search = function (domain, offset, limit, order, count, context) {
  domain = domain || [];
  offset = offset || 0;
  return this.runMethod('search', [domain, offset, limit, order, count], context);
}

Model.prototype.searchRead = function (domain, offset, limit, order, fields, context) {
  domain = domain || [];
  offset = offset || 0;
  return this.runMethod('search_read', [domain, offset, limit, order, fields], context);
}

Model.prototype.searchCount = function (domain, context) {
  domain = domain || [];
  return this.runMethod('search_count', [domain], context);
}
