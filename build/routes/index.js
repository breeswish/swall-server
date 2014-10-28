(function() {
  var express, router;

  express = require('express');

  router = express.Router();

  router.get('/1', function(req, res) {
    if (req.query.page) {
      info.page = req.query.page;
    } else {
      info.page = 1;
    }
    return res.render('takeComment', info);
  });

  router.post('/:id', function(req, res) {
    var comment, infos;
    if (filtKeyWord(req.body.msg)) {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.sendStatus(200);
      } else {
        res.render('takeComment', info);
      }
      return;
    }
    console.log('pass');
    infos = {
      color: req.body.color,
      id: parseInt(req.params.id),
      time: Date.now(),
      ip: req.connection.remoteAddress,
      ua: req.headers['user-agent'] || '',
      msg: req.body.msg
    };
    comment = Comment(infos);
    comment.save(function(err, comment) {
      if (err) {
        return console.log(err);
      }
    });
    io.to(req.params.id).emit('comment', infos);
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.sendStatus(200);
    } else {
      return res.render('takeComment', info);
    }
  });

  router.get('/', function(req, res) {
    return res.redirect('/1');
  });

  router.get('/1/test', function(req, res) {
    return res.render('test');
  });

  router.get('/1/info', function(req, res) {
    return res.json({
      id: 1,
      link: 'www.swall.me/1',
      title: '软件学院迎新晚会',
      forbidden: info.keyword
    });
  });

  module.exports = router;

}).call(this);
