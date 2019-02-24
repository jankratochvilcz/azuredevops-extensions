import React, { Component } from "react";
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

        const columns = [
            {
                key: 'id',
                name: 'Id',
                fieldName: 'id',
                minWidth: 35,
                maxWidth: 35,
                isRowHeader: true,
                data: 'string',
                isPadded: false,
                onRender: item => <span>{item.id}</span>
            },
            {
                key: 'title',
                name: 'Title',
                fieldName: 'name',
                minWidth: 210,
                maxWidth: 600,
                isRowHeader: true,
                data: 'string',
                isPadded: true,
                onRender: item => <span>{item.title}</span>
            },
            {
                key: 'storyPoints',
                name: 'Points',
                fieldName: 'storyPoints',
                minWidth: 25,
                maxWidth: 25,
                data: 'string',
                isPadded: true,
                onRender: item => <span>{item.storyPoints}</span>
            }
        ]

        this.state = {
            columns: columns.filter(x => x.key === "id" || _.some(
                this.props.columns,
                propColumnName => propColumnName === x.key)),
            selection: new Selection({
                onSelectionChanged: this.selectionChanged
            })
        }
    }

    selectionChanged() {
        const currentSelection = this.state.selection.getSelection();
        if (currentSelection.length == 1 && this.props.onSelectedUserStoryIdChanged != null) {
            const selectedWorkItemId = currentSelection[0];
            this.props.onSelectedUserStoryIdChanged(selectedWorkItemId.id);
        }
    }

    render() {
        const items = this.props.items != null
            ? this.props.items
            : [];

        if (!_.some(items, x => x.id == this.props.selectedUserStoryId)) {
            this.state.selection.setAllSelected(false);
        }

        return (
            <DetailsList
                items={items}
                compact={false}
                selection={this.state.selection}
                columns={this.state.columns}
                selectionMode={SelectionMode.single}
                checkboxVisibility={CheckboxVisibility.hidden}
                isCompactMode={true}
                setKey="id"
                isHeaderVisible={true} 
            />
        );
    }
}

export default UserStoryList;
