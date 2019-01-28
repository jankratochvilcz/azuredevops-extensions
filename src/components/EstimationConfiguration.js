import React, { Component } from "react";
import _ from 'underscore'

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from "office-ui-fabric-react";
import { Redirect } from 'react-router';

import "./EstimationConfiguration.css"

class EstimationConfiguration extends Component {
    constructor(props) {
        super(props);

        this.loadIterations = this.loadIterations.bind(this);
        this.toggleIsAvailableCardDecksHintVisible = this.toggleIsAvailableCardDecksHintVisible.bind(this);
        this.goToSession = this.goToSession.bind(this);

        const availableCardDecks = [
            {
                key: "fibonacci",
                name: "Fibonacci sequence",
                about: "The available values are 0, 1, 2, 3, 5, 8, 13, 21. The fibonacci sequence is great at reflecting the inherent uncertainty when estimating larger items."
            }
        ];
        this.state = {
            availableIterations: [],
            selectedIteration: null,
            availableCardDecks: availableCardDecks,
            selectedDeck: _.first(availableCardDecks),
            isAvailableCardDecksHintVisible: false,
            redirectToSession: false
        }
    }

    componentDidMount() {
        this.loadIterations();
    }

    loadIterations() {
        var context = VSS.getWebContext();

        var contextArg = {
            teamId: context.team.id,
            projectId: context.project.id
        };

        this.executeOnVssWorkClient(client => {
            client
                .getTeamIterations(contextArg)
                .then((result => {
                    const availableIterations = _.sortBy(result, x => x.attributes.startDate).reverse();

                    this.setState({
                        availableIterations: availableIterations,
                        selectedIteration: _.first(availableIterations)
                    })
                }).bind(this));
        })
    }

    toggleIsAvailableCardDecksHintVisible() {
        this.setState({
            isAvailableCardDecksHintVisible: !this.state.isAvailableCardDecksHintVisible
        });
    }

    // https://stackoverflow.com/a/35354844
    goToSession() {
        this.setState({
            redirectToSession: true
        })
    }

    executeOnVssWorkClient(action) {
        VSS.require(["VSS/Service", "TFS/Work/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkHttpClient);
            action(client);
        });
    }

    render() {
        if (this.state.redirectToSession) {
            return <Redirect 
                        to={"/session/" + this.state.selectedIteration.path} />;
        }

        return (
                <div className="main-content">
                    <h2 className="main-content-child">
                        Configure Estimation Session
                    </h2>

                    <Dropdown
                        placeholder="Loading interations ..."
                        className="main-content-child"
                        label="Iteration"
                        selectedKey={this.state.selectedIteration != null ? this.state.selectedIteration.id : null}
                        options={_.first(this.state.availableIterations, 5).map(x => {
                            return {
                                key: x.id,
                                text: x.name
                            }
                        })} />

                    <Dropdown
                        label="Deck"
                        className="main-content-child"
                        selectedKey={this.state.selectedDeck != null ? this.state.selectedDeck.key : null}
                        options={this.state.availableCardDecks.map(x => {
                            return {
                                key: x.key,
                                text: x.name
                            }
                        })} />

                    <PrimaryButton
                        className="main-content-child go-to-session-button"
                        onClick={this.goToSession}
                        text="Start Estimating" />
                </div>
        );
    }
}

export default EstimationConfiguration;