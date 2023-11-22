import React, { Component } from 'react';

export class NieuwsDetails extends Component {
    static displayName = NieuwsDetails.name;
    constructor(props) {
        super(props);
        this.state = { data: [], filteredData: null };
    }

    componentDidMount() {
        this.fetchNewsDetails();
    }

    async fetchNewsDetails() {
        const response = await fetch('../news');
        const data = await response.json();
        this.setState({ data: data });

        // Get the URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = parseInt(urlParams.get("ID"), 10);

        // Filter data based on the URL parameter
        const filteredData = data.filter(news => news.NewsID === urlId);

        if (filteredData.length > 0) {
            this.setState({ filteredData: filteredData[0] });
        }
    }

    render() {
        return (
            <>
                {this.state.filteredData ? (
                    <div className="w-[100%] sm:w-[95%] m-auto">
                        <h1 className="text-[#848484] mb-4">{this.state.filteredData.Title}</h1>
                        <div className="m-2 bg-gray-100 p-6">
                            <p className="text-[#848484] mt-2 text-right">Gemaakt door:</p>
                            <span className="text-[#848484] mt-2 text-right">{this.state.filteredData.PostTime}</span>
                            <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
                                <h1 className="text-[#848484] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{this.state.filteredData.Title}</h1>
                                <p className="text-[#848484]">{this.state.filteredData.Description}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Geen nieuws gevonden.</p>
                )}
            </>
        );
    }
}
