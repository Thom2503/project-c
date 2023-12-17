import React, { Component } from 'react';
import { Sidebar } from './Sidebar';
import { getCookie } from '../include/util_functions';

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
                    <h2 className="text-[#792F82] font-bold text-[25px]">Kamers</h2>
                    {getCookie("isadmin") === "true" && (
                        <a href='kamers?modal=6'>Kamer Toevoegen</a>
                    )}
                </div>
                <div className="gap-5 flex flex-col">
                    {this.state.data.length > 0 ? (
                            this.state.data.map((room, index) => (
								<div key={index}>
                        			<div className=" m-auto  sm:mx-[20px] kamerbg max-w-[1200px] w-[95%] h-[150px] p-6 flex flex-col justify-center rounded-xl mt-[25px] border-[2px]"
								         onClick={() => this.setSidebarOpen(room.RoomsID, room.isOpen ?? false)}>
                        			    <h3 className="text-[#792F82] font-bold text-[23px]">{room.Name}</h3>
                        			    <span className="text-[#848484]">
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