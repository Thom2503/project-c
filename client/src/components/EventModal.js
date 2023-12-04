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
import dayjs from "dayjs";

export class EventModal extends Component {
  static displayName = EventModal.name;

  constructor(props) {
    super(props);
    this.state = {
      showRooms: false,
      selectedRoom: "",
      rooms: [],
      title: "",
      description: "",
      location: "",
      istentative: 0,
      tentativetime: "null",
      declinetime: "null",
      isexternal: 0,
      accountsid: 1,
      status: 'dd',
      date: "null",
      starttime: "null",
      endtime: "null",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRooms();
  }

  async getRooms() {
    const response = await fetch('/rooms');
    const roomsData = await response.json();
    this.setState({ rooms: roomsData });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      this.setState({ showRooms: checked, isexternal: checked ? 0 : 1 });
    } else {
      this.setState({ [name]: value });
    }
  }


  async handleSubmit(event) {
    event.preventDefault();

    const title = this.state.title;
    const description = this.state.description;
    const location = this.state.location;
    const istentative = this.state.istentative;
    const tentativetime = this.state.tentativetime;
    const declinetime = this.state.declinetime;
    const isexternal = this.state.isexternal;
    const accountsid = this.state.accountsid;
    const status = this.state.status;
    const date = dayjs(this.state.date).format('DD/MM/YYYY');
    const starttime = dayjs(this.state.starttime).format('HH:mm');
    const endtime = dayjs(this.state.endtime).format('HH:mm');

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            description: description,
            location: location,
            istentative: 0,
            tentativetime: 'not set',
            declinetime: 'not set',
            isexternal: 1,
            accountsid: 0,
            status: 'not set',
            date: date,
            starttime: starttime,
            endtime: endtime,
        }),
      });
      const data = await response.json();

      if (data.id > 0 || data.success === true) {
        console.log("Done");
        window.location.replace("evenementen");
      } else {
        // Handle form validation errors or other issues
        console.log(data);
      }
    } catch (e) {
      console.error("Error: ", e.message);
    }
  }


  render() {
    const isFormFilled = this.state.date && this.state.description && this.state.starttime && this.state.endtime && this.state.title && this.state.location;
    return (
        <div className="modal">
          <form className={'p-7'} onSubmit={this.handleSubmit}>
            <h3 className='font-medium text-[#792F82] text-[25px] border-b-[1px] border-b-[#E8E8E8]'>Toevoegen</h3>
            <div className='mt-5 flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-2'>
                <TextField
                    id="outlined-basic"
                    placeholder="Typ hier je titel."
                    name="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                    label="Titel"
                    variant="outlined"
                    className={"w-[100%]"}
                    required

                />
                <LocalizationProvider dateAdapter={AdapterDayjs}
                >
                  <DatePicker
                      value={this.state.date}
                      onChange={(newDate) => this.setState({ date: newDate })}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          error: false,
                        },
                      }}
                  />
                </LocalizationProvider>
              </div>
              <TextField
                  id="outlined-textarea"
                  label="Beschrijving"
                  onChange={this.handleChange}
                  placeholder="Typ hier je beschrijving."
                  multiline
                  className='w-[100%]'
                  name="description"
                  value={this.state.description}
              />
              <div className='grid grid-cols-2 gap-2'>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}>
                  <TimePicker
                      ampm={false} label="Start Tijd"
                      value={this.state.starttime}
                      onChange={(startTime) => this.setState({ starttime: startTime })}
                      slotProps={{
                        textField: {
                          error: false,
                        },
                      }}
                  />
                </LocalizationProvider>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}>
                  <TimePicker
                      ampm={false} label="Eind Tijd"
                      value={this.state.endtime}
                      onChange={(endTime) => this.setState({ endtime: endTime })}
                      slotProps={{
                        textField: {
                          error: false,
                        },
                      }}
                  />
                </LocalizationProvider>
              </div>
              <FormControlLabel
                  control={<Checkbox checked={this.state.showRooms} onChange={(e) => this.setState({ showRooms: e.target.checked })} />}
                  label="Locatie De Loods"
                  onChange={this.handleChange}
                  name="showRooms"
              />
              {this.state.showRooms ? (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Kamer</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Kamer"
                        name="location"
                        value={this.state.location}
                        onChange={this.handleChange}
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
                      name="location"
                      value={this.state.location}
                      onChange={this.handleChange}
                  />
              )}
            </div>
            <div className={'m-auto w-full flex justify-center'}>
              <button
                  className='mt-3 bg-[#792F82] p-2 text-[20px] rounded-[15px] w-[175px] text-white font-bold'
                  onClick={this.handleSubmit}
                  disabled={!isFormFilled}
              >
                Opslaan
              </button>
            </div>
          </form>
        </div>
    );
  }
}
