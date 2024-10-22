import React, { Component } from 'react';
import { getCookie, getFirstDayTimeStamp, getNextDay } from '../include/util_functions';
import '../css/voorzieningen.css';
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class Supplies extends Component {
    static displayName = Supplies.name;

	constructor(props) {
		super(props);
		this.state = {data: [], today: getNextDay(getFirstDayTimeStamp(), new Date().getDay()), usedData: []};
		document.title = "Voorzieningen";
	}

	componentDidMount() {
		this.getSupplies();
		this.getUsedSupplies();
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

	async getUsedSupplies() {
		const response = await fetch(`usersupplies/ts${this.state.today.toString()}`);
		const data = await response.json();
		if (data.error) {
			this.setState({usedData: []});
		} else {
			this.setState({usedData: data});
		}
	}

    render() {
		// om vandaag de dag aan te geven
		const date = new Date().toLocaleDateString("nl-NL", {day: 'numeric', month: 'short', year: 'numeric'});
		// als je geen admin bent mag je niet naar deze pagina
		if (getCookie("isadmin") !== "true") window.location.replace("agenda");
        return (
			<div id='voorzieningen'>
				<div className='under-header'>
					<h2>Voorzieningen</h2>
					<div className='flex flex-row gap-5'>
						<span className='add'><a href='voorzieningen?modal=2'>Voorziening Toevoegen <FontAwesomeIcon
							icon={faCirclePlus}/></a></span>
						&nbsp;
						<span className='date-picker'>
						<a href='voorzieningen?pick-date'>
							{date}
						</a>
					</span>
					</div>
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
								<tr key={supply.SuppliesID || 'Empty-Row'}>
									<td onClick={() => this.onClickHref(supply)} style={{cursor: "pointer"}}>
										{supply.SuppliesID}
									</td>
									<td>{supply.Name}</td>
									<td>{supply.Total}</td>
									<td>{this.state.usedData.find(s => s.SupplyID === supply.SuppliesID)?.C ?? 0}</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
        );
    }
}
