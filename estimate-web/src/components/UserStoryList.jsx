import React, { Component } from "react";
import { DetailsList, SelectionMode, CheckboxVisibility, PersonaSize, Persona, Selection } from "office-ui-fabric-react"
import _ from "underscore"
import "./UserStoryLists.css"

class UserStoryList extends Component {
    constructor(props) {
        super(props);

        this.selectionChanged = this.selectionChanged.bind(this);

        var columns = [
            {
                key: 'id',
                name: 'Id',
                fieldName: 'id',
                minWidth: 35,
                maxWidth: 35,
                isRowHeader: true,
                data: 'string',
                isPadded: false,
                onRender: item => {
                    return <span>{item.id}</span>;
                }
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
                onRender: item => {
                    return <span>{item.title}</span>;
                }
            },
            {
                key: 'storyPoints',
                name: 'Points',
                fieldName: 'storyPoints',
                minWidth: 25,
                maxWidth: 25,
                data: 'string',
                isPadded: true,
                onRender: item => {
                    return <span>{item.storyPoints}</span>;
                }
            },
            {
                key: 'createdBy',
                name: 'By',
                fieldName: 'createdBy',
                minWidth: 24,
                maxWidth: 24,
                isPadded: true,
                onRender: item => {
                    return (
                        <Persona
                            size={PersonaSize.size24}
                            imageUrl={item.createdBy.imageUrl}
                            personaName={item.createdBy.displayName} />
                    );
                }
            }
        ]

        this.state = {
            columns: columns.filter(x => x.key == "id" || _.some(
                this.props.columns,
                propColumnName => propColumnName == x.key)),
            selection: new Selection({
                onSelectionChanged: this.selectionChanged
            })
        }
    }

    selectionChanged() {
        var currentSelection = this.state.selection.getSelection();
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

        return (<div>
            <h4>{this.props.title} [{items.length}]</h4>
            <div className="wrapper">
                <DetailsList
                    items={items}
                    compact={false}
                    selection={this.state.selection}
                    columns={this.state.columns}
                    selectionMode={SelectionMode.single}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    isCompactMode={true}
                    setKey="id"
                    isHeaderVisible={true} />
            </div>

        </div>);
    }
}

export default UserStoryList;