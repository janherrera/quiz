var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD sqlite
var sequelize = new Sequelize(null, null, null,
                      {dialect: "sqlite", storage: "quiz.sqlite"}
                    );

// Importar definión Tablas
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// Crear e Inicializar Tabla Preguntas
sequelize.sync().success(function() {
  // success() ejecuta el manejador tras creación Tabla
  Quiz.count().success(function (count){
      if(count === 0) {
        Quiz.create({ pregunta: 'Capital de Lienchestein',
                      respuesta: 'Vaduz'})
        .success(function(){console.log('Base de Datos Init OK')});
      };
  });
});
