import React, { Component } from 'react';
import { setCookie } from "../include/util_functions.js";
import {sendForgotPasswordMail} from "../include/notification_functions";

export class ForgotPassword extends Component {
	static displayName = ForgotPassword.name;

	constructor(props){
		super(props);
		this.state = {
			email: "",
			submitted: false,
			formValidation: [],
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		document.title = "Reset je wachtwoord";
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
			console.log(data);
			this.setState({
				submitted: true
			});
			sendForgotPasswordMail(data.AccountsID);
		} catch (error) {
			console.error('Error:', error);
		}
	}

    render() {
		if(this.state.submitted === false){
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
						<h1 className="text-[#792F82] text-[40px] font-bold mb-[15px] justify-center items-center flex">De mail is verzonden</h1>
						<div className="flex justify-center pt-[35px] flex-col items-center">
							<input type="submit" onClick={() => this.resendMail()} className="w-[250px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center cursor-pointer" value="Verstuur opnieuw" />
						</div>
					</div>
				</div>
			);
		}
	}
}
