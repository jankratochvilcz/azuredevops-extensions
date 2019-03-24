import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";
import {
    PrimaryButton,
    DefaultButton,
    IconButton
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

        this.onactiveWorkItemIdChanged = this.onSelectedWorkItemIdChanged.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
        this.saveEstimate = this.saveEstimate.bind(this);
        this.resetEstimate = this.resetEstimate.bind(this);
        this.revealVotes = this.revealVotes.bind(this);
        this.markSelectedWorkItemIdAsActive = this.markSelectedWorkItemIdAsActive.bind(this);
        this.getStoryPoints = this.getStoryPoints.bind(this);

        this.state = {
            selectedWorkItemId: null,
            previousActiveWorkItemId: null
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

    static getDerivedStateFromProps(props, state) {
        const { previousActiveWorkItemId } = state;
        const { activeWorkItemId } = props;

        if (previousActiveWorkItemId === activeWorkItemId) {
            return state;
        }

        return {
            ...state,
            previousActiveWorkItemId: activeWorkItemId,
            selectedWorkItemId: activeWorkItemId
        };
    }

    onSelectedWorkItemIdChanged(workItemId) {
        this.setState({
            selectedWorkItemId: workItemId
        });
    }

    getStoryPoints(votes) {
        const { cardValues } = this.props;

        const voteValues = votes
            .map(x => _.find(cardValues, y => y.title === x.value).value)
            .filter(x => !Number.isNaN(x));

        if (voteValues.length < 1) {
            return NaN;
        }

        return average(voteValues);
    }

    markSelectedWorkItemIdAsActive() {
        const { selectedWorkItemId } = this.state;

        if (selectedWorkItemId == null) {
            return;
        }

        const { userId, iterationPath, dispatch } = this.props;

        dispatch(switchActiveWorkItem(
            userId,
            iterationPath,
            selectedWorkItemId
        ));
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
        const {
            dispatch,
            iterationPath,
            activeWorkItemId,
            userId
        } = this.props;

        dispatch(removeStoryPoints(
            activeWorkItemId,
            iterationPath
        ));

        dispatch(switchActiveWorkItem(
            userId,
            iterationPath,
            activeWorkItemId
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
            activeWorkItemId,
            isActiveWorkItemRevealed,
            iterationPath,
            dispatch
        } = this.props;

        const {
            selectedWorkItemId
        } = this.state;

        const selectedWorkItem = selectedWorkItemId !== null
            ? _.find(workItems, x => x.id === selectedWorkItemId)
            : null;

        const isSelectedWorkItemInEstimation = activeWorkItemId != null
            && selectedWorkItemId === activeWorkItemId;

        const votesForActiveWorkItem = selectedWorkItemId !== null
            ? votes.filter(x => x.workItemId === selectedWorkItemId)
            : [];

        const storyPoints = this.getStoryPoints(votesForActiveWorkItem);

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
                            <div className="refresh-button">
                                <IconButton
                                    className="refreshButton"
                                    iconProps={{ iconName: "Refresh" }}
                                    title="Reload User Stories"
                                    ariaLabel="ReloadUserStories"
                                    onClick={() => dispatch(getWorkItems(iterationPath))}
                                />
                            </div>
                        </div>
                        <UserStoryList
                            title="Work Items"
                            columns={["title", "storyPoints"]}
                            selectedUserStoryId={(selectedWorkItem != null
                                ? selectedWorkItem.id
                                : null)}
                            onSelectedUserStoryIdChanged={(
                                id => this.onSelectedWorkItemIdChanged(id))}
                            items={(workItemsOrdered.map(x => ({
                                ...x,
                                isBeingScored: x.id === activeWorkItemId
                            })))}
                        />
                    </div>
                </div>
                <div className="center-pane">
                    {/* https://stackoverflow.com/questions/21515042/scrolling-a-flexbox-with-overflowing-content */}
                    <div className="scrollable-flex">
                        <div className="vote-title-container">
                            <h4 className="vote-title-text">Voting</h4>
                            <ConnectionStatus />
                        </div>
                        <div className="cards-alignment-container">
                            <div className="poker-cards-container">
                                {cardValues.map(cardValue => (
                                    <PokerCard
                                        value={cardValue.title}
                                        key={cardValue.title}
                                        selected={_.some(
                                            votes,
                                            x => x.userId === userId
                                            && x.workItemId === activeWorkItemId
                                            && x.value === cardValue.title
                                        )}
                                        onClick={() => this.cardClicked(cardValue.title)}
                                    />
                                ))}
                            </div>
                            {!isSelectedWorkItemInEstimation && (
                                <div
                                    className="cards-overlay"
                                    onKeyPress={() => this.markSelectedWorkItemIdAsActive()}
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => this.markSelectedWorkItemIdAsActive()}
                                >
                                    {selectedWorkItem != null && (
                                        <div className="cards-overlay-info">
                                            <div className="cards-overlay-title">
                                                <span>Start scoring &nbsp;</span>
                                                <span className="cards-overlay-info-work-item-title">{selectedWorkItem.title}</span>
                                            </div>
                                            <div>Click here to move the whole team to this work item and start scoring it.</div>
                                        </div>
                                    )}
                                    {selectedWorkItem == null && (
                                        <div className="cards-overlay-info">
                                            <div className="cards-overlay-title">Pick a work item</div>
                                            <div>Pick a work item from the &quot;Work Items&quot; list.</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="users-container">
                            {_.sortBy(users, x => !x.isConnected).map(user => (
                                <EstimatorPersona
                                    key={user.id}
                                    user={user}
                                    votesRevealed={isActiveWorkItemRevealed}
                                    vote={_.some(votesForActiveWorkItem, x => x.userId === user.id)
                                        ? _.find(votesForActiveWorkItem, x => x.userId === user.id)
                                            .value
                                        : null}
                                />
                            ))}
                        </div>

                        <div className="voting-control-container">
                            {isSelectedWorkItemInEstimation && !isActiveWorkItemRevealed && (
                                <PrimaryButton
                                    onClick={() => this.revealVotes()}
                                    text="Reveal votes"
                                    disabled={!_.some(votesForActiveWorkItem)}
                                    style={{ marginRight: "10px" }}
                                />
                            )}
                            {isSelectedWorkItemInEstimation && isActiveWorkItemRevealed && !Number.isNaN(storyPoints) && (
                                <PrimaryButton
                                    onClick={() => this.saveEstimate(storyPoints)}
                                    text={`Save ${storyPoints} story points`}
                                    style={{ marginRight: "10px" }}
                                />
                            )}
                            {isSelectedWorkItemInEstimation && isActiveWorkItemRevealed && (
                                <DefaultButton
                                    text="Reset &amp; revote"
                                    onClick={() => this.resetEstimate()}
                                />
                            )}
                        </div>

                        {selectedWorkItem && <UserStoryDetail workItem={selectedWorkItem} />}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    userId: state.applicationContext.userId,
    teamId: state.applicationContext.teamId,
    projectId: state.applicationContext.projectId,
    users: state.user.filter(x => x.teamId === state.applicationContext.teamId),
    workItems: state.workItem.filter(x => x.iterationPath === ownProps.match.params.iterationPath),
    cardValues: state.enums.cardDecks[0].cardValues,
    iterationPath: ownProps.match.params.iterationPath,
    votes: state.vote,
    activeWorkItemId: state.applicationContext.activeWorkItemId,
    isActiveWorkItemRevealed: state.applicationContext.isActiveWorkItemRevealed
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
    activeWorkItemId: PropTypes.number,
    isActiveWorkItemRevealed: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(EstimationSession);
