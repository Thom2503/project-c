import React, { Component } from "react";
import { ModalContent } from "./ModalContent";

export class BaseModal extends Component {
  static displayName = BaseModal.name;

  constructor(props) {
    super(props);
    this.state = {
      userParam: "",
      tsParam: "",
      deleteSupply: false,
      title: "testtitle",
      total: "testtotal",
      startdate: "teststartdate",
      enddate: "testenddate",
      location: "testlocation",
      accountsid: "1",
      status: "teststatus",
    };
  }

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    const tsParam = params.get("ts");

    this.setState({ userParam, tsParam });
    try {
      const response = await fetch("rooms");
      const rooms = await response.json();
      console.log("Fetched rooms:", rooms);
      this.setState({ rooms: rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const title = this.state.title;
    const note = this.state.total;
    const startdate = this.state.startdate;
    const enddate = this.state.enddate;
    const location = this.state.location;
    const accountsid = this.state.accountsid;
    const status = this.state.status;

    const fetchURL =
      this.state.supply > 0 || this.state.deleteSupply === true
        ? `agendaitems/${this.state.supply}`
        : "agendaitems";

    try {
      const response = await fetch(fetchURL, {
        method: this.state.deleteSupply === true ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          note: note,
          startdate: startdate,
          enddate: enddate,
          location: location,
          accountsid: accountsid,
          status: status,
        }),
      });
      const data = await response.json();
      // als er een id terug is -- dus successvol opgeslagen -- kan je naar het overzicht terug.
      if (data.id > 0 || data.success === true) {
        //window.location.replace("voorzieningen");
        console.log("Done");
      } else {
        // TODO: form validatie toevoegen voor als het fout gaat.
        console.log(data);
      }
    } catch (e) {
      console.error("Error: ", e.message);
    }
  };

  render() {
    if (!this.props.isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="outer-close-icon">
            <div className="close-icon" onClick={this.props.onClose}></div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <ModalContent
              userName={this.state.userParam}
              timestamp={this.state.tsParam}
              rooms={this.state.rooms}
            />
            <input
              className="save-button"
              type="submit"
              value="Opslaan & Sluiten"
            />
          </form>
        </div>
      </div>
    );
  }
}
