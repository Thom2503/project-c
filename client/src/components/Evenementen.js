import React, { Component } from 'react';
import { Header } from './Header';

export class Evenementen extends Component {
    static displayName = Evenementen.name;

    constructor(props){
        super(props);
        this.state = {data: []};
        document.title = "Evenementen"
    }

    // componentDidMount() {
    //     this.getRooms();
    // }
    //
    // async getRooms() {
    //     const response = await fetch('rooms');
    //     const data = await response.json();
    //     this.setState({ data: data });
    // }

    render() {
        return (
            <div className="w-[95%] m-auto">
                <h1 className="text-[#792F82] font-bold text-[25px]">Evenementen van vandaag</h1>
                <div className="gap-5 flex flex-col">
                    {this.state.data.length > 0 ? (
                            this.state.data.map((room, index) => (
                                <div className=" m-auto  sm:mx-[20px] kamerbg max-w-[1200px] w-[95%] h-[150px] p-6 flex flex-col justify-center rounded-xl mt-[25px] border-[2px]">
                                    <h1 className="text-[#792F82] font-bold text-[23px]">{room.Name}</h1>
                                    <span className="text-[#848484]">Klik voor meer informatie</span>
                                </div>
                            ))
                        ) :
                        (
                            <p>Geen evenementen gevonden.</p>
                        )
                    }
                </div>
            </div>

        );
    }
}