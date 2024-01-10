import React, { Component } from 'react';
import {send2FAMail} from "../include/notification_functions";
import { setCookie } from "../include/util_functions.js";

export class TwoFactor extends Component {
	static displayName = TwoFactor.name;

	constructor(props){
		super(props);
		this.state = {
            accountsid: "",
            accountdata: [],
			code2FA: "",
			keyViaDB: "",
			formValidation: [],
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		document.title = "Two Factor Authentication";
	}

	async componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const accountidParam = Number.parseInt(params.get("id"));
        this.setState({
			accountsid: accountidParam,
		});
		this.getKeyDB();
        this.getAccount(accountidParam);
	}

	async getKeyDB() {
		let response = await fetch(`/keys/2FA`);
		let data = await response.json();
		this.setState({
			keyViaDB : data,
		});
	}

    async getAccount(id) {
        let response = await fetch(`/accounts/${id}`);
		let data = await response.json();
		this.setState({
			accountdata : data,
		});
    }

	handleChange(event){
		this.setState({[event.target.name]: event.target.value})
	}

	async handleSubmit(event) {
		event.preventDefault();
		
		const { code2FA, keyViaDB } = this.state;

		// Form Validation
		const formValidation = [];

        if (code2FA !== keyViaDB) formValidation.push('De juiste code is niet ingevuld')

		if (formValidation.length > 0) {
			this.setState({ formValidation });
			return;
		}

        setCookie("user", this.state.accountsid, 7);
        setCookie("isadmin", Number.parseInt(this.state.accountdata.IsAdmin) === 1 ? "true" : "false", 7);
        window.location.replace('agenda');
	}

	async resendMail() {
		await send2FAMail(this.state.accountsid);
        window.location.replace(`twofactor?id=${this.state.accountsid}`);
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
                    <span className="text-transparent">2FA</span>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="w-[400px] flex m-auto justify-center flex-col pt-[10vh]">
                        <h1 className="text-[#792F82] text-[40px] font-bold mb-[15px]">Two Factor Authentication</h1>
                        <div className="mb-[15px]">
                            <label htmlFor="2FA" className="block mb-2 text-sm font-small text-[#9E9E9E]">Vul hieronder de 2FA code in</label>
                            <input type="Text" value={this.state.code2FA} onChange={this.handleChange} id="code2FA" name="code2FA" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" defaultValue="" required/>
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
                        <div className="flex justify-center pt-[20px] flex-col items-center">
                            <input type="submit" className="w-[150px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center transition-all duration-300 hover:cursor-pointer hover:bg-[#5c2363]" value="Verstuur" />
                        </div>
                    </div>
                </form>
                <div className="flex justify-center flex-col items-center pt-[20px]">
                    <span className="text-sm font-small text-[#9E9E9E] ">Is de mail na 30 seconden niet verzonden? <span onClick={() => this.resendMail()} className="text-[#792F82] cursor-pointer">Klik hier</span></span>
                </div>
            </div>
        );
	}
}
