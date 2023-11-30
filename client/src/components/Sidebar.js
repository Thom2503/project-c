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
			openID: props.id,
			users: null
		};
	}

	componentDidMount() {
		this.getUsersInRoom();
	}

	componentDidUpdate(prevProps) {
		this.state.isOpen = !prevProps.room.isOpen;
	}

	async getUsersInRoom() {
		const response = await fetch(`rooms/${this.state.room.RoomsID}`);
		const data = await response.json();
		if (!data.error) {
			this.setState({ users: data });
		}
	}

	render() {
		console.log(this.state.users);
		if ((this.state.room.isOpen ?? false) === false) return;
		switch (this.state.type) {
		case 1:
			return (
				<div className="kamers sidebar">
					<h3>{this.state.room.Name}</h3>
					<hr />
					<div className='kamers userlist'>
					{this.state.users !== null ? (
						this.state.users.map((user, index) => (
							<div key={index} className='kamers user'>
								<h4>{`${user.FirstName} ${user.LastName}`}</h4>
								<em>{user.Function}</em>
							</div>
						))
					) : (
						<p>Geen collega's in deze kamer</p>
					)}
					</div>
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
