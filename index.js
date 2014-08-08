exports.catchError = function(error, callback) {
  return function(err) {
    if (err instanceof error) {
      return callback.call(this, err);
    }
    throw err;
  };
};


/**
 ```js
 var lick = require('lick');
 
 Promise.resolve('value')
 .then(lick.return('some other value'))
 .then(function(value) {
   console.log(value);
 });
 ```

 @method return
 @param {Error} value
 @return {Function} promise callback
*/
exports.tap = function(callback) {
  return function(value) {
    callback.call(this, value);
    return value;
  };
};

/**
 ```js
 var lick = require('lick');
 
 Promise.resolve('value')
 .then(lick.return('some other value'))
 .then(function(value) {
   console.log(value);
 });
 ```

 @method return
 @param {Error} value
 @return {Function} promise callback
*/
exports.return = function(value) {
  return function() {
    return value;
  };
};

/**
 ```js
 var lick = require('lick');
 
 Promise.resolve('value')
 .then(lick.throw(new Error('reason')))
 .catch(function(error) {
   console.log(error);
 });
 ```

 @method throw
 @param {Error} reason
 @return {Function} promise callback
*/
exports.throw = function(reason) {
  return function() {
    throw reason;
  };
};

/**
 ```js
 var lick = require('lick');
 lick.hash({
   tweets: twitterService.getTweets(),
   cmsContent: cmsService.getContent(),
   instagrams: instaGramService.getPhotos()
 }).then(function(context) {
   var renderedTemplateString = templateService.render(context);
   return renderedTemplateString;
 });
 ```

 @method hash
 @param {Object} promises
 @return {Promise} promise that is fulfilled when all properties of `promises`
 have been fulfilled, or rejected if any of them become rejected.
*/
exports.hash = function(object) {
  return new Promise(function(resolve, reject){
    var results = {};
    var keys = Object.keys(object);
    var remaining = keys.length;
    var entry, property;

    if (remaining === 0) {
      resolve(results);
      return;
    }

    function fulfilledTo(property) {
      return function(value) {
        results[property] = value;
        if (--remaining === 0) {
          resolve(results);
        }
      };
    }

    function onRejection(reason) {
      remaining = 0;
      reject(reason);
    }

    for (var i = 0; i < keys.length; i++) {
      property = keys[i];
      entry = object[property];

      Promise.resolve(entry).then(fulfilledTo(property), onRejection);
    }
  });
};
