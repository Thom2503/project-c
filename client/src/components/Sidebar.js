import React, { Component } from 'react';
import '../css/custom.css';

export class Sidebar extends Component {
	static displayName = Sidebar.name;

	constructor(props) {
		super(props);
		this.state = {
			isOpen: props.isOpen,
			type: Number.parseInt(props.type),
			room: props.room ?? null,
			openID: props.id
		};
	}

	componentDidUpdate(prevProps) {
		this.state.isOpen = !prevProps.room.isOpen;
	}

	async getUsersInRoom() {
		const response = await fetch(`rooms/${this.state.room.RoomsID}`);
		const data = await response.json();
	}

	render() {
		if ((this.state.room.isOpen ?? false) === false) return;
		switch (this.state.type) {
		case 1:
			return (
				<div className="kamers sidebar">
					<h3>{this.state.room.Name}</h3>
					<hr />
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
