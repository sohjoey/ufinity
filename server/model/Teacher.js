const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ufinity', 'user1', 'user1', { dialect: 'mysql' }); //database name "ufinity", username "user1", password "user1"

class Teacher extends Model { }
Teacher.init({
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, { sequelize, modelName: 'Teacher' });

module.exports = {
    Teacher
}
