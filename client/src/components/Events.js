import React, { Component } from 'react';
import { Header } from './Header';

export class Events extends Component {
    static displayName = Events.name;

    constructor(props){
        super(props);
        this.state = {data: []};
        document.title = "Rooms"
    }

    componentDidMount() {
        this.getRooms();
    }

    async getRooms() {
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
                        <div className="bg-[#F9F9F9] m-auto  sm:mx-[20px] max-w-[1200px] w-[95%] h-[150px] p-6 flex flex-col justify-center rounded-xl mt-[25px] border-[2px]">
                            <h1 className="text-[#792F82] font-medium text-[23px]">{event.Title}</h1>
                            <span className="text-[#848484] text-[14px]">Klik voor meer informatie</span>
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
