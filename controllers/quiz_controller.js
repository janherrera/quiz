var models = require('../models/models.js');

// Get /quizes/:id/edit
exports.edit = function(req, res) {
    var quiz = req.quiz;    // autoload de instancia de quiz

    res.render('quizes/edit', {quiz: quiz, errors: []});
};

// Put /quizes/:id
exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;

    req.quiz
    .validate();
    .then(
        function(err){
            if (err) {
                res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
            } else {
                req.quiz      // save in DDBB
                .save( {fields: ["pregunta", "respuesta"]})
                .then( function(){ res.redirect('/quizes')});
            }
        }
    )
};

// Get /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build(
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );

    res.render('quizes/new', {quiz: quiz, errors: []});
};

// Post /quizes/create
exports.create = function(req, res) {
    var quiz = models.Quiz.build( req.body.quiz );

    quiz
    .validate()
    .then(
        function(err){
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz
                .save({fields: ["pregunta", "respuesta"]})
                .then(function(){ res.redirect('/quizes') })
            }
        }
    );
};


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
        res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error) {next(error);});
};

// Get /quizes/:id
exports.show = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
      res.render('quizes/show', {quiz: req.quiz, errors: []});
  })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: []});
    } else {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
    }
  })
};
