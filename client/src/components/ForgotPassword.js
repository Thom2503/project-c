import React, { Component } from 'react';
import {sendForgotPasswordMail} from "../include/notification_functions";

export class ForgotPassword extends Component {
	static displayName = ForgotPassword.name;

	constructor(props){
		super(props);
		this.state = {
			email: "",
			submitted: false,
			keyViaURL: "",
			keyViaDB: "",
			accountsid: "",
			password: "",
            confirmPassword: "",
			formValidation: [],
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
		document.title = "Reset je wachtwoord";
	}

	async componentDidMount() {
		const params = new URLSearchParams(window.location.search);
		const keyParam = params.get("key");
		const accountidParam = Number.parseInt(params.get("id"));
		this.setState({
			accountsid: accountidParam,
			keyViaURL: keyParam,
		});
		this.getKeyDB();
	}

	async getKeyDB() {
		let response = await fetch(`/keys/ForgotPassword`);
		let data = await response.json();
		this.setState({
			keyViaDB : data,
		});
	}

	handleChange(event){
		this.setState({[event.target.name]: event.target.value})
	}

	async handleSubmit(event) {
		event.preventDefault();
		
		const { email } = this.state;

		// Form Validation
		const formValidation = [];

		const response = await fetch(`accounts/${email}`);
		const data = await response.json();
		if (data.error) {
			formValidation.push('Deze email bestaat niet, probeer het opnieuw');
		}
		if (formValidation.length > 0) {
			this.setState({ formValidation });
			return;
		}

		try {
			this.setState({
				submitted: true,
				accountsid: data.AccountsID
			});
			sendForgotPasswordMail(data.AccountsID);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async resendMail() {
		sendForgotPasswordMail(this.state.accountsid);
	}

	async handleSubmitPassword(event) {
		event.preventDefault();

		const { accountsid, password, confirmPassword } = this.state;

		// Form Validation
		const formValidation = [];

		const passRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
		if (!passRegex.test(password)) {
			formValidation.push('Wachtwoord voldoet niet aan de eisen. Minimaal 1 hoofdletter, 1 cijfer en minimaal 6 tekens lang.');
		}
		if (confirmPassword !== password) formValidation.push('Wachtwoord en Bevestig Wachtwoord zijn niet hetzelfde'); 
		if (formValidation.length > 0) {
			this.setState({ formValidation });
		return;
		}

		// change url for updating or deleting
		const fetchURL = `accounts/${accountsid}/forgotpassword`

	    try {
			const response = await fetch(fetchURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
		  		},
		  		body: JSON.stringify({
					Password: password
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			// Continue with your success handling
			if (data.id > 0 || data.success === true) {
				window.location.replace("login")
			} else {
				// Handle form validation errors or other issues
				console.log(data);
			}
		} catch (e) {
			console.error("Error: ", e.message);
		}
	}

    render() {
		if(this.state.submitted === false && this.state.keyViaURL === null){
			return (
				<div>
					<div className="bg-white text-white p-3">
						<img className="w-[170px]"
							src="../static/logo.png"
							alt="grote banner logo van cavero"
						/>
					</div>
					<div className="bg-[#792F82] h-[112px] w-100">
						<span className="text-transparent">Reset wachtwoord</span>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="w-[400px] flex m-auto justify-center flex-col">
							<h1 className="text-[#792F82] text-[40px] font-bold mb-[15px]">Reset wachtwoord</h1>
							<div className="mb-[15px]">
								<label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Email Address</label>
								<input type="email" value={this.state.email} onChange={this.handleChange} id="first_name" name="email" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" defaultValue="" required/>
							</div>
							{this.state.formValidation.length > 0 && (
								<div className="validation-errors input-field-div">
									{this.state.formValidation.map((error, index) => (
									<div key={index} className="error">
										{error}
									</div>
									))}
								</div>
							)}
							<div className="flex justify-center pt-[35px] flex-col items-center">
								<input type="submit" className="w-[150px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center" value="Verstuur" />
							</div>
						</div>
					</form>
				</div>
			);
    	} else if(this.state.submitted === false && this.state.keyViaURL === this.state.keyViaDB && this.state.accountsid !== null) {
			return (
				<div>
					<div className="bg-white text-white p-3">
						<img className="w-[170px]"
							src="../static/logo.png"
							alt="grote banner logo van cavero"
						/>
					</div>
					<div className="bg-[#792F82] h-[112px] w-100">
						<span className="text-transparent">Reset wachtwoord</span>
					</div>
					<form onSubmit={this.handleSubmitPassword}>
						<div className="w-[400px] flex m-auto justify-center flex-col">
							<h1 className="text-[#792F82] text-[40px] font-bold mb-[15px]">Reset wachtwoord</h1>

							<div className="mb-[15px]">
								<label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Wachtwoord</label>
								<input type="password" value={this.state.password} onChange={this.handleChange} id="first_name" name="password" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" defaultValue="" required/>
							</div>
							<div>
								<label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Bevestig Wachtwoord</label>
								<input type="password" value={this.state.confirmPassword} onChange={this.handleChange} id="first_name" name="confirmPassword" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" defaultValue="" required/>
							</div>

							{this.state.formValidation.length > 0 && (
								<div className="validation-errors input-field-div">
									{this.state.formValidation.map((error, index) => (
									<div key={index} className="error">
										{error}
									</div>
									))}
								</div>
							)}
							<div className="flex justify-center pt-[35px] flex-col items-center">
								<input type="submit" className="w-[150px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center" value="Verstuur" />
							</div>
						</div>
					</form>
				</div>
			);
		} else if (this.state.submitted === true) {
			return (
				<div>
					<div className="bg-white text-white p-3">
						<img className="w-[170px]"
							src="../static/logo.png"
							alt="grote banner logo van cavero"
						/>
					</div>
					<div className="bg-[#792F82] h-[112px] w-100">
						<span className="text-transparent">Reset wachtwoord</span>
					</div>
					<div className="w-[500px] flex m-auto justify-center flex-col items-center">
						<h1 className="text-[#792F82] text-[40px] font-bold mb-[15px] justify-center items-center flex">De mail is verzonden</h1>
						<div className="flex justify-center flex-col items-center">
							<span className='mb-[15px] justify-center items-center flex text-center'>Is de mail na 30 seconden niet verzonden?<br/>Druk hieronder op de knop</span>
							<input type="submit" onClick={() => this.resendMail()} className="w-[250px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center cursor-pointer" value="Verstuur opnieuw" />
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className="bg-white text-white p-3">
						<img className="w-[170px]"
							src="../static/logo.png"
							alt="grote banner logo van cavero"
						/>
					</div>
					<div className="bg-[#792F82] h-[112px] w-100">
						<span className="text-transparent">Reset wachtwoord</span>
					</div>
					<div className="w-[500px] flex m-auto justify-center flex-col items-center">
					<h1 className="text-[#792F82] text-[40px] font-bold mb-[15px] justify-center items-center flex">Een foute key</h1>
						<span className='mb-[15px] justify-center items-center flex text-center'>Sorry er is iets fout gegaan met de Key</span>
					</div>
				</div>
			);
		}
	}
}
