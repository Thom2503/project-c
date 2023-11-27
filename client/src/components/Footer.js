import React, { Component } from 'react';
import { deleteCookie, getCookie } from '../include/util_functions';
import { sendNotification } from '../include/notification_functions';
import { Settings } from './Settings';

export class Footer extends Component {

	constructor(props) {
		super(props);
		this.state = {userid: Number.parseInt(getCookie("user"))};
	}
	
	loguitEvent() {
		// verwijder de cookies die de gebruiker krijgt aan het begin
		deleteCookie("user");
		deleteCookie("isadmin");

		window.location.replace("login");
	}

    render() {
        return (
			<footer>
				<Settings />
				<div>
					<a onClick={() => sendNotification(this.state.userid, 1, "Test!")} className='loguit-button'>
						<span>Test!</span>
					</a>
					<a onClick={() => this.loguitEvent()} className='loguit-button'>
						<span className='loguit-text'>Loguit</span>
					</a>
				</div>
			</footer>
        );
    }
}
