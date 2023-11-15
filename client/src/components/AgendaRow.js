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
	 * Method om de specifieke data van de gebruiker te krijgen van deze week.
	 *
	 * @returns {Array} - agenda items van deze gebruiker
	 */
	async getUserData() {
		let returnArr = []
		const response = await fetch(`agendaitems/${this.state.user}`);
		console.log(response.body);
		const data = await response.json()
		                           .catch(_ => {
			for (let i = 0; i < 7; i++) {
				let newDate = new Date(this.state.begin).setHours(24 * i).valueOf();
				let obj = {status: "", isOut: false, ts: newDate};
				returnArr.push(obj);
			}
		});
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
					<td style={{backgroundColor: this.getCellColour(cell)}}>
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