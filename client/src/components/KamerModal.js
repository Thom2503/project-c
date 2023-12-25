import React, { Component } from "react";
import { toast } from "react-toastify";
import "../css/voorzieningen.css";

export class KamerModal extends Component {
  static displayName = KamerModal.name;

  constructor(props) {
    super(props);
    this.state = { 
        name: "",
        capacity: 0,
        deleteRoom: false,
        room: 0,
        formValidation: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const roomid = Number.parseInt(params.get("id"));
    // check if a accountid is given via url
    if (!Number.isNaN(roomid)) {
        this.fetchRoomData(roomid);
    }
  }

  handleChange(event) {
    if (event.target.name === "deleteRoom") {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const name = this.state.name;
    const capacity = this.state.capacity;

    // Form Validation
    const formValidation = [];

    if (name.length > 32) formValidation.push('Naam is te lang, maximale lengte is 32');
    if (capacity <= 0) formValidation.push('Het Capaciteit van een kamer kan niet 0 of minder zijn');
    if (formValidation.length > 0) {
      this.setState({ formValidation });
      return;
    }

    const fetchURL =
    Number.parseInt(this.state.room) > 0 || this.state.deleteRoom === true
        ? `rooms/${this.state.room}`
        : "rooms";

    try {
      const response = await fetch(fetchURL, {
        method: this.state.deleteRoom === true ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          Name: name, 
          Capacity: capacity
        }),
      });
      const data = await response.json();
      if (data.id > 0 || data.success === true) {
        this.props.onClose();
      } else {
        console.log(data);
        toast.error("Er is iets fout gegaan waardoor er niets veranderd is.");
      }
    } catch (e) {
      console.error("Error: ", e.message);
      toast.error("Er is een onverwachtte fout gevonden.");
    }
  }

  async fetchRoomData(roomID) {
    const response = await fetch(`room/${roomID}`);
    const data = await response.json();
    console.log(data);

    if (data) {
        this.setState({
            name: data.Name,
            capacity: data.Capacity,
            room: data.RoomsID,
        });
    }
  }

  render() {
    return (
      <div className="modal">
        <h2>Kamers Toevoegen</h2>
        <div className="modal-content">
          <form onSubmit={this.handleSubmit}>
            <div className="input-field-div">
              <label htmlFor="roomsName" className="input-field-label">Naam:</label>
              <input
                type="text"
                id="roomName"
                name="name"
                className="input-field"
                value={this.state.name}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="input-field-div">
              <label htmlFor="capacity" className="input-field-label">Capaciteit:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                className="input-field"
                value={this.state.capacity}
                onChange={this.handleChange}
                required
              />
            </div>
            {Number.parseInt(this.state.room) > 0 && (
              <div className="input-field-div">
                <label htmlFor="deleteRoom" >Delete:</label>
                <input
                  type="checkbox"
                  id="deleteRoom"
                  name="deleteRoom"
                  value={this.state.deleteRoom}
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
