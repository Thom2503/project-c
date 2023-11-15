import React, { Component } from 'react';

export class AgendaRow extends Component {
	static displayName = AgendaRow.name;

	constructor(props) {
		super(props);
		this.state = {cells: this.getUserData(), user: props.user, name: props.name};
	}
	
	/**
	 * Method om de specifieke data van de gebruiker te krijgen van deze week.
	 *
	 * @returns {Array} - agenda items van deze gebruiker
	 */
	getUserData() {
		// bij de lijst moet nog datum komen
		return [
			{status: "In de loods", isOut: false, ts: 1696356620},
			{status: "Uit de loods", isOut: true, ts: 1696356620},
			{status: "In de loods", isOut: false, ts: 1696356620},
			{status: "In de loods", isOut: false, ts: 1696356620},
			{status: "Uit de loods", isOut: true, ts: 1696356620},
			{status: "", isOut: false, ts: 1696356620},
			{status: "In de loods", isOut: false, ts: 1696356620},
		];
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