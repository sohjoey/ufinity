import Axios from 'Axios'
import React from 'react'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            registerTeacherEmail: '',
            registerStudentEmails: '',
            commonStudentsTeacherEmail: '',            
            suspendStudentEmail: '',
            retrieveForNotificationsTeacherEmail: '',
            retrieveForNotificationsMessage: '',  
            retrieveForNotificationsMessageRecipients: [],

            registerResult: '',
            commonResult: '',
            suspendResult: '',            
        }

        this.updateRegisterTeacherEmail = this.updateRegisterTeacherEmail.bind(this)
        this.updateRegisterStudentEmails = this.updateRegisterStudentEmails.bind(this)
        this.updateCommonStudentsTeacherEmail = this.updateCommonStudentsTeacherEmail.bind(this)
        this.updateSuspendStudentEmail = this.updateSuspendStudentEmail.bind(this)
        this.updateRetrieveForNotificationsTeacherEmail = this.updateRetrieveForNotificationsTeacherEmail.bind(this)
        this.updateRetrieveForNotificationsMessage = this.updateRetrieveForNotificationsMessage.bind(this)

        this.register = this.register.bind(this)
        this.commonStudents = this.commonStudents.bind(this)
        this.suspendStudent = this.suspendStudent.bind(this)
        this.retrieveForNotifications = this.retrieveForNotifications.bind(this)
    }

    updateRegisterTeacherEmail(e) {        
        this.state.registerTeacherEmail = e.target.value;
        this.setState({registerTeacherEmail: this.state.registerTeacherEmail})
    }

    updateRegisterStudentEmails(e) {        
        this.state.registerStudentEmails = e.target.value;
        this.setState({ registerStudentEmails: this.state.registerStudentEmails })
    }

    updateCommonStudentsTeacherEmail(e) {
        this.state.commonStudentsTeacherEmail = e.target.value;
        this.setState({ commonStudentsTeacherEmail: this.state.commonStudentsTeacherEmail })
    }

    updateSuspendStudentEmail(e) {
        this.state.suspendStudentEmail = e.target.value;
        this.setState({ suspendStudentEmail: this.state.suspendStudentEmail })
    }

    updateRetrieveForNotificationsTeacherEmail(e) {
        this.state.retrieveForNotificationsTeacherEmail = e.target.value;
        this.setState({ retrieveForNotificationsTeacherEmail: this.state.retrieveForNotificationsTeacherEmail })
    }

    updateRetrieveForNotificationsMessage(e) {
        this.state.retrieveForNotificationsMessage = e.target.value;        
        this.setState({ retrieveForNotificationsMessage: this.state.retrieveForNotificationsMessage})
    }

    componentDidMount() {
    }

    async register() {
        var teacher = this.state.registerTeacherEmail;
        var students = this.state.registerStudentEmails.replace(/[\s*\,]+/gi, ' ').split(' ')

        var result = await Axios.post('http://127.0.0.1:3000/register', {
            teacher,
            students
        })
        console.log(result)
        this.state.registerResult = `Status code: ${result.status}`
        this.setState({
            registerResult: this.state.registerResult
        })  
    }

    async commonStudents() {
        var teachers = this.state.commonStudentsTeacherEmail.replace(/[\s*\,]+/gi, ' ').split(' ')
        console.log(`teachers`, teachers)
        var result = await Axios.get('http://127.0.0.1:3000/commonstudents', {
            params: {
                teachers
            }
        })
        
        console.log(result)
        var str = ''

        if (!result.data.students.length) {
            str = 'None'
        } else {
            result.data.students.forEach(s => {
                if (str.length) {
                    str += ','
                }
                str += s
            })
        }

        this.state.commonResult = `Students: ${str}`

        this.setState({
            commonResult: this.state.commonResult
        })
    }

     async suspendStudent() {
        var student = this.state.suspendStudentEmail
        var result = await Axios.post('http://127.0.0.1:3000/suspendStudent', {
            student
        })
        console.log(result)
        this.state.suspendResult = `Status code: ${result.status}`
        this.setState({
            suspendResult: this.state.suspendResult
        })
        
    }

     async retrieveForNotifications() {
        var teacher = this.state.retrieveForNotificationsTeacherEmail
        var notification = this.state.retrieveForNotificationsMessage
        
        if (notification) {
            var result = await Axios.post('http://127.0.0.1:3000/retrievefornotifications', {
                teacher, notification
            })

            var recipients = result.data.recipients
            var strRecipients = ''
            if (recipients) {
                result.data.recipients.forEach(e => {
                    if (strRecipients.length) {
                        strRecipients += ', '
                    }
                    strRecipients += e
                })
            }
            this.state.retrieveForNotificationsMessageRecipients = strRecipients
            this.setState({
                retrieveForNotificationsMessageRecipients: this.state.retrieveForNotificationsMessageRecipients
            })            
        }
    }

    render() {
        return (<div>
            <form>
                Register Teacher and one or more students:<br/>
                <label>
                    Teacher Email:
                    <input type="text" name="registerTeacherEmail" onChange={this.updateRegisterTeacherEmail} value={this.state.registerTeacherEmail} />
                    <br/>
                    Student(s) Email:
                    <input type="text" name="registerStudentEmails" onChange={this.updateRegisterStudentEmails} value={this.state.registerStudentEmails} />
                    <br />
                </label>                
                <input type="button" value="Register" onClick={this.register} />
                <br/>
                {this.state.registerResult}

                <br /><br /><br />

                Students with Common Teachers:
                <br />                
                Teacher Email(s): <input type="text" name="commonStudentsTeacherEmail" onChange={this.updateCommonStudentsTeacherEmail} value={this.state.commonStudentsTeacherEmail} />
                <br />                
                <input type="button" value="Common Teachers" onClick={this.commonStudents} />
                <br />
                {this.state.commonResult}
                <br />
                <br/>
                Suspend Student:
                <br />
                Student Email: <input type="text" name="suspendStudentEmail" onChange={this.updateSuspendStudentEmail} value={this.state.suspendStudentEmail} />
                <br />                
                <input type="button" value="Suspend" onClick={this.suspendStudent} />
                <br />
                {this.state.suspendResult}
                <br />
                <br />                
                Send a notification:                                
                <br />                
                Teacher Email: <input type="text" name="retrieveForNotificationsTeacherEmail" onChange={this.updateRetrieveForNotificationsTeacherEmail} value={this.state.retrieveForNotificationsTeacherEmail} />
                <br/>
                Student Email: <input type="text" name="suspendStudentEmail" onChange={this.updateRetrieveForNotificationsMessage} value={this.state.retrieveForNotificationsMessage} />
                <br/>
                <input type="button" value="Send a Notification" onClick={this.retrieveForNotifications} />
                <br />
                {this.state.retrieveForNotificationsMessageRecipients }
            </form>
        </div>)
    }
}

export default App