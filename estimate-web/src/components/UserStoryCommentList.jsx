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
        const { workItem, requestComments } = this.props;
        requestComments(workItem.id);
    }

    render() {
        const { comments } = this.props;
        if (!comments) {
            return <Spinner label="Loading..." />;
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
                            <div dangerouslySetInnerHTML={{
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
    comments: PropTypes.arrayOf(PropTypes.object).isRequired
};

UserStoryCommentList.propTypes = {
    workItem: workItemShape.isRequired,
    requestComments: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    comments: state.workItem
        && state.workItem.find(x => x.id === state.applicationContext.selectedWorkItemId).comments
});

const mapDispatchToProps = dispatch => ({
    requestComments: workItemId => dispatch(requestWorkItemGetComments(workItemId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStoryCommentList);
