import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";

import { PrimaryButton } from "office-ui-fabric-react";
import { Redirect } from "react-router";

import { requestIterations } from "../../actions/devops";
import "./WelcomePage.less";
import IterationPicker from "../IterationPicker";
import { cardDeckShape } from "../../reducers/models/cardDeckShape";
import iterationShape from "../../reducers/models/iterationShape";
import EmptyState from "../EmptyState";

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
        const { dispatch } = this.props;

        // In cases where the user has gotten a link from a colleague,
        // goes directly to the right session.
        VSS.getService(VSS.ServiceIds.Navigation).then(navigationService => {
            navigationService.getHash().then(hash => {
                if (hash.length < 1) {
                    return;
                }

                this.setState({
                    selectedIteration: {
                        path: hash
                    },
                    redirectToSession: true
                });
            });
        });

        dispatch(requestIterations());
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
            selectedIteration
        } = this.state;

        const {
            iterations
        } = this.props;

        if (redirectToSession) {
            return <Redirect to={`/session/${selectedIteration.path}`} />;
        }

        return (
            <div className="centering-root">
                <div className="welcome-root">
                    <div className="welcome-illustration">
                        <EmptyState
                            image="https://doist-estimate-api.azurewebsites.net/assets/setup_wizard.svg"
                            title="Sprint Selection"
                            body="Select a sprint you want to estimate from the list above.
                            Once you click &quot;Estimate&quot;, grab the URL from the adress bar and share it with colleagues to allow them to join."
                        />
                    </div>
                    <div className="iterations-picker" data-private>
                        <IterationPicker
                            iterations={iterations}
                            onSelectedIterationChanged={this.onSelectedIterationChanged}
                            selectedIteration={selectedIteration}
                        />
                    </div>
                    <div className="go-to-session-button">
                        <PrimaryButton
                            onClick={this.goToSession}
                            text="Estimate"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

WelcomePage.propTypes = {
    availableCardDecks: PropTypes.arrayOf(cardDeckShape),
    dispatch: PropTypes.func.isRequired,
    iterations: PropTypes.arrayOf(iterationShape)
};

WelcomePage.defaultProps = {
    iterations: [],
    availableCardDecks: []
};

const mapStateToProps = state => ({
    iterations: state.iteration,
    availableCardDecks: state.enums.cardDecks
});

export default connect(mapStateToProps)(WelcomePage);
