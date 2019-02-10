import React, { Component } from "react";
import PropTypes from "prop-types";
import { PersonaSize, Persona, PersonaPresence } from "office-ui-fabric-react";

import "./EstimatorPersona.css";


class EstimatorPersona extends Component {
    constructor(props) {
        super(props);

        this.renderAvatarCoin = this.renderAvatarCoin.bind(this);
    }

    static getPresence(connected, vote) {
        if (!connected) {
            return PersonaPresence.offline;
        }

        return vote !== null
            ? PersonaPresence.online
            : PersonaPresence.away;
    }

    renderAvatarCoin() {
        const { vote } = this.props;

        return <div className="voted-persona">{vote}</div>;
    }

    render() {
        const { user, vote } = this.props;

        return (
            <Persona
                key={user.id}
                size={user.connected ? PersonaSize.size40 : PersonaSize.size24}
                hidePersonaDetails={!user.connected}
                imageUrl={user.imageUrl}
                text={user.displayName}
                onRenderCoin={vote != null ? this.renderAvatarCoin : undefined}
                presence={EstimatorPersona.getPresence(user.connected, vote)}
            />
        );
    }
}

EstimatorPersona.defaultProps = {
    vote: null
};

EstimatorPersona.propTypes = {
    user: PropTypes.object.isRequired,
    vote: PropTypes.string
};

export default EstimatorPersona;
