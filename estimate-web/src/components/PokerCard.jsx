import React from "react";
import PropTypes from "prop-types";

import "./PokerCard.less";

const PokerCard = props => {
    const { onClick, value, selected } = props;

    const classNames = ["poker-card"];

    if (selected) {
        classNames.push("card-selected");
    }

    return (
        <div
            className={classNames.join(" ")}
            onClick={() => onClick()}
            onKeyDown={() => onClick()}
            role="button"
            tabIndex="0"
        >
            <span>
                {value}
            </span>
        </div>
    );
};

PokerCard.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired
};

export default PokerCard;
