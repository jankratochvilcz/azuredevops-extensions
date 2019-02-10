import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PersonaSize, Persona, PersonaPresence } from "office-ui-fabric-react";
import _ from "underscore";
import "./EstimationSession.css";
import UserStoryList from "./UserStoryList";
import PokerCard from "./PokerCard";
import { getTeam, getWorkItems } from "../actions";
import { connectToGroup, requestVote } from "../actions/estimation";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.onSelectedWorkItemIdChanged = this.onSelectedWorkItemIdChanged.bind(this);
        this.cardClicked = this.cardClicked.bind(this);

        this.state = {
            selectedUserStory: null
        };
    }

    componentDidMount() {
        const {
            iterationPath,
            teamId,
            userId,
            projectId,
            dispatch
        } = this.props;

        dispatch(getTeam(
            teamId,
            projectId,
            () => dispatch(connectToGroup(iterationPath, userId))
        ));

        dispatch(getWorkItems(iterationPath));
    }

    onSelectedWorkItemIdChanged(workItemId) {
        const { workItems } = this.props;

        this.setState({
            selectedUserStory: _.find(workItems, x => x.id === workItemId)
        });
    }

    cardClicked(value) {
        const { userId, iterationPath } = this.props;
        const { selectedUserStory } = this.state;

        if (selectedUserStory === null) {
            return;
        }

        requestVote(
            userId,
            iterationPath,
            selectedUserStory.id,
            value
        );
    }

    render() {
        const { selectedUserStory } = this.state;
        const { workItems, cardValues, users } = this.props;

        return (
            <div className="component-root">
                <div className="left-pane">
                    <div className="to-vote-row">
                        <UserStoryList
                            title="Remaining"
                            columns={["title", "createdBy"]}
                            selectedUserStoryId={(selectedUserStory != null
                                ? selectedUserStory.id
                                : null)}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={workItems.filter(x => x.storyPoints == null)}
                        />
                    </div>
                    <div className="voted-row">
                        <UserStoryList
                            title="Scored"
                            columns={["title", "storyPoints"]}
                            selectedUserStoryId={(selectedUserStory != null
                                ? selectedUserStory.id
                                : null)}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={workItems.filter(x => x.storyPoints != null)}
                        />
                    </div>
                    <div className="abandoned-row">
                        <UserStoryList
                            title="Abandoned"
                            selectedUserStoryId={(selectedUserStory != null
                                ? selectedUserStory.id
                                : null)}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            columns={["title"]}
                        />
                    </div>
                </div>
                <div className="center-pane">
                    <h4>Your Vote</h4>
                    <div className="poker-cards-container">
                        {cardValues.map(cardValue => (
                            <PokerCard
                                value={cardValue}
                                key={cardValue}
                                onClick={() => this.cardClicked(cardValue)}
                            />
                        ))}
                    </div>
                    <h4>Team</h4>

                    <div className="users-container">
                        {_.sortBy(users, x => !x.connected).map(user => (
                            <Persona
                                key={user.id}
                                size={user.connected ? PersonaSize.size40 : PersonaSize.size24}
                                hidePersonaDetails={!user.connected}
                                imageUrl={user.imageUrl}
                                text={user.displayName}
                                presence={(user.connected
                                    ? PersonaPresence.online
                                    : PersonaPresence.offline)}
                            />
                        ))}
                    </div>

                    <h4>Current Work Item</h4>
                    {selectedUserStory
                        && (
                            <div className="user-story-container">
                                <h3>
                                    <a href={selectedUserStory.url}>
                                        <span>{selectedUserStory.workItemType}</span>
                                        <span>&nbsp;</span>
                                        <span>{selectedUserStory.id}</span>
                                    </a>
                                    <span>&nbsp;</span>
                                    {selectedUserStory.title}
                                </h3>
                                <div dangerouslySetInnerHTML={{
                                    __html: selectedUserStory.description
                                }}
                                />
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    userId: state.devOps.context.user.id,
    teamId: state.devOps.context.team.id,
    projectId: state.devOps.context.project.id,
    users: state.devOps.teams[state.devOps.context.team.id],
    workItems: state.devOps.workItems[ownProps.match.params.iterationPath],
    cardValues: state.enums.cardDecks[0].cardValues,
    iterationPath: ownProps.match.params.iterationPath
});

EstimationSession.defaultProps = {
    workItems: [],
    users: []
};

EstimationSession.propTypes = {
    iterationPath: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    teamId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    workItems: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.arrayOf(PropTypes.object),
    cardValues: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default connect(mapStateToProps)(EstimationSession);
