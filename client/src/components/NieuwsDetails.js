import React, { Component } from 'react';

export class NieuwsDetails extends Component {
    static displayName = NieuwsDetails.name;
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        this.fetchNewsDetails();
    }

    async fetchNewsDetails() {
            const response = await fetch('../news');
            const data = await response.json();
            this.setState({ data: data });
    }

    render() {
        return (
            <>
                {this.state.data.length > 0 ? (
                    this.state.data.map((news, index) => (
                        <div className="w-[100%] sm:w-[95%] m-auto">
                            <h1 className="text-[#848484] mb-4">{news.PostTime}</h1>
                            <div className="m-2 bg-gray-100 p-6">
                                <p className="text-[#848484] mt-2 text-right">Gemaakt door:</p>
                                <span className="text-[#848484] mt-2 text-right">{news.PostTime}</span>
                                <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
                                    <h1 className="text-[#848484] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{news.Title}</h1>
                                    <p className="text-[#848484]">{news.Description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Geen nieuws gevonden.</p>
                )}
            </>
        );
    }
}
