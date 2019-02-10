import React, { Component } from "react";
import "./PokerCard.css"

class PokerCard extends Component {
    render() {
        return (
            <div className="poker-card" onClick={this.props.onClick()}>
                <span className="poker-card-title">
                    {this.props.value}
                </span>
            </div>
        );
    }
}

export default PokerCard;