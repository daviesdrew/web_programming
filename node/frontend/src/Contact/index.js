import React, { Component } from 'react';
import './index.css';
import * as ENV from '../config/literals';
import ReCAPTCHA from "react-google-recaptcha";

class ContactForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contactFormFields: {
				firstname: '',
				lastname: '',
				email: '',
				message: '',
				recipient: 'test'			// TO BE CHANGED
			},
			recaptchaSuccess: false,
			sendSuccess: false,
			errorMessage: ''
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.asyncFetch = this.asyncFetch.bind(this);
		this.recaptchaVerify = this.recaptchaVerify.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.allFieldsFilled = this.allFieldsFilled.bind(this);
		this.reloadContactForm = this.reloadContactForm.bind(this);
		this.displayErrorMessage = this.displayErrorMessage.bind(this);
	}

	// Adjust current state to reflect form inputs (on change)
	handleInputChange(event) {
		const target = event.target; // the element 
		const value = target.value; // value of the field 
		const name = target.name; // field name

		// maintain react immutability - do not mutate state
		// create a copy, modify the copy, and set state as new object
		let temp = this.state.contactFormFields;
		temp[name] = value;
		this.setState(() => ({ contactFormFields: temp }));
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
				errorMessage: 'reCAPTCHA timed out. Please try again'
			});
			return;
		}
	}

	// Send message on backend
	sendMessage() {
		if (this.state.recaptchaSuccess) {
			document.getElementById('submit-button').innerHTML = 'Sending message...';

			// Process message sending on backend
			this.asyncFetch(ENV.DB_API_CONTACT, {
				firstName: this.state.contactFormFields.firstname,
				lastName: this.state.contactFormFields.lastname,
				email: this.state.contactFormFields.email,
				message: this.state.contactFormFields.message,
				recipient: this.state.contactFormFields.recipient,
			}).then(serverResponse => {
				if (serverResponse.messageSent === false)
					this.displayErrorMessage('Message failed to send. Please try again.')
				this.setState({ sendSuccess: serverResponse.messageSent })
			});
		}
	}

	// Check if reCAPTCHA is completed & all fields are filled
	allFieldsFilled() {
		return (
			this.state.recaptchaSuccess &&
			this.state.contactFormFields.firstname &&
			this.state.contactFormFields.lastname &&
			this.state.contactFormFields.email &&
			this.state.contactFormFields.message)
	}

	// Display an error message if login or reCAPTCHA fails
	displayErrorMessage(errMsg) {
		document.getElementById('submit-button').innerHTML = 'Submit';
		this.setState({ errorMessage: errMsg });
	}

	// Reload contact form after confirmation (restore state defaults)
	reloadContactForm() {
		let temp = {
			contactFormFields: {
				firstName: '',
				lastname: '',
				email: '',
				message: '',
				recipient: 'test'		// TO BE CHANGED
			},
			recaptchaSuccess: false,
			sendSuccess: false
		}
		this.setState(temp);
	}

	render() {
		return (!this.state.sendSuccess ?
			<div className='contact-container'>
				<div className='contact-form'>
					<div className="contact-form-title">For general inquires please fill out the form below.</div>

					<label>First Name</label>
					<input type='text' name='firstname' value={this.state.contactFormFields['firstname']} onChange={event => this.handleInputChange(event)} placeholder='First Name' />

					<label>Last Name</label>
					<input type='text' name='lastname' value={this.state.contactFormFields['lastname']} onChange={event => this.handleInputChange(event)} placeholder='Last Name' />

					<label>Email</label>
					<input type='text' name='email' value={this.state.contactFormFields['email']} onChange={event => this.handleInputChange(event)} placeholder='Email Address' />

					<label>Message</label>
					<textarea id='message' name='message' value={this.state.contactFormFields['message']} onChange={event => this.handleInputChange(event)} placeholder='Write your message here...'></textarea>

					<label>Recipient</label>
					<select id='recipient' name='recipient' onChange={event => this.handleInputChange(event)}>
						<option value='test'>Test Email Address</option>
						<option value='owner' disabled>Zbigniew Izydorczyk (Owner)</option>
						<option value='database_admin' disabled>Ron McFadyen (Database Administrator)</option>
					</select>

					<div className='recaptcha-container'>
						<ReCAPTCHA
							sitekey={ENV.RECAPTCHA_SITE_KEY}
							onChange={this.recaptchaVerify}
						/>
					</div>

					{this.allFieldsFilled() ?
						<button id='submit-button' type='Button' onClick={this.sendMessage}>Submit</button>
						:
						<button id='submit-button' type='Button' disabled>Submit</button>}
				</div>
			</div>
			:
			<div className='confirmation-container'>
				<div className='confirmation-message'>
					Your message has been sent.
					<br />
					<b>Thank you!</b>
				</div>
				<div className='confirmation-back-button' onClick={this.reloadContactForm}>Back</div>
			</div>
		);
	}
}

export default ContactForm;