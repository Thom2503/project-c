import React, { Component } from 'react';
import { askPermission, changeUserSubscription, sendNotification, userWantsMail, userWantsPushNotification } from '../include/notification_functions';
import {getCookie} from '../include/util_functions';

export class Settings extends Component {

	constructor(props) {
		super(props);
		this.state = {mail: false, push: false, userid: Number.parseInt(getCookie("user"))};

        this.changeSubscription = this.changeSubscription.bind(this);
	}

	componentDidMount() {
		userWantsMail(this.state.userid).then(result => this.setState({mail: result}));
		userWantsPushNotification(this.state.userid).then(result => this.setState({push: result}));
	}

	changeSubscription(event) {
        this.setState({[event.target.name]: event.target.checked});
		if (event.target.name === "push") {
			askPermission(this.state.userid);
		} else {
			changeUserSubscription(this.state.userid, event.target.checked, event.target.name);
		}
	}

    render() {
        return (
			<div style={{display: 'flex', color: 'white', float: 'left'}}>
				<span style={{margin: '0.8em'}}>Settings</span>&nbsp;
				<ul style={{color: 'white'}}>
					<li>
						<input onChange={this.changeSubscription}
						       type='checkbox'
						       name='mail'
						       checked={this.state.mail} />&emsp;Mail
					</li>
					<li>
						<input onChange={this.changeSubscription}
						       type='checkbox'
						       name='push'
						       checked={this.state.push} />&emsp;Push notifications
					</li>
				</ul>
				<span onClick={() => sendNotification(this.state.userid, 1, "Test!")}> Test! </span>
			</div>
        );
    }
}
