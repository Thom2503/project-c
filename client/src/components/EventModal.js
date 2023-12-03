import React, { Component } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export class EventModal extends Component {
  static displayName = EventModal.name;

  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      title: "",
      description: "",
      startTime: null, // Use null or a default start time
      endTime: null, // Use null or a default end time
      showRooms: false,
      selectedRoom: "",
      address: "",
      date: null, // Use null or a default date
    }

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
      this.fetchEventsData(paramID);
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  async handleSubmit(event) {
    event.preventDefault();

    const title = this.state.title;
    const description = this.state.description;
    const startTime = this.state.startTime;
    const endTime = this.state.endTime;
    const isExternal = this.state.showRooms ? 0 : 1;
    const location = this.state.showRooms ? this.state.selectedRoom : this.state.address;
    const date = this.state.date;

    // Additional validation checks can be added here

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: title,
          Description: description,
          Time: `${startTime} - ${endTime}`,
          Location: location,
          IsExternal: isExternal,
          Date: date,
          // Add other fields as needed
        }),
      });

      const data = await response.json();

      if (data.id > 0 || data.success === true) {
        window.location.replace('/your-redirect-path'); // Update with your actual redirect path
      } else {
        console.log(data);
        // Handle error scenarios
      }
    } catch (e) {
      console.error('Error: ', e.message);
    }
  }

  render() {
    return (
      <div className="modal">
          <div className={'p-7'}>
            <h3 className='font-medium text-[#792F82] text-[25px] border-b-[1px] border-b-[#E8E8E8]'>Toevoegen</h3>
            <div className='mt-5 flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-2'>
                <TextField id="outlined-basic"
                           placeholder="Typ hier je titel."
                           onChange={(e) => this.handleChange(e)}
                           label="Titel" variant="outlined" className={"w-[100%]"}/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker />
                </LocalizationProvider>
              </div>
              <TextField
                  id="outlined-textarea"
                  label="Beschrijving"
                  onChange={(e) => this.handleChange(e)}
                  placeholder="Typ hier je beschrijving."
                  multiline
                  className='w-[100%]'
              />
              <div className='grid grid-cols-2 gap-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                      onChange={(e) => this.handleChange(e)}
                      ampm={false} label="Start Tijd" />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                      onChange={(e) => this.handleChange(e)}
                      ampm={false} label="Eind Tijd" />
                </LocalizationProvider>
              </div>
              <FormControlLabel
                  control={<Checkbox checked={this.state.showRooms} onChange={(e) => this.setState({ showRooms: e.target.checked })} />}
                  label="Locatie De Loods"
                  onChange={(e) => this.handleChange(e)}
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

            </div>
          <div className={'m-auto w-full flex justify-center'}>
            <button className='mt-3 bg-[#792F82] p-2 text-[20px] rounded-[15px] w-[175px] text-white font-bold'>Opslaan</button>
          </div>
          </div>

      </div>
    );
  }
}
