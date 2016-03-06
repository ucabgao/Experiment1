import React from 'react';

export default class Info extends React.Component {
    render() {
        const message = this.props.message;
        return (
            <span className='message-info'>{message.msg}</span>
        );
    }
}

Info.propTypes = {
    message: React.PropTypes.shape({
        msg: React.PropTypes.string.isRequired
    }).isRequired
};
