import React, { Component } from "react";
import { AgendaItemsModal } from "./AgendaItemsModal";
import { SupplyModal } from "./SupplyModal";
import { Nieuws } from "./Nieuws";
import { AccountModal } from "./AccountModal";
import { KamerModal } from "./KamerModal";

import "../css/modal.css";
import CloseIcon from "../static/close-icon.svg";
import { EventModal } from "./EventModal";

export class BaseModal extends Component {
  static displayName = BaseModal.name;

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    /* Based on the param given via url the right modal gets loaded */
    const params = new URLSearchParams(window.location.search);
    const modalType = params.get("modal");
    this.setState({ modalType });
  }

  render() {
    if (!this.props.isOpen) return null;

    let modalSwitch
    switch (this.state.modalType) {
      case "1":
        modalSwitch = < AgendaItemsModal onClose={this.props.onClose} />
        break;
      case "2":
        modalSwitch = < SupplyModal onClose={this.props.onClose} />
        break
      case "3":
        modalSwitch = < Nieuws onClose={this.props.onClose} />
        break;
      case "4":
        modalSwitch = < AccountModal onClose={this.props.onClose} />
        break
      case "5":
        modalSwitch = < EventModal onClose={this.props.onClose} />
        break
      case "6":
        modalSwitch = < KamerModal onClose={this.props.onClose} />
        break
      /* Error message if there is no corresponding Modal */
      default:
        modalSwitch = "The following modal type could not be loaded"
        break;
    }

    return (
      <div className="base-modal-container">
        <div className="base-modal-content">
          <div className="base-outer-close-icon">
            <img
              className="close-icon"
              src={CloseIcon}
              alt="Close Icon"
              onClick={this.props.onClose}
            />
          </div>
          { modalSwitch }
        </div>
      </div>
    );
  }
}
