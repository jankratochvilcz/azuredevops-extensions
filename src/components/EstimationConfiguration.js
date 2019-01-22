import React, { Component } from "react";
import _ from 'underscore'

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Button, PrimaryButton } from "office-ui-fabric-react";

import "./EstimationConfiguration.css"

class EstimationConfiguration extends Component {
    constructor(props) {
        super(props);

        this.loadIterations = this.loadIterations.bind(this);
        this.toggleIsAvailableCardDecksHintVisible = this.toggleIsAvailableCardDecksHintVisible.bind(this);

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
            isAvailableCardDecksHintVisible: false
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

    executeOnVssWorkClient(action) {
        VSS.require(["VSS/Service", "TFS/Work/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkHttpClient);
            action(client);
        });
    }

    render() {
        return (
            <div className="App">
                <h2>
                    Configure Estimation Session
                </h2>

                <Dropdown
                    placeholder="Loading interations ..."
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
                    selectedKey={this.state.selectedDeck != null ? this.state.selectedDeck.key : null}
                    options={this.state.availableCardDecks.map(x => {
                        return {
                            key: x.key,
                            text: x.name
                        }
                    })} />

                <PrimaryButton
                    style={{ marginTop: "12px" }}
                    text="Estimate" />

            </div>
        );
    }
}

export default EstimationConfiguration;