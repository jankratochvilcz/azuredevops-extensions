import React, { Component } from "react";
import "./EstimationSession.css"
import UserStoryList from "./UserStoryList";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workItems: []
        }
    }

    componentDidMount() {
        console.log(this.props);
        var wiql = {
            query: "SELECT [System.Id],[Microsoft.VSTS.Common.StackRank],[Microsoft.VSTS.Scheduling.StoryPoints],[System.Title] FROM WorkItems WHERE [System.IterationPath] UNDER '" + this.props.match.params.iterationPath + "'"
        };
        console.log(wiql);

        this.executeOnVssWorkClient(client => {
            client
                .queryByWiql(wiql)
                .then((result => {
                    var workItemIds = result.workItems.map(x => x.id);
                    console.log(workItemIds)
                    client.getWorkItems(workItemIds).then((workItemsResult => {
                        console.log(workItemsResult);

                        var workItemObjects = workItemsResult.map(x => ({
                            id: x.fields["System.Id"],
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

    render() {
        return (
            <div className="component-root">
                <div className="left-pane">
                    <div className="to-vote-row">
                        <UserStoryList
                            title="Remaining"
                            columns={["title", "createdBy"]}
                            items={this.state.workItems.filter(x => x.storyPoints == null)} />
                    </div>
                    <div className="voted-row">
                        <UserStoryList
                            title="Scored"
                            columns={["title", "createdBy"]}
                            items={this.state.workItems.filter(x => x.storyPoints != null)} />
                    </div>
                    <div className="abandoned-row">
                        <UserStoryList
                            title="Abandoned"
                            columns={["title"]} />
                    </div>
                </div>
                <div className="center-pane">
                    Center
                </div>
                <div className="right-pane">
                    Right
                </div>
            </div>
        )
    }
}

export default EstimationSession;