import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { IconButton } from "office-ui-fabric-react";
import ConnectionStatus from "./ConnectionStatus";
import iterationShape from "../reducers/models/iterationShape";
import workItemShape from "../reducers/models/workItemShape";
import { sum } from "../utils/math";
import { selectIterationUrl } from "../selectors/devOpsUrlSelectors";
import { requestWorkItems } from "../actions/devops";

const EstimationSessionStatus = ({
    iteration,
    workItems,
    currentIterationUrl,
    userId,
    refreshWorkItems
}) => {
    const storyPointsTotal = Math.round(sum(workItems
        .filter(x => x.storyPoints !== null && x.storyPoints !== undefined)
        .map(x => x.storyPoints)));

    const workItemsWithoutStoryPointsCount = workItems
        .filter(x => x.storyPoints == null)
        .length;

    return (
        <div className="work-items-title-row">
            <h4>
                { iteration && <a href={currentIterationUrl} target="_blank" rel="noopener noreferrer">{iteration.name}</a> }
            </h4>
            <div className="work-items-title-row-member">{`${workItemsWithoutStoryPointsCount} work items left`}</div>
            <div className="work-items-title-row-member">{`${storyPointsTotal} total story points`}</div>
            <div className="refresh-button work-items-title-row-member">
                <IconButton
                    className="refreshButton"
                    iconProps={{ iconName: "Refresh" }}
                    title="Reload User Stories"
                    ariaLabel="ReloadUserStories"
                    onClick={() => refreshWorkItems(iteration.path)}
                />
            </div>
            <ConnectionStatus
                iterationPath={iteration.path}
                userId={userId}
            />
        </div>
    );
};

EstimationSessionStatus.defaultProps = {
    workItems: []
};

EstimationSessionStatus.propTypes = {
    currentIterationUrl: PropTypes.string.isRequired,
    workItems: PropTypes.arrayOf(workItemShape),
    iteration: iterationShape.isRequired,
    userId: PropTypes.string.isRequired,
    refreshWorkItems: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    currentIterationUrl: selectIterationUrl(state, ownProps.iteration.path),
    workItems: state.workItem.filter(x => x.iterationPath === ownProps.iteration.path),
    userId: state.applicationContext.userId
});

const mapDispatchToProps = dispatch => ({
    refreshWorkItems: iterationPath => dispatch(
        requestWorkItems(iterationPath)
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(EstimationSessionStatus);
