import React, { Component } from "react";
import {
    Spinner, Persona, PersonaSize, Label
} from "office-ui-fabric-react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { requestWorkItemGetComments } from "../actions/devops";
import workItemShape from "../reducers/models/workItemShape";

import "./UserStoryCommentList.less";
import timeAgo from "../utils/date";

class UserStoryCommentList extends Component {
    componentDidMount() {
        const { workItem, requestComments, commentsFetched } = this.props;
        if (!commentsFetched) {
            requestComments(workItem.id);
        }
    }

    componentDidUpdate(previousProps) {
        const { workItem, requestComments, commentsFetched } = this.props;

        if (commentsFetched) return;

        if (workItem.id !== previousProps.workItem.id) {
            requestComments(workItem.id);
        }
    }

    render() {
        const { comments, commentsFetched } = this.props;
        if (!commentsFetched) {
            return <Spinner label="Loading comments..." />;
        }
        return (
            <div className="user-story-comments">
                {comments.map(comment => (
                    <React.Fragment key={comment.id}>
                        <Persona
                            key={comment.createdBy.id}
                            size={PersonaSize.size40}
                            imageUrl={comment.createdBy.imageUrl}
                            hidePersonaDetails
                        />
                        <div className="user-story-comment">
                            <Label>
                                <span className="user-display-name">{comment.createdBy.displayName}</span>
                                <span> commented</span>
                                <span>
                                    {" "}
                                    {timeAgo(comment.createdDate)}
                                </span>
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
    requestComments: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object),
    commentsFetched: PropTypes.bool
};

UserStoryCommentList.defaultProps = {
    commentsFetched: false,
    comments: []
};

// TODO (CK): rewrite using filters
const mapStateToProps = state => ({
    comments: state.workItem
        && state.workItem.find(x => x.id === state.applicationContext.selectedWorkItemId).comments,
    commentsFetched: state.workItem.find(x => x.id === state.applicationContext.selectedWorkItemId)
        .commentsFetched
});

const mapDispatchToProps = dispatch => ({
    requestComments: workItemId => dispatch(requestWorkItemGetComments(workItemId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStoryCommentList);
