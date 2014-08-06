exports.catchError = function(error, callback) {
  return function(err) {
    if (err instanceof error) {
      return callback.call(this, err);
    }
    throw err;
  };
};
