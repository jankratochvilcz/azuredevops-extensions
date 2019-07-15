import React from "react";
import PropTypes from "prop-types";

import "./EmptyState.less";

const EmptyState = ({
    image,
    title,
    body,
    children
}) => (
    <div className="empty-state-container">
        <img
            src={image}
            className="illustration"
            alt="Empty state"
        />
        { title && <div data-private className="empty-state-title">{title}</div> }
        { body && <div data-private className="empty-state-body">{body}</div> }

        { children && <div className="empty-state-children">{children}</div>}
    </div>
);

EmptyState.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    children: PropTypes.element
};

EmptyState.defaultProps = {
    image: null,
    title: null,
    body: null,
    children: null
};

export default EmptyState;
