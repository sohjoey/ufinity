const { Sequelize} = require('sequelize');
const sequelize = new Sequelize('ufinity', 'user1', 'user1', { dialect: 'mysql' }); //database name "ufinity", username "user1", password "user1"
const Teacher = require('./model/Teacher.js').Teacher
const Student = require('./model/Student.js').Student
const TeacherStudent = require('./model/TeacherStudent.js').TeacherStudent



const express = require('express')
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

app.post('/register', async function (req, res) {
    var teacher = req.body.teacher
    var students = req.body.students
    
    await TeacherStudent.register(teacher,students)
    res.sendStatus(204)
})

app.get('/commonstudents', async function (req, res) {
    var commonstudents = req.query.teachers
    var result = await TeacherStudent.commonStudents(commonstudents)
    res.status(200).send({students:result})    
})

app.post('/suspendStudent', async function (req, res) {
    var student = req.body.student
    var result = await Student.suspend(student)
    console.log(result)
    res.sendStatus(204)
})

app.post('/retrievefornotifications', async function (req, res) {
    var teacher = req.body.teacher    
    var notification = req.body.notification
    var regex = /(?<=^|\s)@.[\@\w\.]+/gi
    var students = notification.match(regex)    
    var arrRecipients = await TeacherStudent.retrievefornotifications(teacher, students)    
    res.status(200).send({ recipients: arrRecipients })
})

async function dropTables() {
    await sequelize.getQueryInterface().dropAllTables()    
}

async function init() {
    await dropTables()
    await Student.sequelize.sync()
    await Teacher.sequelize.sync()
    await TeacherStudent.sequelize.sync() 
}

init()


app.listen(3000)