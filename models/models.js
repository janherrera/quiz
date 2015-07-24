var path = require('path');

// Obtención parámetros DDBB
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name     = (url[6]||null);
var user        = (url[2]||null);
var pwd         = (url[3]||null);
var protocol    = (url[1]||null);
var dialect     = (url[1]||null);
var port        = (url[5]||null);
var host        = (url[4]||null);
var storage     = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD sqlite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd,
                       {dialect: protocol,
                        protocol: protocol,
                        port: port,
                        host: host,
                        storage: storage,   // solo SQlite
                        omitNull: true      // solo Postgress
                        }
                    );

// Importar definión Tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definión Tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportamos Tablas a Objetos
exports.Quiz = Quiz;
exports.Comment = Comment;

// Crear e Inicializar Tabla Preguntas
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador tras creación Tabla
  Quiz.count().then(function (count){
      if(count === 0) {
        Quiz.create({ pregunta: 'Capital de Lienchestein',
                      respuesta: 'Vaduz',
                      tema: 'humanidades'});
        Quiz.create({ pregunta: 'Capital de Moldavia',
                      respuesta: 'Chisinau',
                      tema: 'humanidades'});
        Quiz.create({ pregunta: 'Capital de Kosovo',
                      respuesta: 'Pristina',
                      tema: 'humanidades'})
        .then(function(){console.log('Base de Datos Init OK')});
      };
  });
});
