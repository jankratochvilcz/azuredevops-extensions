import PropTypes from "prop-types";

export const cardValueShape = PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
});

export const cardDeckShape = PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    cardValues: PropTypes.arrayOf(cardValueShape).isRequired
});

export default cardDeckShape;
