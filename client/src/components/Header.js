import React, { Component } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { getCookie, getFirstDayTimeStamp, getNextDay } from '../include/util_functions';
import '../css/tailwind.css';

export class Header extends Component {
    static displayName = Header.name;

    constructor(props) {
        super(props);
        this.state = {
			user: [],
			item: false,
			isHere: false,
			today: getNextDay(getFirstDayTimeStamp(), new Date().getDay() - 1)
		};
    }

    componentDidMount() {
        this.getUser();
		this.getUserAgenda();
    }

    /**
     * Haal de data van een gebruiker op.
     *
     * @returns {void}
     */
    async getUser() {
        let userid = getCookie('user');
        const response = await fetch(`accounts/${userid}`);
        const data = await response.json();
        this.setState({ user: data });
    }

	/**
	 * Haal de agenda item van vandaag op om te kijken of de gebruiker aanwezig is.
	 *
	 * @returns
	 */
	async getUserAgenda() {
		let userid = getCookie("user");
		const response = await fetch(`useritems/${userid}`);
		const data = await response.json();
		// als er niks is kan je ook niet filteren dus return dan
		if (data.error) return;
		let item = data.filter(item => item.Date == this.state.today)[0];
		if (item) {
			let isHere = item.Status === "in";
			this.setState({item: item, isHere: isHere});
		}

	}

	/**
	 * Update of maak een nieuwe agenda item voor de gebruiker in de agenda, als de gebruiker nog niks heeft staan
	 * word er een nieuw item gemaakt voor de gebruiker. Als er wel wat staat word de huidige geupdate.
	 *
	 * @returns
	 */
	async setUserAgendaItem() {
		// waardes om te posten naar de gebruiker
		let userid = getCookie("user");
		let status = "in";
		let title = "In de loods";
		let ts = this.state.today;
		let item = this.state.item;
		let roomid = 0;
		let note = "";
		let fetchURL = "agendaitems";
		try {
			// als er een wel een item is verander de default waardes dan zodat die geupload worden
			if (item !== false) {
				// als de status nu in is moet het naar uit
				status = item.Status === "in" ? "uit" : "in";
				// verander de titel alleen als het een standaard titel is zoals in de loods
				title = ["In de loods", "Uit de loods"].includes(item.Title)
				      ? `${status.charAt(0).toUpperCase() + status.slice(1)} de loods`
				      : item.Title;
				note = item.Note;
				roomid = item.RoomID;
				// verander de url waar de post request naar gemaakt moet worden
				fetchURL = `agendaitems/${userid}`;
			}
			let response = await fetch(fetchURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: title,
					note: note,
					date: ts,
					roomID: roomid,
					accountsid: userid,
					status: status,
				}),
			});

			if (!response.ok) {
        		throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			// als er een id is of de data is successvol geupload ga weer naar de agenda
      		if (data.id > 0 || data.success === true) {
      		  console.log("Done");
	  		  window.location.replace("agenda");
      		} else {
      		  // Handle form validation errors or other issues
      		  console.log(data);
      		}
		} catch (e) {
      		console.error("Error: ", e.message);
		}
	}

    render() {
        let isAdmin = getCookie('isadmin');
        return (
            <div>
                <div className="bg-white text-white p-3 flex flex-row items-center">
                    <NavLink to="/">
                        <img
                            className="w-[170px]"
                            src='../static/logo.png'
                            alt="Logo"
                        />
                    </NavLink>
                    <div className="flex-row ml-auto gap-4 hidden sm:flex">
                            <NavLink tag={Link} className="text-black text-[20px]" to="/agenda">
                                Agenda
                            </NavLink>
                        {isAdmin === 'true' && (
                                <NavLink tag={Link} className="text-black text-[20px]" to="/Voorzieningen">
                                    Voorzieningen
                                </NavLink>
                        )}
                            <NavLink tag={Link} className="text-black text-[20px]" to="/Nieuws">
                                Nieuws
                            </NavLink>
                            <NavLink tag={Link} className="text-black text-[20px]" to="/evenementen">
                                Evenementen
                            </NavLink>
                    </div>
                </div>

                <div className="bg-[#792F82] h-[112px] w-100 flex items-center pl-6">
                    <div className='flex flex-col'>
                        <h1 className="text-white font-medium text-[32px]"><HeaderTitle /></h1>
						<span className='text-white font-medium text-[16px] sm:hidden'>Welkom {this.state.user.FirstName ?? ''}</span>
                    </div>
                    <div className="flex flex-col ml-auto pr-6">
                        <span className="text-white font-medium text-[32px] text-white hidden sm:block">Welkom {this.state.user.FirstName ?? ''}</span>
                        <div className="flex flex-row">
              <span className="text-white font-medium text-[18px] ml-auto hidden sm:block">Momenteel</span>
              <a className="bg-[#DB3131] ml-[5px] drop-shadow-lg rounded-sm font-normal pr-2 pl-2 pt-1 pb-1 text-white"
				 style={{backgroundColor: this.state.isHere === true ? '#46bf52' : '#DB3131'}}
	 		     onClick={() => this.setUserAgendaItem()}>
				{this.state.isHere == true ? "Aanwezig" : "Afwezig"}
			  </a>
            </div>
                    </div>
                </div>

                <div className="bg-[#3D3D3D] w-full">
                    <div className={'flex flex-row gap-4 pl-4'}>
                        <NavLink
                            tag={Link}
                            to="/kamers"
                            className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white"
                        >
                            Kamers
                        </NavLink>
                        <NavLink
                            tag={Link}
                            to="/evenementen"
                            className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white"
                        >
                            Evenementen
                        </NavLink>
                    </div>

                    <div className={'flex flex-row gap-4 pl-4 hidden'}>
                        <NavLink tag={Link} to="/kamers" className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white">
                            Kamers
                        </NavLink>
                        <NavLink tag={Link} to="/evenementen" className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white">
                            Evenementen
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }
}

const HeaderTitle = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const title = pathSegments[pathSegments.length - 1];

    return (
        <span className="text-white font-medium text-[32px]">
      {title.charAt(0).toUpperCase() + title.slice(1)}
    </span>
    );
};