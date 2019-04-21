import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";

import { PrimaryButton } from "office-ui-fabric-react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { Redirect } from "react-router";

import { getIterations } from "../../actions";
import "./WelcomePage.less";
import IterationPicker from "../IterationPicker";

class WelcomePage extends Component {
    constructor(props) {
        super(props);

        const { availableCardDecks } = this.props;

        this.goToSession = this.goToSession.bind(this);
        this.onSelectedIterationChanged = this.onSelectedIterationChanged.bind(this);


        this.state = {
            selectedIteration: null,
            selectedDeck: _.first(availableCardDecks),
            redirectToSession: false
        };
    }

    componentDidMount() {
        const { teamId, projectId, dispatch } = this.props;

        dispatch(getIterations(teamId, projectId));
    }

    static getDerivedStateFromProps(props, state) {
        if (state.selectedIteration != null
            || props.iterations == null
            || !_.some(props.iterations)) {
            return null;
        }

        return {
            ...state,
            selectedIteration: props.iterations[0]
        };
    }

    onSelectedIterationChanged(meta, selection) {
        const { iterations } = this.props;
        const selectedIteration = _.find(iterations, x => x.id === selection.key);

        this.setState({
            selectedIteration: selectedIteration
        });
    }

    // https://stackoverflow.com/a/35354844
    goToSession() {
        this.setState({
            redirectToSession: true
        });
    }

    render() {
        const {
            redirectToSession,
            selectedIteration,
            selectedDeck
        } = this.state;

        const {
            availableCardDecks,
            iterations
        } = this.props;

        if (redirectToSession) {
            return <Redirect to={`/session/${selectedIteration.path}`} />;
        }

        return (
            <div className="main-content">
                <h2 className="main-content-child">Configure Estimation Session</h2>

                <IterationPicker
                    iterations={iterations}
                    onSelectedIterationChanged={this.onSelectedIterationChanged}
                    selectedIteration={selectedIteration}
                />

                <Dropdown
                    label="Deck"
                    className="main-content-child"
                    selectedKey={selectedDeck != null ? selectedDeck.key : null}
                    options={availableCardDecks.map(x => ({
                        key: x.key,
                        text: x.name
                    }))}
                />

                <PrimaryButton
                    className="main-content-child go-to-session-button"
                    onClick={this.goToSession}
                    text="Start Estimating"
                />
            </div>
        );
    }
}

WelcomePage.propTypes = {
    availableCardDecks: PropTypes.arrayOf(PropTypes.object).isRequired,
    teamId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    iterations: PropTypes.arrayOf(PropTypes.object)
};

WelcomePage.defaultProps = {
    iterations: []
};

const mapStateToProps = state => ({
    teamId: state.applicationContext.teamId,
    projectId: state.applicationContext.projectId,
    iterations: state.iteration,
    availableCardDecks: state.enums.cardDecks
});

export default connect(mapStateToProps)(WelcomePage);
