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
                <div>
                    {this.state.data.map(room =>
                        <>
                            <h1>{room.Name}</h1>
                            <h2>{room.Capacity}</h2>
                        </>
                    )}
                </div>
            </>

        );
    }
}
