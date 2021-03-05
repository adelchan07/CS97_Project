import React from 'react';
//import firebase from 'firebase';

export default class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: null,
      password: null,
    };
  }

  onSubmit(event) {
    event.preventDefault();
    
    const data = {username: this.state.username, password: this.state.password};

    /*firebase.auth().signInWithEmailAndPassword(username, password).catch((error) => {
      console.error('Incorrect username or password');
    }); */

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

          <label htmlFor="un"> Username: </label>
          <input type="text" name="un" placeholder="Username" autoComplete="off"
           onChange={({target}) => this.setState({username: target.value})} required /><br /><br />

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