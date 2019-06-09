import _ from "underscore";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PokerCard from "./PokerCard";
import { requestVote } from "../actions/estimation";
import { cardValueShape } from "../reducers/models/cardDeckShape";
import voteShape from "../reducers/models/voteShape";

import "./PokerCardList.less";

const PokerCardList = ({
    cardValues,
    votes,
    userId,
    activeWorkItemId,
    pickCard
}) => {
    const cards = cardValues.map(cardValue => ({
        title: cardValue.title,
        selected: _.some(
            votes,
            x => x.userId === userId
                && x.workItemId === activeWorkItemId
                && x.value === cardValue.title
        )
    }));

    return (
        <div className="poker-cards-container">
            {cards.map(({ title, selected }) => (
                <PokerCard
                    value={title}
                    key={title}
                    selected={selected}
                    onClick={() => pickCard(userId, activeWorkItemId, title)}
                />
            ))}
        </div>
    );
};

PokerCardList.propTypes = ({
    userId: PropTypes.string.isRequired,
    cardValues: PropTypes.arrayOf(cardValueShape).isRequired,
    votes: PropTypes.arrayOf(voteShape).isRequired,
    activeWorkItemId: PropTypes.number,
    pickCard: PropTypes.func.isRequired
});

PokerCardList.defaultProps = ({
    activeWorkItemId: null
});

const mapStateToProps = state => ({
    userId: state.applicationContext.userId,
    cardValues: state.enums.cardDecks[0].cardValues,
    votes: state.vote,
    activeWorkItemId: state.applicationContext.activeWorkItemId
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    pickCard: (userId, activeWorkItemId, value) => {
        if (activeWorkItemId === null) {
            return;
        }

        dispatch(requestVote(
            userId,
            ownProps.iteration.path,
            activeWorkItemId,
            value
        ));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PokerCardList);
