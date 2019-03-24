import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    DetailsList,
    SelectionMode,
    CheckboxVisibility,
    Selection
} from "office-ui-fabric-react";
import _ from "underscore";
import "./UserStoryList.less";

class UserStoryList extends Component {
    constructor(props) {
        super(props);

        this.selectionChanged = this.selectionChanged.bind(this);
        this.getViewSelectedWorkItemId = this.getViewSelectedWorkItemId.bind(this);

        const columns = [
            {
                key: "id",
                name: "Id",
                fieldName: "id",
                minWidth: 35,
                maxWidth: 35,
                isRowHeader: true,
                data: "string",
                isPadded: false,
                onRender: item => <span>{item.id}</span>
            },
            {
                key: "title",
                name: "Title",
                fieldName: "name",
                minWidth: 210,
                maxWidth: 600,
                isRowHeader: true,
                data: "string",
                isPadded: true,
                onRender: item => <span>{item.title}</span>
            },
            {
                key: "storyPoints",
                name: "Points",
                fieldName: "storyPoints",
                minWidth: 25,
                maxWidth: 25,
                data: "string",
                isPadded: true,
                onRender: item => (item.isBeingScored
                    ? <span className="item-is-being-scored" role="img" aria-label="Scoring">⏳</span>
                    : <span>{item.storyPoints}</span>
                )
            }
        ];

        this.state = {
            columns: columns.filter(x => x.key === "id" || _.some(
                props.columns,
                propColumnName => propColumnName === x.key
            )),
            selection: new Selection({
                onSelectionChanged: this.selectionChanged
            })
        };
    }

    getViewSelectedWorkItemId() {
        const { selection } = this.state;

        const currentSelection = selection.getSelection();

        return currentSelection.length === 1
            ? currentSelection[0]
            : null;
    }

    selectionChanged() {
        const { onSelectedUserStoryIdChanged, selectedUserStoryId } = this.props;
        const currentViewSelection = this.getViewSelectedWorkItemId();

        if (currentViewSelection != null && onSelectedUserStoryIdChanged != null) {
            if (currentViewSelection !== selectedUserStoryId) {
                onSelectedUserStoryIdChanged(currentViewSelection.id);
            }
        }
    }

    render() {
        const {
            items,
            selectedUserStoryId
        } = this.props;

        const {
            selection,
            columns
        } = this.state;

        const itemsSafe = items != null
            ? items
            : [];

        const viewSelection = this.getViewSelectedWorkItemId();
        const viewSelectionId = viewSelection != null
            ? viewSelection.id
            : null;

        if (viewSelectionId !== selectedUserStoryId) {
            selection.setAllSelected(false);

            const viewIndexToSelect = _.findIndex(items, x => x.id === selectedUserStoryId);
            selection.setIndexSelected(viewIndexToSelect, true, true);
        }

        return (
            <DetailsList
                items={itemsSafe}
                compact={false}
                selection={selection}
                columns={columns}
                selectionMode={SelectionMode.single}
                checkboxVisibility={CheckboxVisibility.hidden}
                isCompactMode
                setKey="id"
                isHeaderVisible
            />
        );
    }
}

UserStoryList.defaultProps = {
    onSelectedUserStoryIdChanged: () => {},
    selectedUserStoryId: null
};

UserStoryList.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectedUserStoryIdChanged: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedUserStoryId: PropTypes.string
};

export default UserStoryList;
