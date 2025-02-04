import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCirclePlus,
    faClock, faThumbsDown, faThumbsUp,
    faUser,
    faXmark,
    faPaperPlane, faPenToSquare, faTrash, faFileLines, faPeopleGroup, faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { getCookie } from '../include/util_functions';
import {Pagination, TextField} from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { Tabs, Tab } from '@mui/material';
import FetchUserDetails from './FetchUserDetails';
import FetchCommentDetails from './FetchCommentDetails';
import '../css/tab.css';
import FetchTentative from "./FetchTentative";
import {addNotification, sendMailNotification} from '../include/notification_functions';
import { toast } from 'react-toastify';

export class Evenementen extends Component {

    static displayName = Evenementen.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rooms: [],
            isSidebarOpen: false,
            date: new Date(),
            filteredData: [],
            currentPage: 1,
            eventsPerPage: 6,
            drawerOpen: false,
            selectedEvent: null,
            selectedTab: 0,
            host: getCookie('user'),
            eventid: 0,
            deelnemers: [],
            votedInt: 0,
            commentInput: '',
            comments: [],
            confirmed: 0,
            confirmedPeople: 0,
            tentative: 0,
        };
        document.title = "Events";
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getUsersInEvent = this.getUsersInEvent.bind(this);
    }

    toggleDrawer = async (event) => {
        await this.setState({ selectedEvent: event, drawerOpen: true, eventid: event.EventsID, selectedTab: 0 });
        await this.getUsersInEvent(event.EventsID);
    };

    async getComments(event) {
        try {
            const response = await fetch('/eventcomments/' + parseInt(event.EventsID));
            const data = await response.json();
            this.setState({ comments: data }, () => {
            });
        } catch (error) {
            console.error(error);
            this.setState({ comments: [] });
        }
    }

    async deleteEvent(event) {
        try {
            const response = await fetch('/eventdelete/' + parseInt(event.EventsID), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventid: event.EventsID,
                }),
            });

            if (!response.ok) {
				console.error(`Failed to delete event: ${response.status} ${response.statusText}`);
				toast.error("Kan evenement niet verwijderen");
            }

			await sendMailNotification(1, `Gaat niet door: ${event.Title}`, "Dit evenement gaat helaas niet meer door");
			await addNotification(1, `Gaat niet door: ${event.Title}`);
            window.location.replace("evenementen");
        } catch (e) {}
    }

    async getUsersInEvent(evenementid) {
        try {
            const response = await fetch('/eventsusers/' + evenementid);
            if (!response.ok) {
				console.error('No users found for this event');
            }
            const data = await response.json();
            if (data.error) {
                this.setState({deelnemers: []});
            } else {
                this.setState({ deelnemers: data }, () => {
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({ deelnemers: [] });
        }
    }
 // Join event voor als je op de knop aanmelden drukt
    async handleJoinEvent(event) {
        try {
            await fetch('/eventjoin/' + parseInt(event.EventsID), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountid: parseInt(this.state.host),
                    eventid: parseInt(event.EventsID),
                }),
            });
			toast.success("Je zit nu bij het evenement");
            window.location.replace("evenementen");
        } catch (e) {
            console.error("Error: ", e.message);
			toast.warning("Kan helaas niet meedoen aan het evenement");
        }
    }



    async handleLeaveEvent(event) {
        try {
            await fetch('/eventleave/' + parseInt(event.EventsID), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountid: parseInt(this.state.host),
                    eventid: parseInt(event.EventsID),
                }),
            });
			toast.success("Je doet nu niet meer mee met het evenement");
            window.location.replace("evenementen");
        } catch (e) {
            console.error("Error: ", e.message);
			toast.warning("Je kan helaas niet meer verwijderd worden van het evenement");
        }
    }

    handleDateChange = (newDate) => {
        if (newDate) {
            const formattedDate = dayjs(newDate).format('DD/MM/YYYY');
            const filteredEvents = this.state.data.filter(event => {
                if (event.Date) {
                    const eventDate = event.Date.includes('-') ? dayjs(event.Date).format('DD/MM/YYYY') : event.Date;
                    return eventDate === formattedDate;
                }
                return false;
            });
            this.setState({ date: formattedDate, filteredData: filteredEvents });
        } else {
            this.setState({ date: null, filteredData: this.state.data });
        }
    }

    async getConfirmedPeople(event) {
        const response = await fetch('/accountevents/' + parseInt(event.EventsID));
        const data = await response.json();

        if(data.length != null) {
            const filteredData = data.filter(entry => parseInt(entry.confirmed) === 1);
            const int = filteredData.length;

            if (data.length > 0) {
                this.setState(
                    {
                        confirmedPeople: int,
                    },
                    () => {
                    }
                );
            } else {
                this.setState({
                    confirmedPeople: 0,
                });
            }
        } else {
            this.setState({
                confirmedPeople: 0,
            });
        }
    }


    componentDidMount() {
        this.getEvents();
        this.getRooms();
    }

    async istenantive(event) {
        try {
            const response = await fetch('/events/' + parseInt(event.EventsID));

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const isTentativeValue = parseInt(data.IsTentative);

            // Update state with the parsed value
            this.setState(
                {
                    tentative: isTentativeValue,
                },
                () => {
                }
            );

        } catch (error) {
            console.error('Error fetching or parsing data:', error);
        }
    }


    async getEvents() {
        const response = await fetch('events');
        const data = await response.json();
        this.setState({ data: data, filteredData: data ? data : [] });
    }

    async getRooms() {
        const response = await fetch('/rooms');
        const roomsData = await response.json();
        this.setState({ rooms: roomsData });
    }

    async vote(event) {
        try {
            const response = await fetch('/eventvote/' + parseInt(event.EventsID), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountid: parseInt(this.state.host),
                    eventid: parseInt(this.state.eventid),
                    vote: this.state.votedInt,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to vote: ${response.status} ${response.statusText}`);
            }
            window.location.replace("evenementen");
        } catch (e) {}
    }

    async postComment(event) {
        try {
            const response = await fetch('/eventcomments/' + parseInt(event.EventsID), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountid: parseInt(this.state.host),
                    eventid: parseInt(this.state.eventid),
                    comment: this.state.commentInput,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to post comment: ${response.status} ${response.statusText}`);
            }
            window.location.reload();
        } catch (e) {}
    }
    calculateRemainingTime(event) {
        const eventDateTime = dayjs(`${event.Date} ${event.startTime}`);
        const currentDateTime = dayjs();
        const totalRemainingHours = Math.floor(eventDateTime.diff(currentDateTime) / (60 * 60 * 1000));

        if (parseInt(event.DeclineTime) === 0 && totalRemainingHours > 0) {
           return true;
        } else if (totalRemainingHours >= parseInt(event.DeclineTime)) {
            return true;
        } else {
            return false;
        }
    }

    calculateTentativeTime(event) {
        const eventDateTime = dayjs(`${event.Date} ${event.startTime}`);
        const currentDateTime = dayjs();
        const totalRemainingHours = Math.floor(eventDateTime.diff(currentDateTime) / (60 * 60 * 1000));
        if(totalRemainingHours > parseInt(event.TentativeTime) && totalRemainingHours > 0) {
            return true;
        } else {
            return false;
        }
    }

    paginate = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    handleTabChange = (event, newValue) => {
        this.setState({selectedTab: newValue});
	};

    render() {
       const {data, filteredData, currentPage, eventsPerPage, selectedEvent, drawerOpen} = this.state;

       const indexOfLastEvent = currentPage * eventsPerPage;
       const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
        const eventsToDisplay =
            (data && data.length > 0)
                ? (filteredData.length === data.length)
                    ? data.filter(event => {
                        // Convert the event date string to a Date object
                        const eventDate = dayjs(event.Date, { format: 'YYYY-MM-DD' }).toDate();

                        // Check if the event date is within the current week
                        return dayjs(eventDate).isAfter(dayjs().startOf('week')) && dayjs(eventDate).isBefore(dayjs().endOf('week'));
                    }).slice(indexOfFirstEvent, indexOfLastEvent)
                    : (Array.isArray(filteredData) ? filteredData.slice(indexOfFirstEvent, indexOfLastEvent) : data.slice(indexOfFirstEvent, indexOfLastEvent))
                : [];
         
       // Logic for displaying page numbers
       const pageNumbers = [];
       for (let i = 1; i <= Math.ceil(filteredData.length / eventsPerPage); i++) {
           pageNumbers.push(i);
       }

       return (
           <>
               <div className='w-[95%] m-auto pb-[80px]'>
                   <div className="flex flex-col sm:flex-row justify-between items-stretch mb-4 items-center">
                       <div className='flex items-center'>
                           <h1 className="text-[#792F82] font-bold text-[25px]">Evenementen</h1>
                       </div>
                       <div className='items-stretch flex gap-4 flex-col sm:flex-row'>
                           {getCookie("isadmin") === "true" && (
                               <a href="?modal=5"
                                  className='h-full text-[23px] gap-2 text-[#8A8A8A] font-normal cursor-pointer flex sm:justify-center sm:items-center'
                               >
                                   Evenement Toevoegen <FontAwesomeIcon icon={faCirclePlus}/>
                               </a>
                           )}
                           <LocalizationProvider dateAdapter={AdapterDayjs}>
                               <DatePicker
                                   value={this.state.date ? dayjs(this.state.date, 'DD/MM/YYYY') : null}
                                   onChange={(newDate) => this.handleDateChange(newDate ? newDate.toDate() : null)}
                                   format="DD/MM/YYYY"
                                   slotProps={{
                                       textField: {
                                           error: false,
                                       },
                                   }}
                               />
                           </LocalizationProvider>
                       </div>
                   </div>
                   <div className="gap-5 grid lg:grid-cols-2 grid-cols-1" style={{gridAutoFlow: 'row'}}>
                       {eventsToDisplay.length > 0 ? (
                           eventsToDisplay.map((event, index) => (
                               <div
                                   key={index}
                                   className='flex flex-col gap-2'>
                                   {this.calculateTentativeTime(event) && parseInt(event.IsTentative) === 1 && (
                                       <FetchTentative eventId={event.EventsID}
                                                       accountId={this.state.host}/>
                                   )}

                                   <div
                                       className={`${dayjs(event.Date).isBefore(dayjs()) ? "opacity-40" : "opacity-100"} sm:mx-[20px] max-w-[1200px] w-[100%] h-[150px] p-4 flex flex-col justify-center rounded-xl border-[2px] duration-300 transition-all hover:bg-[#FEF3FF] hover:border-[#7100a640] hover:cursor-pointer
                                   ${dayjs(event.Date).isSame(dayjs(), 'day') ? '!opacity-100' : ''}
                                   
                                   `}
                                       onClick={() => {
                                           this.toggleDrawer(event);
                                           this.getConfirmedPeople(event);
                                           this.istenantive(event);
                                       }}
                                   >
                                       <div className="">
                                           <h1 className="text-[#792F82] font-medium text-[23px]">
                                               {event.Title}
                                               {parseInt(event.IsExternal) === 0 ? (
                                                   <span
                                                       className="px-[9px] py-[3px] bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px] ml-4">Internal</span>
                                               ) : (
                                                   <span
                                                       className="px-[9px] py-[3px] bg-[#FFCEA1] rounded-[100px] p-1 text-[#EE5600] text-[13px] ml-4">External</span>
                                               )}
                                           </h1>
                                           <span className="text-[#848484] text-[14px]">Klik voor meer informatie</span>
                                       </div>
                                       <div className="mt-auto flex flex-row gap-8">
                                           <div className="flex flex-row items-center gap-2">
                                               <div>
                                                   <FontAwesomeIcon icon={faUser} className="text-[#D8D8D8]"/>
                                               </div>
                                               <div className="flex flex-col">
                                                   <span className="text-[#B0B0B0] text-[12px]">Host</span>
                                                   <span className="text-[#5F5F5F] text-[13px] font-bold">
                                                       <FetchUserDetails userId={event.Host} showNameOnly='true'/>
                                                   </span>
                                               </div>
                                           </div>
                                           <div className="flex flex-row items-center gap-2">
                                               <div>
                                                   <FontAwesomeIcon icon={faCalendar} className="text-[#D8D8D8]"/>
                                               </div>
                                               <div className="flex flex-col">
                                                   <span className="text-[#B0B0B0] text-[12px]">Time</span>
                                                   <span
                                                       className="text-[#5F5F5F] text-[13px] font-bold ">{event.startTime} - {event.endTime}</span>
                                               </div>
                                           </div>
                                           <div className="flex flex-row items-center gap-2">
                                               <div>
                                                   <FontAwesomeIcon icon={faClock} className="text-[#D8D8D8]"/>
                                               </div>
                                               <div className="flex flex-col">
                                                   <span className="text-[#B0B0B0] text-[12px]">Date</span>
                                                   <span
                                                       className="text-[#5F5F5F] text-[13px] font-bold">{event.Date.split('-').reverse().join('-')}</span>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           ))
                       ) : (
                           <p>Geen evenementen gevonden.</p>
                       )}
                   </div>
                   <div className='w-full'>
                       <Pagination
                           className='mt-4 flex justify-end w-full'
                           count={pageNumbers.length}
                           page={currentPage}
                           variant="outlined"
                           shape="rounded"
                           color="secondary"
                           onChange={(event, page) => this.paginate(page)}
                       />
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
                   {/* Render the event information in the drawer */}
                   <button onClick={() => this.setState({drawerOpen: false})} className='mr-auto px-10 pt-10'>
                       <FontAwesomeIcon className='text-[#E1E1E1] text-[20px]' icon={faXmark}/></button>
                   {selectedEvent && (
                       <div className="px-10 mb-[10%]">
                           <h1 className="mt-[10%] text-[#792F82] font-bold text-[23px] flex flex-row justify-between items-center border-b-[1px] border-[#E8E8E8] pb-5">
                               {selectedEvent.Title}
                               <div className='flex flex-row gap-4 items-center'>
                                   <button

                                       onClick={() => window.location.replace(`evenementen?modal=5&eventid=${selectedEvent.EventsID}`)}
                                       className='hover:bg-[#cdced1] duration-300 transition-all h-[40px] w-[40px] rounded-[10px] bg-gray-200 font-bold text-[15px] flex justify-center items-center'>
                                       <FontAwesomeIcon
                                           icon={faPenToSquare}/>
                                   </button>
                                   <button
                                       onClick={() => this.deleteEvent(selectedEvent)}
                                       className='bg-red-500 h-[40px] w-[40px]  rounded-[10px] text-white font-bold text-[15px] hover:bg-[#cf3a3a] duration-300 transition-all'>
                                       <FontAwesomeIcon icon={faTrash}/>
                                   </button>
                                   {parseInt(selectedEvent.IsExternal) === 0 ? (
                                       <span
                                           className="px-[9px] py-[3px] bg-[#BAFFA1] rounded-[100px] p-1 text-[#02BB15] text-[13px]">Internal</span>
                                   ) : (
                                       <span
                                           className="px-[9px] py-[3px] bg-[#FFCEA1] rounded-[100px] p-1 text-[#EE5600] text-[13px]">External</span>
                                   )}
                               </div>
                           </h1>
                           <div className="mt-4 flex flex-col">
                               <FetchUserDetails userId={selectedEvent.Host} showNameOnly='false'/>
                           </div>

                           <Tabs
                               value={this.state.selectedTab}
                               className="mt-4 mb-4"
                               onChange={this.handleTabChange}
                               aria-label="Event Details"
                               style={{display: 'flex', justifyContent: 'space-between'}}
                           >
                               <Tab
                                   label={<FontAwesomeIcon icon={faFileLines}/>}
                                   className={
                                       this.state.selectedTab === 0
                                           ? 'active-tab !bg-[#FFFFFF] !rounded-r-[8px] tab-width text-black font-bold'
                                           : '!bg-[#F6F8FC] !rounded-r-[0px] tab-width'
                                   }
                               />
                               <Tab
                                   label=<FontAwesomeIcon icon={faPeopleGroup}/>
                               onClick={() => this.getUsersInEvent(selectedEvent.EventsID)}
                               className={
                               this.state.selectedTab === 1
                                   ? 'active-tab !bg-[#FFFFFF] !rounded-[8px] tab-width font-bold'
                                   : '!bg-[#F6F8FC] !rounded-r-[8px] tab-width'
                           }
                               />
                               <Tab
                                   label=<FontAwesomeIcon icon={faMessage}/>
                               onClick={() => {
                               this.getComments(selectedEvent);
                           }}
                               disabled={parseInt(selectedEvent.requestFeedback) === 0}

                               className={
                               this.state.selectedTab === 2
                                   ? 'active-tab !bg-[#FFFFFF] !rounded-l-[8px] tab-width font-bold'
                                   : '!bg-[#F6F8FC] !rounded-r-[8px] tab-width'
                           }
                               />
                           </Tabs>


                           {this.state.selectedTab === 0 && (
                               <>
                                   <div className='max-h-[270px] h-[100%] overflow-y-auto'>
                                       <p className='text-[#A9A9A9] break-words'>
                                           {selectedEvent.Description}
                                       </p>
                                   </div>
                                   <div className='buttons flex flex-col gap-2'>
                                       {/*{!dayjs(selectedEvent.Date).isBefore(dayjs()) && ()}*/}
                                       {this.calculateRemainingTime(selectedEvent) && (
                                           <button
                                               onClick={() => {
                                                   if (this.state.deelnemers.includes(parseInt(this.state.host))) {
                                                       this.handleLeaveEvent(selectedEvent);
                                                   } else {
                                                       this.handleJoinEvent(selectedEvent);
                                                   }


                                               }}
                                               className='w-full bg-[#792F82] py-3 px-8 rounded-[10px] text-white font-bold text-[20px] transition-all duration-300 hover:cursor-pointer hover:bg-[#5c2363]'>
                                               {this.state.deelnemers.includes(parseInt(this.state.host)) ? 'Afzeggen' : 'Aanmelden'}

                                           </button>
                                       )}

                                   </div>

                                   <>
                                       {this.state.deelnemers.includes(parseInt(this.state.host)) && selectedEvent.requestRating === "1" && dayjs(selectedEvent.Date).isBefore(dayjs()) && (
                                           <div className="pb-4">
                                               <h1 className='text-[#792F82] font-medium text-[18px] mt-4'>Vond het
                                                   leuk:</h1>

                                               <div className='flex flex-col gap-2'>
                                                   <div className='flex flex-row gap-2'>
                                                       <button
                                                           onClick={() => {
                                                               this.setState({
                                                                   votedInt: 1
                                                               }, () => {
                                                                   this.vote(selectedEvent);
                                                               });
                                                           }}
                                                           className='bg-[#09A719BD] w-[50%] h-[40px] text-[25px] rounded-[8px]'>
                                                           <FontAwesomeIcon className='text-white'
                                                                            icon={faThumbsUp}/>
                                                       </button>

                                                       <button
                                                           onClick={() => {
                                                               this.setState({
                                                                   votedInt: 2
                                                               }, () => {
                                                                   this.vote(selectedEvent);
                                                                   // window.location.reload();
                                                               });
                                                           }}
                                                           className='bg-[#DB3131] text-white w-[50%] h-[40px] text-[25px] rounded-[8px]'>
                                                           <FontAwesomeIcon icon={faThumbsDown}/>
                                                       </button>
                                                   </div>
                                                   <div className='w-full justify-between flex-row flex'>
                                                       <p className='text-[#5F5F5F]'>{selectedEvent.like} Likes</p>
                                                       <p className='text-[#5F5F5F]'>{selectedEvent.dislike} Likes</p>
                                                   </div>
                                               </div>
                                           </div>
                                       )}
                                   </>
                               </>
                           )}

                           {this.state.selectedTab === 1 && (
                               <div className='flex flex-col justify-between h-full'>
                                   <div className='grid grid-cols-2 gap-2 max-w-[100%] break-words'>

                                       {this.state.deelnemers && this.state.deelnemers.length > 0 ? (
                                           this.state.deelnemers.map((user, index) => (

                                               <div key={index} className='flex flex-col'>
                                                   <FetchUserDetails userId={user} showNameOnly='false'/>
                                               </div>
                                           ))
                                       ) : (
                                           <p>Geen deelnemers bij dit evenement</p>
                                       )}


                                   </div>
                                   {parseInt(this.state.tentative) === 1 && (
                                       <p className='text-[#6f6f6f6b] '>Confirmed
                                           Deelnemers: {this.state.confirmedPeople}</p>
                                   )}
                               </div>
                           )}

                           {this.state.selectedTab === 2 && (
                               <>
                                   <div className='flex flex-row mb-3'>
                                       <TextField
                                           label="Feedback"
                                           placeholder="Typ hier je feedback"
                                           multiline
                                           variant="standard"
                                           className='w-full'
                                           value={this.state.commentInput}
                                           onChange={(e) => this.setState({commentInput: e.target.value})}
                                       />
                                       <button
                                           onClick={() => {
                                               if (selectedEvent) {
                                                   this.postComment(selectedEvent);
                                                   this.setState({commentInput: ''});
                                               }
                                           }}
                                           className='p-3 bg-[#015fcc]'
                                       >
                                           <FontAwesomeIcon className='text-white' icon={faPaperPlane}/>
                                       </button>
                                   </div>

                                   <div className='flex flex-col gap-2 overflow-y-auto'>
                                       {this.state.comments && this.state.comments.length != null ? (

                                           this.state.comments.map((comment, index) => (
                                               <div key={index} className='flex flex-col'>
                                                   <FetchCommentDetails comment={comment.comment}
                                                                        userId={comment.account_id}/>

                                               </div>
                                           ))
                                       ) : (
                                           <p>Geen feedback in deze kamer</p>
                                       )}
                                   </div>


                               </>
                           )}
                       </div>
                   )}
               </Drawer>
           </>
       );
    }
}