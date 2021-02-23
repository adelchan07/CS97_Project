import React from "react";

export default class LoginPage extends React.Component {
  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="forms.css" />    
      <a href="/"><h1 id="header"> My Calendar </h1></a>
      <div id="login">
        <form action="////replace me////">
          <label htmlFor="un"> Username: </label>
          <input type="text" name="un" placeholder="Username" autoComplete="off" required /><br /><br />
          <label htmlFor="pw"> Password: </label>
          <input type="password" name="pw" id="pass" placeholder="Password" required /><br />
          <input type="checkbox" onclick="passwordVisible()" /> Show Password <br /><br />
          <button type="submit" onclick="validate()"> Login </button>
          <p> Don't have an account? Create one here:
            <a href="SignupForm" className="to_register">Register</a>
          </p>
        </form>
      </div>
    </>)
  }
}

function passwordVisible() {
    let input = document.getElementById("pass");
    return input.type === "password" ? input.type = "text" : input.type = "password"
}

function validate() {
    
}