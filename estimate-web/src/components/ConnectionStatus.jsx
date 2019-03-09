import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";

import "./ConnectionStatus.less";

const ConnectionStatus = props => {
    const { isConnected, isConnecting } = props;

    if (isConnected) {
        return <div className="connection-status-connected">Connected</div>;
    }

    if (isConnecting) {
        return <div className="connection-status-connecting">Connecting</div>;
    }

    return <div className="connection-status-disconnected">Disconnected (reconnecting in two seconds)</div>;
};

const mapStateToProps = state => {
    const user = _.find(state.user, x => x.id === state.applicationContext.userId);

    return {
        isConnecting: state.applicationContext.isConnecting,
        isConnected: user != null && user.isConnected
    };
};

ConnectionStatus.propTypes = {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(ConnectionStatus);
