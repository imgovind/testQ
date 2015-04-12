var express = require('express'),
  router = express.Router(),
  Q = require('q'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  bcrypt = require('bcrypt'),
  bcryptRounds = 11;

// Promisification of a Promise Unaware API
// Better than Q in my opinion, Saves time for backend code
// Q is better for front end code still
Promise.promisifyAll(bcrypt);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/hashPassword', function(req, res, next) {
  var values = {};
  if (req.body.password) {

    // Promise Chaining
    // Drawbacks are that salt could not be passed 
    // to the chained method in the native way
    // bcrypt
    // .genSaltAsync(bcryptRounds)
    // .then(function(salt) {
    //   return bcrypt.hashAsync(req.body.password, salt);
    // })
    // .then(function(hash) {
    //   res.json({
    //     hash: hash
    //   });
    // })
    // .catch(function(err){
    //   res.status(500).send({ error: err.message });
    // });

    // Promise Chaining - 2 Behind Door
    // This will allow the access to previously chained promises outputs
    // bcrypt.genSaltAsync(bcryptRounds)
    // .then(function(salt){
    //   return [salt, bcrypt.hashAsync(req.body.password, salt)];
    // })
    // .spread(function(salt, hash){
    //   res.json({ salt: salt, hash: hash });
    // })
    // .catch(function(err){
    //   res.status(500).send({ error: err.message });
    // });

    // Promise Chaining - 3 Using Bluebird Bind
    // Use a particular scope for the chained promises
    bcrypt
    .genSaltAsync(bcryptRounds)
    .bind({})
    .then(function(salt){
      this.salt = salt;
      return bcrypt.hashAsync(req.body.password, salts);
    })
    .then(function(hash){
      this.hash = hash;
    })
    .then(function(){
      res.json({ salt: this.salt, hash: this.hash });
    })
    .catch(function(err){
      res.status(500).send({ error: err.message });
    });

    // Promise Nesting
    // Drawbacks: Can look like Pyramid of Doom after sometime
    // bcrypt.genSaltAsync(bcryptRounds).then(function(salt){
    //   bcrypt.hashAsync(req.body.password, salt).then(function(hash){
    //     res.json({ salt: salt, hash: hash });
    //   });
    // })
    // .catch(function(err){
    //   res.status(500).send({ error: err.message });
    // });

    // Optimum because less code 
    // Also can bind multiple input 
    // values in closure
    // Works
    // Q
    // .nfcall(bcrypt.genSalt, bcryptRounds)
    // .then(function(salt){ 
    //   Q.nfcall(bcrypt.hash, req.body.password, salt)
    //   .done(function(hash){
    //     return res.json({ salt: salt, hash: hash});
    //   });
    // });

    // Works - Kinda Bad because you create the promise all the way
    // Q
    // .fcall(function(bcryptRounds){
    //   var deferred = Q.defer();
    //   bcrypt.genSalt(bcryptRounds, function(err, salt){
    //     if(err) deferred.reject(err);
    //     else deferred.resolve(salt);
    //   });
    //   return deferred.promise;
    // })
    // .then(function(salt){
    //   values.passwordSalt = salt;
    //   return salt;
    // })
    // .then(function(salt){
    //   var deferred = Q.defer();
    //   bcrypt.hash(req.body.password, salt, function(err, hash){
    //     if(err) deferred.reject(err);
    //     else deferred.resolve(hash);
    //   });
    //   return deferred.promise;
    // })
    // .then(function(hash){
    //   values.passwordHash = hash;
    //   res.json(values);
    // })
    // .catch(function(err){
    //   res.send(err);
    // });

    // Does not Work
    // Q.fcall(bcrypt.genSalt(10, function(err, salt) {
    //     values.passwordSalt = salt;
    //     return salt;
    //   }))
    //   .then(bcrypt.hash(req.body.password, salt, function(err, hash) {
    //     values.passwordHash = hash;
    //     return hash;
    //   }))
    //   .catch(function(err) {
    //     res.send(err);
    //   });

    // Does not Work
    // var getPasswordSalt = Q.nfcall(bcrypt.genSalt(10));
    // var getPasswordHash = Q.nfcall(bcrypt.hash(req.body.password, values.passwordSalt));
    // getPasswordSalt.done(function(salt){
    //   values.passwordSalt = salt;
    // });
    // getPasswordHash
    // .done(function(hash){
    //   values.passwordHash = hash;
    //   res.json(values);
    // });

    // Does not Work
    // Q
    // .fcall(Q.nfcall(bcrypt.genSalt(bcryptRounds)))
    // .then(function(salt){
    //   values.passwordSalt = salt;
    //   return salt;
    // })
    // .then(Q.nfcall(bcrypt.hash(req.body.password, salt)))
    // .then(function(hash){
    //   values.passwordHash = hash;
    //   res.json(values);
    // })
    // .catch(function(err){
    //   res.send(err);
    // });

    // Does not Work
    // Q
    // .fcall(bcrypt.genSalt(10))
    // .then(function(salt){
    //   values.passwordSalt = salt;
    //   return salt;
    // })
    // .then(bcrypt.hash(req.body.password, salt))
    // .then(function(hash){
    //   values.passwordHash = hash;
    //   return hash;
    // })
    // .then(function(){
    //   res.json(values);
    // })
    // .catch(function(err){
    //   res.send(err);
    // });
  } else {
    res.send("No Password Sent");
  }
});

module.exports = router;
