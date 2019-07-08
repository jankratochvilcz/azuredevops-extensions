import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import sanitizeHtml from "sanitize-html";

import "./UserStoryDetail.less";
import { selectWorkItemRootUrl } from "../selectors/devOpsUrlSelectors";
import workItemShape from "../reducers/models/workItemShape";

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
            <h4 style={{ marginLeft: "0", marginBottom: "0" }} data-private>{workItem.title}</h4>
            <a
                href={`${urlRoot}${workItem.id}`}
                className="user-story-title-row"
                target="_blank"
                rel="noopener noreferrer"
                data-private
            >
                <span>{`${workItem.workItemType.toLowerCase()} #${workItem.id} by ${workItem.createdBy.displayName}`}</span>
            </a>

            <div
                data-private
                dangerouslySetInnerHTML={{
                    __html: sanitizedDescription
                }}
            />
        </div>
    );
};

UserStoryDetail.propTypes = {
    workItem: workItemShape.isRequired,
    urlRoot: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    urlRoot: selectWorkItemRootUrl(state)
});

export default connect(mapStateToProps)(UserStoryDetail);
