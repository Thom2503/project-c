import React, { Component } from 'react';
import '../css/voorzieningen.css';

export class Supplies extends Component {
    static displayName = Supplies.name;

	constructor(props) {
		super(props);
		this.state = {data: []};
		document.title = "Voorzieningen";
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
		// om vandaag de dag aan te geven
		const currentDate = new Date();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
			<div id='voorzieningen'>
				<div className='under-header'>
					<h2>Voorzieningen</h2>
					<span className='add'><a href='supply-toevoegen'>Voorziening Toevoegen</a></span>
					&nbsp;
					<span className='date-picker'>
						<a href='voorzieningen?pick-date'>
							{`${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
						</a>
					</span>
				</div>
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
									<td>
										<a href={`supply-toevoegen?id=${supply.SuppliesID}`}>
											{supply.SuppliesID}
										</a>
									</td>
									<td>{supply.Name}</td>
									<td>{supply.Total}</td>
									<td>0</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
        );
    }
}
