import React from 'react';
import './calendarLayout.css';
import fb from '../src/firebase_config'

// to render the date buttons
class Dates extends React.Component {
  renderDay(i) {
    if (this.props.dateArray[i] === null) {
      return (
        <button className="day-button-unclickable" disabled="true"></button>
      );
    }
    return (
      <button className="day-button" onClick={() => this.props.onClick(i)} >
      {this.props.dateArray[i]}
    </button>
    );
  }

  renderWeeks(startIndex) {
    let weekArray = [];
    for (var i = 0; i < 7; i++) {
      weekArray[i] = startIndex + i;
    }
    return (
      <div className="dates-row">
          {weekArray.map(item => (this.renderDay(item)))}
        </div>
    );
  }

  render() {
    return (
      <div>
        {[0, 7, 14, 21, 28, 35].map(item => (this.renderWeeks(item)))}
      </div>
    );
  }
}

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    console.log('OPEN CAL:');
    this.state = {
      dateIndex: 1,
      calendarMonth: 3,
      eventName: null,
      eventMonth: null,
      eventDay: null,
      eventStartHour: null,
      eventStartMinute: null,
      eventEndHour: null,
      eventEndMinute: null,
      eventArray: [],
      dateArray: [],
      initialized: false,
    };
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

    const eventData = {
      uid: this.state.uid,
      eventName: this.state.eventName, 
      eventMonth: this.state.eventMonth,
      eventDay: this.state.eventDay,
      eventStartHour: this.state.eventStartHour,
      eventStartMinute: this.state.eventStartMinute,
      eventEndHour: this.state.eventEndHour,
      eventEndMinute: this.state.eventEndMinute,
    };
    
    if (parseInt(this.state.eventStartHour) > parseInt(this.state.eventEndHour)) {
      alert('Start hour must be before end hour');
      return;
    }
    if (parseInt(this.state.eventStartHour) === parseInt(this.state.eventEndHour)) {
      if (parseInt(this.state.eventStartMinute) > parseInt(this.state.eventEndMinute)) {
        alert('Start minute must be before end minute');
        return;
      }
    }
    if (parseInt(this.state.eventStartHour) === parseInt(this.state.eventEndHour)
       && parseInt(this.state.eventStartMinute) === parseInt(this.state.eventEndMinute)) {
        alert('Give yourself some time! Event must be at least one minute long');
        return;
    }
    if (parseInt(this.state.eventDay) > this.getMaxDays(parseInt(this.state.eventMonth))) {
      alert('Invalid Date!');
      return;
    }

    console.log(eventData)
    const res = await fetch('http://localhost:3200/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    // clear form
    this.setState({
      eventName: "", 
      eventMonth: "",
      eventDay: "",
      eventStartHour: "",
      eventStartMinute: "",
      eventEndHour: "",
      eventEndMinute: "",
    });

    this.closeForm(event);
    console.log(eventData)
    console.log(res);
    return res;
  }

//https://c0ad8586d629.ngrok.io

  async getEventsOfCurrentDate(month, date) {
    console.log('http://localhost:3200/events/' + this.state.uid + '/' + month + '/' + date);
    fetch('http://localhost:3200/events/' + this.state.uid + '/' + month + '/' + date, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((data) => {this.setState({eventArray: data});});
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

  openForm(event) {
    event.preventDefault();
    document.getElementById("eventForm").style.display = "block";
  }

  closeForm(event) {
    event.preventDefault();
    document.getElementById("eventForm").style.display = "none";
  }

  async handleClick(i) {
    await this.setState({
      dateIndex: i,
    });
    this.getEventsOfCurrentDate(this.state.calendarMonth, this.state.dateArray[this.state.dateIndex]);
  }

  setEventInfo(type, input) {
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
      if (this.validateInputWithZero(input, 23)) {
        this.setState({eventStartHour: input})
        return input;
      }
      break;
      case "eventStartMinute": 
      if (this.validateInputWithZero(input, 59)) {
        this.setState({eventStartMinute: input})
        return input;
      }
      break;
      case "eventEndHour": 
      if (this.validateInputWithZero(input, 23)) {
        this.setState({eventEndHour: input})
        return input;
      }
      break;
      case "eventEndMinute": 
      if (this.validateInputWithZero(input, 59)) {
        this.setState({eventEndMinute: input})
        return input;
      }
      break;
      default: return;
    }
    alert("Input Invalid!")
    return '';
  }

  validateInput(input, num) {
    if (isNaN(input) || input[0] === '-')
      return false;
    if (parseInt(input) > num || input === "0")
      return false;
    return true;
  }
  validateInputWithZero(input, num) {
    if (isNaN(input) || input[0] === '-')
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
      default: return;
    }
  }

  getMonth(i) {
    switch(i) {
      case 1: return "JANUARY";
      case 2: return "FEBRUARY";
      case 3: return "MARCH";
      case 4: return "APRIL";
      case 5: return "MAY";
      case 6: return "JUNE";
      case 7: return "JULY";
      case 8: return "AUGUST";
      case 9: return "SEPTEMBER";
      case 10: return "OCTOBER";
      case 11: return "NOVEMBER";
      case 12: return "DECEMBER";
      default: return;
    }
  }

  getMaxDays(i) {
    switch(i) {
      case 1: return 31;
      case 2: return 28;
      case 3: return 31;
      case 4: return 30;
      case 5: return 31;
      case 6: return 30;
      case 7: return 31;
      case 8: return 31;
      case 9: return 30;
      case 10: return 31;
      case 11: return 30;
      case 12: return 31;
      default: return;
    }
  }

  setDatesToCurrentMonth(i) {
    let tempCalendarMonth = i;
    let tempDateArray = [];
    let tempDateIndex = 0;
    switch(i) {
      case 1: tempDateArray = [null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null, null];
      break;
      case 2: tempDateArray = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, null, null, null, null, null, null, null, null, null, null, null, null, null];
      break;
      case 3: tempDateArray = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null, null, null, null, null, null];
      break;
      case 4: tempDateArray = [null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, null, null, null, null, null, null, null, null];
      break;
      case 5: tempDateArray = [null, null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null];
      break;
      case 6: tempDateArray = [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, null, null, null, null, null, null, null, null, null, null];
      break;
      case 7: tempDateArray = [null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null, null, null];
      break;
      case 8: tempDateArray =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null, null, null, null, null, null, null];
      break;
      case 9: tempDateArray = [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, null, null, null, null, null, null, null, null, null];
      break;
      case 10: tempDateArray = [null, null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null, null];
      break;
      case 11: tempDateArray = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, null, null, null, null, null, null, null, null, null, null, null];
      break;
      case 12: tempDateArray = [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null, null, null, null, null, null];
      break;
      default: return;
    }
    while (tempDateArray[tempDateIndex] === null) 
      tempDateIndex++;
    this.setState({calendarMonth: tempCalendarMonth,
      dateArray: tempDateArray,
      dateIndex: tempDateIndex});
    this.getEventsOfCurrentDate(tempCalendarMonth, tempDateArray[tempDateIndex])
  }

  render() {
    if (!this.state.initialized) {
      // initialize dateArray
      this.setDatesToCurrentMonth(3);
      // initialize eventArray
      this.getEventsOfCurrentDate(3, 1);
      this.setState({initialized: true});
    }
    console.log(this.state.eventArray);
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
          <button className="month-button" onClick={() => this.setDatesToCurrentMonth(1)} >Jan</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(2)} >Feb</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(3)} >Mar</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(4)} >Apr</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(5)} >May</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(6)} >Jun</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(7)} >Jul</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(8)} >Aug</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(9)} >Sep</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(10)} >Oct</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(11)} >Nov</button>
            <button className="month-button" onClick={() => this.setDatesToCurrentMonth(12)} >Dec</button>
            </div>{/* months */}
          <hr className="month-line" />
          <div className="days-line"><span className="white"> </span>SUN MON TUE WED THU FRI SAT</div>
          {/* days */}
          <div className="dates-grid">
            <Dates
              dateArray={this.state.dateArray}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          {/* num-dates */}
        </div>
        {/* calendar-base */}
        <div className="calendar-left">
          {/* hamburger */}
          <div className="num-date">{this.state.dateArray[this.state.dateIndex]}</div>
          {/*month */}
          <div className="month">{this.getMonth(this.state.calendarMonth)}</div>
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
              <input type="event_text" placeholder="Event name" name="event" autoComplete="off" value={this.state.eventName}
               onChange={({target}) => this.setState({eventName: target.value})} required></input>
              
              <input type="date_text" placeholder="Month" name="month" autoComplete="off" maxlength="2" value={this.state.eventMonth}
               onChange={({target}) => target.value = this.setEventInfo("eventMonth", target.value)} required></input>      <input type="date_text" placeholder="Day" name="day" autoComplete="off" maxlength="2" value={this.state.eventDay}
               onChange={({target}) => target.value = this.setEventInfo("eventDay", target.value)} required></input>
               
              <input type="time_text" placeholder="hour" name="time" autoComplete="off" maxlength="2" value={this.state.eventStartHour}
               onChange={({target}) => target.value = this.setEventInfo("eventStartHour", target.value)} required></input> : <input type="time_text" placeholder="min" name="time" autoComplete="off" maxlength="2" value={this.state.eventStartMinute}
               onChange={({target}) => target.value = this.setEventInfo("eventStartMinute", target.value)} required></input>   -   <input type="time_text" placeholder="hour" name="time" autoComplete="off" maxlength="2" value={this.state.eventEndHour}
               onChange={({target}) => target.value = this.setEventInfo("eventEndHour", target.value)} required></input> : <input type="time_text" placeholder="min" name="time" autoComplete="off" maxlength="2" value={this.state.eventEndMinute}
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
