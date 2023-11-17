import React, { Component } from 'react';

export class AgendaRow extends Component {
	static displayName = AgendaRow.name;

	constructor(props) {
		super(props);
		this.state = {cells: [], user: props.user, name: props.name, begin: props.beginTS};
	}

	componentDidMount() {
		this.getUserData();
	}

	/**
	 * Bereken het absolute nieuwe dag, en return de timestamp
	 *
	 * @param {int} i - welk dag nummer van de week er bij moet
	 *
	 * @returns {int} newDateTS - de timestamp van de "volgende" dag
	 */
	getNextDay(i) {
		let beginDate = new Date(this.state.begin);
		let newDate = beginDate.setDate(beginDate.getDate() + i);
		newDate = beginDate.setHours(0, 0, 0, 0);
		let newDateTS = newDate.valueOf();
		return newDateTS;
	}
	
	/**
	 * Method om de specifieke data van de gebruiker te krijgen van deze week.
	 *
	 * @returns {Array} - agenda items van deze gebruiker
	 */
	async getUserData() {
		let returnArr = []
		const response = await fetch(`useritems/${this.state.user}`);
		const data = await response.json().then(res => { return typeof(res.error) == "string" ? false : res; });
		// als er geen data is gevonden van de gebruiker moet er een standaard lege agenda zijn
		if (data === false) {
			for (let i = 0; i < 7; i++) {
				let newDateTS = this.getNextDay(i);
				let obj = {status: "", isOut: false, ts: newDateTS};
				returnArr.push(obj);
			}
		} else {
			// de agenda items die uiteindelijk getoont worden
			let items = [];
			// om bij te houden dat je maar zeven dagen krijgt
			let count = 0;
			for (let item of data) {
				// stop bij 7 dagen
				if (count === 6) break;
				// als de item waar de date hoger is dan de start date dan kan je beginnen met
				// tellen en toevoegen voor deze week
				if (Number.parseInt(item.Date) >= this.state.begin) {
					items.push(item);
					count++;
				}
			}
			// maak de items van de week door 7 keer te loopen
			for (let i = 0; i < 7; i++) {
				// zoek de volgende dag om te vergelijken met de datum die staat in de database
				let newDateTS = this.getNextDay(i);
				// standaard waardes
				let status = "";
				let isOut = false;
				// zoek een item in items, als die er is return dan de eerste item van de lijst zodat die gebruikt
				// kan worden voor cell data
				let item = items.filter(it => {
					return Number.parseInt(it.Date) === newDateTS;
				})[0];
				// als er een item is gevonden schrijf dan de standaard data over met de nieuwe data
				if (item) {
					// de status is de title
					status = item.Title;
					// of je eruit met dus niet in de loods is de status niet "in"
					isOut = item.Status !== "in";
				}
				let obj = {status: status, isOut: isOut, ts: newDateTS};
				returnArr.push(obj);
			}
		}
		this.setState({cells: returnArr});
	}

	/**
	 * Method om de kleuren van een cell te bepalen, groen voor er in, wit voor geen data,
	 * rood voor niet in de loods
	 * 
	 * @param {Array} cell - de cell data 
	 * @returns {string}   - hsla waarde van de kleur
	 */
	getCellColour(cell) {
		// als je uit de loods bent moet het rood zijn
		if (cell.isOut === true) {
			return "hsla(0, 70%, 53%, 0.75)";
		// als je er wel in bent en een status hebt aangegeven,
		// dan moet het groen zijn
		} else if (cell.isOut === false && cell.status !== "") {
			return "hsla(126, 90%, 35%, 0.75)";
		// als er geen waarde is moet het gewoon wit zijn.
		} else {
			return "hsla(0, 0%, 100%, 1)";
		}
	}

	render() {
		return (
			<tr>
				<td className="fixed">{this.state.name}</td>
				{this.state.cells.map(cell =>
					<td key={cell.ts} style={{backgroundColor: this.getCellColour(cell)}}>
						<a href={`agenda?modal=1&user=${this.state.user}&ts=${cell.ts}`}>
							{cell.status ?? "&nbsp;"}
						</a>
					</td>
					//<AgendaCell />
				)}
			</tr>
		);
	}
}