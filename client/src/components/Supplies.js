import React, { Component } from 'react';

export class Supplies extends Component {
    static displayName = Supplies.name;

	constructor(props) {
		super(props);

		this.state = {data: []};
	}

	componentDidMount() {
		this.getSupplies();
	}

	/**
	 * Om de data van alle voorzieningen op te halen.
	 *
	 * @returns {void}
	 */
	async getSupplies() {
		const response = await fetch("supplies");
		const data = await response.json();
		this.setState({data: data});
	}

    render() {
        return (
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>#&emsp;ID</th>
							<th>Naam</th>
							<th>Totaal aantal</th>
							<th>Vandaag gebruikt</th>
						</tr>
					</thead>
					<tbody>
						{this.state.data.map(supply => 
							<tr>
								<td>{supply.SuppliesID}</td>
								<td>{supply.Name}</td>
								<td>{supply.Total}</td>
								<td>0</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
        );
    }
}
