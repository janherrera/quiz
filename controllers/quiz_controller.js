var models = require('../models/models.js');

// Autoload para pillar el código en caso de :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
  }).catch(function(error) {next(error);});
};

// Get /quizes with search option
exports.index = function(req, res) {
    var busca = '%';
    if (req.query.search != undefined) {
        busca = '%' + req.query.search + '%';
        busca = busca.trim().replace(/\s/g,"%");
    }

    models.Quiz.findAll({where: ["pregunta like ?", busca], order: 'pregunta ASC'}).then(function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes});
    }).catch(function(error) {next(error);});
};

// Get /quizes/:id
exports.show = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
      res.render('quizes/show', {quiz: req.quiz});
  })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
    }
  })
};
