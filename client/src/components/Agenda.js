import React, { Component } from 'react';
import { AgendaRow } from './AgendaRow';
import '../css/custom.css';
//class AgendaCell extends Component {
//    render() {
//        <div>this.props.status</div>
//    }
//}

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
		let currentDateObj = new Date(new Date().getTime());
		let week           = [];
		for (let i = 0; i < 7; i++) {
			let currentDate = currentDateObj.getDate();
			let currentDay  = currentDateObj.getDay();
			let first = currentDate - currentDay + i;
			let day   = new Date(currentDateObj.setDate(first)).toISOString().slice(5, 10);
			week.push(day);
		}
		return week;
	}

	/**
	 * Zoek de timestamp van de eerste dag van deze week
	 *
	 * @returns {int} today - de timestamp van de eerste dag
	 */
	getFirstDayTimeStamp() {
		let today = new Date();
		let dayOfWeek = today.getDay();
		let daysUntilSun = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
		let firstDay = new Date(today);
		firstDay.setDate(today.getDate() + daysUntilSun);
		firstDay.setHours(0, 0, 0, 0);
		return firstDay.getTime();
	}

	/**
	 * Functie om een maand nummer te converten naar een naam, dus 10 -> okt enz.
	 * 
	 * @param {int} monthNumber - het nummer van de maand om te converten 
	 * @returns 
	 */
	getMonthName(monthNumber) {
		const monthNames = [
			"Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
		];
		return monthNames[monthNumber - 1];
	}

	/**
	 * Functie om alle data te converten naar een fatsoenlijk datum die makkelijk te
	 * lezen is.
	 * 
	 * @returns {Array} - array met de goede data
	 */
	convertDates() {
		return this.getWeekDays().map((day) => {
			const month  = day.split("-")[0];
			const dayNum = day.split("-")[1];
			return `${dayNum} ${this.getMonthName(month)} ${new Date().getFullYear()}`;
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
							           beginTS={this.getFirstDayTimeStamp()}
							           user={user.AccountsID} 
							/>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}