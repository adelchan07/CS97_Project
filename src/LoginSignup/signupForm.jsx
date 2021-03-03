import React from "react";

export default class SignupPage extends React.Component {
  onSubmit() { 
  
  }

  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="forms.css" />    
      <a href="/"><h1 id="header"> My Calendar </h1></a>
      <div id="register">
        <form >
          <label htmlFor="register_un"> Select a username: </label>
          <input type="text" name="register_un" placeholder="Username" autoComplete="off" k required /><br /><br />

          <label htmlFor="register_pw"> Select a password: </label> 
          <input type="password" name="register_pw" placeholder="Password" required /><br />

          <label htmlFor="confirm_pw"> Confirm password: </label> 
          <input type="password" name="confirm_pw" placeholder="Confirm Password" required /><br />

          <button onClick={ (event) => {this.onSubmit.bind(this) ; event.preventDefault()} }> Create Account </button>
          
          <p> Already have an account?
            <a href="LoginForm" className="to_register">Login here</a>
          </p>
        </form>
      </div>
    </>)
  }
}
