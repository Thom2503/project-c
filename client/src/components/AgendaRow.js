import React, { Component } from 'react';
import {getNextDay} from '../include/util_functions';

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
	 * Method om de specifieke data van de gebruiker te krijgen van deze week.
	 *
	 * @returns {Array} - agenda items van deze gebruiker
	 */
	async getUserData() {
		let returnArr = []
		// pak de timestamp van het einde van de week, weken beginnen bij 0 vandaar de 6 en niet 7
		// om de range te bepalen om op te filteren
		const endOfWeek = getNextDay(this.state.begin, 6);
		const response = await fetch(`useritems/${this.state.user}/${this.state.begin}/${endOfWeek}`);
		const data = await response.json().then(res => { return typeof(res.error) == "string" ? false : res; });
		// als er geen data is gevonden van de gebruiker moet er een standaard lege agenda zijn
		if (data === false) {
			for (let i = 0; i < 7; i++) {
				let newDateTS = getNextDay(this.state.begin, i);
				let obj = {status: "", isOut: false, ts: newDateTS, id: ""};
				returnArr.push(obj);
			}
		} else {
			// maak de items van de week door 7 keer te loopen
			for (let i = 0; i < 7; i++) {
				// zoek de volgende dag om te vergelijken met de datum die staat in de database
				const newDateTS = getNextDay(this.state.begin, i);
				// bepaal de default waardes om in een cel te doen
				const defaultVals = { Title: "", isOut: false, Status: "out", ID: "" };;
				// zoek een agenda item op basis van de datum om in de cel te stoppen, als undefined kan je de default
				// waardes pakken
				const item = data.find((d) => d.Date == newDateTS) || defaultVals;
				// maak de object die uiteindelijk in de cel komt te staan
				const obj = { status: item.Title, isOut: item.Status !== "in" && item.Title !== "", ts: newDateTS, id: item.ID };
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

	onClickHref(cell) {
		window.location.replace(`agenda?modal=1&id=${cell.id}&user=${this.state.user}&ts=${cell.ts}`);
	}

	render() {
		return (
			<tr>
				<td className={'accountName'}><span>{this.state.name}</span></td>
				{this.state.cells.map(cell =>
					<td className={'hoverTd'} onClick={() => this.onClickHref(cell)} key={cell.ts} style={{backgroundColor: this.getCellColour(cell), cursor: "pointer"}}>
						{cell.status ?? "&nbsp;"}
					</td>
				)}
			</tr>
		);
	}
}