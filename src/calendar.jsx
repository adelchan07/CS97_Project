import React from "react";
import './calendarLayout.css';

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
    this.state = {
      currentDate: 0,
      eventDay: null,
      eventName: null,
      eventTime: null
    };
  }

  async onSubmit(event) {
    event.preventDefault();
    
    const data = {eventName: this.state.eventName, eventDay: this.state.eventDay,
                  eventTime: this.state.eventTime};

    const res = await fetch('http://localhost:3200/:username/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    this.closeForm(event);
    //this.refreshPage();
    
    return res.data;
  }

  displayUser() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }

  displayTime() {

  }

  displayEvent() {

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

  handleClick(i) {
    this.setState({
      currentDate: i,
    })
  }

  getDayOfWeek(i) {
    /*TODO: handleclick*/
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
          <div className="num-date">{dateArray[this.state.currentDate]}</div>
          {/*num-date */}
          <div className="day">{this.getDayOfWeek(this.state.currentDate)}</div>
          {/*day */}
          <div className="current-events">{/*Current Events*/}
            <br />
            <ul>
              <li><strong className="white">4:00 PM - 5:00 PM</strong>  CS97 Lecture</li>
              <li><strong className="white">5:30 PM - 6:00 PM</strong> Cry because you don’t understand</li>
            </ul>
            <span className="posts"> </span></div>
          
          {/* display user info */}
          <div class="popup" onClick={() => this.displayUser()}><i class="fa fa-bars"></i> 
              <span class="popuptext" id="myPopup">sample user name</span>
          </div>

          {/* create-event */}
          <button class="open-button" onClick={this.openForm.bind(this)}>Create an Event</button>
          <div class="popup-form" id="eventForm">
            <form onSubmit={this.onSubmit.bind(this)} class="form-container">

              <label htmlFor="event"> Event </label>
              <input type="text" placeholder="Event name" name="event" autoComplete="off"
               onChange={({target}) => this.setState({eventName: target.value})} required></input>

              <label htmlFor="day"> Day </label>
              <input type="text" placeholder="Event date" name="day" autoComplete="off"
               onChange={({target}) => this.setState({eventDay: target.value})} required></input>

              <label htmlFor="time"> Time </label>
              <input type="text" placeholder="Event time" name="time" autoComplete="off"
               onChange={({target}) => this.setState({eventTime: target.value})} required></input>

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
