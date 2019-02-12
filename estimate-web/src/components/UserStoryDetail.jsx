import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./UserStoryDetail.less";

const UserStoryDetail = props => {
    const { workItem, urlRoot } = props;

    return (
        <div className="user-story-container">
            <h4 style={{ marginLeft: "0", marginBottom: "0" }}>{workItem.title}</h4>
            <a href={`${urlRoot}${workItem.id}`} className="user-story-title-row">
                <span>{`${workItem.workItemType.toLowerCase()} #${workItem.id} by ${workItem.createdBy.displayName}`}</span>
            </a>

            <div dangerouslySetInnerHTML={{
                __html: workItem.description
            }}
            />
        </div>
    );
};

UserStoryDetail.propTypes = {
    workItem: PropTypes.object.isRequired,
    urlRoot: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    urlRoot: `${state.devOps.context.collection.uri}${state.devOps.context.project.name}/_workitems/edit/`
});

export default connect(mapStateToProps)(UserStoryDetail);
