import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../include/util_functions';
import "../css/nieuws.css";

export class NieuwsDetails extends Component {
    static displayName = NieuwsDetails.name;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredData: null,
            title: ' ',
            description: ' ',
            image: "nieuwsimage",
            posttime: '2023-12-02 19:44',
            accountsid: Number.parseInt(getCookie("user")),
            NewsID: null,
            deleteNews: false,
        };
    }

    componentDidMount() {
        this.fetchNewsDetails();
    }

    async fetchNewsDetails() {
        // Get the URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = Number.parseInt(urlParams.get('ID'));

        const response = await fetch(`../news/${urlId}`);
        const data = await response.json();

        this.setState({ data: data });

        this.setState({ filteredData: data, NewsID: urlId });

    }

    handleInputChange = (event) => {
        if (event.target.name === "deleteNews") {
            this.setState({ [event.target.name]: event.target.checked });
        } else {
            this.setState({ [event.target.name]: event.target.value });
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        // is de oude manier hierbij word nieuws wel gwn toegevoegd:
        // const fetchURL = "../news";
        const { title, description, posttime, image, accountsid, NewsID } = this.state;
        // is de oude manier hierbij word nieuws wel gwn toegevoegd:
        // const fetchURL = "../news";
        const fetchURL = NewsID ? `/news/${NewsID}` : '/news';
        console.log(this.state);
        try {
            console.log("DELETE request to:", fetchURL);
            const response = await fetch(fetchURL, {
                method: this.state.deleteNews === true ? "DELETE" : "POST",
                // method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    image,
                    posttime,
                    accountsid
                }),
            });
            console.log(this.state.deleteNews);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.id > 0 || data.success === true) {
                console.log("Done");
                window.location.replace("/Nieuws");
            } else {
                console.log(data);
            }
        } catch (e) {
            console.error("Error: ", e.message);
        }
    };
    render() {
        const isAdmin = getCookie("isadmin") === "true";
        const fromAddNews = new URLSearchParams(window.location.search).get("fromAddNews");
        if (isAdmin) {
            if (fromAddNews) {
                return (
                    <>
                        <Link to="/Nieuws" className="text-[#848484] mb-4" style={{ marginLeft: '30px' }}>&lt; Terug</Link>
                        <form onSubmit={this.handleSubmit} className="max-w-[400px] sm:max-w-[600px] mx-auto" style={{ marginTop: '50px' }}>
                            <div className="input-field-div" style={{ marginBottom: '2rem' }}>
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

                            <div className="input-field-div" style={{ marginBottom: '2rem' }}>                            <label
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
            }
            else {
                return (
                    <>
                        <Link to="/Nieuws" className="text-[#848484] mb-4" style={{ marginLeft: '30px' }}>&lt; Terug</Link>
                        <form onSubmit={this.handleSubmit} className="max-w-[400px] sm:max-w-[600px] mx-auto" style={{ marginTop: '50px' }}>
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
                            <div className="input-field-div">
                                <label htmlFor="deleteNews">Delete: </label>
                                <input
                                    type="checkbox"
                                    id="deleteNews"
                                    name="deleteNews"
                                    value={this.state.deleteNews}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <input
                                className="save-button"
                                type="submit"
                                value="Opslaan & Sluiten"
                            />
                        </form>
                    </>
                );
            }
        }
        else {
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

