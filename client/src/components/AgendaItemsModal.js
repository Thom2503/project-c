import React, { Component } from "react";
import { toast } from 'react-toastify';
import Select from 'react-select';
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
      formValidation: [],
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
      toast.error("Kan de kamers niet inladen, probeer later opnieuw");
    }

	this.getAllSupplies();
	this.getAgendaSupplies();
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

    // Form Validation
    const formValidation = [];

    if (!title) formValidation.push('Een titel is verplicht');
    if (title.length > 30) formValidation.push('Titel is te lang, maximale lengte is 30');
    if (note.length > 120) formValidation.push('Beschrijving is te lang, maximale lengte is 120');
    if (!roomID && status !== "uit") formValidation.push('Een Kamer is verplicht');
    if (formValidation.length > 0) {
      this.setState({ formValidation });
      return;
    }

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
	    const d = await this.postUserSupplies(data.id);

      // Continue with your success handling
      if (data.id > 0 || data.success === true || d.success === true) {
        toast.success("Agenda item successvol veranderd!");
        this.props.onClose();
      } else {
        // Handle form validation errors or other issues
        toast.warning(data);
      }
    } catch (e) {
        toast.error('Verbinding kon niet gemaakt worden');
    }
  };

  async fetchAgendaData(agendaItemID) {
    const response = await fetch(`agendaitems/${agendaItemID}`);
    const data = await response.json();

    if (data) {
      this.setState({
        title: data.Title,
        note: data.Note,
        status: data.Status,
      });

      if (data.RoomID > 0) {
        this.setState({
          roomID: data.RoomID,
        });
      }
    }
  }

  async getAllSupplies() {
	const response = await fetch("supplies");
	const data = await response.json();

	if (!data.error) {
		this.setState({supplies: data});
	}
  }

	async postUserSupplies(id) {
		const response = await fetch("usersupplies", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				supplies: this.state.userSupplies,
				itemid: !Number.isNaN(this.state.agenda)? this.state.agenda : id ,
				date: this.state.date
			}),
		});

		const data = await response.json();
		return data;
	}

	handleSupplyChange = (selectedOpts) => {
		const selectedSupplies = selectedOpts.map((opt) => opt.value);
		this.setState({ userSupplies: selectedSupplies });
	}

	async getAgendaSupplies() {
		if (this.state.agenda !== "") {
			const response = await fetch(`usersupplies/${this.state.agenda}`);
			const data = await response.json();
			if (!data.error) {
				this.setState({userSupplies: data});
			}
		}
	}

  render() {
	const { supplies, userSupplies } = this.state;
	const selectOptions = supplies.map((supply) => ({
		value: supply.SuppliesID,
		label: `${supply.Name} - ${supply.Total} totaal`,
	}));

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
              required
            />
          </div>

          <div className="input-field-div">
            <label htmlFor="note" className="input-field-label">
              Beschrijving:
            </label>
            <textarea
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
                  <option key={room.RoomsID} value={room.RoomsID}>
                    {room.Name}
                  </option>
                ))}
            </select>
          </div>

            <div className="input-field-div">
              <label htmlFor="supplies" className="input-field-label">
                Voorzieningen:
              </label>
              {this.state.supplies && (
                <Select id="supplies"
                        name="usersupplies"
                        className="input-field"
                        isMulti
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        options={selectOptions}
                        onChange={this.handleSupplyChange}
                        value={selectOptions.filter((opt) => userSupplies.includes(opt.value))} />
              )}
            </div>

          {!Number.isNaN(this.state.agenda) && (
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
		  <div className="input-field-div">
            <label htmlFor="supplies" className="input-field-label">
              Voorzieningen:
            </label>
		  {this.state.supplies && (
			  <Select id="supplies"
			          name="usersupplies"
			          className="input-field"
			          isMulti
			          disabled
			          menuPortalTarget={document.body}
			          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
			          options={selectOptions}
			          onChange={this.handleSupplyChange}
			          value={selectOptions.filter((opt) => userSupplies.includes(opt.value))} />
		  )}
		  </div>
        </form>
      );
    }
  }
}
