import React, { Component } from "react";
import { getCookie } from '../include/util_functions';
import "../css/modal.css";

export class AgendaItemsModal extends Component {
  static displayName = "AgendaItemsModal";

  constructor(props) {
    super(props);

    this.state = {
      title: "In de loods",
      note: "",
      date: "",
      roomID: "",
      accountsid: Number.parseInt(getCookie("user")),
      status: "in",
    };
  }

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    const tsParam = params.get("ts");
	// const tsEnd = new Date(Number.parseInt(tsParam)).setHours(23,59,59,999).valueOf().toString();
    this.setState({accountsid: userParam, date: tsParam});
    try {
      const response = await fetch("rooms");
      const rooms = await response.json();
      console.log("Fetched rooms:", rooms);
      this.setState({ rooms: rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { title, note, date, roomID, accountsid, status } = this.state;

    const fetchURL = "agendaitems";

    try {
      const response = await fetch(fetchURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          note,
          date,
          roomID,
          accountsid,
          status,
        }),
      });

	  console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Continue with your success handling
      if (data.id > 0 || data.success === true) {
        console.log("Done");
        this.props.onClose();
		window.location.replace("agenda");
      } else {
        // Handle form validation errors or other issues
        console.log(data);
      }
    } catch (e) {
      console.error("Error: ", e.message);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-field-div">
          <label
            htmlFor="title"
            className="input-field-label"
          >
            Titel:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="input-field"
            value={this.state.title}
            onChange={this.handleInputChange}
          />
        </div>

        <div className="input-field-div">
          <label
            htmlFor="note"
            className="input-field-label"
          >
            Beschrijving:
          </label>
          <input
            type="text"
            id="note"
            name="note"
            className="input-field"
            value={this.state.note}
            onChange={this.handleInputChange}
          />
        </div>

        <div className="input-field-div">
          <label
            htmlFor="date"
            className="input-field-label"
          >
          </label>
          <input
            type="hidden"
            id="sate"
            name="date"
            className="input-field"
            value={this.state.date}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="input-field-div">
          <label
            htmlFor="roomID"
            className="input-field-label"
          >
            Kamer:
          </label>
          <select
            id="roomID"
            name="roomID"
            className="input-field"
            value={this.state.roomID}
            onChange={this.handleInputChange}
          >
            <br/>
            <option value="" disabled>
              Selecteer een kamer
            </option>
            {this.state.rooms &&
              this.state.rooms.map((room) => (
                <option key={room.RoomsID} value={room.RoomsID}>
                  {room.Name}
                </option>
              ))}
          </select>
        </div>

        <input
          className="save-button"
          type="submit"
          value="Opslaan & Sluiten"
        />
      </form>
    );
  }
}
