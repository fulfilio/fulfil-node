(function() {
    'use strict';

    Fulfil.Model = function (name, client) {
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
    Fulfil.Model.prototype.runMethod = function (method, args, context) {
      return this._client.rpc(
        'model.' + this._name + '.' + method,
        args, context
      );
    }

    Fulfil.Model.prototype.read = function (ids, fields, context) {
      return this.runMethod('read', [ids, fields], context);
    }

    Fulfil.Model.prototype.create = function (recordObjs, context) {
      return this.runMethod('create', [recordObjs], context);
    }

    Fulfil.Model.prototype.write = function (ids, recordObj, context) {
      return this.runMethod('write', [ids, recordObj], context);
    }

    Fulfil.Model.prototype.copy = function (ids, context) {
      return this.runMethod('copy', [ids], context);
    }

    Fulfil.Model.prototype.delete = function(ids, context) {
      return this.runMethod('delete', [ids], context);
    }

    Fulfil.Model.prototype.search = function (domain, offset, limit, order, count, context) {
      domain = domain || [];
      offset = offset || 0;
      return this.runMethod('search', [domain, offset, limit, order, count], context);
    }

    Fulfil.Model.prototype.searchRead = function (domain, offset, limit, order, fields, context) {
      domain = domain || [];
      offset = offset || 0;
      return this.runMethod('search_read', [domain, offset, limit, order, fields], context);
    }

    Fulfil.Model.prototype.searchCount = function (domain, context) {
      domain = domain || [];
      return this.runMethod('search_count', [domain], context);
    }

    Fulfil.Model.prototype.confirm = function(ids) {
      return this.runMethod('confirm', [ids]);
    };

    Fulfil.Model.prototype.complete_existing_lines = function(ids) {
      return this.runMethod('complete_existing_lines', [ids]);
    };

    Fulfil.Model.prototype.adjust_inventory = function(id, location_id, quantity, type) {
      return this.runMethod('adjust_inventory', [id, location_id, quantity, type]);
    };

    Fulfil.Model.prototype.toDate = function(jsDate) {
      return {
        '__class__': 'date',
        'year': jsDate.getFullYear(),
        'month': jsDate.getMonth() + 1,
        'day': jsDate.getDate()
      };
    }
}());
