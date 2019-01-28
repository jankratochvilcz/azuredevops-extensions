import React, { Component } from "react";
import { PersonaSize, Persona, PersonaPresence } from "office-ui-fabric-react"
import _ from "underscore";
import "./EstimationSession.css"
import UserStoryList from "./UserStoryList";
import PokerCard from "./PokerCard";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.onSelectedWorkItemIdChanged = this.onSelectedWorkItemIdChanged.bind(this);

        this.state = {
            workItems: [],
            cardValues: [0, 1, 2, 3, 5, 8, 13, 21],
            selectedUserStory: null,
            users: []
        }
    }

    componentDidMount() {
        var wiql = {
            query: "SELECT [System.Id],[Microsoft.VSTS.Common.StackRank],[Microsoft.VSTS.Scheduling.StoryPoints],[System.Title] FROM WorkItems WHERE [System.IterationPath] UNDER '"
                + this.props.match.params.iterationPath + "'"
        };

        this.executeOnVssWorkClient(client => {
            client
                .queryByWiql(wiql)
                .then((result => {

                    var workItemIds = result.workItems.map(x => x.id);
                    client.getWorkItems(workItemIds).then((workItemsResult => {

                        var workItemObjects = workItemsResult.map(x => ({
                            id: x.id,
                            url: x.url,
                            title: x.fields["System.Title"],
                            storyPoints: x.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
                            stackRank: x.fields["Microsoft.VSTS.Common.StackRank"],
                            createdBy: x.fields["System.CreatedBy"],
                            assignedTo: x.fields["System.AssignedTo"],
                            description: x.fields["System.Description"] || x.fields["Microsoft.VSTS.TCM.ReproSteps"],
                            workItemType: x.fields["System.WorkItemType"]
                        }))

                        var users = _.uniq(
                            workItemObjects.map(x => x.createdBy),
                            x => x.displayName);

                        this.setState({
                            workItems: workItemObjects,
                            users: users
                        })
                    }))
                }).bind(this));
        })
    }

    executeOnVssWorkClient(action) {
        VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
            action(client);
        });
    }

    onSelectedWorkItemIdChanged(workItemId) {
        this.setState({
            selectedUserStory: _.find(this.state.workItems, x => x.id == workItemId)
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
                            items={this.state.workItems.filter(x => x.storyPoints == null)} />
                    </div>
                    <div className="voted-row">
                        <UserStoryList
                            title="Scored"
                            columns={["title", "storyPoints"]}
                            selectedUserStoryId={this.state.selectedUserStory != null ? this.state.selectedUserStory.id : null}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={this.state.workItems.filter(x => x.storyPoints != null)} />
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
                        {this.state.cardValues.map(cardValue => {
                            return <PokerCard value={cardValue} />
                        })}
                    </div>
                    <h4>Team Votes</h4>

                    <div className="users-container">
                        {this.state.users.map(user => {
                            return (
                                <Persona
                                    size={PersonaSize.size40}
                                    imageUrl={user.imageUrl}
                                    text={user.displayName}
                                    presence={PersonaPresence.away}
                                    hidePersonaDetails={false} />
                            )
                        })}
                    </div>

                    <h4>Work Item Details</h4>
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

export default EstimationSession;