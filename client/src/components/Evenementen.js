import React, { Component } from 'react';
import { Header } from './Header';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCircle,
    faCirclePlus,
    faClock,
    faSquarePlus,
    faUser,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {DatePicker, DesktopTimePicker, LocalizationProvider, TimePicker} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getCookie } from '../include/util_functions';
import Drawer from '@mui/material/Drawer';
import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField} from "@mui/material";

export class Evenementen extends Component {
    static displayName = Evenementen.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rooms: [],
            isSidebarOpen: false  // Added state for sidebar
        };
        document.title = "Events";
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
        this.setState({ data: data });
    }

    async getRooms() {
        const response = await fetch('/rooms');
        const roomsData = await response.json();
        this.setState({ rooms: roomsData });
    }



    render() {


        return (
            <>
                <div className='w-[95%] m-auto'>
                    <div className="flex flex-row justify-between items-stretch mb-4">
                        <div className='items-stretch'>
                            <h1 className="text-[#792F82] font-bold text-[25px]">Evenementen</h1>
                        </div>
                        <div className='items-stretch flex gap-4 flex-row'>


                            {getCookie("isadmin") !== "true" && (
                                <a href="?modal=3" className='h-full text-[23px] gap-2 text-[#8A8A8A] font-normal cursor-pointer flex justify-center items-center'
                                     onClick={this.toggleSidebar}
                                >
                                    Evenement Toevoegen <FontAwesomeIcon icon={faCirclePlus} />
                                </a>
                            )}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker />
                            </LocalizationProvider>
                        </div>
                    </div>
                    {/*<Drawer*/}
                    {/*    anchor="right"*/}
                    {/*    open={this.state.isSidebarOpen}*/}
                    {/*    onClose={this.toggleSidebar}*/}
                    {/*    PaperProps={{ style:*/}
                    {/*            {*/}
                    {/*                borderTopLeftRadius: '10px',*/}
                    {/*                borderBottomLeftRadius: '10px',*/}
                    {/*                background: '#F9F9F9',*/}
                    {/*                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'*/}

                    {/*            } }}*/}
                    {/*    hideBackdrop='true'*/}
                    {/*>*/}
                    {/*</Drawer>*/}
                    <div className="gap-5 grid grid-cols-2">
                        {this.state.data.length > 0 ? (
                                this.state.data.map((event, index) => (
                                    <div className="bg-[#F9F9F9] sm:mx-[20px] max-w-[1200px] w-[100%] h-[150px] p-4 flex flex-col justify-center rounded-xl border-[2px]">
                                        <div className="">
                                            <h1 className="text-[#792F82] font-medium text-[23px]">{event.Title} <span className=" px-[9px] py-[3px] bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px]">Internal</span></h1>
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
                                                    <FontAwesomeIcon icon={faCalendar} className="text-[#D8D8D8]"/>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#B0B0B0] text-[12px]">Time</span>
                                                    <span className="text-[#5F5F5F] text-[13px] font-bold ">{event.Time}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <div>
                                                    <FontAwesomeIcon icon={faClock} className="text-[#D8D8D8]"/>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#B0B0B0] text-[12px]">Date</span>
                                                    <span className="text-[#5F5F5F] text-[13px] font-bold">{event.Date}</span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                ))
                            ) :
                            (
                                <p>Geen evenementen gevonden.</p>
                            )
                        }
                    </div>
                </div>
            </>

        );
    }
}