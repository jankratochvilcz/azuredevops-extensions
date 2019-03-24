import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PropTypes from "prop-types";

import WelcomePage from "./components/pages/WelcomePage";
import EstimatePage from "./components/pages/EstimatePage";

import { initializeContext } from "./actions";

import "./App.less";

class App extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(initializeContext());
    }

    render() {
        const { projectId } = this.props;

        if (projectId === null) {
            return <div>App loading ...</div>;
        }

        return (
            <Router>
                <div className="App">
                    <Route path="/" component={WelcomePage} />
                    <Route path="/session/:iterationPath" component={EstimatePage} />
                </div>
            </Router>
        );
    }
}

App.defaultProps = {
    projectId: null
};

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    projectId: state.applicationContext.projectId
});

export default connect(mapStateToProps)(App);
