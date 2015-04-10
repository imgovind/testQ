var express = require('express'),
  router = express.Router(),
  Q = require('q'),
  _ = require('lodash'),
  bcrypt = require('bcrypt'),
  bcryptRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/hashPassword', function(req, res, next) {
  var values = {};
  if (req.body.password) {
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

    //Works
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

    // Optimum because less code 
    // Also can bind multiple input 
    // values in closure
    // Works
    Q
    .nfcall(bcrypt.genSalt, bcryptRounds)
    .then(function(salt){ 
      Q.nfcall(bcrypt.hash, req.body.password, salt)
      .done(function(hash){
        return res.json({ salt: salt, hash: hash});
      });
    });


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
