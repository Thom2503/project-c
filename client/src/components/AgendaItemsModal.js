import React, { Component } from "react";
import "../css/modal.css";

class AgendaItemsModal extends Component {
  static displayName = "AgendaItemsModal";

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      note: "",
      date: "",
      roomID: "",
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

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { title, note, date, roomID, accountsid, status } =
      this.state;

    const fetchURL = `agendaitems`;

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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Continue with your success handling
      if (data.id > 0 || data.success === true) {
        console.log("Done");
        this.props.onClose();
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
        <div className="inputfield">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            Titel:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.title}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="inputfield">
          <label
            htmlFor="note"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            Beschrijving:
          </label>
          <input
            type="text"
            id="note"
            name="note"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.note}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="inputfield">
          <label
            htmlFor="date"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            Start Date:
          </label>
          <input
            type="text"
            id="sate"
            name="date"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.date}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="inputfield">
          <label
            htmlFor="roomID"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            Kamer:
          </label>
          <select
            id="roomID"
            name="roomID"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.roomID}
            onChange={this.handleInputChange}
            required
          >
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

export default AgendaItemsModal;
