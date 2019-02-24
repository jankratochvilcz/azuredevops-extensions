import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./ConnectionStatus.less";

const ConnectionStatus = props => {
    const { isConnected, isConnecting } = props;

    if (isConnected) {
        return <div className="connection-status-connected">Connected</div>;
    }

    if (isConnecting) {
        return <div className="connection-status-connecting">Connecting</div>;
    }

    return <div className="connection-status-disconnected">Disconnected</div>;
};

const mapStateToProps = state => ({
    isConnected: state.connection.isConnected,
    isConnecting: state.connection.isConnecting
});

ConnectionStatus.propTypes = {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(ConnectionStatus);
