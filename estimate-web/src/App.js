import React, { Component } from "react";
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from "react-router-dom";

import EstimationConfiguration from "./components/EstimationConfiguration";

import "./App.css";
import EstimationSession from "./components/EstimationSession";
import { initializeContext } from "./actions";

class App extends Component {
    componentDidMount() {
        this.props.dispatch(initializeContext());
    }

    render() {
        if(this.props.context == null) {
            return <div>App loading ...</div>
        }

        return (
            <Router>
                <div className="App">
                    <Route path="/" component={EstimationConfiguration} />
                    <Route path="/session/:iterationPath" component={EstimationSession} />
                </div>
            </Router>
        )
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
        context: state.devOps.context
    }
}

export default connect(mapStateToProps)(App);