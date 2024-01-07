import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../css/nieuws.css";
import { getCookie } from '../include/util_functions';
import { toast } from 'react-toastify';

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
    this.fetchNewsData();
  }

  async fetchNewsData() {
    try {
      const response = await fetch("/news");
      const data = await response.json();
      const updatedData = await Promise.all(
        data.map(async (newsItem) => {
          const accountName = await this.getAccountName(newsItem.AccountsId);
          return { ...newsItem, accountName };
        })
      );
      this.setState({ data: updatedData });
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Er is een onverwachtte fout gevonden.");
    }

  }

  async getAccountName(accountId) {
    try {
      const response = await fetch(`accounts/${accountId}`);
      const accountData = await response.json();
      return `${accountData.FirstName} ${accountData.LastName}`;
    } catch (error) {
      console.error("Error fetching account data:", error);
      toast.warning("Er zijn geen gebruikers gevonden");
      return "Onbekende gebruiker";
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
    if (getCookie("isadmin") === "true") {
      return (<div className="w-[100%] sm:w-[95%] m-auto">
        <h1 className="text-[#848484] mb-4 flex justify-start items-center  ml-2">{this.state.currentDate} </h1>
        <Link
          to={{ pathname: "/Artikel", search: "fromAddNews=true" }}
          className="h-full text-[17px] gap-2 text-[#792F82] font-normal cursor-pointer flex justify-start items-center  ml-2"
          onClick={this.toggleSidebar}
        >
          + Nieuws toevoegen
        </Link>
        <div className="flex flex-wrap">
          {this.state.data.length > 0 ? (
            this.state.data.map((newsItem, index) => (
              <div
                key={index}
                className={`m-2 bg-purple-800  p-6 flex flex-col justify-start max-w-[100%] sm:max-w-[45%]`}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  height: '350px',
                  backgroundImage: `linear-gradient(to top right, #792F82, white)`,
                  backgroundSize: 'cover',
                }}
                onClick={() =>
                  this.routechange(`Artikel?ID=${newsItem.NewsID}`)
                }
              >
                <p className="text-[#792F82] mt-2 text-right">Gemaakt door: {newsItem.accountName}</p>
                <span className="text-[#792F82] mt-2 text-right">{newsItem.PostTime}</span>
                <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
                  <h1 className="text-[#C0C0C0] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{newsItem.Title}</h1>
                  <p className="text-[#C0C0C0]">{newsItem.Description.substring(0, 100)}...</p>
                </div>
              </div>
            ))
          ) : (
            <p>Geen nieuws gevonden voor vandaag.</p>
          )}
        </div>
      </div >
      );
    }
    else
      return (
        <div className="w-[100%] sm:w-[95%] m-auto">
          <h1 className="text-[#848484] mb-4">{this.state.currentDate}</h1>
          <div className="flex flex-wrap">
            {this.state.data.length > 0 ? (
              this.state.data.map((newsItem, index) => (
                <div
                  key={index}
                  className={`m-2 bg-purple-800  p-6 flex flex-col justify-start max-w-[100%] sm:max-w-[45%]`}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    height: '350px',
                    backgroundImage: `linear-gradient(to top right, #792F82, white)`,
                    backgroundSize: 'cover',
                  }}
                  onClick={() =>
                    this.routechange(`Artikel?ID=${newsItem.NewsID}`)
                  }
                >
                  <p className="text-[#792F82] mt-2 text-right">Gemaakt door: {newsItem.accountName}</p>
                  <span className="text-[#792F82] mt-2 text-right">{newsItem.PostTime}</span>
                  <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
                    <h1 className="text-[#C0C0C0] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{newsItem.Title}</h1>
                    <p className="text-[#C0C0C0]">{newsItem.Description.substring(0, 100)}...</p>
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
