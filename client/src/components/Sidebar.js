import React, { Component } from 'react';
import '../css/custom.css';

export class Sidebar extends Component {
	static displayName = Sidebar.name;

	constructor(props) {
		super(props);
		this.state = { type: props.type };
	}


	async getUsersInRoom() {

	}

	render() {
		switch (this.state.type) {
		case 1:
			return (
				<div className="kamers sidebar">
				</div>
			);
		default:
			return (
				<div>
					<p>Geen geldig type sidebar</p>
				</div>
			);
		}
	}
}
