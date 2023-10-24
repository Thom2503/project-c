import React, { Component } from 'react';
import '../css/voorzieningen.css';

export class SupplyModal extends Component {
    static displayName = SupplyModal.name;

	constructor(props) {
		super(props);
		this.state = {name: "", total: 0, deleteSupply: false, supply: 0};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const params = new URLSearchParams(window.location.search);
		if (params.size >= 1) {
			const paramID = params.get("id");
			this.fetchSupplyData(paramID);
		}
	}

	handleChange(event) {
		if (event.target.name === "deleteSupply") {
			this.setState({[event.target.name]: event.target.checked});
		} else {
			this.setState({[event.target.name]: event.target.value});
		}
	}

	async handleSubmit(event) {
		event.preventDefault();

		const name = this.state.name;
		const total = this.state.total;

		const fetchURL = this.state.supply > 0 || this.state.deleteSupply === true
		               ? `supplies/${this.state.supply}`
		               : "supplies";

		// name en total mogen niet leeg zijn
		// TODO: form validatie toevoegen voor als het fout gaat
		if (name.trim() === "") return;
		if (total <= 0) return;

		try {
			const response = await fetch(fetchURL, {
				method: this.state.deleteSupply === true ? "DELETE" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({name: name, total: total}),
			});
			const data = await response.json();
			// als er een id terug is -- dus successvol opgeslagen -- kan je naar het overzicht terug.
			if (data.id > 0 || data.success === true) {
				window.location.replace("voorzieningen");
			} else {
				// TODO: form validatie toevoegen voor als het fout gaat.
				console.log(data);
			}
		} catch(e) {
			console.error("Error: ", e.message);
		}
	}

	async fetchSupplyData(supplyID) {
		try {
			const response = await fetch(`supplies/${supplyID}`);
			const data = await response.json();
			console.log(data);

			if (data) this.setState({name: data.Name, total: data.Total, supply: data.SuppliesID});
		} catch(e) {
			console.error("Error: ", e.message);
		}

	}

    render() {
        return (
            <div className='modal'>
				<h2>Voorziening Toevoegen</h2>
				<div className='modal-content'>
					<div className='outer-close-icon'>
						<div className='close-icon'>x</div>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div>
							<label htmlFor="supplyName">Naam:</label>
							<input type="text"
			                       id="supplyName"
			                       name="name"
			                       value={this.state.name}
			                       onChange={this.handleChange}
			                       required
			                />
						</div>
						<div>
							<label htmlFor="supplyTotal">Totaal:</label>
							<input type="number"
			                       id="supplyTotal"
			                       name="total"
			                       value={this.state.total}
			                       onChange={this.handleChange}
			                       required
			                />
						</div>
						<div>
							<label htmlFor="supplyDelete">Delete:</label>
							<input type="checkbox"
			                       id="supplyDelete"
			                       name="deleteSupply"
			                       value={this.state.deleteSupply}
			                       onChange={this.handleChange}
			                />
						</div>
						<input type="submit" value="Opslaan" />
					</form>
				</div>
			</div>
        );
    }
}
