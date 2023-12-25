import React, { Component } from "react";
import "../css/voorzieningen.css";
import { toast } from 'react-toastify';

export class SupplyModal extends Component {
  static displayName = SupplyModal.name;

  constructor(props) {
    super(props);
    this.state = { name: "", total: 0, deleteSupply: false, supply: 0, formValidation: [] };

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
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const name = this.state.name;
    const total = this.state.total;

    // Form Validation
    const formValidation = [];

    if (name.length > 32) formValidation.push('Naam is te lang, maximale lengte is 32');
    if (total <= 0) formValidation.push('Het totaal van een voorziening kan niet 0 of minder zijn');
    if (formValidation.length > 0) {
      this.setState({ formValidation });
      return;
    }
    

    const fetchURL =
      this.state.supply > 0 || this.state.deleteSupply === true
        ? `supplies/${this.state.supply}`
        : "supplies";

    try {
      const response = await fetch(fetchURL, {
        method: this.state.deleteSupply === true ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, total: total }),
      });
      const data = await response.json();
      // als er een id terug is -- dus successvol opgeslagen -- kan je naar het overzicht terug.
      if (data.id > 0 || data.success === true) {
        window.location.replace("voorzieningen");
      } else {
        console.log(data);
        toast.error("Er was wat fout er is niks veranderd.");
      }
    } catch (e) {
      console.error("Error: ", e.message);
      toast.error("Er is een onverwachtte fout gevonden.");
    }
  }

  async fetchSupplyData(supplyID) {
    try {
      const response = await fetch(`supplies/${supplyID}`);
      const data = await response.json();

      if (data)
        this.setState({
          name: data.Name,
          total: data.Total,
          supply: data.SuppliesID,
        });
    } catch (e) {
      console.error("Error: ", e.message);
      toast.error("Data van de voorzieningen kan niet gevonden worden.");
    }
  }

  render() {
    return (
      <div className="modal">
        <h2>Voorziening Toevoegen</h2>
        <div className="modal-content">
          <form onSubmit={this.handleSubmit}>
            <div className="input-field-div">
              <label htmlFor="supplyName" className="input-field-label">Naam:</label>
              <input
                type="text"
                id="supplyName"
                name="name"
                className="input-field"
                value={this.state.name}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="input-field-div">
              <label htmlFor="supplyTotal" className="input-field-label">Totaal:</label>
              <input
                type="number"
                id="supplyTotal"
                name="total"
                className="input-field"
                value={this.state.total}
                onChange={this.handleChange}
                required
              />
            </div>
            {Number.parseInt(this.state.room) > 0 && (
              <div className="input-field-div">
                <label htmlFor="supplyDelete" >Delete:</label>
                <input
                  type="checkbox"
                  id="supplyDelete"
                  name="deleteSupply"
                  value={this.state.deleteSupply}
                  onChange={this.handleChange}
                />
              </div>
            )}

            {this.state.formValidation.length > 0 && (
              <div className="validation-errors input-field-div">
                {this.state.formValidation.map((error, index) => (
                  <div key={index} className="error">
                    {error}
                  </div>
                ))}
              </div>
            )}

            <input type="submit" value="Opslaan" className="save-button"/>
          </form>
        </div>
      </div>
    );
  }
}
