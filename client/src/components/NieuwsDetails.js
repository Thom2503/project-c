import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../include/util_functions';
import "../css/nieuws.css";

export class NieuwsDetails extends Component {
    static displayName = NieuwsDetails.name;
    constructor(props) {
        super(props);
        this.state = {   };
        this.state = {
            data: [],
            filteredData: null,
            Title: ' ',
            Description: ' ',
            Image: "nieuwsimage",
            PostTime: ' '
          };
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

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
    event.preventDefault();

    const { title, description, posttime, image, AccountsId} = this.state;

    const fetchURL = "news";

    try {
        const response = await fetch(fetchURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description,
            image,
            posttime,
            AccountsId
        }),
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Continue with your success handling
        if (data.id > 0 || data.success === true) {
        console.log("Done");
        window.location.replace("news");
        } else {
        // Handle form validation errors or other issues
        console.log(data);
        }
    } catch (e) {
        console.error("Error: ", e.message);
    }
    };
    render() {
        const isAdmin = getCookie("isadmin") === "true";
        const fromAddNews = new URLSearchParams(window.location.search).get("fromAddNews");
        if (isAdmin){
            if(fromAddNews)
            {
                // return (
                //     <>
                //     <Link to="/Nieuws" className="text-[#848484] mb-4" style={{ marginLeft: '30px' }}>&lt; Terug</Link>
                //     <form onSubmit={this.handleSubmit} className="max-w-[400px] sm:max-w-[600px] mx-auto"style={{ marginTop: '50px' }}>
                //         <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                //             <label
                //                 htmlFor="title"
                //                 className="input-field-label"
                //             >
                //                 Titel:
                //             </label>
                //             <input
                //                 type="text"
                //                 id="title"
                //                 name="title"
                //                 className="input-field"
                //                 value={this.state.title}
                //                 onChange={this.handleInputChange}
                //             />
                //         </div>

                //         <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                //             <label
                //                 htmlFor="note"
                //                 className="input-field-label"
                //             >
                //                 Beschrijving:
                //             </label>
                //             <input
                //                 type="text"
                //                 id="description"
                //                 name="description"
                //                 className="input-field"
                //                 value={this.state.description}
                //                 onChange={this.handleInputChange}
                //             />
                //         </div>

                //         <div className="input-field-div" style={{ marginBottom: '2rem' }}>                            <label
                //                 htmlFor="note"
                //                 className="input-field-label"
                //             >
                //                 Posttijd:
                //             </label>
                //             <input
                //                 type="text"
                //                 id="posttime"
                //                 name="posttime"
                //                 className="input-field"
                //                 value={this.state.posttime}
                //                 onChange={this.handleInputChange}
                //             />
                //         </div>
                //         {/* <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                //             <p className="static-text">Huidige afbeelding:</p>
                //             <label
                //                 htmlFor="note"
                //                 className="input-field-label"
                //             >
                //                 Afbeelding:
                //             </label>
                //             <input
                //                 type="file"
                //                 id="image"
                //                 name="image"
                //                 className="input-field"
                //                 onChange={this.handleImageChange}
                //             />
                //         </div> */}
                //         <input
                //             className="save-button"
                //             type="submit"
                //             value="Opslaan & Sluiten"
                //         />
                //     </form>
                // </>
                // );
            }
            else {
            return(
                <>
                    <Link to="/Nieuws" className="text-[#848484] mb-4" style={{ marginLeft: '30px' }}>&lt; Terug</Link>
                    <form onSubmit={this.handleSubmit} className="max-w-[400px] sm:max-w-[600px] mx-auto"style={{ marginTop: '50px' }}>
                        <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                            <p className="static-text">Huidige titel: {this.state.filteredData?.Title}</p>
                            <label
                                htmlFor="title"
                                className="input-field-label"
                            >
                                Titel:
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input-field"
                                value={this.state.title}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                            <p className="static-text">Huidige beschrijving: {this.state.filteredData?.Description}</p>
                            <label
                                htmlFor="note"
                                className="input-field-label"
                            >
                                Beschrijving:
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="input-field"
                                value={this.state.description}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                            <p className="static-text">Huidige posttijd: {this.state.filteredData?.PostTime}</p>
                            <label
                                htmlFor="note"
                                className="input-field-label"
                            >
                                Posttijd:
                            </label>
                            <input
                                type="text"
                                id="posttime"
                                name="posttime"
                                className="input-field"
                                value={this.state.posttime}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        {/* <div className="input-field-div" style={{ marginBottom: '2rem' }}>
                            <p className="static-text">Huidige afbeelding:</p>
                            <label
                                htmlFor="note"
                                className="input-field-label"
                            >
                                Afbeelding:
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                className="input-field"
                                onChange={this.handleImageChange}
                            />
                        </div> */}
                        <input
                            className="save-button"
                            type="submit"
                            value="Opslaan & Sluiten"
                        />
                    </form>
                </>
            );
        }}
        else{
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
}
