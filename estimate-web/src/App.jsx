import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import WelcomePage from "./components/pages/WelcomePage";
import EstimatePage from "./components/pages/EstimatePage";

import { initializeContext } from "./actions";

import "./App.less";

class App extends Component {
    componentDidMount() {
        this.props.dispatch(initializeContext());
    }

    render() {
        if(this.props.context == null) {
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

const mapStateToProps = state => ({
    context: state.devOps.context
});

export default connect(mapStateToProps)(App);
