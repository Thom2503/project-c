
import React from 'react';

class FetchUserDetails extends React.Component {
    state = {
        name: '',
        function: '',
        showNameOnly: 'false'
    };

    async componentDidMount() {
        const response = await fetch('/accounts/' + this.props.userId);
        const data = await response.json();
        this.setState({ name: data.FirstName, function: data.Function , showNameOnly: this.props.showNameOnly});
    }

    render() {
        return (
            <>
                <span>{this.state.name}</span>
                {this.state.showNameOnly === 'false' ?
                <span className='text-[10px] text-[#b8b8b8]'>{this.state.function}</span> :
                ''  }

                </>
                );
            }
                }

                export default FetchUserDetails;