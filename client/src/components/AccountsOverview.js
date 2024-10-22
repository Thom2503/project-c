import React, { Component } from 'react';
import { getCookie } from '../include/util_functions';
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class AccountsOverview extends Component {
	static displayName = AccountsOverview.name;

	constructor(props) {
		super(props);
		this.state = {data: []};
		document.title = "AccountsOverview";
	}

	componentDidMount() {
		this.getAccounts();
	}

	/**
	 * Om de data van alle Accounts op te halen.
	 *
	 * @returns {void}
	 */
	async getAccounts() {
		const response = await fetch("accounts");
		const data = await response.json();
		if (data.error) {
			this.setState({data: ["No data found"]});
		} else {
			this.setState({data: data});
		}
	}

	onClickHref(account) {
		window.location.replace(`AccountsOverview?modal=4&id=${account.AccountsID}`);
	}

	render() {
		// als je geen admin bent mag je niet naar deze pagina
		if (getCookie("isadmin") !== "true") window.location.replace("agenda");
		return (
			<div id='voorzieningen'>
				<div className='under-header'>
					<h2>AccountsOverview</h2>
					<span className='add'><a href='AccountsOverview?modal=4'>Account Toevoegen <FontAwesomeIcon icon={faCirclePlus}/></a></span>
					&nbsp;
				</div>
				<div className="table-wrapper">
					<table>
						<thead>
						<tr>
							<th>#&emsp;ID</th>
							<th>Voor-en achternaam</th>
							<th>Functie</th>
							<th>Admin</th>
							<th>Email</th>
						</tr>
						</thead>
						<tbody>
						{this.state.data.map(account =>
							<tr key={account.AccountsID}>
								<td onClick={() => this.onClickHref(account)} style={{cursor: "pointer"}}>
									{account.AccountsID}
								</td>
								<td>{account.FirstName} {account.LastName}</td>
								<td>{account.Function}</td>
								<td>{Number.parseInt(account.IsAdmin) === 1 ? "Ja" : "Nee"}</td>
								<td>{account.Email}</td>
							</tr>
						)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
