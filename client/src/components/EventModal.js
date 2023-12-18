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
import utc from "dayjs/plugin/utc";
import { getCookie } from '../include/util_functions';

import {addNotification} from "../include/notification_functions";

export class EventModal extends Component {
  static displayName = EventModal.name;

  constructor() {
    super();
    this.state = {
      updateEvent: false,
      showRooms: false,
      selectedRoom: "",
      rooms: [],
      title: "",
      description: "",
      location: "",
      istentative: 0,
      tentativetime: 0,
      declinetime: 0,
      isexternal: 0,
      host: getCookie('user'),
      status: 'dd',
      date: null,
      starttime: null,
      endtime: null,
      requestRating: false,
      requestFeedback: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRooms();
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.size >= 1) {
      const paramID = params.get("eventid");
      if (paramID !== null) {
        this.setState({ updateEvent: true });
        this.fetchEventsData(paramID);
      }
    }
}

  async fetchEventsData(eventid) {
    try {
      const response = await fetch(`/events/${eventid}`);
      const data = await response.json();

      const formattedDate = dayjs(data.Date).format('DD-MM-YYYY');

      this.setState({
        eventData: data,
        title: data.Title,
        description: data.Description,
        location: data.Location,
        isexternal: data.IsExternal,
        date: formattedDate,
        starttime: data.startTime,
        endtime: data.endTime,
        istentative: data.IsTentative,
        tentativetime: data.TentativeTime,
        declinetime: data.DeclineTime,
        requestRating: data.requestRating,
        requestFeedback: data.requestFeedback,

      });
      console.log(this.state.isexternal);

    } catch (error) {
      console.error('Error:', error);
    }
  }


  async getRooms() {
    const response = await fetch('/rooms');
    const roomsData = await response.json();
    this.setState({ rooms: roomsData });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
  
    if (type === "checkbox" && name === "isExternal") {
      // If checkbox for showRooms is checked, update showRooms state
      this.setState({ isexternal: checked ? 0 : 1 });
    } else {
      // Set raw time values without formatting
      if (name === "starttime" || name === "endtime") {
        this.setState({ [name]: value });
      } else {
        this.setState({ [name]: value });
      }
    }

    if(type === "checkbox" && name === "isTentative") {
      this.setState({ istentative: checked ? 1 : 0 });
    }
    if (name === "tentativetime") {
      this.setState({ tentativetime: value });
    }

    if(name === "declinetime") {
      this.setState({ declinetime: value });
    }

    if(type === "checkbox" && name === "requestRating") {
      this.setState({ requestRating: checked ? 1 : 0 });
    }
    if(type === "checkbox" && name === "requestFeedback") {
      this.setState({ requestFeedback: checked ? 1 : 0 });
    }

  }


  async handleSubmit(event) {
    dayjs.extend(utc);
    event.preventDefault();

    const title = this.state.title;
    const description = this.state.description;
    const location = this.state.location;
    const istentative = this.state.istentative;
    const tentativetime = this.state.tentativetime;
    const declinetime = this.state.declinetime;
    const isexternal = this.state.isexternal;
    const host = this.state.host;
    const status = this.state.status;
    const date = dayjs(this.state.date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const unixtime = '00:00';
    const starttime = dayjs(this.state.starttime, 'HH:mm').format('HH:mm');
    const endtime = dayjs(this.state.endtime, 'HH:mm').format('HH:mm');
    const unixTimestamp = dayjs(`${date} ${unixtime}`).unix();
    const requestFeedback = this.state.requestFeedback;
    const requestRating = this.state.requestRating;


    try {
      console.log(unixTimestamp);
      if(this.state.updateEvent === true) {

        const params = new URLSearchParams(window.location.search);
        const eventid = params.get('eventid');
        const response = await fetch(`/updateevent/` + parseInt(eventid), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            description: description,
            location: location,
            istentative: istentative,
            tentativetime: tentativetime,
            declinetime: this.state.declinetime,
            isexternal: isexternal,
            host: getCookie('user'),
            status: 'not set',
            date: date,
            starttime: starttime,
            endtime: endtime,
            eventid: eventid,
            epochint: unixTimestamp,
            requestFeedback: requestFeedback,
            requestRating: requestRating,

          }),
        });
        const data = await response.json();
        console.log(date);
        window.location.replace("evenementen");

        if (data.id > 0 || data.success === true) {
          console.log("Done");
            await addNotification(1, title);
        } else {
          // Handle form validation errors or other issues
          console.log(data);
        }


      } else {
        const response = await fetch('/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
              description: description,
              location: location,
              istentative: istentative,
              tentativetime: 0,
              declinetime: this.state.declinetime,
              isexternal: isexternal,
              host: getCookie('user'),
              status: 'not set',
              date: date,
              starttime: starttime,
              endtime: endtime,
              epochint: unixTimestamp,
              requestFeedback: requestFeedback,
              requestRating: requestRating,
          }),
        });
        const data = await response.json();
        window.location.replace("evenementen");
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
                      value={dayjs(this.state.date, 'DD-MM-YYYY')}
                      onChange={(newDate) => this.setState({ date: newDate })}
                      format="DD-MM-YYYY"
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
                      value={dayjs(this.state.starttime, 'HH:mm')}
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
                      value={dayjs(this.state.endtime, 'HH:mm')}
                      onChange={(endTime) => this.setState({ endtime: endTime })}
                      slotProps={{
                        textField: {
                          error: false,
                        },
                      }}
                  />
                </LocalizationProvider>
              </div>
              <div className={'flex flex-col justify-between'}>
                <div className='flex flex-row justify-between'>
                  <FormControlLabel
                      control={<Checkbox checked={parseInt(this.state.isexternal) === 0} onChange={this.handleChange} />}
                      label="Locatie De Loods"
                      onChange={this.handleChange}
                      name="isExternal"
                  />
                  <FormControlLabel
                      control={<Checkbox checked={parseInt(this.state.istentative) === 1} onChange={this.handleChange} />}
                      label="Is Tentative"
                      onChange={this.handleChange}
                      name="isTentative"
                  />
                </div>
                <div className='flex flex-row justify-between'>
                  <FormControlLabel
                      control={<Checkbox checked={parseInt(this.state.requestRating) === 1} onChange={this.handleChange}/>}
                      label="Rating vragen"
                      onChange={this.handleChange}
                      name="requestRating"
                  />
                  <FormControlLabel
                      control={<Checkbox checked={parseInt(this.state.requestFeedback) === 1} onChange={this.handleChange}/>}
                      label="Feedback vragen"
                      onChange={this.handleChange}
                      name="requestFeedback"
                  />
                </div>
              </div>
              {parseInt(this.state.isexternal) === 0 ? (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Kamer</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Kamer"
                        name="location"
                        value={this.state.location} // If isexternal is 0, check the checkbox
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
              <div className='flex flex-row-reverse gap-2'>
                {this.state.istentative ? (
                    <div className='flex flex-col'>
                      <TextField
                          id="outlined-basic"
                          placeholder="Tijd in uren (bijv. 1)"
                          label="Tentative Tijd"
                          variant="outlined"
                          className={"w-[100%]"}
                          name="tentativetime"
                          value={this.state.tentativetime}
                          onChange={this.handleChange}
                      />
                      <small>Hoeveel uur van te voren van het evenement moeten ze bevestigen dat ze er zeker zijn</small>
                    </div>
                ) : (
                    <p className='hidden'></p>
                )}
         <div className='flex flex-col'>
           <TextField
               id="outlined-basic"
               placeholder="Aantal uren voor het evenement mogen ze wijzigen (bijv. 4)"
               label="Decline Tijd"
               variant="outlined"
               className={"w-[100%]"}
               name="declinetime"
               value={this.state.declinetime}
               onChange={this.handleChange}
           />
           <small>Hoeveel uur van te voren van het evenement mogen ze aanmelden / afmelden</small>
         </div>
              </div>
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