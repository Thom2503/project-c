import React, { Component } from 'react';

export class NieuwsDetails extends Component {
  static displayName = NieuwsDetails.name;
  constructor(props) {
    super(props);
    this.state = {
      newsItem: null,
    };
  }

  componentDidMount() {
    this.fetchNewsDetails();
  }

  async fetchNewsDetails() {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("ID");
      const response = await fetch(`news/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const newsItem = await response.json();
  
      console.log(newsItem);
      alert(newsItem);
      console.log("Fetched news details:", newsItem);
      this.setState({ newsItem });
    } catch (error) {
      console.error("Error fetching news details:", error);
    }
  }

  render() {
    const { newsItem } = this.state;

    if (newsItem === null) {
        return <p>No news item found for the given ID.</p>;
    }
      

    return (
      <div className="w-[100%] sm:w-[95%] m-auto">
        <h1 className="text-[#848484] mb-4">{newsItem.PostTime}</h1>
        <div className="m-2 bg-gray-100 p-6">
          <p className="text-[#848484] mt-2 text-right">Gemaakt door:</p>
          <span className="text-[#848484] mt-2 text-right">{newsItem.PostTime}</span>
          <div style={{ position: 'relative', left: '10px', bottom: '-150px' }}>
            <h1 className="text-[#848484] font-bold text-[18px] mt-2 text-left inline-block align-text-bottom">{newsItem.Title}</h1>
            <p className="text-[#848484]">{newsItem.Description}</p>
          </div>
        </div>
      </div>
    );
  }
}
