import React from "react";
import fb from '../firebase_config.js'

export default class SignupPage extends React.Component {
  constructor(props){
  super(props);
    this.state = {
      email: null,
      password: null,
      confirm: null
    };
  }

  async onSubmit(event) { 
    event.preventDefault();

    const userData = {
      email: this.state.email, 
      password: this.state.password, 
      confirm: this.state.confirm
    };

    if (userData.password.length < 6) {
      alert("Password must be a minimum of 6 characters");
    }

    if(userData.password !== userData.confirm) {
      alert("Password and confirm password must match.");
      return;
    }
    await fb.auth().createUserWithEmailAndPassword(userData.email, userData.password).then(()=>{
      console.log('User Created');
      window.location.replace('LoginForm'); 
    }).catch((error) => {
      alert("Email seems to be registered already");
      console.log('Failure!!!')  
      console.error('Failed');
    });

    // const res = await fetch('http://localhost:3200/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // if(res.status === 400) {
    //   alert("Username is taken, please choose a different username.");
    //   return;
    // }
  }

  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="forms.css" />    
      <a href="/"><h1 id="header"> My Calendar </h1></a>
      <div id="register">
        <form onSubmit={this.onSubmit.bind(this)}>
          <label htmlFor="register_un"> Select an email address: </label>
          <input type="text" name="register_un" placeholder="Email address" 
           onChange={({target}) => this.setState({email: target.value})} autoComplete="off" required /><br /><br />

          <label htmlFor="register_pw"> Select a password: </label> 
          <input type="password" name="register_pw" placeholder="Password (min length: 6)"
           onChange={({target}) => this.setState({password: target.value})} required /><br />

          <label htmlFor="confirm_pw"> Confirm password: </label> 
          <input type="password" name="confirm_pw" placeholder="Confirm password"
           onChange={({target}) => this.setState({confirm: target.value})} required /><br />

          <button type="submit"> Create Account </button>
          
          <p> Already have an account?
            <a href="LoginForm" className="to_register">Login here</a>
          </p>
        </form>
      </div>
    </>)
  }
}
