import React, { Component } from 'react';
import '../css/custom.css';
import "../css/modal.css";
import CloseIcon from "../static/close-icon.svg";
import { getCookie } from '../include/util_functions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCog,
    faClock,
    faUser
} from "@fortawesome/free-solid-svg-icons";

export class Sidebar extends Component {
	static displayName = Sidebar.name;

	constructor(props) {
		super(props);
		this.state = {
			isOpen: props.isOpen,
			room: props.room ?? null,
			users: null,
			events: null,
			displayUser: 'block',
			displayEvents: 'none'
		};

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		this.getUsersInRoom();
		this.getEventsInRoom();
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

	async getEventsInRoom() {
		const response = await fetch(`rooms/${this.state.room.Name}`);
		const data = await response.json();
		// voor testen :)
		// if (!data.error) {
		// 	for (let i = 0; i < 35; i++) {
		// 		data.push(data[0]);
		// 	}
		// }
		if (!data.error) {
			this.setState({ events: data });
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

	changeSidebarView = (type) => {
		if (type === "event") {
			this.setState({displayUser: 'none', displayEvents: 'block'});
		} else if (type === "user") {
			this.setState({displayUser: 'block', displayEvents: 'none'});
		}
	};

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
					<input type="button"
					       className={`status-field ${this.state.displayEvents === "none" && "selected"}`}
					       value="Collega's"
					       onClick={() => this.changeSidebarView("user")}
					/>
					<input type="button"
					       className={`status-field ${this.state.displayUser === "none" && "selected"}`}
					       value="Evenementen"
					       onClick={() => this.changeSidebarView("event")}
					/>
				</div>
				<hr />
				<div className='kamers userlist' style={{display: this.state.displayUser}}>
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
				<div className='kamers eventlist' style={{display: this.state.displayEvents}}>
				{this.state.events !== null ? (
					this.state.events.map((event) => (
						<>
							<br />
							<div key={event.id} className="bg-[#F9F9F9] sm:mx-[20px] max-w-[1200px] w-[90%] h-[150px] p-4 flex flex-col justify-center rounded-xl border-[2px] duration-300 transition-all hover:bg-[#FEF3FF] hover:border-[#7100a640] hover:cursor-pointer">
							    <div className="">
							    <h1 className="text-[#792F82] font-medium text-[23px]">
							    {event.Title}
							    {event.IsExternal === 0 ? (
							        <span className="px-[9px] py-[3px] bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px] ml-4">Internal</span>
							    ) : (
							        <span className="px-[9px] py-[3px] bg-[#FFCEA1] rounded-[100px] p-1 text-[#EE5600] text-[13px] ml-4">External</span>
							    )}
							    </h1>
							    </div>
							    <div className="mt-auto flex flex-row gap-8">
							        <div className="flex flex-row items-center gap-2">
							            <div>
							                <FontAwesomeIcon icon={faUser} className="text-[#D8D8D8]" />
							            </div>
							            <div className="flex flex-col">
							                <span className="text-[#B0B0B0] text-[12px]">Host</span>
							                <span className="text-[#5F5F5F] text-[13px] font-bold">Name</span>
							            </div>
							        </div>
							        <div className="flex flex-row items-center gap-2">
							            <div>
							                <FontAwesomeIcon icon={faCalendar} className="text-[#D8D8D8]" />
							            </div>
							            <div className="flex flex-col">
							                <span className="text-[#B0B0B0] text-[12px]">Time</span>
							                <span className="text-[#5F5F5F] text-[13px] font-bold ">{event.startTime} - {event.endTime}</span>
							            </div>
							        </div>
							        <div className="flex flex-row items-center gap-2">
							            <div>
							                <FontAwesomeIcon icon={faClock} className="text-[#D8D8D8]" />
							            </div>
							            <div className="flex flex-col">
							                <span className="text-[#B0B0B0] text-[12px]">Date</span>
							                <span className="text-[#5F5F5F] text-[13px] font-bold">{event.Date}</span>
							            </div>
							        </div>
							    </div>
							</div>
						</>
					))
				) : (
					<p>Geen evenementen in deze kamer</p>
				)}
				</div>
				<div className='kamers date'>
					<a href='agenda'>Klik hier voor agenda</a>
					<br />
					<span className='kamers datestring'>
						{new Date().toLocaleDateString("nl-NL", {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})}
					</span>
				</div>
			</div>
		);
	}
}
