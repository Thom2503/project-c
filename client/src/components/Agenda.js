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
			<>
				<div className="tableDiv">
					<table className='tableCss'>
						<tbody>
						<tr>
							<th>&nbsp;</th>
							{this.state.weekDays.map((day, index) =>
								<th key={index}>
									{day}
								</th>
							)}
						</tr>
						</tbody>
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
			</>
		);
	}

}