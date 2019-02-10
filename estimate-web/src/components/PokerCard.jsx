import React from "react";
import PropTypes from "prop-types";

import "./PokerCard.css";

const PokerCard = props => {
    const { onClick, value } = props;

    return (
        <div
            className="poker-card"
            onClick={() => onClick()}
            onKeyDown={() => onClick()}
            role="button"
            tabIndex="0"
        >
            <span className="poker-card-title">
                {value}
            </span>
        </div>
    );
};

PokerCard.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

export default PokerCard;
