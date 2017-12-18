module.exports = function MongoError(message, options) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.options = options;
};

require('util').inherits(module.exports, Error);
