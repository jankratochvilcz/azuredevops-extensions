import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";
import {
    PrimaryButton,
    DefaultButton
} from "office-ui-fabric-react";

import "./EstimatePage.less";
import UserStoryList from "../UserStoryList";
import PokerCard from "../PokerCard";
import {
    getTeam,
    getWorkItems,
    updateStoryPoints,
    removeStoryPoints
} from "../../actions";
import {
    connectToGroup,
    requestVote,
    revealVotes,
    switchActiveWorkItem
} from "../../actions/estimation";
import EstimatorPersona from "../EstimatorPersona";
import { average, sum } from "../../utils/math";
import UserStoryDetail from "../UserStoryDetail";
import ConnectionStatus from "../ConnectionStatus";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.onactiveWorkItemIdChanged = this.onactiveWorkItemIdChanged.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
        this.saveEstimate = this.saveEstimate.bind(this);
        this.resetEstimate = this.resetEstimate.bind(this);
        this.revealVotes = this.revealVotes.bind(this);
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

    static getStoryPoints(votes) {
        return average(votes
            .filter(x => !Number.isNaN(x.value))
            .map(x => Number.parseInt(x.value, 10)));
    }

    onactiveWorkItemIdChanged(workItemId) {
        const { userId, iterationPath, dispatch } = this.props;
        dispatch(switchActiveWorkItem(userId, iterationPath, workItemId));
    }

    saveEstimate(storyPoints) {
        const {
            dispatch,
            iterationPath,
            activeWorkItemId,
            workItems,
            userId
        } = this.props;

        dispatch(updateStoryPoints(
            activeWorkItemId,
            storyPoints,
            iterationPath
        ));

        const sortedWorkItemsLeft = _.sortBy(
            workItems.filter(x => x.storyPoints == null),
            x => x.stackRank
        );

        const currentWorkItemIndex = _.findIndex(
            sortedWorkItemsLeft,
            x => x.id === activeWorkItemId
        );

        if (currentWorkItemIndex < 0 || currentWorkItemIndex > sortedWorkItemsLeft.length - 1) {
            return;
        }

        const nextWorkItem = _.first(_.rest(sortedWorkItemsLeft, currentWorkItemIndex + 1));

        dispatch(switchActiveWorkItem(userId, iterationPath, nextWorkItem.id));
    }

    resetEstimate() {
        const { dispatch, iterationPath, activeWorkItemId } = this.props;

        dispatch(removeStoryPoints(
            activeWorkItemId,
            iterationPath
        ));
    }

    revealVotes() {
        const { iterationPath, userId, activeWorkItemId } = this.props;

        revealVotes(
            userId,
            iterationPath,
            activeWorkItemId
        );
    }

    cardClicked(value) {
        const { userId, iterationPath, activeWorkItemId } = this.props;

        if (activeWorkItemId === null) {
            return;
        }

        requestVote(
            userId,
            iterationPath,
            activeWorkItemId,
            value
        );
    }

    render() {
        const {
            workItems,
            cardValues,
            users,
            votes,
            userId,
            activeWorkItemId
        } = this.props;

        const selectedWorkItem = activeWorkItemId !== null
            ? _.find(workItems, x => x.id === activeWorkItemId)
            : null;

        const votesForSelectedWorkItem = activeWorkItemId !== null
            ? votes.filter(x => x.workItemId === activeWorkItemId)
            : [];

        const storyPoints = EstimationSession.getStoryPoints(votesForSelectedWorkItem);

        const workItemsOrdered = _.sortBy(workItems, x => x.stackRank);
        const storyPointsTotal = Math.round(sum(workItems
            .filter(x => x.storyPoints !== null && x.storyPoints !== undefined)
            .map(x => x.storyPoints)));

        return (
            <div className="component-root">
                <div className="left-pane">
                    <div className="to-vote-row">
                        <div className="work-items-title-row">
                            <h4>Work Items</h4>
                            <div>{`${workItemsOrdered.length} work items left`}</div>
                            <div>{`${storyPointsTotal} total story points`}</div>
                        </div>
                        <UserStoryList
                            title="Work Items"
                            columns={["title", "storyPoints"]}
                            selectedUserStoryId={(selectedWorkItem != null
                                ? selectedWorkItem.id
                                : null)}
                            onSelectedUserStoryIdChanged={this.onactiveWorkItemIdChanged}
                            items={workItemsOrdered}
                        />
                    </div>
                </div>
                <div className="center-pane">
                    <div className="vote-title-container">
                        <h4 className="vote-title-text">Voting</h4>
                        <ConnectionStatus />
                    </div>
                    <div className="cards-alignment-container">
                        <div className="poker-cards-container">
                            {cardValues.map(cardValue => (
                                <PokerCard
                                    value={cardValue}
                                    key={cardValue}
                                    selected={_.some(
                                        votes,
                                        x => x.userId === userId
                                            && x.workItemId === activeWorkItemId
                                            && x.value === cardValue
                                    )}
                                    onClick={() => this.cardClicked(cardValue)}
                                />
                            ))}
                        </div>
                        {selectedWorkItem === null && (
                            <div className="cards-overlay">
                                <span className="cards-overlay-info">Pick a work item to start scoring</span>
                            </div>
                        )}
                    </div>

                    <div className="users-container">
                        {_.sortBy(users, x => !x.connected).map(user => (
                            <EstimatorPersona
                                key={user.id}
                                user={user}
                                votesRevealed={(selectedWorkItem != null
                                    ? selectedWorkItem.votesRevealed
                                    : false)}
                                vote={_.some(votesForSelectedWorkItem, x => x.userId === user.id)
                                    ? _.find(votesForSelectedWorkItem, x => x.userId === user.id)
                                        .value
                                    : null}
                            />
                        ))}
                    </div>

                    <div className="voting-control-container">
                        {selectedWorkItem !== null && !selectedWorkItem.votesRevealed && (
                            <PrimaryButton
                                onClick={() => this.revealVotes()}
                                text="Reveal votes"
                                disabled={!_.some(votesForSelectedWorkItem)}
                                style={{ marginRight: "10px" }}
                            />
                        )}
                        {selectedWorkItem !== null && selectedWorkItem.votesRevealed && (
                            <PrimaryButton
                                onClick={() => this.saveEstimate(storyPoints)}
                                text={`Save ${storyPoints} story points`}
                                style={{ marginRight: "10px" }}
                            />
                        )}
                        {selectedWorkItem !== null && selectedWorkItem.storyPoints !== undefined && (
                            <DefaultButton
                                text="Reset &amp; revote"
                                onClick={() => this.resetEstimate()}
                            />
                        )}
                    </div>

                    {selectedWorkItem && <UserStoryDetail workItem={selectedWorkItem} />}
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
    iterationPath: ownProps.match.params.iterationPath,
    votes: state.devOps.votes,
    activeWorkItemId: state.devOps.activeWorkItemId
});

EstimationSession.defaultProps = {
    workItems: [],
    users: [],
    activeWorkItemId: null
};

EstimationSession.propTypes = {
    iterationPath: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    teamId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    workItems: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.arrayOf(PropTypes.object),
    cardValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    votes: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeWorkItemId: PropTypes.number
};

export default connect(mapStateToProps)(EstimationSession);
