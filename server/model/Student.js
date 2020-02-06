const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ufinity', 'user1', 'user1', { dialect: 'mysql' }); //database name "ufinity", username "user1", password "user1"

class Student extends Model {
    static async suspend(student) {
        await Student.update(
            {
                isSuspended: true
            },
            {
                where: {
                    email: student
                }
            }            
        )
    }
}
Student.init({
    isSuspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, { sequelize, modelName: 'Student' });

module.exports = {
    Student
}