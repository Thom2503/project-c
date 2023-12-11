import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Settings } from './Settings';

export class NotificationTray extends Component {

	constructor(props) {
		super(props);
		this.state = {userNotifications: [], display: "none"};
	}

	openTray = () => {
		const noneOrBlock = this.state.display === "none" ? "block" : "none";
		this.setState({display: noneOrBlock});
	}

    render() {
		const { userNotifications, display } = this.state;
        return (
			<div className='notificationTray'>
				<span><FontAwesomeIcon id='notificationTrayIcon' icon={faBell} onClick={() => this.openTray()}/></span>
				<div className='notificationTrayContent' style={{display: display}}>
					<h4>Notificaties</h4>
					<hr />
					<Settings />
					<hr />
					{userNotifications.length > 0 ? (
						userNotifications.map((notification) => (
							<p>{notification.title}</p>
						))
					) : (
						<p>Geen notificaties gevonden</p>
					)}
				</div>
			</div>
        );
    }
}
