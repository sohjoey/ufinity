const Teacher = require('./Teacher.js').Teacher
const Student = require('./Student.js').Student
const { Sequelize, Model} = require('sequelize');

const sequelize = new Sequelize('ufinity', 'user1', 'user1', { dialect: 'mysql' }); //database name "ufinity", username "user1", password "user1"

class TeacherStudent extends Model {    
    static async retrievefornotifications(teacher, students) {
        var result = await Student.findAll({
            where: {
                isSuspended: false
            },
            include: [{
                model: Teacher,
                through: {
                    attributes: ['StudentEmail'],
                    where: {
                        [Sequelize.Op.or]: [
                            { TeacherEmail: teacher },
                            {
                                StudentEmail: {
                                    [Sequelize.Op.in]: students
                                }
                            }
                        ]
                    }
                },
                required: true
            }]
        })

        var arr = []
        result.forEach(r => {
            var email = r.dataValues.email
            if (!arr.includes(email)) {
                arr.push(email)
            }
        })
        return arr
    }

    static async register(teacher, students) {        
        var arr = []
        arr.push(Teacher.upsert({ email: teacher }))
        students.forEach(async s => {
            arr.push(Student.upsert({ email: s }))
        })        
        await Promise.all(arr)

        arr = []        
        students.forEach(async s => {                
            arr.push(TeacherStudent.upsert({ TeacherEmail: teacher, StudentEmail: s }))
        })
        
        await Promise.all(arr)
    }
    static async commonStudents(teachers) {
        for (var i = 0; i < teachers.length; i++) {
            for (var j = teachers.length - 1; j > i; j--) {
                if (teachers[j].toUpperCase() === teachers[i].toUpperCase()) {
                    teachers.splice(j,1)
                }
            }
        }        

        var result = await TeacherStudent.findAll({
            attributes: ['StudentEmail', [Sequelize.fn('COUNT', sequelize.col('StudentEmail')), 'count']],
            where: {
                TeacherEmail: {
                    [Sequelize.Op.in]: teachers
                }
            },
            group: 'StudentEmail',
            having: {
                count: {
                    [Sequelize.Op.eq]: teachers.length
                }
            }
        })

        var arr = []        
        result.forEach(r => {                        
            var StudentEmail = r.dataValues.StudentEmail
            if (!arr.includes(StudentEmail)) {
                arr.push(StudentEmail)
            }            
        })
        return arr
    }
}

TeacherStudent.init({
}, { sequelize, modelName: 'TeacherStudent' });


Student.belongsToMany(Teacher, { through: TeacherStudent });
Teacher.belongsToMany(Student, { through: TeacherStudent });

module.exports = {
    TeacherStudent
}

