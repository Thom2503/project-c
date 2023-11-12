import React, { Component } from 'react';

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
        const response = await fetch('kamers');
        const data = await response.json();
        this.setState({ data: data });
        console.log(data);
    }

    render() {
        return (

            <div>
                <div className="bg-red text-white p-3">
                    <img className="w-[170px]" src="https://cdn.discordapp.com/attachments/826352506623361104/1158339204363853854/image.png?ex=651be2f3&is=651a9173&hm=a1017c97f67b0407a334b0d64790e135b67965bc7a335aaf54d8050e659e0e81&"/>
                </div>
                <div className="bg-[#792F82] h-[112px] w-100">
                    <span className="text-black">Login</span>
                </div>
                <span>daadaad</span>
            </div>
        );
    }
}
