import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";
import {
    PrimaryButton,
    Spinner,
    SpinnerSize,
    CompoundButton
} from "office-ui-fabric-react";

import UserStoryList from "../UserStoryList";
import {
    requestTeam,
    requestWorkItems,
    requestWorkItemUpdateStoryPointsUpdate,
    requestWorkItemUpdateStoryPointsRemove,
    requestIterations
} from "../../actions/devops";
import {
    connectToGroup,
    requestSwitchActiveWorkItem,
    requestVotesRevealed
} from "../../actions/estimation";
import EstimatorPersona from "../EstimatorPersona";
import { average } from "../../utils/math";
import UserStoryDetail from "../UserStoryDetail";
import iterationShape from "../../reducers/models/iterationShape";
import { cardValueShape } from "../../reducers/models/cardDeckShape";
import userShape from "../../reducers/models/userShape";
import voteShape from "../../reducers/models/voteShape";
import workItemShape from "../../reducers/models/workItemShape";

import "./EstimatePage.less";
import "../../resources/Containers.less";
import EmptyState from "../EmptyState";
import EstimationSessionStatus from "../EstimationSessionStatus";
import PokerCardList from "../PokerCardList";
import { selectUsersInCurrentTeam } from "../../selectors/usersSelectors";
import { orderedWorkItems } from "../../selectors/workItemsSelectors";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.onactiveWorkItemIdChanged = this.onSelectedWorkItemIdChanged.bind(this);
        this.saveEstimate = this.saveEstimate.bind(this);
        this.resetEstimate = this.resetEstimate.bind(this);
        this.revealVotes = this.revealVotes.bind(this);
        this.markSelectedWorkItemIdAsActive = this.markSelectedWorkItemIdAsActive.bind(this);
        this.getStoryPoints = this.getStoryPoints.bind(this);
        this.getWorkItems = this.getWorkItems.bind(this);

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

        this.getWorkItems();

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

    getWorkItems() {
        const { iterationPath, dispatch } = this.props;

        dispatch(requestWorkItems(iterationPath));
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

        const currentWorkItemIndex = _.findIndex(
            workItems,
            x => x.id === activeWorkItemId
        );

        if (currentWorkItemIndex < 0 || currentWorkItemIndex > workItems.length - 1) {
            return;
        }

        const nextWorkItem = _.find(
            _.rest(workItems, currentWorkItemIndex + 1),
            x => !x.storyPoints
        );

        dispatch(requestSwitchActiveWorkItem(
            iterationPath,
            userId,
            nextWorkItem ? nextWorkItem.id : null
        ));
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

    render() {
        const {
            workItems,
            users,
            votes,
            activeWorkItemId,
            isActiveWorkItemRevealed,
            iterationPath,
            iterations
        } = this.props;

        const {
            selectedWorkItemId
        } = this.state;

        const selectedWorkItem = selectedWorkItemId !== null
            ? _.find(workItems, x => x.id === selectedWorkItemId)
            : null;

        console.log(`selectedWorkItemId ${selectedWorkItemId}`);
        console.log(`selectedWorkItem ${selectedWorkItem}`);
        console.log(`activeWorkItemId ${activeWorkItemId}`);


        const isSelectedWorkItemInEstimation = activeWorkItemId != null
            && selectedWorkItemId === activeWorkItemId;

        const votesForActiveWorkItem = selectedWorkItemId !== null
            ? votes.filter(x => x.workItemId === selectedWorkItemId)
            : [];

        const storyPoints = this.getStoryPoints(votesForActiveWorkItem);

        const iteration = _.find(iterations, x => x.path === iterationPath);
        const hasNoWorkItems = iteration && !iteration.workItemsLoading && workItems.length < 1;

        return (
            <div className="component-root">
                <div className="left-pane">
                    <div className="to-vote-row">
                        { iteration && !iteration.workItemsLoading && !hasNoWorkItems && (
                            <>
                                <EstimationSessionStatus iteration={iteration} />
                                <UserStoryList
                                    title="Work Items"
                                    columns={["title", "storyPoints"]}
                                    selectedUserStoryId={(selectedWorkItem != null
                                        ? selectedWorkItem.id
                                        : null)}
                                    onSelectedUserStoryIdChanged={(
                                        id => this.onSelectedWorkItemIdChanged(id))}
                                    items={(workItems.map(x => ({
                                        ...x,
                                        isBeingScored: x.id === activeWorkItemId
                                    })))}
                                />
                            </>
                        )}
                        { hasNoWorkItems && iteration && !iteration.workItemsLoading && (
                            <EmptyState
                                image="https://doist-estimate-api.azurewebsites.net/assets/blank_canvas.svg"
                                title="No user stories to score"
                                body="There are no user stories and bugs in iteration to score just yet."
                            />
                        )}
                        { (!iteration || iteration.workItemsLoading) && (
                            <Spinner className="user-stories-spinner" size={SpinnerSize.large} />
                        )}
                    </div>
                </div>
                <div className="center-pane">
                    {selectedWorkItem && <UserStoryDetail workItem={selectedWorkItem} />}
                </div>
                <div className="right-pane">
                    { iteration && isSelectedWorkItemInEstimation && (
                        <div className="cards-alignment-container">
                            <PokerCardList iteration={iteration} />
                        </div>
                    )}

                    {isSelectedWorkItemInEstimation && (
                        <div className="users-container" data-private>
                            {users.map(user => (
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
                    )}


                    {isSelectedWorkItemInEstimation && !isActiveWorkItemRevealed && (
                        <>
                            <div className="voting-control-container">
                                <CompoundButton
                                    onClick={() => this.revealVotes()}
                                    primary={votesForActiveWorkItem.length === users.length}
                                    text="Reveal votes"
                                    split
                                    style={{
                                        width: "299px",
                                        maxWidth: "299px"
                                    }}
                                    secondaryText="Take you time to carefully consider the work item, but stay aware of time."
                                    disabled={!_.some(votesForActiveWorkItem)}
                                    iconProps={{
                                        iconName: "view"
                                    }}
                                    menuProps={{
                                        items: [{
                                            key: "reset",
                                            text: "Reset and revote",
                                            onClick: () => this.resetEstimate(),
                                            iconProps: {
                                                iconName: "redo"
                                            }
                                        }]
                                    }}
                                />
                            </div>
                            <div className="voting-illustration">
                                <EmptyState
                                    image="https://doist-estimate-api.azurewebsites.net/assets/in_thought.svg"
                                    body="&quot;Give me six hours to chop down a tree and I will spend the first four sharpening the axe.&quot;"
                                />
                            </div>
                        </>
                    )}
                    {isSelectedWorkItemInEstimation && isActiveWorkItemRevealed && !Number.isNaN(storyPoints) && (
                        <div className="voting-control-container">
                            <CompoundButton
                                primary
                                onClick={() => this.saveEstimate(storyPoints)}
                                text={`Commit ${storyPoints} story points`}
                                split
                                secondaryText="If votes differ significantly, consider a short discussion and re-vote before comitting."
                                disabled={!_.some(votesForActiveWorkItem)}
                                iconProps={{
                                    iconName: "commitments"
                                }}
                                style={{
                                    width: "299px",
                                    maxWidth: "299px"
                                }}
                                menuProps={{
                                    items: [{
                                        key: "reset",
                                        text: "Reset and revote",
                                        onClick: () => this.resetEstimate(),
                                        iconProps: {
                                            iconName: "redo"
                                        }
                                    }]
                                }}
                            />
                        </div>
                    )}


                    {!isSelectedWorkItemInEstimation && (
                        <div
                            className="cards-overlay"
                        >
                            {selectedWorkItem != null && (
                                <EmptyState
                                    image="https://doist-estimate-api.azurewebsites.net/assets/playing_cards.svg"
                                    title={selectedWorkItem.title}
                                    body="Click here to move the whole team to this work item and start estimating it."
                                >
                                    <PrimaryButton
                                        onClick={() => this.markSelectedWorkItemIdAsActive()}
                                        text="Start estimating"
                                    />
                                </EmptyState>
                            )}
                            {selectedWorkItem == null && (
                                <div className="cards-overlay-info">
                                    <EmptyState
                                        image="https://doist-estimate-api.azurewebsites.net/assets/waiting_for_you.svg"
                                        title="Pick a work item"
                                        body="Start scoring by picking a work item from the list on the left."
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    userId: state.applicationContext.userId,
    users: selectUsersInCurrentTeam(state),
    workItems: orderedWorkItems(state)
        .filter(x => x.iterationPath === ownProps.match.params.iterationPath),
    cardValues: state.enums.cardDecks[0].cardValues,
    iterationPath: ownProps.match.params.iterationPath,
    votes: state.vote,
    activeWorkItemId: state.applicationContext.activeWorkItemId,
    isActiveWorkItemRevealed: state.applicationContext.isActiveWorkItemRevealed,
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
    iterations: PropTypes.arrayOf(iterationShape).isRequired
};

export default connect(mapStateToProps)(EstimationSession);
