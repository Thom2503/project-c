import React, { Component } from 'react';
import { Header } from './Header';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faClock, faUser} from "@fortawesome/free-solid-svg-icons";

export class Events extends Component {
    static displayName = Events.name;

    constructor(props){
        super(props);
        this.state = {data: []};
        document.title = "Events"
    }

    componentDidMount() {
        this.getEvents();
    }

    async getEvents() {
        const response = await fetch('events');
        const data = await response.json();
        this.setState({ data: data });
    }

    render() {
        return (
            <>
                <h1 className="text-[#792F82] font-bold text-[25px]">Evenementen</h1>
                <div className="gap-5 flex flex-col">
                    {this.state.data.length > 0 ? (
                            this.state.data.map((event, index) => (
                                <div className="bg-[#F9F9F9] m-auto  sm:mx-[20px] max-w-[1200px] w-[45%] h-[150px] p-4 flex flex-col justify-center rounded-xl mt-[25px] border-[2px]">
                                    <div className="">
                                        <h1 className="text-[#792F82] font-medium text-[23px]">{event.Title} <span className="bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px]"><small className="rounded-[100px] text-[10px]">●</small>Internal</span></h1>
                                        <span className="text-[#848484] text-[14px]">Klik voor meer informatie</span>
                                    </div>
                                    <div className="mt-auto flex flex-row gap-8">
                                        <div className="flex flex-row items-center gap-2">
                                            <div>
                                                <FontAwesomeIcon icon={faUser} className="text-[#D8D8D8]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#B0B0B0] text-[12px]">Host</span>
                                                <span className="text-[#5F5F5F] text-[13px] ">Name</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <div>
                                                <FontAwesomeIcon icon={faCalendar} className="text-[#D8D8D8]"/>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#B0B0B0] text-[12px]">Host</span>
                                                <span className="text-[#5F5F5F] text-[13px] ">Name</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <div>
                                                <FontAwesomeIcon icon={faClock} className="text-[#D8D8D8]"/>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#B0B0B0] text-[12px]">Host</span>
                                                <span className="text-[#5F5F5F] text-[13px] ">Name</span>
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
            </>

        );
    }
}
