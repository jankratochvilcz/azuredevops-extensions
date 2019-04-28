import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import sanitizeHtml from "sanitize-html";

import "./UserStoryDetail.less";

const mixInTargetBlankAttributes = (tagName, attribs) => ({
    tagName: tagName,
    attribs: {
        ...attribs,
        target: "_blank",
        rel: "noopener noreferrer"
    }
});

const UserStoryDetail = props => {
    const { workItem, urlRoot } = props;

    const sanitizedDescription = sanitizeHtml(
        workItem.description,
        {
            transformTags: {
                a: mixInTargetBlankAttributes
            }
        }
    );

    return (
        <div className="user-story-container">
            <h4 style={{ marginLeft: "0", marginBottom: "0" }}>{workItem.title}</h4>
            <a href={`${urlRoot}${workItem.id}`} className="user-story-title-row" target="_blank" rel="noopener noreferrer">
                <span>{`${workItem.workItemType.toLowerCase()} #${workItem.id} by ${workItem.createdBy.displayName}`}</span>
            </a>

            <div dangerouslySetInnerHTML={{
                __html: sanitizedDescription
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
    urlRoot: `${state.applicationContext.collectionUri}${state.applicationContext.projectName}/_workitems/edit/`
});

export default connect(mapStateToProps)(UserStoryDetail);
