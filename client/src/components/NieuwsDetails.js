import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../include/util_functions';
import "../css/nieuws.css";
import { addNotification } from '../include/notification_functions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import dayjs from "dayjs";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class NieuwsDetails extends Component {
    static displayName = NieuwsDetails.name;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredData: null,
            title: ' ',
            description: ' ',
            image: '',
            posttime: '',
            accountsid: Number.parseInt(getCookie("user")),
            NewsID: null,
            deleteNews: false,
            accountName: '',
        };
    }

    handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png'];
            if (validImageTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({ image: reader.result });
                };
                reader.readAsDataURL(file);
            } else {
                console.error('Invalid image type. Please upload a JPEG or PNG image.');
            }
        }
    };

    getDateOptions = () => {
        const currentDate = new Date();
        const options = [];

        const startHour = currentDate.getHours();
        const startMinutes = currentDate.getMinutes();

        for (let i = 0; i < 7; i++) {
            const futureDate = new Date(currentDate);
            futureDate.setDate(currentDate.getDate() + i);

            let startJ = 0;

            if (i === 0) {
                startJ = startHour;
                if (startMinutes > 0) {
                    startJ--; // Allow going back just one hour
                }
            }

            for (let j = startJ; j < 24; j++) {
                const futureDateTime = new Date(futureDate);
                futureDateTime.setHours(j);
                futureDateTime.setMinutes(0); // Reset minutes to 0
                options.push(futureDateTime.toISOString().replace('T', ' ').slice(0, -8));
            }
        }

        return options;
    };

    componentDidMount() {
        this.fetchNewsDetails();
    }

    async fetchNewsDetails() {
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
            if (event.target.name === "posttime") {
                const selectedDate = event.target.value;
                const currentDate = new Date().toISOString().split('T')[0];
                const isValidDate = selectedDate >= currentDate;

                this.setState({ posttime: isValidDate ? selectedDate : currentDate });
            } else {
                this.setState({ [event.target.name]: event.target.value });
            }
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { title, description, posttime, image, accountsid, NewsID } = this.state;
        const fetchURL = NewsID ? `/news/${NewsID}` : '/news';
        console.log(this.state);
        try {
            console.log("DELETE request to:", fetchURL);
            const formattedPostTime = dayjs(posttime).format('YYYY-MM-DD HH:mm');
            const response = await fetch(fetchURL, {
                method: this.state.deleteNews === true ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    image,
                    posttime: formattedPostTime,
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
                await addNotification(2, title);
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
                        <Link to="/Nieuws" className="text-[#848484] mb-4 hover:bg-[#00000021] transition-all duration-300 border-[#00000021] border-[1px] rounded-[4px] px-4 py-2" style={{ marginLeft: '30px' }}><FontAwesomeIcon icon={faArrowLeft} /> Terug</Link>
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
                                <textarea
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="input-field"
                                    value={this.state.description}
                                    onChange={this.handleInputChange}
                                />
                            </div>

                            <div className="input-field-div" style={{ marginBottom: '2rem' }}><label
                                htmlFor="note"
                                className="input-field-label"
                            >
                                Posttijd:
                            </label>
                                <TextField
                                    id="posttime"
                                    name="posttime"
                                    type="datetime-local"
                                    className="input-field"
                                    value={this.state.posttime}
                                    onChange={this.handleInputChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        inputProps: { min: new Date().toISOString().replace('T', ' ').slice(0, -8) }, // Set the minimum value to today's date without 'T'
                                    }}
                                >
                                    {this.getDateOptions().map((dateTime) => (
                                        <MenuItem key={dateTime} value={dateTime} disabled={dateTime < new Date().toISOString().replace('T', ' ').slice(0, -8)}>
                                            {dateTime}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                        <Link to="/Nieuws" className="text-[#848484] hover:bg-[#00000021] transition-all duration-300 mb-4 border-[#00000021] border-[1px] rounded-[4px] px-4 py-2" style={{ marginLeft: '30px' }}><FontAwesomeIcon icon={faArrowLeft} /> Terug</Link>
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
                                <textarea
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
                                <TextField
                                    id="posttime"
                                    name="posttime"
                                    type="datetime-local"
                                    className="input-field"
                                    value={this.state.posttime}
                                    onChange={this.handleInputChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        inputProps: { min: new Date().toISOString().replace('T', ' ').slice(0, -8) }, // Set the minimum value to today's date without 'T'
                                    }}
                                >
                                    {this.getDateOptions().map((dateTime) => (
                                        <MenuItem key={dateTime} value={dateTime} disabled={dateTime < new Date().toISOString().replace('T', ' ').slice(0, -8)}>
                                            {dateTime}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                    <Link to="/Nieuws" className="text-[#848484] hover:bg-[#00000021] transition-all duration-300 mb-4 border-[#00000021] border-[1px] rounded-[4px] px-4 py-2" style={{ marginLeft: '30px' }}><FontAwesomeIcon icon={faArrowLeft} /> Terug</Link>
                    {this.state.filteredData ? (
                        <div className="custom-centered-container text-center p-4">
                            <div className="max-w-[400px] sm:max-w-[600px] mx-auto">
                                <h1 className="text-[#848484] font-bold text-[18px] mb-2">{this.state.filteredData.Title}</h1>
                                <div className="text-[#848484] text-sm mb-4">
                                    <p className="text-left">{this.state.filteredData.PostTime}</p>
                                </div>
                                <p
                                    className="text-[#848484] text-left"
                                    style={{ whiteSpace: 'pre-line' }}
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

