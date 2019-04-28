import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownMenuItemType } from "office-ui-fabric-react/lib/Dropdown";
import _ from "underscore";
import iterationShape from "../reducers/models/iterationShape";

const insertIterationOptionsGroupHeader = (
    iterationOptions,
    headerKey,
    headerName,
    condition
) => {
    const insertBeforeItem = _.find(
        iterationOptions,
        x => condition(x)
    );

    if (insertBeforeItem != null) {
        iterationOptions.splice(
            _.indexOf(iterationOptions, insertBeforeItem),
            0,
            { key: headerKey, text: headerName, itemType: DropdownMenuItemType.Header }
        );
    }
};

const IterationPicker = props => {
    const { onSelectedIterationChanged, selectedIteration, iterations } = props;

    const iterationOptions = _.first(iterations, 10).map(x => ({
        key: x.id,
        text: x.name,
        startDate: x.attributes.startDate,
        finishDate: x.attributes.finishDate
    }));

    insertIterationOptionsGroupHeader(
        iterationOptions,
        "pastOptionsHeader",
        "Past",
        x => x.finishDate != null && x.finishDate < new Date()
    );

    insertIterationOptionsGroupHeader(
        iterationOptions,
        "presentOptionsHeader",
        "Present",
        x => x.finishDate != null && x && x.startDate <= new Date() && x.finishDate >= new Date()
    );

    insertIterationOptionsGroupHeader(
        iterationOptions,
        "futureOptionsHeader",
        "Future",
        x => x.finishDate != null && x && x.startDate > new Date()
    );

    return (
        <Dropdown
            placeholder="Loading interations ..."
            className="main-content-child"
            label="Iteration"
            onChange={onSelectedIterationChanged}
            selectedKey={selectedIteration != null ? selectedIteration.id : null}
            options={iterationOptions}
        />
    );
};

IterationPicker.propTypes = {
    onSelectedIterationChanged: PropTypes.func.isRequired,
    selectedIteration: iterationShape,
    iterations: PropTypes.arrayOf(iterationShape)
};

IterationPicker.defaultProps = {
    iterations: [],
    selectedIteration: null
};

export default IterationPicker;
