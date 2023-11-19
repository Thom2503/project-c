import React, { Component } from 'react';
import { setCookie } from "../include/util_functions.js";

const functies = [
	{name: '.NET Developer'},
	{name: 'Java Developer'},
	{name: 'Enabler'},
	{name: 'Scrummaster'},
	{name: 'Business Consultant'},
	{name: 'Microsoft 365 Consultant'},
	{name: 'Adoptie- en Verander Consultant'}
];

export class CreateAccount extends Component {
	static displayName = CreateAccount.name;

	constructor(props){
		super(props);
		this.state = {
			email: "",
			password:  "",
			firstName: "",
			lastName: "",
			compentancy: "",
			suggestions: []
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		document.title = "Maak een account";
	}

	handleChange(event){
		this.setState({[event.target.name]: event.target.value})
		if (event.target.name === "compentancy") {
			this.getSuggestion(event.target.value);
			this.onSuggestionFetchRequest(event);
		}
	}

	async handleSubmit(event) {
		event.preventDefault();
		
		const { email, password, firstName, lastName, compentancy } = this.state;

		// TODO: validatie toevoegen

		try {
			const response = await fetch("accounts", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					FirstName: firstName,
					LastName: lastName,
					Function: compentancy,
					IsAdmin: false,
					Email: email,
					Password: password // weet niet of dit goed gaat, want dit kan niet veilig zijn
				})
			});
			
			if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

			const data = response.json();
			if (data.id > 0) {
				setCookie("user", data.id, 7);
				setCookie("isadmin", false, 7);
				window.location.replace("agenda");
			} else {
				console.log("user not created!");
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	escapeRegexChars = (str) => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	getSuggestion = (value) => {
		const escapedVal = this.escapeRegexChars(value);
		if (escapedVal === "") return [];
		const regex = new RegExp("^" + escapedVal, "i");
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

            <div>
                <div className="bg-white text-white p-3">
                    <img className="w-[170px]" src="https://cdn.discordapp.com/attachments/826352506623361104/1158339204363853854/image.png?ex=651be2f3&is=651a9173&hm=a1017c97f67b0407a334b0d64790e135b67965bc7a335aaf54d8050e659e0e81&"/>
                </div>
                <div className="bg-[#792F82] h-[112px] w-100">
                    <span className="text-transparent">Maak een account</span>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <div className="w-[400px] flex m-auto justify-center flex-col h-[45vh] pt-[15vh]">
						{
						// bah bah bah
						// XXX: DIT MOET ECHT BETER!
						}
						<em>&emsp;</em>
						<em>&emsp;</em>
						<em>&emsp;</em>
						<em>&emsp;</em>
                        <h1 className="text-[#792F82] text-[40px] font-bold mb-[30px]">Maak een account</h1>
                        <div className="mb-[30px]">
                            <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Voornaam</label>
                            <input type="text" value={this.state.firstName} onChange={this.handleChange} id="first_name" name="firstName" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" defaultValue="" required/>
                        </div>
                        <div className="mb-[30px]">
                            <label htmlFor="last_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Achternaam</label>
                            <input type="text" value={this.state.lastName} onChange={this.handleChange} id="last_name" name="lastName" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" defaultValue="" required/>
                        </div>
                        <div className="mb-[30px]">
                            <label htmlFor="functie" className="block mb-2 text-sm font-small text-[#9E9E9E]">Functie</label>
							<input type="text"
							       value={this.state.compentancy}
							       onChange={this.handleChange}
							       id="functie"
							       name="compentancy"
							       className='bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5'
							       defaultValue=""
							       required
							       onFocus={this.onSuggestionFetchRequest}
							       onBlur={this.onSuggestionClearRequest}
							/>
                            <label htmlFor="suggestions" className="block mb-2 text-sm font-small text-[#9E9E9E]">Suggesties</label>
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
                        <div className="mb-[30px]">
                            <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Email Address</label>
                            <input type="email" value={this.state.email} onChange={this.handleChange} id="first_name" name="email" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" defaultValue="" required/>
                        </div>

                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Wachtwoord</label>
                            <input type="password" value={this.state.password} onChange={this.handleChange} id="first_name" name="password" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" defaultValue="" required/>

                        </div>
                        <div className="flex justify-center pt-[35px] flex-col items-center">
                            <input type="submit" className="w-[150px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center" value="Maak account" />
                        </div>

                    </div>

                </form>

            </div>
        );
    }
}
