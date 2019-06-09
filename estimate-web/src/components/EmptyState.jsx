import React from "react";
import PropTypes from "prop-types";

import "./EmptyState.less";

const EmptyState = ({
    image,
    title,
    body
}) => (
    <div className="empty-state-container">
        <img
            src={image}
            className="illustration"
            alt="Empty state"
        />
        { title && <div className="empty-state-title">{title}</div> }
        { body && <div className="empty-state-body">{body}</div> }
    </div>
);

EmptyState.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string
};

EmptyState.defaultProps = {
    image: null,
    title: null,
    body: null
};

export default EmptyState;
