import React, { Component } from 'react';
import { Sidebar } from './Sidebar';
import { getCookie } from '../include/util_functions';
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class Kamers extends Component {
    static displayName = Kamers.name;

    constructor(props) {
        super(props);
        this.state = {data: [], isOpen: false};
        document.title = "Kamers";
    }

    componentDidMount() {
        this.getRooms();
    }

    async getRooms() {
        const response = await fetch('rooms');
        const data = await response.json();
        this.setState({ data: data });
    }

	setSidebarOpen = (roomID, isOpen) => {
		let newData = this.state.data.map((room) => {
			if (room.RoomsID === roomID) {
				room.isOpen = !isOpen;
			} else {
				room.isOpen = false;
			}
			return room;
		});
		this.setState({ data: newData });
	}

    render() {
        return (
            <div className="w-[95%] m-auto">
                <div>
                    <div className='flex flex-row justify-between'>
                        <h2 className="text-[#792F82] font-bold text-[25px]">Kamers</h2>
                        {getCookie("isadmin") === "true" && (
                            <a
                                className='duration-300 transition-all hover:text-[#626060] h-full text-[23px] gap-2 text-[#8A8A8A] font-normal cursor-pointer flex sm:justify-center sm:items-center'
                                href='kamers?modal=6'>Kamer Toevoegen <FontAwesomeIcon icon={faCirclePlus}/></a>
                        )}
                    </div>
                </div>
                <div className="gap-5 flex flex-col">
                    {this.state.data.length > 0 ? (
                            this.state.data.map((room, index) => (
								<div key={index}>
                        			<div className=" m-auto  sm:mx-[20px] kamerbg w-[95%] h-[150px] p-6 flex flex-col justify-center rounded-xl mt-[25px] border-[2px] hover:bg-[#FEF3FF] hover:cursor-pointer"
								         onClick={() => this.setSidebarOpen(room.RoomsID, room.isOpen ?? false)}>
                        			    <h3 className="text-center sm:text-left text-[#792F82] font-bold text-[23px]">{room.Name}</h3>
                        			    <span className="text-center sm:text-left text-[#848484]">
											Klik voor meer informatie
										</span>
                        			</div>
									<Sidebar isOpen={room.isOpen ?? false} room={room} />
								</div>
                            ))
                    ) :
                        (
                            <p>Geen kamers gevonden.</p>
                        )
                    }
                </div>
            </div>

        );
    }
}