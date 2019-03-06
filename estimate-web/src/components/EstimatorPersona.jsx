import React, { Component } from "react";
import PropTypes from "prop-types";
import { PersonaSize, Persona, PersonaPresence } from "office-ui-fabric-react";

import "./EstimatorPersona.less";


class EstimatorPersona extends Component {
    constructor(props) {
        super(props);

        this.renderVote = this.renderVote.bind(this);
    }

    static getPresence(isConnected, vote) {
        if (!isConnected) {
            return PersonaPresence.offline;
        }

        return vote !== null
            ? PersonaPresence.online
            : PersonaPresence.away;
    }

    renderVote() {
        const { vote } = this.props;

        return <div className="voted-persona">{vote}</div>;
    }

    render() {
        const { user, vote, votesRevealed } = this.props;

        return (
            <Persona
                key={user.id}
                size={user.isConnected ? PersonaSize.size40 : PersonaSize.size24}
                hidePersonaDetails={!user.isConnected}
                imageUrl={user.imageUrl}
                text={user.displayName}
                onRenderCoin={vote != null && votesRevealed ? this.renderVote : undefined}
                presence={EstimatorPersona.getPresence(user.isConnected, vote)}
            />
        );
    }
}

EstimatorPersona.defaultProps = {
    vote: null,
    votesRevealed: false
};

EstimatorPersona.propTypes = {
    user: PropTypes.object.isRequired,
    vote: PropTypes.string,
    votesRevealed: PropTypes.bool
};

export default EstimatorPersona;
