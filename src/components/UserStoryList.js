import React, { Component } from "react";
import { DetailsList, SelectionMode, CheckboxVisibility, PersonaSize, Persona } from "office-ui-fabric-react"
import _ from "underscore"

class UserStoryList extends Component {
    constructor(props) {
        super(props);

        var columns = [
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
            columns: columns.filter(x => _.some(
                this.props.columns,
                propColumnName => propColumnName == x.key))
        }
    }

    render() {
        const items = this.props.items != null ? this.props.items : [];

        return (<div>
            <h4>{this.props.title} [{items.length}]</h4>
            <DetailsList
                items={items}
                compact={false}
                columns={this.state.columns}
                selectionMode={SelectionMode.single}
                checkboxVisibility={CheckboxVisibility.hidden}
                isCompactMode={true}
                setKey="id"
                isHeaderVisible={true} />
        </div>);
    }
}

export default UserStoryList;