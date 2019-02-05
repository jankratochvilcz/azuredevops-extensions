import React, { Component } from "react";
import { connect } from "react-redux"
import { PersonaSize, Persona, PersonaPresence } from "office-ui-fabric-react"
import _ from "underscore";
import "./EstimationSession.css"
import UserStoryList from "./UserStoryList";
import PokerCard from "./PokerCard";
import { getTeam, getWorkItems } from "../actions";
import { connectToGroup } from "../actions/estimation";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.onSelectedWorkItemIdChanged = this.onSelectedWorkItemIdChanged.bind(this);

        this.state = {
            selectedUserStory: null
        }
    }

    componentDidMount() {
        const iterationPath = this.props.match.params.iterationPath;
        const currentUserId = this.props.context.user.id;

        this.props.dispatch(getTeam(
            this.props.context.team.id,
            this.props.context.project.id,
            () => this.props.dispatch(connectToGroup(iterationPath, currentUserId))));
        this.props.dispatch(getWorkItems(iterationPath));
    }

    onSelectedWorkItemIdChanged(workItemId) {
        this.setState({
            selectedUserStory: _.find(this.props.workItems, x => x.id == workItemId)
        })
    }

    render() {
        return (
            <div className="component-root">
                <div className="left-pane">
                    <div className="to-vote-row">
                        <UserStoryList
                            title="Remaining"
                            columns={["title", "createdBy"]}
                            selectedUserStoryId={this.state.selectedUserStory != null ? this.state.selectedUserStory.id : null}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={this.props.workItems.filter(x => x.storyPoints == null)} />
                    </div>
                    <div className="voted-row">
                        <UserStoryList
                            title="Scored"
                            columns={["title", "storyPoints"]}
                            selectedUserStoryId={this.state.selectedUserStory != null ? this.state.selectedUserStory.id : null}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={this.props.workItems.filter(x => x.storyPoints != null)} />
                    </div>
                    <div className="abandoned-row">
                        <UserStoryList
                            title="Abandoned"
                            selectedUserStoryId={this.state.selectedUserStory != null ? this.state.selectedUserStory.id : null}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            columns={["title"]} />
                    </div>
                </div>
                <div className="center-pane">
                    <h4>Your Vote</h4>
                    <div className="poker-cards-container">
                        {this.props.cardValues.map(cardValue => {
                            return <PokerCard value={cardValue} key={cardValue} />
                        })}
                    </div>
                    <h4>Team</h4>

                    <div className="users-container">
                        {_.sortBy(this.props.users, x => !x.connected).map(user => {
                            return (
                                <Persona
                                    key={user.id}
                                    size={user.connected ? PersonaSize.size40 : PersonaSize.size24}
                                    hidePersonaDetails={!user.connected}
                                    imageUrl={user.imageUrl}
                                    text={user.displayName}
                                    presence={user.connected ? PersonaPresence.online : PersonaPresence.offline} />
                            )
                        })}
                    </div>

                    <h4>Current Work Item</h4>
                    {this.state.selectedUserStory &&
                        <div className="user-story-container">
                            <h3>
                                <a href={this.state.selectedUserStory.url}>
                                    {this.state.selectedUserStory.workItemType} {this.state.selectedUserStory.id}
                                </a>
                                &nbsp;
                                {this.state.selectedUserStory.title}
                            </h3>
                            <div dangerouslySetInnerHTML={{ __html: this.state.selectedUserStory.description }} />
                        </div>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        context: state.devOps.context,
        users: state.devOps.teams[state.devOps.context.team.id] || [],
        workItems: state.devOps.workItems[ownProps.match.params.iterationPath] || [],
        cardValues: state.enums.cardDecks[0].cardValues
    }
}

export default connect(mapStateToProps)(EstimationSession);