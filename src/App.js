import React, { Component } from "react";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);

    this.showAlert = this.showAlert.bind(this);
  }

  showAlert() {
    var context = VSS.getWebContext();
    console.log(context);
  }

  render() {
    return (
      <div className="App">
        <PrimaryButton
          onClick={this.showAlert}
          text="I'm a cool button, click me" />
      </div>
    );
  }
}

export default App;