import React, { Component } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "../css/nieuws.css";
import { getCookie} from '../include/util_functions';

export class Nieuws extends Component {
  static displayName = Nieuws.name;
  constructor(props) {
    super(props); 
    this.state = {
      data: [],
      currentDate: this.formatDate(new Date()),
    };
  }

  componentDidMount() {
    console.log("Component did mount");
    this.fetchNewsData();
  }

  async fetchNewsData() {
    try {
      const response = await fetch("/news");
      const data = await response.json();
      console.log("Fetched news:", data);
      this.setState({ data: data });
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  routechange = (newsItem) => {
      window.location.replace(newsItem);
  };


  formatDate = (date) => {
    return date.toLocaleString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  render() {
    if (getCookie("isadmin") === "true"){
    return (
<div className="w-[100%] sm:w-[95%] m-auto">
        <h1 className="text-[#848484] mb-4">{this.state.currentDate}</h1>
        <Link
          to={{ pathname: "/nieuws/details", search: "fromAddNews=true" }}
          className="add-news-button"
        >
          <div className="button-container">
            <button className="button-style">Nieuws Toevoegen</button>
          </div>
        </Link>
        <div className="flex flex-wrap">
          {this.state.data.length > 0 ? (
            this.state.data.map((newsItem, index) => (
              <div
                key={index}
                className={`m-2 bg-gray-100 p-6 flex flex-col justify-start max-w-[100%] sm:max-w-[45%]`}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  height: '350px',
                }}
                onClick={() =>
                  this.routechange(`nieuws/details?ID=${newsItem.NewsID}`)
                }
              >
                <p className="text-[#848484] mt-2 text-right">Gemaakt door:</p>
                <span className="text-[#848484] mt-2 text-right">{newsItem.PostTime}</span>
                <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
                  <h1 className="text-[#848484] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{newsItem.Title}</h1>
                  <p className="text-[#848484]">{newsItem.Description.substring(0, 100)}...</p>
                </div>
              </div>
            ))
          ) : (
            <p>Geen nieuws gevonden voor vandaag.</p>
          )}
        </div>
      </div>
    );
          }
          else
          return(
            <div className="w-[100%] sm:w-[95%] m-auto">
            <h1 className="text-[#848484] mb-4">{this.state.currentDate}</h1>
            <div className="flex flex-wrap">
              {this.state.data.length > 0 ? (
                this.state.data.map((newsItem, index) => (
                  <div
                    key={index}
                    className={`m-2 bg-gray-100 p-6 flex flex-col justify-start max-w-[100%] sm:max-w-[45%]`}
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      height: '350px',
                    }}
                    onClick={() =>
                      this.routechange(`nieuws/details?ID=${newsItem.NewsID}`)
                    }
                  >
                    <p className="text-[#848484] mt-2 text-right">Gemaakt door:</p>
                    <span className="text-[#848484] mt-2 text-right">{newsItem.PostTime}</span>
                    <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
                      <h1 className="text-[#848484] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{newsItem.Title}</h1>
                      <p className="text-[#848484]">{newsItem.Description.substring(0, 100)}...</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Geen nieuws gevonden voor vandaag.</p>
              )}
            </div>
          </div>
        );
  }
}
