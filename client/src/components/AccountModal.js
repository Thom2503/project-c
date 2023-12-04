import React, { Component } from "react";
import "../css/modal.css";

const functies = [
	{name: '.NET Developer'},
	{name: 'Java Developer'},
	{name: 'Enabler'},
	{name: 'Scrummaster'},
	{name: 'Business Consultant'},
	{name: 'Microsoft 365 Consultant'},
	{name: 'Adoptie- en Verander Consultant'}
];

export class AccountModal extends Component {
    static displayName = "AccountModal";

    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            compentancy: "",
            isAdmin: false,
            email: "",
            password: "",
            suggestions: [],
            account: "",
            deleteAccount: false,
        };
    }

    async componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const accountid = Number.parseInt(params.get("id"));
        this.setState({
            account: accountid,
        });

        // check if a accountid is given via url
        if (!Number.isNaN(accountid)) {
            this.fetchAccountData(accountid);
        }
    }

    handleInputChange = (event) => {
      const { name, value } = event.target;
      let updatedValue = value;

      // inplaats van een nieuwe functie voor de status button wordt de waarde zo aangepast
      if (name === "status") {
        updatedValue = value.toLowerCase();
        // titel wordt nu verandert zodat de gebruiker dat niet zelf hoeft te doen
        if (updatedValue === "in") {
          this.setState({ title: "In de loods" });
        } else {
          this.setState({ title: "Uit de loods" });
        }
      }

      if (event.target.name === "compentancy") {
        this.getSuggestion(updatedValue);
        this.onSuggestionFetchRequest(event);
      }

      // checkbox logic
      if (name === "deleteAccount" || name === "isAdmin") {
          this.setState({ [name]: event.target.checked });
      } else {
          this.setState({ [name]: updatedValue });
      }
    };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password, firstName, lastName, compentancy, isAdmin } = this.state;

    // change url for updating or deleting
    const fetchURL =
      !Number.isNaN(this.state.account) || this.state.deleteAccount === true
        ? `accounts/${this.state.account}`
        : "accounts";

    try {
      const response = await fetch(fetchURL, {
        method: this.state.deleteAccount === true ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: firstName,
					LastName: lastName,
					Function: compentancy,
					IsAdmin: isAdmin,
					Email: email,
					Password: password
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Continue with your success handling
      if (data.id > 0 || data.success === true) {
        console.log("Done");
        this.props.onClose();
      } else {
        // Handle form validation errors or other issues
        console.log(data);
      }
    } catch (e) {
      console.error("Error: ", e.message);
    }
  };

  async fetchAccountData(accountID) {
    const response = await fetch(`accounts/${accountID}`);
    const data = await response.json();

    if (data) {
      this.setState({
        firstName: data.FirstName,
        lastName: data.LastName,
        compentancy: data.Function,
        isAdmin: data.IsAdmin === "1",
        email: data.Email,
      });
    }
  }

  escapeRegexChars = (str) => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

  getSuggestion = (value) => {
		const escapedVal = this.escapeRegexChars(value);
		if (escapedVal === "") return [];
		const regex = new RegExp(escapedVal, "i");
		return functies.filter(functie => {
			return regex.test(functie.name);
		});
	};

	getSuggestionValue = (suggestion) => {
		return suggestion.name;
	};

	onSuggestionFetchRequest = ({ target: { value } }) => {
		this.setState({suggestions: this.getSuggestion(value)});
	};

	onSuggestionClearRequest = () => {
		setTimeout(() => {
			this.setState({suggestions: []});
		}, 200);
	};

	handleSuggestionSelect = (suggestion) => {
		this.setState({compentancy: suggestion.name, suggestions: []});
	}

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
            <div className="input-field-div">
              <label htmlFor="firstName" className="input-field-label">
                  Voornaam:
              </label>
              <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="input-field"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
              />
            </div>

            <div className="input-field-div">
              <label htmlFor="lastName" className="input-field-label">
                  Achternaam:
              </label>
              <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="input-field"
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
              />
            </div>

            <div className="input-field-div">
            <label htmlFor="email" className="input-field-label">
              Email:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="input-field"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            </div>

            {!this.state.account && (
              <div className="input-field-div">
                <label htmlFor="password" className="input-field-label">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-field"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </div>
            )}

            <div className="input-field-div">
              <label htmlFor="functie" className="input-field-label">Functie</label>
							<input type="text"
							  value={this.state.compentancy}
							  onChange={this.handleInputChange}
							  id="functie"
							  name="compentancy"
							  className='input-field'
							  defaultValue=""
							  required
							  onFocus={this.onSuggestionFetchRequest}
							  onBlur={this.onSuggestionClearRequest}
							/>
                <label htmlFor="suggestions" className="input-field-label">Suggesties</label>
							<ul>
								{this.state.suggestions.map((suggestion, idx) => (
									<li className="block mb-2 text-sm font-small text-[#9E9E9E]"
										key={idx}
										onClick={() => this.handleSuggestionSelect(suggestion)}>
										{suggestion.name}
									</li>
								))}
							</ul>
							{this.state.suggestions.length === 0 && (
								<p className="block mb-2 text-sm font-small text-[#9E9E9E]"> Nog geen suggesties</p>
							)}
            </div>

            <div className="input-field-div">
              <label htmlFor="isAdmin">Admin: </label>
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={this.state.isAdmin}
                onChange={this.handleInputChange}
              />
            </div>
            
            <div className="input-field-div">
              <label htmlFor="deleteAccount">Delete:</label>
              <input
                type="checkbox"
                id="deleteAccount"
                name="deleteAccount"
                value={this.state.deleteAccount}
                onChange={this.handleInputChange}
              />
            </div>

            <input
            className="save-button"
            type="submit"
            value="Opslaan & Sluiten"
            />
        </form>
    );
    } 
}

