import React, { Component } from "react";
import { connect } from  "react-redux"
import { PersonaSize, Persona, PersonaPresence } from "office-ui-fabric-react"
import _ from "underscore";
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import "./EstimationSession.css"
import UserStoryList from "./UserStoryList";
import PokerCard from "./PokerCard";

class EstimationSession extends Component {
    constructor(props) {
        super(props);

        this.onSelectedWorkItemIdChanged = this.onSelectedWorkItemIdChanged.bind(this);

        this.state = {
            workItems: [],
            cardValues: ["🆓", "1", "2", "3", "5", "8", "13", "21", "😵", "🍵"],
            selectedUserStory: null,
            users: []
        }
    }

    componentDidMount() {
        const iterationPath = this.props.match.params.iterationPath;
        const context = VSS.getWebContext();

        var wiql = {
            query: "SELECT [System.Id],[Microsoft.VSTS.Common.StackRank],[Microsoft.VSTS.Scheduling.StoryPoints],[System.Title] FROM WorkItems WHERE [System.IterationPath] UNDER '"
                + iterationPath + "'"
        };

        this.executeOnVssCoreClient(client => {
            client
                .getTeamMembersWithExtendedProperties(context.project.id, context.team.id)
                .then((result => {
                    const users = result.map(x => ({
                        ...x.identity,
                        connected: false
                    }));

                    this.setState({
                        users: users
                    });
                })).bind(this)
        })

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
                        }));

                        this.setState({
                            workItems: workItemObjects
                        });
                    }))
                }).bind(this));
        });

        var connection = new HubConnectionBuilder()
            .withUrl("https://localhost:44378/estimate")
            .configureLogging(LogLevel.Information)
            .build();

        connection.start().then(function() {
            connection.invoke("join", {
                groupName: iterationPath,
                userId: context.user.id
            });
        });

        connection.on("groupUpdated", args => {
            const users = this.state.users;
            users.forEach(user => {
                user.connected = _.some(args.presentUserIds, x => user.id == x);
            });

            this.setState({
                users: users
            });
        })
    }

    executeOnVssWorkClient(action) {
        VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
            action(client);
        });
    }

    executeOnVssCoreClient(action) {
        VSS.require(["VSS/Service", "TFS/Core/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.CoreHttpClient);
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
                    <h4>Team</h4>

                    <div className="users-container">
                        {_.sortBy(this.state.users, x => !x.connected).map(user => {
                            return (
                                <Persona
                                    size={user.connected ? PersonaSize.size40 : PersonaSize.size24 }
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

const mapStateToProps = state => {
    return {
        context: state.devOps.context
    }
}

export default connect(mapStateToProps)(EstimationSession);