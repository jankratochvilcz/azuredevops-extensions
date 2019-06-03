import PropTypes from "prop-types";

const iterationShape = PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    finishDate: PropTypes.string,
    workItemsLoading: PropTypes.bool
});

export default iterationShape;
