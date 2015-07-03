// Definición del Modelo

module.exports = function(sequellize, DataTypes) {
  return sequelize.define('Quiz',
            { pregunta:   DataTypes.STRING,
              respuesta:  DataTypes.STRING,
            });
}
