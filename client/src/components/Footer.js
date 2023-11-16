import React, { Component } from 'react';
import { deleteCookie } from '../include/util_functions';
import { Settings } from './Settings';

export class Footer extends Component {
	
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
					<a onClick={() => this.loguitEvent()} className='loguit-button'>
						<span className='loguit-text'>Loguit</span>
					</a>
				</div>
			</footer>
        );
    }
}
