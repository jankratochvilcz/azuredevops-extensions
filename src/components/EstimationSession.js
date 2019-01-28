import React, { Component } from "react";
import { DetailsList, SelectionMode, CheckboxVisibility, PersonaSize, Persona } from "office-ui-fabric-react"
import "./EstimationSession.css"

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        const titleColumn = {
            key: 'title',
            name: 'Title',
            fieldName: 'name',
            minWidth: 210,
            maxWidth: 600,
            isRowHeader: true,
            data: 'string',
            isPadded: true,
            onRender: item => {
                return <span>{item.title}</span>;
            }
        };

        const storyPointsColumn = {
            key: 'storyPoints',
            name: 'Points',
            fieldName: 'storyPoints',
            minWidth: 25,
            maxWidth: 25,
            data: 'string',
            isPadded: true,
            onRender: item => {
                return <span>{item.storyPoints}</span>;
            }
        }

        const stakeholdersColumn = {
            key: 'createdBy',
            name: 'By',
            fieldName: 'createdBy',
            minWidth: 24,
            maxWidth: 24,
            isPadded: true,
            onRender: item => {
                return (
                    <Persona
                        size={PersonaSize.size24}
                        imageUrl={item.createdBy.imageUrl}
                        personaName={item.createdBy.displayName} />
                );
            }
        }

        this.state = {
            workItems: [],
            toVoteListConfiguration: [
                titleColumn, stakeholdersColumn
            ],
            votedListConfiguration: [
                titleColumn, storyPointsColumn
            ]
        }
    }

    getPersona(devOpsUser) {
        return {
            imageUrl: devOpsUser.createdBy.imageUrl,
            personaName: devOpsUser.createdBy.displayName
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
                        <h4>Remaining</h4>
                        <DetailsList
                            items={this.state.workItems.filter(x => x.storyPoints == null)}
                            compact={false}
                            columns={this.state.toVoteListConfiguration}
                            selectionMode={SelectionMode.single}
                            checkboxVisibility={CheckboxVisibility.hidden}
                            isCompactMode={true}
                            setKey="id"
                            isHeaderVisible={true} />
                    </div>
                    <div className="voted-row">
                        <h4>Scored</h4>
                        <DetailsList
                            items={this.state.workItems.filter(x => x.storyPoints != null)}
                            compact={false}
                            columns={this.state.votedListConfiguration}
                            selectionMode={SelectionMode.single}
                            checkboxVisibility={CheckboxVisibility.hidden}
                            isCompactMode={true}
                            setKey="id"
                            isHeaderVisible={true} />
                    </div>
                    <div className="abandoned-row">
                        <h4>Abandoned</h4>
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