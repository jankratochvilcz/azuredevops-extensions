import PropTypes from "prop-types";

const userShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    isConnected: PropTypes.bool,
    displayName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string
});

export default userShape;
