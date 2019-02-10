import React, { Component } from "react";
import { connect } from "react-redux"
import _ from 'underscore'

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from "office-ui-fabric-react";
import { Redirect } from 'react-router';

import { getIterations } from '../actions'
import "./EstimationConfiguration.css"

class EstimationConfiguration extends Component {
    constructor(props) {
        super(props);
        this.goToSession = this.goToSession.bind(this);
        this.onSelectedIterationChanged = this.onSelectedIterationChanged.bind(this);

        this.state = {
            selectedIteration: null,
            selectedDeck: _.first(this.props.availableCardDecks),
            redirectToSession: false
        }
    }

    componentDidMount() {
        this.props.dispatch(getIterations(this.props.teamId, this.props.projectId));
    }

    static getDerivedStateFromProps(props, state) {
        if(state.selectedIteration != null || props.iterations == null || !_.some(props.iterations))
            return null;
        
        return {
            ...state,
            selectedIteration: props.iterations[0]
        };
    }

    // https://stackoverflow.com/a/35354844
    goToSession() {
        this.setState({
            redirectToSession: true
        })
    }

    onSelectedIterationChanged(meta, selection) {
        var selectedIteration = _.find(this.props.iterations, x => x.id == selection.key);

        this.setState({
            selectedIteration: selectedIteration
        })
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
                    onChange={this.onSelectedIterationChanged}
                    selectedKey={this.state.selectedIteration != null ? this.state.selectedIteration.id : null}
                    options={_.first(this.props.iterations, 5).map(x => {
                        return {
                            key: x.id,
                            text: x.name
                        }
                    })} />

                <Dropdown
                    label="Deck"
                    className="main-content-child"
                    selectedKey={this.state.selectedDeck != null ? this.state.selectedDeck.key : null}
                    options={this.props.availableCardDecks.map(x => {
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

const mapStateToProps = state => {
    return {
        teamId: state.devOps.context.team.id,
        projectId: state.devOps.context.project.id,
        iterations: state.devOps.iterations,
        availableCardDecks: state.enums.cardDecks
    }
}

export default connect(mapStateToProps)(EstimationConfiguration);