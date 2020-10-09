import React, { Component } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import * as ENV from '../../config/literals';
import './index.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminFormFields: {
                username: '',
                password: ''
            },
            recaptchaSuccess: false,
            loginError: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this);
        this.asyncFetch = this.asyncFetch.bind(this);
        this.recaptchaVerify = this.recaptchaVerify.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.allFieldsFilled = this.allFieldsFilled.bind(this);
        this.displayErrorMessage = this.displayErrorMessage.bind(this);
    }

    // Adjust current state to reflect form inputs (on change)
    handleInputChange(event) {
        const target = event.target; // the element 
        const value = target.value; // value of the field 
        const name = target.name; // field name

        // maintain react immutability - do not mutate state
        // create a copy, modify the copy, and set state as new object
        let temp = this.state.adminFormFields;
        temp[name] = value;
        this.setState(() => ({ adminFormFields: temp }));
    }

    // Allows user to submit login form by pressing ENTER
    handleEnterSubmit(event, callback) {
        if (this.allFieldsFilled() && event.keyCode === 13)
            callback();
    }

    // Async fetch call
    async asyncFetch(url, data) {
        let serverResponse = (await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })).json();

        return serverResponse;
    }

    // Verify reCAPTCHA on backend
    recaptchaVerify(clientResponse) {
        if (clientResponse) {
            // Process reCAPTCHA verification on backend
            this.asyncFetch(ENV.DB_API_RECAPTCHA, { clientResponse: clientResponse }).then(serverResponse => {
                if (serverResponse.recaptchaResult === false)
                    this.displayErrorMessage('reCAPTCHA failed. Please try again.')
                this.setState({ recaptchaSuccess: serverResponse.recaptchaResult })
            });
        } else {
            // reCAPTCHA timed out
            this.setState({
                recaptchaSuccess: false,
                loginError: 'reCAPTCHA timed out. Please try again'
            });
            return;
        }
    }

    // Authenticate user login on backend
    authenticateUser() {
        //if (this.state.recaptchaSuccess) {                TO BE UNCOMMENTED
        document.getElementById('submit-button').innerHTML = 'Logging in...';

        // Process login authentication on backend
        this.asyncFetch(ENV.DB_API_ADMIN_AUTHENTICATE, {
            username: this.state.adminFormFields.username,
            password: this.state.adminFormFields.password
        }).then(serverResponse => {
            if (serverResponse.token !== '') {
                this.props.handleLoginChange(serverResponse.token, serverResponse.user);
                this.props.getAdminData();
            } else {
                this.displayErrorMessage('Login failed. Please try again.');
            }
        });
        //}
    }

    // Check if reCAPTCHA is completed & all fields are filled
    allFieldsFilled() {
        return (
            //this.state.recaptchaSuccess &&               TO BE UNCOMMENTED
            this.state.adminFormFields.username &&
            this.state.adminFormFields.password)
    }

    // Display an error message
    displayErrorMessage(errMsg) {
        document.getElementById('submit-button').innerHTML = 'Login';
        this.setState({ loginError: errMsg });
    }

    render() {
        return (
            <div className="admin-form">
                <div className="admin-form-title">Administrator Login</div>
                <div className='admin-form-error'>{this.state.loginError}</div>
                <label>Username</label>
                <input type='text' name='username' value={this.state.adminFormFields['username']} onChange={event => this.handleInputChange(event)} onKeyDown={event => this.handleEnterSubmit(event, this.authenticateUser)} placeholder='Username' />

                <label>Password</label>
                <input type='password' name='password' value={this.state.adminFormFields['password']} onChange={event => this.handleInputChange(event)} onKeyDown={event => this.handleEnterSubmit(event, this.authenticateUser)} placeholder='Password' />

                <div className='recaptcha-container' required>
                    <ReCAPTCHA
                        sitekey={ENV.RECAPTCHA_SITE_KEY}
                        onChange={this.recaptchaVerify}
                    />
                </div>

                {this.allFieldsFilled() ?
                    <button id='submit-button' type='Button' onClick={this.authenticateUser}>Login</button>
                    :
                    <button id='submit-button' type='Button' disabled>Login</button>}
            </div>
        );
    }
}

export default Login;