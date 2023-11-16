import React, { Component } from "react";
import { AgendaItemsModal } from "./AgendaItemsModal";
import "../css/modal.css";
import CloseIcon from "../static/close-icon.svg";

export class BaseModal extends Component {
  static displayName = BaseModal.name;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.props.isOpen) return null;

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
          <AgendaItemsModal onClose={this.props.onClose} />
        </div>
      </div>
    );
  }
}
