import React, { Component } from 'react';
import { AgendaRow } from './AgendaRow';
import '../css/custom.css';
import {getFirstDayTimeStamp, getNextDay} from '../include/util_functions';

export class Agenda extends Component {
	static displayName = Agenda.name;

	constructor(props) {
		super(props);
		this.state = {weekDays: this.convertDates(), users: []};
		document.title = Agenda.displayName;
	}

	componentDidMount() {
		this.getUserData();
	}

	/**
	 * Maak een lijst van alle dagen van deze week.
	 * @returns {Array} week - de dagen van deze week
	 */
	getWeekDays() {
		let firstDay = getFirstDayTimeStamp();
		let week = [];
		for (let i = 0; i < 7; i++) {
			let nextDay = getNextDay(firstDay, i);
			week.push(nextDay);
		}
		return week;
	}

	/**
	 * Functie om alle data te converten naar een fatsoenlijk datum die makkelijk te
	 * lezen is.
	 * 
	 * @returns {Array} - array met de goede data
	 */
	convertDates() {
		return this.getWeekDays().map((day) => {
			console.log(day);
			let date = new Date(day);
			return date.toLocaleDateString("nl-NL", { year: 'numeric', month: 'short', day: 'numeric' });
		});
	}

	/**
	 * Om alle gebruikers te krijgen zodat het een dynamische agenda is.
	 */
	async getUserData() {
		const response = await fetch("accounts");
		const data = await response.json();
		this.setState({users: data});
	}

	render() {
		return (
			<div className="agenda table-wrapper">
				<table className='agenda'>
					<thead>
						<tr>
							<th className="fixed">&nbsp;</th>
							{this.state.weekDays.map((day, index) => 
								// de <a> tag om {day} is heel hacky maar het zorgt er voor
								// dat het op mobile er goed uit ziet dus moet het er helaas
								// staan, het feit dat er geen href in staat is niet erg geeft wel een
								// warning maar die moet voor nu genegeerd worden
								<th key={index}>
									<a style={{color: "#8A8A8A"}}>{day}</a>
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{this.state.users.map(user =>
							<AgendaRow key={user.AccountsID}
							           name={`${user.FirstName} ${user.LastName}`}
							           beginTS={getFirstDayTimeStamp()}
							           user={user.AccountsID} 
							/>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}