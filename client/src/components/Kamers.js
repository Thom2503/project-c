import React, { Component } from 'react';
import { Header } from './Header';

export class Kamers extends Component {
    static displayName = Kamers.name;

    constructor(props){
        super(props);
        this.state = {data: []};
        document.title = "Rooms"
    }

    componentDidMount() {
        this.getRooms();
    }

    async getRooms() {
        const response = await fetch('rooms');
        const data = await response.json();
        this.setState({ data: data });
    }

    render() {
        return (
            <>
                <h1 className="text-[#792F82] font-bold text-[25px]">Kamers</h1>
                <div className="gap-5 flex flex-col">
                    {this.state.data.map(room =>
                        <div className="kamerbg max-w-[1200px] w-[95%] h-[150px] p-6 flex flex-col justify-center rounded-xl mt-[20px] mx-[20px] border-[2px]">
                            <h1 className="text-[#792F82] font-bold text-[23px]">{room.Name}</h1>
                            <span className="text-[#848484]">Klik voor meer informatie</span>
                        </div>
                    )}
                </div>
            </>

        );
    }
}
