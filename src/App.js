import React from 'react';
import { Jumbotron, Form, Button, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DatePicker from "react-datepicker";
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import "react-datepicker/dist/react-datepicker.css";
import {db} from './firebase.js';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import emailjs from 'emailjs-com';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

let FinalSessionList = []
let AllSessionChosen = []
let SessionShortList = []
let DelTimes = []
let SubjectListAll = []
let Tutor = ""
let Index = []

let edit = "/pass=1020"
class App extends React.Component{
  render(){
    return(
      <FirebaseDatabaseProvider>
        <Router>
          <Switch>
            <Route exact path= "/" component = {Main}/>
            <Route exact path= {edit} component={editPage}/>
          </Switch>
        </Router>
      </FirebaseDatabaseProvider>
    );
  }
};
class editPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      AllSubjects: [],
      AllTutors: [],
      SessionDays: [],
      SessionShort: [],
      SessionSubjects: [],
      Subject: "",
      SubjectGroup: "",
      Subtopic: "",
      Day: "",
      Time: "",
      Tutor: "",
      Link: "",
      Index: "",
      DayDel: "",
      IndexDel: "",
      TimeDel: "",
      TutorDel: "",
      SubjectNew: "",
      Subjects: []
    }
    this.handleSubjectChange = this.handleSubjectChange.bind(this)
    this.handleSubtopicChange = this.handleSubtopicChange.bind(this)
    this.handleSubjectSubmit = this.handleSubjectSubmit.bind(this)
    this.handleDayChange = this.handleDayChange.bind(this)
    this.handleIndexChange = this.handleIndexChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.handleTutorChange = this.handleTutorChange.bind(this)
    this.handleSubjectNewChange = this.handleSubjectNewChange.bind(this)
    this.handleSubjectEnter = this.handleSubjectEnter.bind(this)
    this.handleSessionSubmit = this.handleSessionSubmit.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.handleSubjectGroup = this.handleSubjectGroup.bind(this)
    this.handleDayDelChange = this.handleDayDelChange.bind(this)
    this.handleIndexDelChange = this.handleIndexDelChange.bind(this)
    this.handleTimeDelChange = this.handleTimeDelChange.bind(this)
    this.handleDelSubmit = this.handleDelSubmit.bind(this)
    this.handleTutorDelChange = this.handleTutorDelChange.bind(this)
  }
  componentDidMount(){
    let AllSubjects = []
    db.ref("AllSubjects").on("value", snapshot => {
      snapshot.forEach(snap => {
        AllSubjects.push(snap.val());
      });
    });
    this.setState({AllSubjects: AllSubjects})
    let AllTutors = []
    db.ref("AllTutors").on("value", snapshot => {
      snapshot.forEach(snap => {
        AllTutors.push(snap.val());
      });
    });
    this.setState({AllTutors: AllTutors})
    let SessionDays = []
    db.ref("SessionDays").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionDays.push(snap.val());
      });
    });
    this.setState({SessionDays: SessionDays})
    let SessionShort = []
    db.ref("SessionShort").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionShort.push(snap.val());
      });
    });
    this.setState({SessionShort: SessionShort})
    let SessionSubjects = []
    db.ref("SessionSubjects").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionSubjects.push(snap.val());
      });
    });
    this.setState({SessionSubjects: SessionSubjects})
    let AllSessions = []
    db.ref("AllSessions").on("value", snapshot => {
      snapshot.forEach(snap => {
        AllSessions.push(snap.val());
      });
    });
    this.setState({AllSessions: AllSessions})
    let SessionLog = []
    db.ref("SessionLog").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionLog.push(snap.val());
      });
    });
    this.setState({SessionLog: SessionLog})
  }
  handleSubjectChange(e){
    this.setState({Subject: e})
  }
  handleSubtopicChange(e){
    this.setState({Subtopic: e.target.value})
  }
  handleSubjectSubmit(){
    let Subject = this.state.Subject
    let Subtopic = this.state.Subtopic
    if (Subject !== "" && Subtopic !== ""){
    let AllSubjects = this.state.AllSubjects[0][Subject]
    AllSubjects.push(Subtopic)
    db.ref(`AllSubjects/Subjects/${Subject}`)
      .set(AllSubjects)
      .then(
        window.location.reload()  
      )
      }else{
        alert("Please fill out all fields")
      }
  }
  handleDayChange(e){
    this.setState({Day: e})
    SessionShortList = this.state.SessionShort[e]
  }
  handleTimeChange(e){
    this.setState({Time: e.target.value})
  }
  handleIndexChange(e){
    this.setState({Index: e.target.value})
  }
  handleTutorChange(e){
    this.setState({Tutor: e.target.value})
  }
  handleLinkChange(e){
    this.setState({Link: e.target.value})
  }
  handleSubjectNewChange(e){
    this.setState({SubjectNew: e.target.value})
  }
  handleSubjectGroup(e){
    SubjectListAll = this.state.AllSubjects[0]
    SubjectListAll = SubjectListAll[e]
    this.setState({SubjectGroup: e})
  }
  handleSubjectEnter(){
    let Subjects = this.state.Subjects
    if(this.state.SubjectNew === "DELETE"){
      Subjects.splice(Subjects.length - 1)
    }else{
    Subjects.push(this.state.SubjectNew)
    }
    this.setState({Subjects: Subjects})
    this.setState({SubjectNew: ""})
  }
  handleSessionSubmit(){
    let Day = this.state.Day
    let Tutor = this.state.Tutor
    let Link = this.state.Link
    let Index = this.state.Index
    let Time = this.state.Time
    let Subjects = this.state.Subjects
    if(Day !== "" && Time !== "" && Tutor !== "" && Index !== "" && Link !== "" && Subjects !== [] ){
    //SessionShort
    let SessionShort = this.state.SessionShort
    SessionShort[Day].splice(Index, 0, Time)
    //AllTutors
    let AllTutors = this.state.AllTutors
    AllTutors[Day].splice(Index, 0, Tutor)
    //SessionSubjects
    let SessionSubjects = this.state.SessionSubjects
    SessionSubjects[Day].splice(Index, 0, Subjects)
    //SessionDays
    let SessionDays = this.state.SessionDays
    let Mark = Time + " - " + Tutor
    SessionDays[Day][Mark] = {Link: Link, Tutor: Tutor}

    db.ref()
    .update({
      SessionShort,
      AllTutors,
      SessionSubjects,
      SessionDays
    })
    
    .then(_ => {
      window.location.reload()  
    });
    }else{
      alert("Please fill out all fields")
    }
  }
  handleDayDelChange(e){
    this.setState({DayDel: e})
    DelTimes = []
    let Enter = ""
    for (var i = 0; i < this.state.SessionShort[e].length; i++ ){
        Enter = this.state.SessionShort[e][i] + " - " + this.state.AllTutors[e][i]
        DelTimes.push(Enter)
    }
  }
  handleIndexDelChange(e){
    this.setState({IndexDel: e.target.value})
  }
  handleTimeDelChange(e){
    this.setState({TimeDel: e.target.value})
  }
  handleTutorDelChange(e){
    this.setState({TutorDel: e.target.value})
  }
  handleDelSubmit(){
    let Day = this.state.DayDel
    let Index = this.state.IndexDel
    let Tutor = this.state.TutorDel
    let Time = this.state.TimeDel
    
    let SessionDaysIndex = Time + " - " + Tutor
    
    let AllTutors = this.state.AllTutors
    let SessionDays = this.state.SessionDays
    
    let SessionShort = this.state.SessionShort
    let SessionSubjects = this.state.SessionSubjects

    if (Day !== "" && Index !== "" && Tutor !== "" && Time !== ""){
      AllTutors[Day].splice(Index, 1)
      delete SessionDays[Day][SessionDaysIndex]
      SessionShort[Day].splice(Index, 1)
      SessionSubjects[Day].splice(Index,1)
      
      db.ref()
      .update({
        SessionShort,
        AllTutors,
        SessionSubjects,
        SessionDays
      })
      
      .then(_ => {
        window.location.reload()  
      });
      }else{
        alert("Please fill out all fields")
      }

  }
  render(){
    return(
      <div>
        <Jumbotron style = {{height: "70px", backgroundColor: "#2f485b", color: "white", marginBottom:"0px"}}fluid>
          <h1 style = {{fontSize:"40px", marginLeft:"10px" }}>
            <strong>
                TutorScope
            </strong>
          </h1>
        </Jumbotron>
        <Jumbotron fluid>          
        <Form style = {{margin: "20px"}}>          
        <h1>New Subjects</h1><br/>
        <Form.Group controlId="formSubject">
          <Form.Label>Subject Group</Form.Label>
          <DropdownButton variant = "secondary"  onSelect = {this.handleSubjectChange} title = {this.state.Subject} value = {this.state.Subject} placeholder="Subject"  >
              <Dropdown.Item eventKey="Math">Math</Dropdown.Item>
              <Dropdown.Item eventKey="Science">Science</Dropdown.Item>
              <Dropdown.Item eventKey="English">English</Dropdown.Item>
              <Dropdown.Item eventKey="History">History</Dropdown.Item>
              <Dropdown.Item eventKey="Foreign Language">Foreign Language</Dropdown.Item>
              <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
            </DropdownButton>
          <br/>
          <Form.Label>Sub-topic</Form.Label>
          <Form.Control value = {this.state.Subtopic} onChange = {this.handleSubtopicChange}/>
        </Form.Group>
        <Button variant = "secondary" onClick = {this.handleSubjectSubmit}>Submit</Button>
        </Form>
        <Form style = {{margin: "20px"}}>          
        <h1>New Sessions</h1><br/>
        <Form.Group controlId="formSessions">
          <Form.Label>Day of the Week</Form.Label>
          <DropdownButton variant = "secondary"  onSelect = {this.handleDayChange} title = {this.state.Day} placeholder="Day of the Week"  >
              <Dropdown.Item eventKey="1" >Monday</Dropdown.Item>
              <Dropdown.Item eventKey="2">Tuesday</Dropdown.Item>
              <Dropdown.Item eventKey="3">Wednesday</Dropdown.Item>
              <Dropdown.Item eventKey="4">Thursday</Dropdown.Item>
              <Dropdown.Item eventKey="5">Friday</Dropdown.Item>
              <Dropdown.Item eventKey="6">Saturday</Dropdown.Item>
              <Dropdown.Item eventKey="0">Sunday</Dropdown.Item>
            </DropdownButton>
          <br/>
          <Form.Label>Time</Form.Label>
          <Form.Control value = {this.state.Time} onChange = {this.handleTimeChange}/>
          <br/>
          <Form.Label>Tutor</Form.Label>
          <Form.Control value = {this.state.Tutor} onChange = {this.handleTutorChange}/>
          <br/>
          <h6>Times:</h6>
          {SessionShortList.map(session => {
            return (
              <p key = {session}>{session}</p>
            )})}
          <br/>
          <Form.Label>Index</Form.Label>
          <Form.Control value = {this.state.Index} onChange = {this.handleIndexChange} type = "number"/>
          <br/>
          <Form.Label>Link</Form.Label>
          <Form.Control value = {this.state.Link} onChange = {this.handleLinkChange}/>
          <br/>
          <Form.Label>Subject</Form.Label>
          <DropdownButton variant = "secondary"  onSelect = {this.handleSubjectGroup} title = {this.state.SubjectGroup}  placeholder="Subject"  >
              <Dropdown.Item eventKey="Math">Math</Dropdown.Item>
              <Dropdown.Item eventKey="Science">Science</Dropdown.Item>
              <Dropdown.Item eventKey="English">English</Dropdown.Item>
              <Dropdown.Item eventKey="History">History</Dropdown.Item>
              <Dropdown.Item eventKey="Foreign Language">Foreign Language</Dropdown.Item>
              <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
            </DropdownButton>
          <br/>
          <h6>All Possible Subtopics</h6>
          {SubjectListAll.map(subject => {
            return (
              <p key = {subject}>{subject}</p>
            )})}
          <br/>
          <Form.Label>Subtopic</Form.Label>
          <h6>Note: To delete last subject in list, type DELETE</h6>
          <Form.Control value = {this.state.SubjectNew} onChange = {this.handleSubjectNewChange}/>
          <br/>
          <Button variant = "primary" onClick = {this.handleSubjectEnter}>Enter Subject</Button><br/>
          {this.state.Subjects.map(subject => {
            return (
              <div key = {subject}><p><strong>{subject}</strong></p>
              </div>
            )})}
        </Form.Group>
        <Button onClick = {this.handleSessionSubmit} variant = "secondary" >Submit</Button>
        </Form>
        <Form style = {{margin: "20px"}}>          
        <h1>Delete Sessions</h1><br/>
        <Form.Group controlId="formDelete">
              <Form.Label>Day of the Week</Form.Label>
              <DropdownButton variant = "secondary"  onSelect = {this.handleDayDelChange} title = {this.state.DayDel} placeholder="Day of the Week"  >
                  <Dropdown.Item eventKey="1" >Monday</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Tuesday</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Wednesday</Dropdown.Item>
                  <Dropdown.Item eventKey="4">Thursday</Dropdown.Item>
                  <Dropdown.Item eventKey="5">Friday</Dropdown.Item>
                  <Dropdown.Item eventKey="6">Saturday</Dropdown.Item>
                  <Dropdown.Item eventKey="0">Sunday</Dropdown.Item>
              </DropdownButton>
              <br/>
              <h6>Times:</h6>
              {DelTimes.map(Time => {
              return (
                <p key = {Time}>{Time}</p>
              )})}
              <br/>
              <Form.Label>Index</Form.Label>
              <Form.Control type = "number" value = {this.state.IndexDel} onChange = {this.handleIndexDelChange}></Form.Control>
              <br/>
              <Form.Label>Time</Form.Label>
              <Form.Control value = {this.state.TimeDel} onChange = {this.handleTimeDelChange} ></Form.Control>
              <br/>
              <Form.Label>Tutor</Form.Label>
              <Form.Control value = {this.state.TutorDel} onChange = {this.handleTutorDelChange}></Form.Control>
              <br/>
              <Button variant = "secondary" onClick = {this.handleDelSubmit}>Submit</Button>
        </Form.Group>
        </Form>
        </Jumbotron>
      </div>
    );
  }
};

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      FName: "",
      LName: "",
      Email: "",
      Day: "",
      Subject: "",
      Duration: "No",
      Topic: "",
      Date: "",
      Index: "",
      Tutor: "",
      SessionDays: [],
      SessionSubjects:[],
      Sessions: [],
      SessionLink: "",
      SessionTime: "",
      TimeIndex: "",
      SessionShort: [],
      SessionShortDay:[],
      FinalSessions: [],
      SubjectList: [],
      SubjectGroup: "",
      AllSubjects:[],
      AllSessions: [],
      AllTutors: [],
      isOpen: false,
      SessionTrue: true
    };
    this.handleSubjectEnter = this.handleSubjectEnter.bind(this)
    this.handleDateEnter = this.handleDateEnter.bind(this)
    this.handleSessionEnter = this.handleSessionEnter.bind(this)
    this.handleSessionCheck = this.handleSessionCheck.bind(this)
    this.handleSubjectSelect = this.handleSubjectSelect.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleFNameChange = this.handleFNameChange.bind(this)
    this.handleLNameChange = this.handleLNameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    let SessionDays = [];
    db.ref("SessionDays").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionDays.push(snap.val());
      });
    });
    this.setState({ SessionDays: SessionDays });
    let SessionShort = []
    db.ref("SessionShort").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionShort.push(snap.val());
      });
    });
    this.setState({SessionShort: SessionShort})
    let SessionSubjects = []
    db.ref("SessionSubjects").on("value", snapshot => {
      snapshot.forEach(snap => {
        SessionSubjects.push(snap.val());
      });
    });
    this.setState({SessionSubjects: SessionSubjects})
    let AllSubjects = []
    db.ref("AllSubjects").on("value", snapshot => {
      snapshot.forEach(snap => {
        AllSubjects.push(snap.val());
      });
    });
    this.setState({AllSubjects: AllSubjects})
    let AllSessions = []
    db.ref("AllSessions").on("value", snapshot => {
      snapshot.forEach(snap => {
        AllSessions.push(snap.val());
      });
    });
    this.setState({AllSessions: AllSessions})
    let AllTutors = []
    db.ref("AllTutors").on("value", snapshot => {
      snapshot.forEach(snap => {
        AllTutors.push(snap.val());
      });
    });
    this.setState({AllTutors: AllTutors})
    console.clear()
  }
  
  componentDidUpdate(prevState){
    let FinalSessions = []
    let FinalCheck = []
    let Subject = this.state.Subject
    let Date = this.state.Date
    let includes = false
    let index = [];
    let subjectLength = "";
    let Indexer = ""
    let AllSessions = this.state.AllSessions
    if(Subject !== "" && Date !== ""){
      for (var i = 0; i < this.state.SessionShortDay.length; i++ ){
        includes = false
        subjectLength = this.state.SessionSubjects[this.state.Day][i].length
        for(var j = 0; j < subjectLength; j++){
          if (this.state.SessionSubjects[this.state.Day][i][j] === Subject){
            includes = true
            index.push(i)
          }
        }
        if (includes === true && index !== ""){
          Indexer = this.state.SessionShortDay[i] + " - " + this.state.AllTutors[this.state.Day][i]
          FinalSessions.push(this.state.SessionShortDay[i])
          FinalCheck.push(Indexer)
        }
      }
    }
    let FinalList = []
    for (i = 0; i < FinalCheck.length; i++){
      let exists = false
      if(AllSessions[0][Date]){
        if (AllSessions[0][Date][FinalCheck[i]]){
          exists = true
        
      }
      }
      if (exists === false){
        FinalList.push(FinalSessions[i])
      }
    }
    FinalSessionList = FinalList 
    Index = index
  }
  
  handleSubjectEnter(e){
    FinalSessionList = []
    this.setState({FinalSessions: FinalSessionList})
    let AllSubjects = this.state.AllSubjects
    let SubjectList = AllSubjects[0]
    this.setState({SubjectList: SubjectList[e]})
    this.setState({SubjectGroup: e})
  }
  handleClose(){
    this.setState({isOpen: false})
    window.location.reload()
  }
  handleDateEnter(e){
    if (e > (Date.now() + 86400000) && e < (Date.now() + 2592000000)){
    FinalSessionList = []
    this.setState({FinalSessions: FinalSessionList})
    this.setState({Date: e})
    let Day = e.getUTCDay()
    this.setState({Day:Day})
    let Sessions = this.state.SessionDays[e]    
    this.setState({Sessions: Sessions})
    this.setState({SessionShortDay: this.state.SessionShort[Day]})
    }
  }
  handleSessionEnter(e){
    let Day = this.state.Day
    let Time = e.target.value
    Tutor = this.state.AllTutors[Day][Index[Time]]
    this.setState({TimeIndex: Index[Time]})
    this.setState({Index: Number(Time)})
    Time = this.state.SessionShort[Day][Index[Time]]
    let SessionTime = Time + " - " + Tutor
    let total = this.state.SessionDays[Day]
    this.setState({SessionLink: total[SessionTime].Link})
    this.setState({Tutor: total[SessionTime].Tutor})
    this.setState({SessionTime: Time})

  }
  handleSubjectSelect(e){
    this.setState({Subject: e})
  }
  handleSessionCheck(){
    if (FinalSessionList && FinalSessionList.length){
      this.setState({FinalSessions:FinalSessionList})
      this.setState({SessionTrue: false})
    }else{
      this.setState({FinalSessions: ["No Sessions Available on this Date"]})
      this.setState({SessionTrue: true})
    }
  }
  handleFNameChange(e){
    this.setState({FName: e.target.value})
  }
  handleLNameChange(e){
    this.setState({LName: e.target.value})
  }
  handleEmailChange(e){
    this.setState({Email: e.target.value})
  }
  handleDurationChange(e){
    e = Number(e)
    var two = false
    var three = false
    var four = false
    var duration = 1;
    if (Index !== []){
      if((this.state.TimeIndex + 1) === (Index[this.state.Index + 1]) && (this.state.AllTutors[this.state.Day][this.state.TimeIndex] === this.state.AllTutors[this.state.Day][this.state.TimeIndex + 1])){
        two = true
        if ((this.state.TimeIndex + 2) === (Index[this.state.Index + 2])&& (this.state.AllTutors[this.state.Day][this.state.TimeIndex + 1] === this.state.AllTutors[this.state.Day][this.state.TimeIndex + 2])){
          three = true
          if ((this.state.TimeIndex + 3) === (Index[this.state.Index + 3])&& (this.state.AllTutors[this.state.Day][this.state.TimeIndex + 2] === this.state.AllTutors[this.state.Day][this.state.TimeIndex + 3])){
            four = true
          }
        }
      }
    switch(e){
      case 1:
        duration = e
        break;
      case 2:
        if(two){
          duration = e
        }else{
          duration = e-1
        }
        break;
      case 3:
        if(three){
          duration = e
        }else if(two){
          duration = e-1
        }else{
          duration = e-2
        }
        break;
      case 4:
        if(four){
          duration = e
        }else if(three){
          duration = e-1
        }else if(two){
          duration = e-2
        }else{
          duration = e-3
        }
        break;
      default:
        duration = 1
        break;
    }
    }
    AllSessionChosen = []
    for (var i = 0; i < duration; i++){
      if(Index[this.state.Index + i] === 0){
        AllSessionChosen.push(Index[this.state.Index + i])
      }
      else if(Index[this.state.Index + i]){
        AllSessionChosen.push(Index[this.state.Index + i])
      }
    }
    this.setState({Duration: duration})
  }
  handleTopicChange(e){
    this.setState({Topic: e.target.value})
  }
  handleSubmit(){
    if (this.state.SessionTime !== "" && this.state.Date !== "" && this.state.Duration !== "" && this.state.Subject !== "" && this.state.FName !== "" && this.state.LName !== "" && this.state.Email !== "" && this.state.Topic !== ""){
    let Time = this.state.SessionTime
    let TimeTutor = Time + " - " + Tutor
    let Date = this.state.Date
    let Link = this.state.SessionLink
    let Duration = this.state.Duration
    let Subject = this.state.Subject
    let FName = this.state.FName
    let LName = this.state.LName
    let Name = this.state.FName + " " + this.state.LName
    let Email = this.state.Email
    let Topic = this.state.Topic
    const log_id = `${LName}_${FName}-${Date}-${Time}-${Tutor}`
    
    for (var i = 0; i < Duration; i ++){
    TimeTutor = this.state.SessionShort[this.state.Day][AllSessionChosen[i]] + ' - ' + Tutor
    db.ref(`AllSessions/SessionList/${Date}/${TimeTutor}`)
      .set({
        Date,
        TimeTutor
      })
    }
    Date = this.state.Date.toDateString()
    Duration = 15*Duration + " minutes"
    db.ref(`SessionLog/${log_id}`)
      .set({
        Name,
        Email,
        Subject,
        Topic,
        Duration,
        Tutor,
        Date,
        Time,
        log_id
      })
    
    //emailjs.send('default_service', 'template_XRgzM4be', {Name: Name, Email: Email, Date: Date, Time: Time, Subject: Subject, Duration: Duration, Topic: Topic, Tutor: Tutor, Link: Link}, 'user_d1Xqe50jKh1T1jDv7xgG5')
      .then(_ => {
        this.setState({isOpen: true})
        
  });
  }else{
      alert("Please fill out all fields")
    }
  }
  render(){
  return (

    <div>
      <Jumbotron style = {{height: "70px", backgroundColor: "#2f485b", color: "white", marginBottom:"0px"}}fluid>
          <h1 style = {{fontSize:"40px", marginLeft:"10px" }}>
            <strong>
                TutorScope
            </strong>
          </h1>
      </Jumbotron>
      <Jumbotron fluid>
        <Form style = {{margin: "20px"}}>
          <h1>TutorScope Session Signup</h1><br/>
        <Form.Group controlId="formName">
          <Form.Label>First Name</Form.Label>
          <Form.Control placeholder= "Enter First Name" onChange = {this.handleFNameChange}/>
          <br/>
          <Form.Label>Last Name</Form.Label>
          <Form.Control placeholder= "Enter Last Name" onChange = {this.handleLNameChange}/>
        </Form.Group>
        <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter Email" onChange = {this.handleEmailChange}/>
          </Form.Group>
          <Form.Group controlId="formSubject">
            <Form.Label>Subject of Session</Form.Label>
            <DropdownButton variant = "secondary"  onSelect = {this.handleSubjectEnter} title = {this.state.SubjectGroup} placeholder="Subject"  >
              <Dropdown.Item eventKey="Math">Math</Dropdown.Item>
              <Dropdown.Item eventKey="Science">Science</Dropdown.Item>
              <Dropdown.Item eventKey="English">English</Dropdown.Item>
              <Dropdown.Item eventKey="History">History</Dropdown.Item>
              <Dropdown.Item eventKey="Foreign Language">Foreign Language</Dropdown.Item>
              <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
            </DropdownButton>
            <br/>
            <Form.Label>Subtopic</Form.Label>
            <DropdownButton variant = "secondary" title = {this.state.Subject} onSelect = {this.handleSubjectSelect} >
            {this.state.SubjectList.map(Subject => {
            return (
              <Dropdown.Item key = {Subject} eventKey ={Subject}>{Subject}</Dropdown.Item>
            )})}
            </DropdownButton>
            <br/>
            <Form.Label>Lesson Topic</Form.Label>
            <Form.Control onChange = {this.handleTopicChange}></Form.Control>
          </Form.Group>
          <Form.Label>Session Date</Form.Label> <br/>
          <DatePicker
            selected={this.state.Date}
            onChange={this.handleDateEnter}
          />
          <br/><br/>
          <Button variant = "secondary" onClick={this.handleSessionCheck}>Check Session Timings</Button>
          <br/><br/>
          <Form.Label>Session Timings (All times in CDT):</Form.Label> <br/>
          <ButtonGroup onClick = {this.handleSessionEnter}>
            {this.state.FinalSessions.map((session,index) => {
            return (
            <Button disabled = {this.state.SessionTrue} variant="secondary" key = {index} value = {index}>{session}</Button>
            )})}
          </ButtonGroup>
          <br/><br/>
          <h5><strong>Tutor: </strong> {this.state.Tutor} </h5><br/>
          <Form.Group controlId="formDuration">
            <Form.Label>Session Duration</Form.Label>
            <DropdownButton variant = "secondary"  onSelect = {this.handleDurationChange} title = {this.state.Duration + " slot"} >
              <Dropdown.Item eventKey = "1" >15 Minutes</Dropdown.Item>
              <Dropdown.Item eventKey="2">30 Minutes</Dropdown.Item>
              <Dropdown.Item eventKey="3">45 Minutes</Dropdown.Item>
              <Dropdown.Item eventKey="4">1 Hour</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
            <br/>
          <Button onClick = {this.handleSubmit} variant="primary" >
            Submit
          </Button>
        </Form>
      </Jumbotron>
      <div>
      <Dialog isOpen={this.state.isOpen} onDismiss={this.handleClose}>
      <h1>Submission Successful</h1> <br/>
        <h4>Thank you for signing up for a TutorScope Session! You will receive a confirmation email to the address that you provided containing your zoom link and all other information. Please email tutorscope.contact@gmail.com if you have any questions!</h4> <br/>
        <Button variant = "secondary" onClick={this.handleClose}>Close</Button>
        <p>  </p>
        <Button href = "https://tutorscope.org">Return to website</Button>
      </Dialog>
      </div>
    </div>
  );
}
}

 
export default App;
 

