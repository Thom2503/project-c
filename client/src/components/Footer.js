import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { deleteCookie, getCookie } from '../include/util_functions';

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
				<div>
					<a onClick={() => this.loguitEvent()} className='loguit-button'>
						<span className='loguit-text'>
							Loguit&nbsp;
							<FontAwesomeIcon icon={faRightFromBracket} />
						</span>
					</a>
				</div>
			</footer>
        );
    }
}
