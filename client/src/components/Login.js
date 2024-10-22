import React, { Component } from 'react';
import { setCookie } from "../include/util_functions.js";
import { getCookie } from '../include/util_functions';
import {send2FAMail} from "../include/notification_functions";

export class Login extends Component {
    static displayName = Login.name;

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password:  ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }

    async handleSubmit(event) {
        event.preventDefault();

        const email = this.state.email; // Get the name from the form input
        const password = this.state.password;
        try {
            const response = await fetch(`accounts/${email}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({password: password})
			});
            if (response.ok) {
                const data = await response.json();
				if (data.verified === true && getCookie("2FA") !== "true")
                {
                    await send2FAMail(data.AccountsID)
                    window.location.replace(`twofactor?id=${data.AccountsID}`);
                } else if ((data.verified === true && getCookie("2FA") === "true")) {
                    setCookie("user", data.AccountsID, 7);
					setCookie("isadmin", Number.parseInt(data.IsAdmin) === 1 ? "true" : "false", 7)
                    window.location.replace('agenda');
                } else  {
                    alert('Wachtwoord en email komen niet overeen.');
                }
            } else {
                console.error('Failed to verify account');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    render() {
        return (

            <div>
                <div className="bg-white text-white p-3">
                    <img className="w-[170px]"
                         src="../static/logo.png"
                        alt="grote banner logo van cavero"
                    />
                </div>
                <div className="bg-[#792F82] h-[112px] w-100">
                    <span className="text-transparent">Login</span>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <div className="px-4 sm:px-0 max-w-full w-[400px] flex m-auto justify-center flex-col h-[45vh] pt-[15vh]">
                        <h1 className="text-[#792F82] text-[40px] font-bold mb-[30px]">Login</h1>
                        <div className="mb-[30px]">
                            <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Email Address</label>
                            <input type="email" value={this.state.email} onChange={this.handleChange} id="first_name" name="email" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" defaultValue="" required/>
                        </div>

                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Wachtwoord</label>
                            <input type="password" value={this.state.password} onChange={this.handleChange} id="first_name" name="password" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" defaultValue="" required/>

                        </div>
                        <div className="max-w-full w-full text-right">
                            <a href='/forgotpassword'>
                                <span className="text-[#792F82] text-[13px]">Wachtwoord vergeten?</span>    
                            </a>
                        </div>
                        <div className="flex justify-center pt-[35px] flex-col items-center">
                            <input type="submit" className="w-[150px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center transition-all duration-300 hover:cursor-pointer hover:bg-[#5c2363]" value="Login" />
							<a href='/create'>
                            	<span className="text-sm font-small text-[#9E9E9E] mt-[3vh]">Geen account? <a className="text-[#792F82]">Registreer hier</a></span>
							</a>
                        </div>

                    </div>

                </form>

            </div>
        );
    }
}
