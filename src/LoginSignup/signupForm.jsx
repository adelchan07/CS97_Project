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

    const result = await fetch('http://localhost:3200/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return result.data;    
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
           onChange={(event) => this.setState({username: event.value})} autoComplete="off" required /><br /><br />

          <label htmlFor="register_pw"> Select a password: </label> 
          <input type="password" name="register_pw" placeholder="Password"
           onChange={(event) => this.setState({password: event.value})} required /><br />

          <label htmlFor="confirm_pw"> Confirm password: </label> 
          <input type="password" name="confirm_pw" placeholder="Confirm Password"
           onChange={(event) => this.setState({confirm: event.value})} required /><br />

          <button type="submit"> Create Account </button>
          
          <p> Already have an account?
            <a href="LoginForm" className="to_register">Login here</a>
          </p>
        </form>
      </div>
    </>)
  }
}
