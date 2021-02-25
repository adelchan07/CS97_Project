import React from "react";

export default class WelcomePage extends React.Component {
  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="forms.css" />    
      <h1 id="header"> Welcome to My Calendar </h1>
      <a href="SignupForm"><button> Sign up </button></a>
      <a href="LoginForm"><button> Login </button></a> <br></br>
      
      <a href="calendar"><button> Calendar (testing) </button></a>
    </>)
  }
}
