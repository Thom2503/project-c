import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../css/nieuws.css";

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
                <Link to="/Nieuws" className="text-[#848484] mb-4" style={{ marginLeft: '30px' }}>&lt; Terug</Link>
                {this.state.filteredData ? (
                <div className="custom-centered-container text-center p-4">
                    <div className="max-w-[400px] sm:max-w-[600px] mx-auto">
                        <h1 className="text-[#848484] font-bold text-[18px] mb-2">{this.state.filteredData.Title}</h1>
                        <div className="text-[#848484] text-sm mb-4">
                            <p className="text-left">Gemaakt door:</p>
                            <p className="text-left">{this.state.filteredData.PostTime}</p>
                        </div>
                        <p
                            className="text-[#848484] text-left" // Left-align the description
                            style={{ whiteSpace: 'pre-line' }} // Preserve line breaks in the text
                        >
                            {this.state.filteredData.Description}
                        </p>
                    </div>
                </div>
                ) : (
                    <p>Geen nieuws gevonden.</p>
                )}
            </>
        );
    }
}
