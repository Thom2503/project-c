import React, { Component } from 'react';
import { getCookie } from '../include/util_functions';
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
		if (data.error) {
			this.setState({data: ["No data found"]});
		} else {
			this.setState({data: data});
		}
	}

	onClickHref(supply) {
		window.location.replace(`voorzieningen?modal=2&id=${supply.SuppliesID}`);
	}

    render() {
		// om vandaag de dag aan te geven
		const currentDate = new Date();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// als je geen admin bent mag je niet naar deze pagina
		if (getCookie("isadmin") !== "true") window.location.replace("agenda");
        return (
			<div id='voorzieningen'>
				<div className='under-header'>
					<h2>Voorzieningen</h2>
					<span className='add'><a href='voorzieningen?modal=2'>Voorziening Toevoegen</a></span>
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
									<td onClick={() => this.onClickHref(supply)} style={{cursor: "pointer"}}>
										{supply.SuppliesID}
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
