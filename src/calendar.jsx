import React from "react";
import './calendarLayout.css';

export default class LoginPage extends React.Component {
  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="calendarLayout.css" />
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
          <div className="days"><span className="white"> </span>SUN MON TUE WED THU FRI SAT</div>
          {/* days */}
          <div className="num-dates">
            <div className="first-week"><span className="grey">28</span> 01 02 03 04 05 06</div>
            {/* first week */}
            <div className="second-week"> 07 08 09 10 11 12 13</div>
            {/* week */}
            <div className="third-week"> 14 15 16 17 <strong className="white">18</strong> 19 20</div>
            {/* week */}
            <div className="fourth-week"> 21 22 23 24 25 26 27</div>
            {/* week */}
            <div className="fifth-week">28 29 30 31<span className="grey"> 01 02 03</span></div>
            {/* week */}
            <div className="sixth-week">  <span className="grey">04 05 06 07 08 09 10</span></div>
            {/* week */}
          </div>
          {/* num-dates */}
          <div className="event-indicator" />
          {/* event-indicator */}
          <div className="active-day" />
          {/* active-day */}
          <div className="event-indicator two" />
          {/* event-indicator */}
        </div>
        {/* calendar-base */}
        <div className="calendar-left">
          <div className="hamburger">
            <div className="burger-line" />
            {/* burger-line */}
            <div className="burger-line" />
            {/* burger-line */}
            <div className="burger-line" />
            {/* burger-line */}
          </div>
          {/* hamburger */}
          <div className="num-date">18</div>
          {/*num-date */}
          <div className="day">THURSDAY</div>
          {/*day */}
          <div className="current-events">{/*Current Events*/}
            <br />
            <ul>
              <li><strong className="white">4:00 PM - 5:00 PM</strong>  CS97 Lecture</li>
              <li><strong className="white">5:30 PM - 6:00 PM</strong> Cry because you don’t understand</li>
            </ul>
            <span className="posts"> </span></div>
          {/*current-events */}
          <div className="create-event">Create an Event</div>
          {/* create-event */}
          <hr className="event-line" />
          <div className="add-event"><span className="add">+</span></div>
          {/* add-event */}
        </div>
        {/* calendar-left */}
      </div>
      {/* container */}
    </>)
  }
}
