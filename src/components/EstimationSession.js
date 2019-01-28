import React, { Component } from "react";
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
            selectedUserStoryId: null
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
                            title: x.fields["System.Title"],
                            storyPoints: x.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
                            stackRank: x.fields["Microsoft.VSTS.Common.StackRank"],
                            createdBy: x.fields["System.CreatedBy"],
                            assignedTo: x.fields["System.AssignedTo"]
                        }))

                        this.setState({
                            workItems: workItemObjects
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
        console.log(workItemId);

        this.setState({
            selectedUserStoryId: workItemId
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
                            selectedUserStoryId={this.state.selectedUserStoryId}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={this.state.workItems.filter(x => x.storyPoints == null)} />
                    </div>
                    <div className="voted-row">
                        <UserStoryList
                            title="Scored"
                            columns={["title", "storyPoints"]}
                            selectedUserStoryId={this.state.selectedUserStoryId}
                            onSelectedUserStoryIdChanged={this.onSelectedWorkItemIdChanged}
                            items={this.state.workItems.filter(x => x.storyPoints != null)} />
                    </div>
                    <div className="abandoned-row">
                        <UserStoryList
                            title="Abandoned"
                            selectedUserStoryId={this.state.selectedUserStoryId}
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
                </div>
                <div className="right-pane">
                    <h4>Work Item Details</h4>
                </div>
            </div>
        )
    }
}

export default EstimationSession;