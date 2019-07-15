import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";

import "./ConnectionStatus.less";
import { PersonaSize, Facepile, OverflowButtonType } from "office-ui-fabric-react";
import { connectToGroup } from "../actions/estimation";
import { selectUsersInCurrentTeam } from "../selectors/usersSelectors";
import userShape from "../reducers/models/userShape";

const ConnectionStatus = props => {
    const {
        isConnected,
        isConnecting,
        isDisconnected,
        users
    } = props;

    if (isConnected) {
        const personas = users.map(user => ({
            imageUrl: user.imageUrl,
            personaName: user.displayName
        }));

        return (
            <Facepile
                personaSize={PersonaSize.size24}
                personas={personas}
                maxDisplayablePersonas={3}
                overflowButtonType={OverflowButtonType.descriptive}
                getPersonaProps={() => ({
                    hidePersonaDetails: true
                })}
                overflowButtonProps={{
                    ariaLabel: "More users",
                    style: {
                        height: "24px" // There seems to be a bug in UI fabric that messes up the size
                    }
                }}
            />
        );
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
        userId: ownProps.userId,
        users: selectUsersInCurrentTeam(state)
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
    userId: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(userShape).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus);
