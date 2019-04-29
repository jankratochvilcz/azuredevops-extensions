import React, { Component } from "react";
import {
    Spinner, Persona, PersonaSize, Label
} from "office-ui-fabric-react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { requestWorkItemGetComments } from "../actions/devops";
import workItemShape from "../reducers/models/workItemShape";

import "./UserStoryCommentList.less";

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
                    <React.Fragment>
                        <Persona
                            key={comment.createdBy.id}
                            size={PersonaSize.size40}
                            imageUrl={comment.createdBy.imageUrl}
                            hidePersonaDetails
                        />
                        <div>
                            <Label>{comment.createdBy.displayName}</Label>
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
    comments: state.workItem.find(x => x.id === state.applicationContext.activeWorkItemId).comments
});

const mapDispatchToProps = dispatch => ({
    requestComments: workItemId => dispatch(requestWorkItemGetComments(workItemId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStoryCommentList);
