import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGear,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { askPermission, changeUserSubscription, userWantsMail, userWantsPushNotification } from '../include/notification_functions';
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
		changeUserSubscription(this.state.userid, event.target.checked, event.target.name);
	}

    render() {
        return (
			<div style={{color: 'black', fontSize: '18px'}}>
				<span>
					<FontAwesomeIcon icon={faEnvelope} />
					&nbsp;Mail ontvangen?&nbsp;
					<input onChange={this.changeSubscription}
					       type='checkbox'
					       name='mail'
					       checked={this.state.mail} />
				</span>
			</div>
        );
    }
}
