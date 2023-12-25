import React, { Component } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link, RouterProvider, useLocation } from 'react-router-dom';
import { getCookie, getFirstDayTimeStamp, getNextDay } from '../include/util_functions';
import '../css/tailwind.css';
import {NotificationTray} from './NotificationTray';
import { toast } from 'react-toastify';
import {faArrowLeft, faBars, faGear, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Drawer from "@mui/material/Drawer";

export class Header extends Component {
    static displayName = Header.name;

    constructor(props) {
        super(props);
        this.state = {
			user: [],
			item: false,
			isHere: false,
			today: getNextDay(getFirstDayTimeStamp(), new Date().getDay()),
			selectedTab: 'null',
			openTray: "none",
			drawerOpen: false,
		};
    }

    componentDidMount() {
        this.getUser();
		this.getUserAgenda();
		this.logCurrentUrl();
    }

	logCurrentUrl = () => {
		const pathSegments = window.location.pathname.split('/');
		const firstParam = pathSegments[1];

		// Set the first parameter as selectedTab and log it in the callback
		this.setState({ selectedTab: firstParam }, () => {
			console.log("Current URL:", this.state.selectedTab);
		});
	};
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

	async handleTabClick(tab) {
		this.setState({selectedTab: tab});

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
              toast.success("Status successvol gewijzigd.");
	  		  window.location.replace("agenda");
      		} else {
      		  // Handle form validation errors or other issues
      		  console.log(data);
              toast.error("Kon de status niet successvol veranderen");
      		}
		} catch (e) {
      		console.error("Error: ", e.message);
			toast.error("Er is een onverwachtte fout gevonden.");
		}
	}

    render() {
		let {drawerOpen} = this.state;
        let isAdmin = getCookie('isadmin');
        return (
			<>
            <div>
                <div className="justify-between bg-white text-white p-3 flex flex-row items-center">
                    <NavLink to="/">
                        <img
                            src='../static/logo.png'
                            alt="Logo"
							width='170px'
							height='auto'
							onClick={() => this.handleTabClick('null')}
                        />
                    </NavLink>
                    <div className="flex-row ml-auto gap-4 hidden sm:flex">
                            <NavLink tag={Link} className={`text-black text-[20px] duration-300 transition-all hover:text-[#792f82] ${this.state.selectedTab === 'agenda' ? 'text-[#792f82] font-medium' : ''}`} to="/agenda"
									 onClick={() => this.handleTabClick('agenda')}
							>
                                Agenda
                            </NavLink>
                        {isAdmin === 'true' && (
                                <><NavLink tag={Link} className={`text-black text-[20px] duration-300 transition-all hover:text-[#792f82] ${this.state.selectedTab === 'voorzieningen' ? 'text-[#792f82] font-medium' : ''}`} to="/Voorzieningen"
										   onClick={() => this.handleTabClick('voorzieningen')}
								>
                                    Voorzieningen
                                </NavLink>
                                <NavLink tag={Link} className={`text-black text-[20px] duration-300 transition-all hover:text-[#792f82] ${this.state.selectedTab === 'accounts' ? 'text-[#792f82] font-medium' : ''}`} to="/AccountsOverview"
										 onClick={() => this.handleTabClick('accounts')}
								>
                                    Accounts
                                </NavLink></>
                        )}
                            <NavLink tag={Link} className={`text-black text-[20px] duration-300 transition-all hover:text-[#792f82] ${this.state.selectedTab === 'nieuws' ? 'text-[#792f82] font-medium' : ''}`} to="/Nieuws"
									 onClick={() => this.handleTabClick('nieuws')}
							>
                                Nieuws
                            </NavLink>
                            <NavLink tag={Link} className={`text-black text-[20px] duration-300 transition-all hover:text-[#792f82] ${this.state.selectedTab === 'evenementen' ? 'text-[#792f82] font-medium' : ''}`} to="/evenementen"
							onClick={() => this.handleTabClick('evenementen')}
							>
                                Evenementen
                            </NavLink>
                    </div>
					<div className={'sm:hidden'}>
						<FontAwesomeIcon
							onClick={() => this.setState({drawerOpen: true})}
							className='text-[#3d3d3d] ml-auto text-[23px]' icon={faBars} />
					</div>
                </div>

                <div className="bg-[#792F82] h-[112px] w-100 flex items-center pl-6">
                    <div className='flex flex-col'>
                        <h1 className="text-white font-medium text-[32px]"><HeaderTitle /></h1>
						<span className='text-white font-medium text-[16px] sm:hidden'>Welkom {this.state.user.FirstName ?? ''}</span>
                    </div>
                    <div className="flex flex-col ml-auto pr-6">
                        <span className="text-white font-medium text-[32px] text-white hidden sm:block">
							Welkom {this.state.user.FirstName ?? ''}
							&nbsp;&nbsp;
							<NotificationTray />
						</span>
                        <div className="flex flex-row">
              <span className="text-white font-medium text-[18px] ml-auto hidden sm:block">Momenteel</span>
							<div className='flex flex-col items-center'>
								<a className="ml-1 shadow-lg rounded-sm font-normal px-2 py-1 text-white transition ease-in-out hover:filter hover:brightness-90 cursor-pointer"
								   style={{backgroundColor: this.state.isHere === true ? '#46bf52' : '#DB3131'}}
								   onClick={() => this.setUserAgendaItem()}>
									{this.state.isHere == true ? "Aanwezig" : "Afwezig"}
								</a>
								<span className='text-white font-medium text-[32px] text-white sm:hidden block'>
								<NotificationTray/>
							</span>
							</div>

						</div>
					</div>
				</div>

				<div className="bg-[#3D3D3D] w-full">
					<div className={'flex flex-row gap-4 pl-4'}>
						<NavLink
							tag={Link}
							to="/kamers"
							className={` p-1 pl-4 pr-4 font-light text-white hover:bg-[#707070] duration-300 transition-all ${this.state.selectedTab === 'kamers' ? 'bg-[#707070] font-medium' : 'bg-[#9E9E9E54]'}`}
							onClick={() => this.handleTabClick('kamers')}
                        >
                            Kamers
                        </NavLink>
                        <NavLink
                            tag={Link}
                            to="/evenementen"
                            className={`p-1 pl-4 pr-4 font-light text-white hover:bg-[#707070] duration-300 transition-all ${this.state.selectedTab === 'evenementen' ? 'bg-[#707070] font-medium' : 'bg-[#9E9E9E54]'}`}
							onClick={() => this.handleTabClick('evenementen')}
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
		<Drawer
			anchor="right"
			open={drawerOpen}
			onClose={() => {
				this.setState({
					drawerOpen: false,
				});
			}}
			hideBackdrop={true}
		>
			<div className='max-w-full  mx-10 w-[250px] mb-4 pt-10 pb-10 flex flex-row justify-between items-center border-b-[1px] border-b-[#8080803b]'>
				<h1 className={'text-[#792F82] font-medium text-[23px]'}>Menu</h1>
				<FontAwesomeIcon
					onClick={() => this.setState({drawerOpen: false})}
					className='text-gray-300' icon={faXmark} />
			</div>
			<div className='max-w-full mx-10 w-[250px] flex flex-col gap-4 mb-4 pb-4'>
				<NavLink tag={Link} className="text-[#8A8A8A] font-medium text-[20px]" to="/agenda"
						 onClick={() => this.handleTabClick('null')}
				>
					Agenda
				</NavLink>
				{isAdmin === 'true' && (
					<><NavLink tag={Link} className="text-[#8A8A8A] font-medium text-[20px]" to="/Voorzieningen"
							   onClick={() => this.handleTabClick('null')}
					>
						Voorzieningen
					</NavLink>
						<NavLink tag={Link} className="text-[#8A8A8A] font-medium text-[20px]" to="/AccountsOverview"
								 onClick={() => this.handleTabClick('null')}
						>
							Accounts
						</NavLink></>
				)}
				<NavLink tag={Link} className="text-[#8A8A8A] font-medium text-[20px]" to="/Nieuws"
						 onClick={() => this.handleTabClick('null')}
				>
					Nieuws
				</NavLink>
				<NavLink tag={Link} className="text-[#8A8A8A] font-medium text-[20px]" to="/evenementen"
						 onClick={() => this.handleTabClick('null')}
				>
					Evenementen
				</NavLink>
			</div>
		</Drawer>
			</>
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