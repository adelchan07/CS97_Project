import React from 'react';
import './calendarLayout.css';
import fb from '../src/firebase_config'

class Dates extends React.Component {
  renderDay(i) {
    return (
      <button className="day-button" onClick={() => this.props.onClick(i)} >
      {this.props.dateArray[i]}
    </button>
    );
  }
  renderGreyDay(i) {
    return (
      <button className="day-button grey" onClick={() => this.props.onClick(i)} >
      {this.props.dateArray[i]}
    </button>
    );
  }

  render() {
    return (
      <div>
        <div className="dates-row">
          {this.renderGreyDay(0)}
          {this.renderDay(1)}
          {this.renderDay(2)}
          {this.renderDay(3)}
          {this.renderDay(4)}
          {this.renderDay(5)}
          {this.renderDay(6)}
        </div>
        <div className="dates-row">
          {this.renderDay(7)}
          {this.renderDay(8)}
          {this.renderDay(9)}
          {this.renderDay(10)}
          {this.renderDay(11)}
          {this.renderDay(12)}
          {this.renderDay(13)}
        </div>
        <div className="dates-row">
          {this.renderDay(14)}
          {this.renderDay(15)}
          {this.renderDay(16)}
          {this.renderDay(17)}
          {this.renderDay(18)}
          {this.renderDay(19)}
          {this.renderDay(20)}
        </div>
        <div className="dates-row">
          {this.renderDay(21)}
          {this.renderDay(22)}
          {this.renderDay(23)}
          {this.renderDay(24)}
          {this.renderDay(25)}
          {this.renderDay(26)}
          {this.renderDay(27)}
        </div>
        <div className="dates-row">
          {this.renderDay(28)}
          {this.renderDay(29)}
          {this.renderDay(30)}
          {this.renderDay(31)}
          {this.renderGreyDay(32)}
          {this.renderGreyDay(33)}
          {this.renderGreyDay(34)}
        </div>
      </div>
    );
  }
}

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    console.log('OPEN CAL:');
    this.state = {
      dateIndex: 0,
      calendarDate: 0,
      eventName: null,
      eventMonth: null,
      eventDay: null,
      eventStartHour: null,
      eventStartMinute: null,
      eventEndHour: null,
      eventEndMinute: null,
      eventArray: []
    };
    this.displayEvents(this.state.dateIndex)
    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          currentUserEmail: user.email,
          uid: user.uid
        }); 
        console.log(user.uid);
      } else {
        console.log('No user signed in');
      }
    });
  }

  async onSubmit(event) {
    event.preventDefault();

    // format minutes if less than 10
    // let startMin = "";
    // let endMin = "";
    // if (this.state.eventStartMinute == "0")
    //   startMin = "00"
    // else if (parseInt(this.state.eventStartMinute) < 10)
    //   startMin = "0" + this.state.eventStartMinute;
    // if (this.state.eventEndMinute == "0")
    //   endMin = "00"
    // else if (parseInt(this.state.eventEndMinute) < 10)
    //   endMin = "0" + this.state.eventEndMinute;

    const eventData = {
      uid: this.state.uid,
      eventName: this.state.eventName, 
      eventMonth: this.state.eventMonth,
      eventDay: this.state.eventDay,
      eventStartHour: this.state.eventStartHour,
      //eventStartMinute: startMin,
      eventStartMinute: this.state.eventStartMinute,
      
      eventEndHour: this.state.eventEndHour,
      eventEndMinute: this.state.eventEndMinute,

      //eventEndMinute: endMin,
      
    };
    console.log(eventData)
    const res = await fetch('http://localhost:3200/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    
    this.closeForm(event);
    //this.refreshPage();
    console.log(eventData)
    console.log(res);
    return res;
  }

//https://c0ad8586d629.ngrok.io

  async displayEvents() {
    console.log('http://localhost:3200/events/' + this.state.uid + '/' + this.state.calendarDate.toString());
    const res = await fetch('http://localhost:3200/events/' + this.state.uid + '/' + this.state.calendarDate.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json();
    console.log(data);
    /* TODO: data is the array of events (each event is a JSON object) */
    this.setState({eventArray: data});
    // .then((res) => res.json())
    // .then((data) => {this.setState({eventArray: data});});
    // /* TODO: return an array with correct info */
  }

  displayUser = () => {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }

  logout(event) {
    event.preventDefault();
    fb.auth().signOut().then(() => {
      this.setState({
        currentUserEmail: null,
        uid: null
      });
    }).catch(function(error) {
      console.log('Could not log on');
    });

    window.location.replace('/')    //welcome page
  }

  /*refreshPage() { 
    window.location.reload(); 
  }*/
  
  openForm(event) {
    event.preventDefault();
    document.getElementById("eventForm").style.display = "block";
  }

  closeForm(event) {
    event.preventDefault();
    document.getElementById("eventForm").style.display = "none";
  }

  async handleClick(i) {
    let dateArray = [28, 1, 2, 3, 4, 5, 6, 
      7, 8, 9, 10, 11, 12, 13, 
      14, 15, 16, 17, 18, 19, 20, 
      21, 22, 23, 24, 25, 26, 27, 
      28, 29, 30, 31, 1, 2, 3];
    await this.setState({
      dateIndex: i,
      calendarDate: dateArray[i]
    });
    this.displayEvents();
  }

  setEventInfo(type, input) {
    console.log("1: ", input)
    switch(type) {
      case "eventMonth": 
      if (this.validateInput(input, 12)) {
        this.setState({eventMonth: input})
        return input;
      }
      break;
      case "eventDay": 
      if (this.validateInput(input, 31)) {
        this.setState({eventDay: input})
        return input;
      }
      break;
      case "eventStartHour": 
      if (this.validateInput(input, 24)) {
        this.setState({eventStartHour: input})
        return input;
      }
      break;
      case "eventStartMinute": 
      if (this.validateInputMinute(input, 59)) {
        this.setState({eventStartMinute: input})
        return input;
      }
      break;
      case "eventEndHour": 
      if (this.validateInput(input, 24)) {
        this.setState({eventEndHour: input})
        return input;
      }
      break;
      case "eventEndMinute": 
      if (this.validateInputMinute(input, 59)) {
        this.setState({eventEndMinute: input})
        return input;
      }
    }
    alert("Input Invalid!")
    return input.substring(0, input.length - 1);
  }

  validateInput(input, num) {
    console.log(input)
    if (isNaN(input))
      return false;
    if (parseInt(input) > num || input == "0")
      return false;
    return true;
  }
  validateInputMinute(input, num) {
    console.log(input)
    if (isNaN(input))
      return false;
    if (parseInt(input) > num)
      return false;
    return true;
  }

  getDayOfWeek(i) {
    switch(i % 7) {
      case 0: return "SUNDAY";
      case 1: return "MONDAY";
      case 2: return "TUESDAY";
      case 3: return "WEDNESDAY";
      case 4: return "THURSDAY";
      case 5: return "FRIDAY";
      case 6: return "SATURDAY";
    }
  }

  render() {
    let dateArray = [28, 1, 2, 3, 4, 5, 6, 
      7, 8, 9, 10, 11, 12, 13, 
      14, 15, 16, 17, 18, 19, 20, 
      21, 22, 23, 24, 25, 26, 27, 
      28, 29, 30, 31, 1, 2, 3];
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="calendarLayout.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link href="https://fonts.googleapis.com/css?family=Kanit:300,700" rel="stylesheet" />


      <div className="container">
      <button className="logout-button" onClick={this.logout.bind(this)}>Logout</button>
        <div className="calendar-base">
          <div className="year">2021</div>

          {/* year */}
          <div className="months">
            <span className="month-hover">Jan </span>
            <span className="month-hover">Feb </span> 
            <strong className="month-color">Mar </strong>
            <span className="month-hover">Apr </span>
            <span className="month-hover">May </span>
            <span className="month-hover">Jun </span>
            <span className="month-hover">July </span> 
            <span className="month-hover">Aug </span> 
            <span className="month-hover">Sep </span> 
            <span className="month-hover">Oct </span> 
            <span className="month-hover">Nov </span> 
            <span className="month-hover">Dec </span>
          </div>{/* months */}
          <hr className="month-line" />
          <div className="days-line"><span className="white"> </span>SUN MON TUE WED THU FRI SAT</div>
          {/* days */}
          <div className="dates-grid">
            <Dates
              dateArray={dateArray}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          {/* num-dates */}
        </div>
        {/* calendar-base */}
        <div className="calendar-left">
          {/* hamburger */}
          <div className="num-date">{dateArray[this.state.dateIndex]}</div>
          {/*num-date */}
          <div className="day">{this.getDayOfWeek(this.state.dateIndex)}</div>
          {/*day */}
          <div className="current-events">{/*Current Events*/}
            <br />
            <ul>
              {this.state.eventArray.map(item => (
                <li><strong className="white">{item.eventStartHour + ":" + item.eventStartMinute + " - " + item.eventEndHour + ":" + item.eventEndMinute}</strong>  {item.eventName}</li>
              ))}
            </ul>
            <span className="posts"> </span></div>
          
          {/* display user info */}
          <div class="popup" onClick={() => this.displayUser()}><i class="fa fa-bars"></i> 
              <span class="popuptext" id="myPopup"> <strong className="gray">User:</strong> {this.state.currentUserEmail}</span>
          </div>

          {/* create-event */}
          <button class="open-button" onClick={this.openForm.bind(this)}>Create an Event</button>
          <div class="popup-form" id="eventForm">
            <form onSubmit={this.onSubmit.bind(this)} class="form-container">
              <input type="event_text" placeholder="Event name" name="event" autoComplete="off"
               onChange={({target}) => this.setState({eventName: target.value})} required></input>
              
              <input type="date_text" placeholder="Month" name="month" autoComplete="off" maxlength="2"
               onChange={({target}) => target.value = this.setEventInfo("eventMonth", target.value)} required></input>      <input type="date_text" placeholder="Day" name="day" autoComplete="off" maxlength="2"
               onChange={({target}) => target.value = this.setEventInfo("eventDay", target.value)} required></input>
               
              <input type="time_text" placeholder="hour" name="time" autoComplete="off" maxlength="2"
               onChange={({target}) => target.value = this.setEventInfo("eventStartHour", target.value)} required></input> : <input type="time_text" placeholder="min" name="time" autoComplete="off" maxlength="2"
               onChange={({target}) => target.value = this.setEventInfo("eventStartMinute", target.value)} required></input>   -   <input type="time_text" placeholder="hour" name="time" autoComplete="off" maxlength="2"
               onChange={({target}) => target.value = this.setEventInfo("eventEndHour", target.value)} required></input> : <input type="time_text" placeholder="min" name="time" autoComplete="off" maxlength="2"
               onChange={({target}) => target.value = this.setEventInfo("eventEndMinute", target.value)} required></input>

              <button type="submit" class="btn" > Create event </button>
              <button class="btn cancel" onClick={this.closeForm.bind(this)}>Cancel</button>
            </form>
          </div>
          
          {/* add-event */}
        </div>
        {/* calendar-left */}
      </div>
      {/* container */}
      
    </>)
  }
}
