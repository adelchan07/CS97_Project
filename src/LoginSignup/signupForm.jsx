import React from "react";

export default class SignupPage extends React.Component {
  constructor(props){
  super(props);
    this.state = {
      username: null,
      password: null,
      confirm: null
    };
  }

  async onSubmit(event) { 
    event.preventDefault();

    const data = {username: this.state.username, password: this.state.password, 
                  confirm: this.state.confirm};

    if (data.password !== data.confirm) {
      alert("Password and confirm Password do not match.")
      return;
    }
    const res = await fetch('http://localhost:3200/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if(res.status === 400) {
      alert("Username is taken, please choose a different username.");
      return;
    }

    return;    
  }

  render() {
    return(<>
      <meta charSet="UTF-8" />
      <title>My Calendar</title>
      <link rel="stylesheet" href="forms.css" />    
      <a href="/"><h1 id="header"> My Calendar </h1></a>
      <div id="register">
        <form onSubmit={this.onSubmit.bind(this)}>
          <label htmlFor="register_un"> Select a username: </label>
          <input type="text" name="register_un" placeholder="Username" 
           onChange={({target}) => this.setState({username: target.value})} autoComplete="off" required /><br /><br />

          <label htmlFor="register_pw"> Select a password: </label> 
          <input type="password" name="register_pw" placeholder="Password"
           onChange={({target}) => this.setState({password: target.value})} required /><br />

          <label htmlFor="confirm_pw"> Confirm password: </label> 
          <input type="password" name="confirm_pw" placeholder="Confirm Password"
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
