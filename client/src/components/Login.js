import React, { Component } from 'react';

export class Login extends Component {
    static displayName = Login.name;

    render() {
        return (

            <div>

                <div className="bg-white text-white p-3">
                    <img className="w-[170px]" src="https://cdn.discordapp.com/attachments/826352506623361104/1158339204363853854/image.png?ex=651be2f3&is=651a9173&hm=a1017c97f67b0407a334b0d64790e135b67965bc7a335aaf54d8050e659e0e81&"/>
                </div>
                <div className="bg-[#792F82] h-[112px] w-100">
                    <span className="text-transparent">Login</span>
                </div>
                <div className="w-[400px] flex m-auto justify-center flex-col h-[45vh] pt-[15vh]">
                    <h1 className="text-[#792F82] text-[40px] font-bold mb-[30px]">Login</h1>
                    <div className="mb-[30px]">
                        <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Email Address</label>
                        <input type="text" id="first_name" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5" placeholder="" required/>
                    </div>

                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm font-small text-[#9E9E9E]">Wachtwoord</label>
                        <input type="text" id="first_name" className="bg-[#FFFFFF] w-[362px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required/>

                    </div>
                    <div className="w-[362px] text-right">
                        <a className="text-[#792F82] text-[13px]">Wachtwoord vergeten?</a>
                    </div>
                    <div className="flex justify-center pt-[35px] flex-col items-center">
                        <a className="w-[150px] bg-[#792F82] font-bold text-[20px] text-white h-[46px] rounded-[15px] flex justify-center items-center">Login</a>
                        <span className="text-sm font-small text-[#9E9E9E] mt-[3vh]">Geen account? <a className="text-[#792F82]">Registreer hier</a></span>
                    </div>

                </div>
            </div>
        );
    }
}
