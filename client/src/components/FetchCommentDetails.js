
import React from 'react';

class FetchCommentDetails extends React.Component {
    state = {
        name: '',
        lastname: '',
    };

    async componentDidMount() {
        const response = await fetch('/accounts/' + this.props.userId);
        const data = await response.json();
        this.setState({ name: data.FirstName, lastname: data.LastName});
    }

    render() {
        return (
            <>
                <div className='bg-[#f2f2f2] rounded-[4px] p-2 border-l-[4px] border-l-gray'>
                    <p className='font-[500]'>{this.props.comment}</p>
                    <span className='text-[12px]'>{this.state.name} {this.state.lastname}</span>
                </div>
            </>
        );
    }
}

export default FetchCommentDetails;