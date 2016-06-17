import React from 'react';

import { saveCells } from '../../utils/state_loader';

export class SaveLoad extends React.Component {
    render() {
        const { cells, onImportGrid } = this.props;
        return (
            <div className="save-load">
                <form
                    id="loadState"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onImportGrid(this.input.value);
                    }}
                >
                    <textarea
                        defaultValue={saveCells(cells)}
                        ref={(node) => { this.input = node; }}
                    />
                    <input type="submit" />
                </form>
            </div>
        );
    }
}

SaveLoad.propTypes = {
    cells: React.PropTypes.array,
    onImportGrid: React.PropTypes.func,
};
