import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Settings } from './Settings';
import {hasUserReadNotifications, readNotification} from '../include/notification_functions';
import { getCookie } from '../include/util_functions';

export class NotificationTray extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userid: Number.parseInt(getCookie("user")),
			userNotifications: [],
			display: "none",
			read: false
		};

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		this.fetchNotifications();
		this.fetchIfUserRead();
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside)
	}

	fetchNotifications = async () => {
		const response = await fetch("notifications");
		const data = await response.json();
		if (!data.error) {
			this.setState({userNotifications: data});
		}
	}

	fetchIfUserRead = async () => {
		this.setState({read: await hasUserReadNotifications(this.state.userid)});
	}

	openTray = async () => {
		const noneOrBlock = this.state.display === "none" ? "block" : "none";
		this.setState({display: noneOrBlock});
		if (this.state.read === false) await readNotification(Number.parseInt(getCookie("user")));
	}

	handleClickOutside(event) {
		if (this.wrapperRef && this.wrapperRef.current &&
		    !this.wrapperRef.current.contains(event.target) && this.state.display === "block") {
			this.openTray();
		}
	}

	render() {
		const { userNotifications, display, read } = this.state;
		return (
			<div className='notificationTray'>
				<span>
					<FontAwesomeIcon id='notificationTrayIcon'
					                 icon={faBell}
					                 style={{animation: read === false ? 'bellshake 5s cubic-bezier(.36,.07,.19,.97) both' : '' }}
					                 onClick={() => this.openTray()}
					/>
				</span>
				<div ref={this.wrapperRef} className='notificationTrayContent' style={{display: display}}>
					<h4>Notificaties</h4>
					<hr />
					<h4>Notificatie Opties</h4>
					<Settings />
					<hr />
					{userNotifications.length > 0 ? (
						userNotifications.map((notification) => (
							<div className='notificationTrayContentItem'>
								<h5>{notification.Content}</h5>
								<em>{new Date(Number.parseInt(notification.Timestamp) * 1000).toLocaleDateString("nl-NL", {
										hour: '2-digit',
										minute: '2-digit',
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})}
								</em>
								<hr />
							</div>
						))
					) : (
						<p>Geen notificaties gevonden</p>
					)}
				</div>
			</div>
		);
	}
}
