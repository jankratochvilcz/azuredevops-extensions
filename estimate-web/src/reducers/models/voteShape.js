import PropTypes from "prop-types";
import { cardValueShape } from "./cardDeckShape";

const voteShape = PropTypes.shape({
    workItemId: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
});

export default voteShape;
