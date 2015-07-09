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

// Importar definión Tablas
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// Crear e Inicializar Tabla Preguntas
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador tras creación Tabla
  Quiz.count().then(function (count){
      if(count === 0) {
        Quiz.create({ pregunta: 'Capital de Lienchestein',
                      respuesta: 'Vaduz'});
        Quiz.create({ pregunta: 'Capital de Moldavia',
                      respuesta: 'Chisinau'});
        Quiz.create({ pregunta: 'Capital de Kosovo',
                      respuesta: 'Pristina'})
        .then(function(){console.log('Base de Datos Init OK')});
      };
  });
});
