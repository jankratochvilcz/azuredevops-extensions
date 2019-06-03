import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";
import {
    PrimaryButton,
    DefaultButton,
    IconButton,
    Spinner,
    SpinnerSize
} from "office-ui-fabric-react";

import UserStoryList from "../UserStoryList";
import PokerCard from "../PokerCard";
import {
    requestTeam,
    requestWorkItems,
    requestWorkItemUpdateStoryPointsUpdate,
    requestWorkItemUpdateStoryPointsRemove,
    requestIterations
} from "../../actions/devops";
import {
    connectToGroup,
    requestVote,
    requestSwitchActiveWorkItem,
    requestVotesRevealed
} from "../../actions/estimation";
import EstimatorPersona from "../EstimatorPersona";
import { average, sum } from "../../utils/math";
import UserStoryDetail from "../UserStoryDetail";
import ConnectionStatus from "../ConnectionStatus";
import { selectIterationUrl } from "../../selectors/devOpsUrlSelectors";
import iterationShape from "../../reducers/models/iterationShape";
import { cardValueShape } from "../../reducers/models/cardDeckShape";
import userShape from "../../reducers/models/userShape";
import voteShape from "../../reducers/models/voteShape";
import workItemShape from "../../reducers/models/workItemShape";

import "./EstimatePage.less";
import "../../resources/Containers.less";
import EmptyState from "../EmptyState";

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
            userId,
            dispatch,
            iterations
        } = this.props;

        dispatch(requestTeam(
            () => dispatch(connectToGroup(iterationPath, userId))
        ));

        dispatch(requestWorkItems(iterationPath));

        if (iterations.length < 1) {
            dispatch(requestIterations());
        }
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

        dispatch(requestSwitchActiveWorkItem(
            iterationPath,
            userId,
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

        dispatch(requestWorkItemUpdateStoryPointsUpdate(
            activeWorkItemId,
            storyPoints,
            iterationPath,
            userId
        ));

        const sortedWorkItems = _.sortBy(
            workItems,
            x => x.stackRank
        );

        const currentWorkItemIndex = _.findIndex(
            sortedWorkItems,
            x => x.id === activeWorkItemId
        );

        if (currentWorkItemIndex < 0 || currentWorkItemIndex > sortedWorkItems.length - 1) {
            return;
        }

        const nextWorkItem = _.find(
            _.rest(sortedWorkItems, currentWorkItemIndex + 1),
            x => !x.storyPoints
        );

        if (nextWorkItem) {
            dispatch(requestSwitchActiveWorkItem(iterationPath, userId, nextWorkItem.id));
        }
    }

    resetEstimate() {
        const {
            dispatch,
            iterationPath,
            activeWorkItemId,
            userId
        } = this.props;

        dispatch(requestWorkItemUpdateStoryPointsRemove(
            activeWorkItemId,
            iterationPath,
            userId
        ));

        dispatch(requestSwitchActiveWorkItem(
            iterationPath,
            userId,
            activeWorkItemId
        ));
    }

    revealVotes() {
        const {
            iterationPath,
            userId,
            activeWorkItemId,
            dispatch
        } = this.props;

        dispatch(requestVotesRevealed(
            iterationPath,
            userId,
            activeWorkItemId,
            dispatch
        ));
    }

    cardClicked(value) {
        const {
            userId,
            iterationPath,
            activeWorkItemId,
            dispatch
        } = this.props;

        if (activeWorkItemId === null) {
            return;
        }

        dispatch(requestVote(
            userId,
            iterationPath,
            activeWorkItemId,
            value
        ));
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
            dispatch,
            iterations,
            currentIterationUrl
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

        const workItemsOrdered = _.sortBy(workItems || [], x => x.stackRank);
        const storyPointsTotal = Math.round(sum((workItems || [])
            .filter(x => x.storyPoints !== null && x.storyPoints !== undefined)
            .map(x => x.storyPoints)));

        const iteration = _.find(iterations, x => x.path === iterationPath);
        const hasNoWorkItems = iteration && !iteration.workItemsLoading && workItems.length < 1;

        return (
            <div className="component-root">
                <div className="left-pane">
                    <div className="to-vote-row">
                        <div className="work-items-title-row">
                            <h4>
                                { iteration && <a href={currentIterationUrl} target="_blank" rel="noopener noreferrer">{iteration.name}</a> }
                            </h4>
                            <div className="work-items-title-row-member">{`${workItemsOrdered.length} work items left`}</div>
                            <div className="work-items-title-row-member">{`${storyPointsTotal} total story points`}</div>
                            <div className="refresh-button work-items-title-row-member">
                                <IconButton
                                    className="refreshButton"
                                    iconProps={{ iconName: "Refresh" }}
                                    title="Reload User Stories"
                                    ariaLabel="ReloadUserStories"
                                    onClick={() => dispatch(requestWorkItemUpdateStoryPointsUpdate(iterationPath))}
                                />
                            </div>
                            <ConnectionStatus
                                iterationPath={iterationPath}
                                userId={userId}
                            />
                        </div>
                        { iteration && !iteration.workItemsLoading && !hasNoWorkItems && (
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
                        )}
                        { hasNoWorkItems && iteration && !iteration.workItemsLoading && (
                            <EmptyState
                                image="/assets/blank_canvas.svg"
                                title="No user stories to score"
                                body="There are no user stories and bugs in iteration to score just yet."
                            />
                        )}
                        { (!iteration || iteration.workItemsLoading) && (
                            <Spinner size={SpinnerSize.large} />
                        )}
                    </div>
                </div>
                <div className="center-pane">
                    {/* https://stackoverflow.com/questions/21515042/scrolling-a-flexbox-with-overflowing-content */}
                    <div className="scrollable-flex">
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
                            {(!Number.isNaN(storyPoints) || (selectedWorkItem && isSelectedWorkItemInEstimation && selectedWorkItem.storyPoints && !Number.isNaN(selectedWorkItem.storyPoints))) && (
                                <DefaultButton
                                    text="Reset story points &amp; vote"
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
    users: state.user.filter(x => x.teamId === state.applicationContext.teamId),
    workItems: state.workItem.filter(x => x.iterationPath === ownProps.match.params.iterationPath),
    cardValues: state.enums.cardDecks[0].cardValues,
    iterationPath: ownProps.match.params.iterationPath,
    votes: state.vote,
    activeWorkItemId: state.applicationContext.activeWorkItemId,
    isActiveWorkItemRevealed: state.applicationContext.isActiveWorkItemRevealed,
    currentIterationUrl: selectIterationUrl(state, ownProps.match.params.iterationPath),
    iterations: state.iteration
});

EstimationSession.defaultProps = {
    workItems: [],
    users: [],
    activeWorkItemId: null
};

EstimationSession.propTypes = {
    iterationPath: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    workItems: PropTypes.arrayOf(workItemShape),
    users: PropTypes.arrayOf(userShape),
    votes: PropTypes.arrayOf(voteShape).isRequired,
    activeWorkItemId: PropTypes.number,
    isActiveWorkItemRevealed: PropTypes.bool.isRequired,
    cardValues: PropTypes.arrayOf(cardValueShape).isRequired,
    iterations: PropTypes.arrayOf(iterationShape).isRequired,
    currentIterationUrl: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(EstimationSession);
