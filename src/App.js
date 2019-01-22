import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import EstimationConfiguration from "./components/EstimationConfiguration";

import "./App.css";
import EstimationSession from "./components/EstimationSession";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Route path="/" component={EstimationConfiguration} />
                    <Route path="/session/" component={EstimationSession} />
                </div>
            </Router>
        )
    }
}

export default App;