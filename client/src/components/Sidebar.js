import React, { Component } from 'react';
import '../css/custom.css';
import "../css/modal.css";
import CloseIcon from "../static/close-icon.svg";
import { getCookie } from '../include/util_functions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

export class Sidebar extends Component {
	static displayName = Sidebar.name;

	constructor(props) {
		super(props);
		this.state = {
			isOpen: props.isOpen,
			room: props.room ?? null,
			users: null
		};

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		this.getUsersInRoom();
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.room.isOpen !== this.props.room.isOpen) {
			this.setState({isOpen: !prevProps.room.isOpen});
		}
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside)
	}

	async getUsersInRoom() {
		const response = await fetch(`rooms/${this.state.room.RoomsID}`);
		const data = await response.json();
		// voor testen :)
		// if (!data.error) {
		// 	for (let i = 0; i < 35; i++) {
		// 		data.push(data[0]);
		// 	}
		// }
		if (!data.error) {
			this.setState({ users: data });
		}
	}

	closeSidebar() {
		let newData = this.state.room;
		newData.isOpen = false;
		this.setState({room: newData});
	}

	handleClickOutside(event) {
		if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
			this.closeSidebar();
		}
	}

	onClickHref(id) {
		window.location.replace(`kamers?modal=6&id=${id}`);
	}

	render() {
		if ((this.state.room.isOpen ?? false) === false) return;
		return (
			<div ref={this.wrapperRef} className="kamers sidebar">
				<div className="base-outer-close-icon">
					<img className="close-icon"
					     style={{float: 'left', margin: '.8em'}}
					     src={CloseIcon}
					     alt="Close Icon"
					     onClick={() => this.closeSidebar()}
					/>
				</div>
				{getCookie("isadmin") === "true" && (
					<div className="update-icon">
                    	<FontAwesomeIcon icon={faCog} className="text-[#792F82]" onClick={() => this.onClickHref(this.state.room.RoomsID)} />
                	</div>
				)}
				<div className='kamers name'>
					<h3>{this.state.room.Name}</h3>
				</div>
      			<div className="status-div">
      			  <input type="button" className={`status-field`} value="Collega's" />
      			  <input type="button" className={`status-field`} value="Evenementen" />
      			</div>
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
				<div className='kamers date'>
					<a href='agenda'>Klik hier voor agenda</a>
					<br />
					<a style={{color: '#CBCBCB', fontWeight: 900, fontSize: '25px'}} href="?date='-1'">&lt;&nbsp;</a>
					<span className='kamers datestring'>
						{new Date().toLocaleDateString("nl-NL", {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})}
					</span>
					<a style={{color: '#CBCBCB', fontWeight: 900, fontSize: '25px'}} href="?date='+1'">&nbsp;&gt;</a>
				</div>
			</div>
		);
	}
}
