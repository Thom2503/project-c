import React, { Component } from "react";
import { getCookie } from "../include/util_functions";
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
      accountsid: "",
      currentaccountsid: Number.parseInt(getCookie("user")),
      status: "in",
      agenda: "",
      deleteAgenda: false,
      supplies: [],
      userSupplies: [],
      selectExpanded: false,
    };
  }

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const userParam = Number.parseInt(params.get("user"));
    const tsParam = params.get("ts");
    const agendaitemid = Number.parseInt(params.get("id"));
    this.setState({
      accountsid: userParam,
      date: tsParam,
      agenda: agendaitemid,
    });

    // check if a agendaitemid is given via url
    if (!Number.isNaN(agendaitemid)) {
      this.fetchAgendaData(agendaitemid);
    }

    try {
      const response = await fetch("rooms");
      const rooms = await response.json();
      this.setState({ rooms: rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }

	this.getAllSupplies();
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;

    // inplaats van een nieuwe functie voor de status button wordt de waarde zo aangepast
    if (name === "status") {
      updatedValue = value.toLowerCase();
      // titel wordt nu verandert zodat de gebruiker dat niet zelf hoeft te doen
      if (updatedValue === "in") {
        this.setState({ title: "In de loods" });
      } else {
        this.setState({ title: "Uit de loods" });
      }
    }

	if (name === "usersupplies") {
		let options = event.target.options;
		let selectedOpts = [...this.state.userSupplies];
		for (let i = 0; i < options.length; i++) {
			const opt = options[i];
			const optID = opt.id;
			if (opt.selected && !selectedOpts.includes(optID) && !this.state.userSupplies.includes(optID)) {
				selectedOpts.push(optID);
			}
		}
		this.setState({userSupplies: selectedOpts});
	}

    // checkbox logic
    if (name === "deleteAgenda") {
      this.setState({ [name]: event.target.checked });
    } else {
      this.setState({ [name]: updatedValue });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { title, note, date, roomID, accountsid, status } = this.state;

    // change url for updating or deleting
    const fetchURL =
      !Number.isNaN(this.state.agenda) || this.state.deleteAgenda === true
        ? `agendaitems/${this.state.agenda}`
        : "agendaitems";

    try {
      const response = await fetch(fetchURL, {
        method: this.state.deleteAgenda === true ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          note,
          date,
          roomID,
          accountsid,
          status
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
	  let d = null;
	  if (this.state.userSupplies.length > 0) {
	  	let d = this.postUserSupplies();
		setTimeout(() => console.log("...."), 200);
	  }

      // Continue with your success handling
      if (data.id > 0 || data.success === true || d.success === true) {
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

  async fetchAgendaData(agendaItemID) {
    const response = await fetch(`agendaitems/${agendaItemID}`);
    const data = await response.json();

    if (data) {
      this.setState({
        title: data.Title,
        note: data.Note,
        roomID: data.roomID,
        status: data.Status,
      });
    }
  }

  async getAllSupplies() {
	const response = await fetch("supplies");
	const data = await response.json();

	if (!data.error) {
		this.setState({supplies: data});
	}
  }

	async postUserSupplies() {
		const response = await fetch("usersupplies", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				supplies: this.state.userSupplies,
				itemid: this.state.agenda,
				date: this.state.date
			}),
		});

		const data = await response.json();
		return data;
	}

  render() {
    //show the modal that you can change and fill only for the appropriate user
    if (this.state.accountsid === this.state.currentaccountsid) {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="time-div">
            {this.state.date &&
              new Date(parseInt(this.state.date)).toLocaleDateString("nl-NL")}
          </div>

          <div className="status-div">
            <input
              type="button"
              id="status"
              name="status"
              className={`status-field ${
                this.state.status === "in" && "selected"
              }`}
              value="In"
              onClick={this.handleInputChange}
            />

            <input
              type="button"
              id="status"
              name="status"
              className={`status-field ${
                this.state.status === "uit" && "selected"
              }`}
              value="Uit"
              onClick={this.handleInputChange}
            />
          </div>

          <div className="input-field-div">
            <label htmlFor="title" className="input-field-label">
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
            <label htmlFor="note" className="input-field-label">
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
            <label htmlFor="roomID" className="input-field-label">
              Kamer:
            </label>
            <select
              id="roomID"
              name="roomID"
              className="input-field"
              value={this.state.roomID}
              onChange={this.handleInputChange}
            >
              <option value="" disabled>
                Selecteer een kamer
              </option>
              {this.state.rooms &&
                this.state.rooms.map((room) => (
                  <option key={room.RoomsID} value={room.RoomsID} selected={room.RoomsID === this.state.roomID}>
                    {room.Name}
                  </option>
                ))}
            </select>
          </div>
		  {this.state.supplies && (
		  <div className="input-field-div">
		  	<label htmlFor="supplies" className="input-field-label">Voorzieningen:</label>
			<select id="supplies" name="usersupplies" className="input-field" onChange={this.handleInputChange} multiple={true}>
			{this.state.supplies.map((supply) => (
				<option key={supply.SuppliesID} id={supply.SuppliesID} value={supply.SuppliesID}>
					{supply.Name} - {supply.Total} totaal
				</option>
			))}
			</select>
		  </div>
		  )}

          <div className="input-field-div">
            <label htmlFor="agendaDelete">Delete:</label>
            <input
              type="checkbox"
              id="agendaDelete"
              name="deleteAgenda"
              value={this.state.deleteAgenda}
              onChange={this.handleInputChange}
            />
          </div>

          <input
            className="save-button"
            type="submit"
            value="Opslaan & Sluiten"
          />
        </form>
      );
    } /* only show the data of the filled in agendaitem */ else {
      // filter that only shows the selected room
      const filteredRooms = this.state.rooms
        ? this.state.rooms.filter((room) => room.RoomsID === this.state.roomID)
        : [];

      return (
        <form>
          <div className="time-div">
            {this.state.date &&
              new Date(parseInt(this.state.date)).toLocaleDateString("en-GB")}
          </div>

          <div className="status-div">
            <input
              type="button"
              className={`status-field ${
                this.state.status === "in" && "selected"
              }`}
              value="In"
            />

            <input
              type="button"
              className={`status-field ${
                this.state.status === "uit" && "selected"
              }`}
              value="Uit"
            />
          </div>

          <div className="input-field-div">
            <label htmlFor="title" className="input-field-label">
              Titel:
            </label>
            <input className="input-field" value={this.state.title} disabled />
          </div>

          <div className="input-field-div">
            <label htmlFor="note" className="input-field-label">
              Beschrijving:
            </label>
            <input className="input-field" value={this.state.note} disabled />
          </div>

          <div className="input-field-div">
            <label htmlFor="roomID" className="input-field-label">
              Kamer:
            </label>
            <select className="input-field" value={this.state.roomID} disabled>
              {filteredRooms.map((room) => (
                <option>{room.Name}</option>
              ))}
            </select>
          </div>
        </form>
      );
    }
  }
}
