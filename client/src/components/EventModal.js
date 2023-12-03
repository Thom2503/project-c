import React, { Component } from "react";
import "../css/voorzieningen.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField
} from "@mui/material";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export class EventModal extends Component {
  static displayName = EventModal.name;

  constructor(props) {
    super(props);
    this.state = { rooms: [], name: "", total: 0, deleteSupply: false, supply: 0 };


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRooms();
  }
  async getRooms() {
    const response = await fetch('/rooms');
    const roomsData = await response.json();
    this.setState({ rooms: roomsData });
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

  handleTabs = (event, newValue) => {
    setValue(newValue);
  }



  async handleSubmit(event) {
    event.preventDefault();

    const name = this.state.name;
    const total = this.state.total;

    const fetchURL =
      this.state.supply > 0 || this.state.deleteSupply === true
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
        body: JSON.stringify({ name: name, total: total }),
      });
      const data = await response.json();
      // als er een id terug is -- dus successvol opgeslagen -- kan je naar het overzicht terug.
      if (data.id > 0 || data.success === true) {
        window.location.replace("voorzieningen");
      } else {
        // TODO: form validatie toevoegen voor als het fout gaat.
        console.log(data);
      }
    } catch (e) {
      console.error("Error: ", e.message);
    }
  }

  async fetchSupplyData(supplyID) {
    const [value, setValue] = React.useState('one');
    try {
      const response = await fetch(`supplies/${supplyID}`);
      const data = await response.json();
      console.log(data);

      if (data)
        this.setState({
          name: data.Name,
          total: data.Total,
          supply: data.SuppliesID,
        });
    } catch (e) {
      console.error("Error: ", e.message);
    }
  }

  render() {
    return (
      <div className="modal">
          <div className={'mt-4 p-7'}>
            <h3 className='font-medium text-[#792F82] text-[25px] border-b-[1px] border-b-[#E8E8E8]'>Toevoegen</h3>
            <div className='mt-5 flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-2'>
                <TextField id="outlined-basic"
                           placeholder="Typ hier je titel."
                           label="Titel" variant="outlined" className={"w-[100%]"}/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker />
                </LocalizationProvider>
              </div>
              <TextField
                  id="outlined-textarea"
                  label="Beschrijving"
                  placeholder="Typ hier je beschrijving."
                  multiline
                  className='w-[100%]'
              />
              <div className='grid grid-cols-2 gap-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker ampm={false} label="Start Tijd" />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker ampm={false} label="Eind Tijd" />
                </LocalizationProvider>
              </div>
              <Tabs
                  value={value}
                  onChange={handleTabs}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
              >
                <Tab value="one" label="Item One" />
                <Tab value="two" label="Item Two" />
                <Tab value="three" label="Item Three" />
              </Tabs>
              <FormControlLabel
                  control={<Checkbox checked={this.state.showRooms} onChange={(e) => this.setState({ showRooms: e.target.checked })} />}
                  label="Locatie De Loods"
              />
              {this.state.showRooms ? (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Kamer</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Kamer"
                        value={this.state.selectedRoom}
                        onChange={(event) => this.setState({ selectedRoom: event.target.value })}
                    >
                      {this.state.rooms.map((room) => (
                          <MenuItem key={room.RoomsID} value={room.Name}>
                            {room.Name}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              ) : (
                  <TextField
                      id="outlined-basic"
                      placeholder="Adres"
                      label="Adres"
                      variant="outlined"
                      className={"w-[100%]"}
                  />
              )}



              <TextField id="outlined-basic"
                         placeholder="Status"
                         label="Status" variant="outlined" className={"w-[100%]"}/>

            </div>
          </div>

      </div>
    );
  }
}
