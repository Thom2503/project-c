import React, { Component } from 'react';
import {NavItem, NavLink} from "reactstrap";
import {Link} from "react-router-dom";
import { getCookie } from '../include/util_functions';

export class Header extends Component {
    static displayName = Header.name;

	constructor(props) {
		super(props);
		this.state = {user: []}
	}

	componentDidMount() {
		this.getUser();
	}

	/**
	 * Haal de data van een gebruiker op.
	 *
	 * @returns {void}
	 */
	async getUser() {
		let userid = getCookie("user");
		const response = await fetch(`accounts/${userid}`);
		const data = await response.json();
		this.setState({user: data});
	}

    render() {
		let isAdmin = getCookie("isadmin");
        return (

            <div>

                <div className="bg-white text-white p-3 flex flex-row items-center">
                    <NavLink to="/"><img className="w-[170px]" src="https://cdn.discordapp.com/attachments/826352506623361104/1158339204363853854/image.png?ex=651be2f3&is=651a9173&hm=a1017c97f67b0407a334b0d64790e135b67965bc7a335aaf54d8050e659e0e81&"/></NavLink>
                    <div className="flex flex-row ml-auto">
                        <NavItem>
                            <NavLink tag={Link} className="text-black text-[20px]" to="/agenda">Agenda</NavLink>
                        </NavItem>
						{isAdmin === "true" &&
                        	<NavItem>
                            	<NavLink tag={Link} className="text-black text-[20px]" to="/Voorzieningen">Voorzieningen</NavLink>
                        	</NavItem>
						}
                        <NavItem>
                            <NavLink tag={Link} className="text-black text-[20px]" to="/Nieuws">Nieuws</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-black text-[20px]" to="/evenementen">Evenementen</NavLink>
                        </NavItem>
                    </div>
                </div>
                <div className="bg-[#792F82] h-[112px] w-100 flex items-center pl-6">
                    <div>
                        <span className="text-white font-medium text-[32px]">Login</span>
                    </div>
                    <div className="flex flex-col ml-auto pr-6">
                        <span className="text-white font-medium text-[32px]">Welkom, {this.state.user.FirstName ?? ""}</span>
                        <span className="text-white font-medium text-[18px] ml-auto">Momenteel<a className="bg-[#DB3131] ml-[5px] drop-shadow-lg rounded-sm font-normal pr-2 pl-2 pt-1 pb-1">Afwezig</a></span>
                    </div>
                </div>
                <div className="bg-[#3D3D3D] w-full">
                    <div className={"flex flex-row gap-4 pl-4"}>
                        <NavLink tag={Link} to="/kamers" className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white">Kamers</NavLink>
                        <NavLink tag={Link} to="/evenementen" className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white">Evenementen</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}
