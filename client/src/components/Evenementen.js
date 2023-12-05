import React, { Component } from 'react';
import { Header } from './Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCirclePlus,
    faClock,
    faUser,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { getCookie } from '../include/util_functions';
import { Pagination } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';

export class Evenementen extends Component {
    static displayName = Evenementen.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rooms: [],
            isSidebarOpen: false,
            date: new Date(),
            filteredData: [],
            currentPage: 1,
            eventsPerPage: 6,
            drawerOpen: false,
            selectedEvent: null,
            selectedTab: 0,
        };
        document.title = "Events";
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    toggleDrawer = (event) => {
        this.setState({ selectedEvent: event, drawerOpen: true });
    };

    handleDateChange = (newDate) => {
        if (newDate) {
            const formattedDate = dayjs(newDate).format('DD/MM/YYYY');
            const filteredEvents = this.state.data.filter(event => {
                if (event.Date) {
                    const eventDate = event.Date.includes('-') ? dayjs(event.Date).format('DD/MM/YYYY') : event.Date;
                    return eventDate === formattedDate;
                }
                return false;
            });
            this.setState({ date: formattedDate, filteredData: filteredEvents });
        } else {
            this.setState({ date: null, filteredData: this.state.data });
        }
    }

    componentDidMount() {
        this.getEvents();
        this.getRooms();
    }

    toggleSidebar = () => {
        this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    }

    async getEvents() {
        const response = await fetch('events');
        const data = await response.json();
        this.setState({ data: data, filteredData: data ? data : [] });
    }

    async getRooms() {
        const response = await fetch('/rooms');
        const roomsData = await response.json();
        this.setState({ rooms: roomsData });
    }

    paginate = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    handleTabChange = (event, newValue) => {
        this.setState({selectedTab: newValue});
      };

    render() {
        const { data, filteredData, currentPage, eventsPerPage, selectedEvent, drawerOpen } = this.state;

        const indexOfLastEvent = currentPage * eventsPerPage;
        const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
        const eventsToDisplay = this.state.date === null && filteredData
            ? data.slice(indexOfFirstEvent, indexOfLastEvent)
            : (Array.isArray(filteredData) ? filteredData.slice(indexOfFirstEvent, indexOfLastEvent) : []);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(data.length / eventsPerPage); i++) {
            pageNumbers.push(i);
        }


        const { selectedTab } = this.state;

        return (
            <>
                <div className='w-[95%] m-auto pb-[80px]'>
                    <div className="flex flex-row justify-between items-stretch mb-4 items-center">
                        <div className='flex items-center'>
                            <h1 className="text-[#792F82] font-bold text-[25px]">Evenementen</h1>
                        </div>
                        <div className='items-stretch flex gap-4 flex-row'>
                            {getCookie("isadmin") !== "true" && (
                                <a href="?modal=5" className='h-full text-[23px] gap-2 text-[#8A8A8A] font-normal cursor-pointer flex justify-center items-center'
                                >
                                    Evenement Toevoegen <FontAwesomeIcon icon={faCirclePlus} />
                                </a>
                            )}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={this.state.date ? dayjs(this.state.date, 'DD/MM/YYYY') : null}
                                    onChange={(newDate) => this.handleDateChange(newDate ? newDate.toDate() : null)}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            error: false,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className="gap-5 grid lg:grid-cols-2 grid-cols-1" style={{ gridAutoFlow: 'row' }}>
                        {eventsToDisplay.length > 0 ? (
                            eventsToDisplay.map((event, index) => (
                                <div
                                    key={event.id}
                                    className="bg-[#F9F9F9] sm:mx-[20px] max-w-[1200px] w-[100%] h-[150px] p-4 flex flex-col justify-center rounded-xl border-[2px] duration-300 transition-all hover:bg-[#FEF3FF] hover:border-[#7100a640] hover:cursor-pointer"
                                    onClick={() => this.toggleDrawer(event)}
                                >
                                    <div className="">
                                        <h1 className="text-[#792F82] font-medium text-[23px]">
                                            {event.Title}
                                            {event.IsExternal === 0 ? (
                                                <span className="px-[9px] py-[3px] bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px] ml-4">Internal</span>
                                            ) : (
                                                <span className="px-[9px] py-[3px] bg-[#FFCEA1] rounded-[100px] p-1 text-[#EE5600] text-[13px] ml-4">External</span>
                                            )}
                                        </h1>
                                        <span className="text-[#848484] text-[14px]">Klik voor meer informatie</span>
                                    </div>
                                    <div className="mt-auto flex flex-row gap-8">
                                        <div className="flex flex-row items-center gap-2">
                                            <div>
                                                <FontAwesomeIcon icon={faUser} className="text-[#D8D8D8]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#B0B0B0] text-[12px]">Host</span>
                                                <span className="text-[#5F5F5F] text-[13px] font-bold">Name</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <div>
                                                <FontAwesomeIcon icon={faCalendar} className="text-[#D8D8D8]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#B0B0B0] text-[12px]">Time</span>
                                                <span className="text-[#5F5F5F] text-[13px] font-bold ">{event.startTime} - {event.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <div>
                                                <FontAwesomeIcon icon={faClock} className="text-[#D8D8D8]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#B0B0B0] text-[12px]">Date</span>
                                                <span className="text-[#5F5F5F] text-[13px] font-bold">{event.Date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Geen evenementen gevonden.</p>
                        )}
                    </div>
                    <div className='w-full'>
                        <Pagination
                            className='mt-4 flex justify-end w-full'
                            count={pageNumbers.length}
                            page={currentPage}
                            variant="outlined"
                            shape="rounded"
                            color="secondary"
                            onChange={(event, page) => this.paginate(page)}
                        />
                    </div>
                </div>

                // ...

                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => this.setState({ drawerOpen: false })}
                    hideBackdrop={true}
                >
                    {/* Render the event information in the drawer */}
                    <button onClick={() => this.setState({ drawerOpen: false })} className='mr-auto px-10 pt-10'><FontAwesomeIcon className='text-[#E1E1E1] text-[20px]' icon={faXmark} /></button>
                    {selectedEvent && (
                        <div className="px-10 w-[360px]">
                            <h1 className="mt-[10%] text-[#792F82] font-bold text-[23px] flex flex-row justify-between items-center border-b-[1px] border-[#E8E8E8] pb-5">
                                {selectedEvent.Title}
                                {selectedEvent.IsExternal === 0 ? (
                                    <span className="px-[9px] py-[3px] bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px] ml-4">Internal</span>
                                ) : (
                                    <span className="px-[9px] py-[3px] bg-[#FFCEA1] rounded-[100px] p-1 text-[#EE5600] text-[13px] ml-4">External</span>
                                )}
                            </h1>
                            <p className="event-description">{selectedEvent.Description}</p>
                                        {/* ...existing code... */}
                                        <Tabs value={selectedTab} onChange={this.handleTabChange} aria-label="Event Details">
          <Tab label="Beschrijving" />
          <Tab label="Deelnemers" />
        </Tabs>
        {selectedTab === 0 && (
          <div>
            <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

            </p>
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            {/* Content for Tab 2 */}
          </div>
        )}
                        </div>
                    )}
                </Drawer>
            </>
        );
    }
}
