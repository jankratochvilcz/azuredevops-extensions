import PropTypes from "prop-types";
import userShape from "./userShape";

const workItemShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdBy: userShape,
    assignedTo: userShape,
    workItemType: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    storyPoints: PropTypes.number,
    stackRank: PropTypes.number,
    description: PropTypes.string,
    iterationPath: PropTypes.string
});

export default workItemShape;
