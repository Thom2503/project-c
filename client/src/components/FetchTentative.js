import React from 'react';
import dayjs from 'dayjs';

import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class FetchTentative extends React.Component {
    state = {
        confirmed: 0,
        foundHit: 0,
    };

    async componentDidMount() {
        this.fetchAccountEvents();
    }

    async fetchAccountEvents() {
        try {
            const response = await fetch(`/accountevents/` + this.props.eventId);
            const data = await response.json();

            const accountEntry = data.find(entry => entry.account_id === this.props.accountId);

            // Update state based on the found entry
            if (accountEntry) {
                this.setState({
                    confirmed: parseInt(accountEntry.confirmed),
                    foundHit: 1,
                });
            }
        } catch (error) {
            console.error('Error fetching account events:', error);
        }
    }

    async updateAccountEvents() {
        try {
            const response = await fetch('/accountevents/' + this.props.eventId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountid: parseInt(this.props.accountId),
                    eventid: parseInt(this.props.eventId),
                    confirmed: 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to vote: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
        } catch (e) {
            console.error('Error updating account events:', e);
        }
    }


    render() {
        return (
            this.state.confirmed === 0 && this.state.foundHit === 1 && (
                <div className='sm:mx-[20px] w-full bg-[#f0f0f0] mt-2 p-3 rounded-[10px] flex flex-row justify-between'>
                    <p className='text-[13px] text-gray-600'>Klik op de knop om je aanwezigheid te verifiëren</p>
                    <button
                        onClick={() => {
                            this.updateAccountEvents();
                        }}
                        className='px-1 bg-[#792f82] rounded-[4px]'><FontAwesomeIcon className='text-white' icon={faCheck}/></button>
                </div>
            )
        );
    }
}

export default FetchTentative;
