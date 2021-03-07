import React from 'react';
import fb from '../firebase_config.js';

export default class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: null,
      password: null,
    };
  }

  onSubmit(event) {
    event.preventDefault();
    
    const userData = {
      email: this.state.email, 
      password: this.state.password
    };

    fb.auth().signInWithEmailAndPassword(userData.email, userData.password).then(()=>{
      console.log('Done');
      window.location.replace('Calendar');   // logs into calendar page
    }).catch((error) => {
        alert('Incorrect username or password');
    }); 
  }

  passwordVisible() {
    let input = document.getElementById("pass");
    return input.type === "password" ? input.type = "text" : input.type = "password";
  }
  
  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="forms.css" />    
      <a href="/"><h1 id="header"> My Calendar </h1></a>
      <div id="login">
        <form onSubmit={this.onSubmit.bind(this)}>

          <label htmlFor="un"> Email: </label>
          <input type="text" name="un" placeholder="Username" autoComplete="off"
           onChange={({target}) => this.setState({email: target.value})} required /><br /><br />

          <label htmlFor="pw"> Password: </label>
          <input type="password" name="pw" id="pass" placeholder="Password" 
           onChange={({target}) => this.setState({password: target.value})} required /><br />

          <input type="checkbox" onClick={this.passwordVisible.bind(this)} /> Show Password <br /><br />

          <button type="submit"> Login </button>

          <p> Don't have an account? Create one here:
            <a href="SignupForm" className="to_register">Register</a>
          </p>
        </form>
      </div>
    </>)
  }
}

