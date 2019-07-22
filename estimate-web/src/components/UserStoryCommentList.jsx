import React, { Component } from "react";
import {
    Spinner,
    Persona,
    Label,
    PersonaSize,
    FontSizes
} from "office-ui-fabric-react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { requestWorkItemGetComments } from "../actions/devops";
import workItemShape from "../reducers/models/workItemShape";

import "./UserStoryCommentList.less";
import timeAgo from "../utils/date";

class UserStoryCommentList extends Component {
    componentDidMount() {
        const { workItem, requestComments } = this.props;
        if (!workItem.commentsFetched) {
            requestComments();
        }
    }

    componentDidUpdate(previousProps) {
        const { workItem, requestComments } = this.props;

        if (workItem.commentsFetched) return;

        if (workItem.id !== previousProps.workItem.id) {
            requestComments();
        }
    }

    render() {
        const { workItem } = this.props;
        if (!workItem.commentsFetched) {
            return <Spinner className="fetching-comments-spinner" label="Loading comments..." />;
        }
        return (
            <div className="user-story-comments user-story-comment-grid-item">
                {workItem.comments.map(comment => (
                    <React.Fragment key={comment.id}>
                        <Persona
                            key={comment.createdBy.id}
                            size={PersonaSize.size32}
                            imageUrl={comment.createdBy.imageUrl}
                            hidePersonaDetails
                        />
                        <div className="user-story-comment">
                            <Label style={{ fontSize: FontSizes.smallPlus }}>
                                <span className="user-display-name">{comment.createdBy.displayName}</span>
                                <span>{` commented ${timeAgo(comment.createdDate)}`}</span>
                            </Label>
                            <div
                                className="body"
                                dangerouslySetInnerHTML={{
                                    __html: comment.text
                                }}
                            />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

UserStoryCommentList.propTypes = {
    workItem: workItemShape.isRequired,
    requestComments: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    requestComments: () => dispatch(requestWorkItemGetComments(ownProps.workItem.id))
});

export default connect(null, mapDispatchToProps)(UserStoryCommentList);
