import React, { Component } from "react";

export class ModalContent extends Component {
  static displayName = ModalContent.name;

  constructor(props) {
    super(props);

    this.state = {
      userName: this.props.userName,
      timestamp: this.props.timestamp,
      location: "",
      rooms:this.props.rooms,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLocationChange = (event) => {
    const { value } = event.target;
    this.setState({ location: value });
  };

  render() {
    return (
      <>
        <div>
          <label
            htmlFor="userName"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            User Name:
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.userName}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="timestamp"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            Timestamp:
          </label>
          <input
            type="text"
            id="timestamp"
            name="timestamp"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.timestamp}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block mb-2 text-sm font-small text-[#9E9E9E]"
          >
            Location:
          </label>
          <select
            id="location"
            name="location"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={this.state.location}
            onChange={this.handleLocationChange}
            required
          >
            <option value="" disabled>Select a room</option>
          {this.props.rooms && this.props.rooms.map((room) => (
            <option key={room.RoomsID} value={room.RoomsID}>
              {room.Name}
            </option>
          ))}
          </select>
        </div>
      </>
    );
  }
}
