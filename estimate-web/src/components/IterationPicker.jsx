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

// We need to use custom rendering so we can inject data-private to prevent leaking user's data
// ESLint incorrectly requires a prop-type here
// eslint-disable-next-line react/prop-types
const getDropdownOption = ({ text }) => (
    <span data-private>{text}</span>
);

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
            onChange={onSelectedIterationChanged}
            selectedKey={selectedIteration != null ? selectedIteration.id : null}
            options={iterationOptions}
            onRenderOption={getDropdownOption}
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
