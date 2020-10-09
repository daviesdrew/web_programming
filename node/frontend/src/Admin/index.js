import React, { Component, useEffect } from 'react';
import Login from './Login/';
import './index.css';
import * as ENV from '../config/literals';

class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeAdminTab: ENV.IDEN_ADMIN_INSIGHTS,
			data: {
				userlist: [],
				userinsights: null
			}
		}
		this.changeActiveTab = this.changeActiveTab.bind(this);
		this.asyncFetch = this.asyncFetch.bind(this);
		this.getAdminData = this.getAdminData.bind(this);
	}

	// Change active administrator tab
	changeActiveTab(tab) {
		this.setState({
			activeAdminTab: tab
		});
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

	// Get user data
	getAdminData() {
		if (this.props.accessToken !== '') {
			// User list...
			this.asyncFetch(ENV.DB_API_ADMIN_USERS, { token: this.props.accessToken }).then(serverResponse => {
				this.setState({
					data: {
						userlist: serverResponse.data
					}
				});

				console.log(this.state.data.userlist);
			});

			// User insights...
			this.asyncFetch(ENV.DB_API_ADMIN_INSIGHTS, { token: this.props.accessToken }).then(serverResponse => {
				console.log(serverResponse);

				this.setState({
					data: {
						userinsights: serverResponse.data
					}
				});
			});
		}
	}

	componentWillMount() {
		this.getAdminData();
	}

	render() {
		return (
			<div className="admin-container">
				{!this.props.accessToken ?
					<Login handleLoginChange={this.props.handleLoginChange} getAdminData={this.getAdminData}></Login>
					:
					<div className='admin-body'>
						<div className='admin-header'>
							<button className='logout-button' onClick={() => this.props.handleLoginChange('', '')}>Logout</button>
							<div className='admin-title'>Administrator Console</div>
							<div className='loggedin-display'>Logged in as: <b>{this.props.user}</b></div>
						</div>
						<div className='admin-content'>
							<div className='admin-content--userdata'>
								USER INSIGHTS HERE
								</div>
							<div className='admin-content--userlist'>
								<div className='admin-content--userlist-header'>Administrators</div>
								<div className='admin-content--userlist-items'>
									{this.state.data.userlist.map(item =>
										<div className='userlist-item'>
											{item.name}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}

export default Admin;