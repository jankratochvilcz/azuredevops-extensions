import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";

import "./ConnectionStatus.less";
import { connectToGroup } from "../actions/estimation";

const ConnectionStatus = props => {
    const { isConnected, isConnecting, isDisconnected } = props;

    if (isConnected) {
        return <div className="connection-status-connected">Connected</div>;
    }

    if (isConnecting) {
        return <div className="connection-status-connecting">Connecting</div>;
    }

    if (isDisconnected) {
        return (
            <div
                role="button"
                className="connection-status-disconnected"
                tabIndex={0}
                onClick={() => props.connect(props.iterationPath, props.userId)}
                onKeyUp={() => props.connect(props.iterationPath, props.userId)}
            >
                <span>Disconnected (click to reconnect)</span>
            </div>
        );
    }

    return null;
};

const mapStateToProps = (state, ownProps) => {
    const user = _.find(state.user, x => x.id === state.applicationContext.userId);

    return {
        isConnecting: state.applicationContext.isConnecting,
        isDisconnected: state.applicationContext.isDisconnected,
        isConnected: user != null && user.isConnected,
        iterationPath: ownProps.iterationPath,
        userId: ownProps.userId
    };
};

const mapDispatchToProps = dispatch => ({
    connect: (iterationPath, userId) => dispatch(connectToGroup(iterationPath, userId))
});

ConnectionStatus.propTypes = {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isDisconnected: PropTypes.bool.isRequired,
    connect: PropTypes.func.isRequired,
    iterationPath: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus);
