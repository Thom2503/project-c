
import React from 'react';

class FetchUserDetails extends React.Component {
    state = {
        name: '',
        function: '',
    };

    async componentDidMount() {
        const response = await fetch('/accounts/' + this.props.userId);
        const data = await response.json();
        this.setState({ name: data.FirstName, function: data.Function });
    }

    render() {
        return (
            <>
                <span>{this.state.name}</span>
                <span className='text-[#5F5F5F] font-medium text-[17px]'>{this.props.name}</span>
                <span className='text-[10px] text-[#b8b8b8]'>{this.state.function}</span>
            </>
        );
    }
}

export default FetchUserDetails;