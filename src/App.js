import React, { Component } from "react";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <PrimaryButton
          text="I'm a cool button, click me" />
      </div>
    );
  }
}

export default App;