import React, { Component } from 'react';
import { userWantsMail, userWantsPushNotification } from '../include/notification_functions';
import {getCookie} from '../include/util_functions';

export class Settings extends Component {

	constructor(props) {
		super(props);
		this.state = {mail: false, push: false, userid: Number.parseInt(getCookie("user"))};
	}

	componentDidMount() {
		this.setState({mail: userWantsMail(this.state.userid), push: userWantsPushNotification(this.state.userid)});
	}

    render() {
        return (
			<div style={{display: 'flex', color: 'white', float: 'left'}}>
				<span style={{margin: '0.8em'}}>Settings</span>&nbsp;
				<ul style={{color: 'white'}}>
					<li><input type='checkbox' checked={this.state.mail} />&emsp;Mail</li>
					<li><input type='checkbox' checked={this.state.push} />&emsp;Push notifications</li>
				</ul>
			</div>
        );
    }
}
