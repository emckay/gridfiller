import React from 'react';

import { saveCells } from '../../utils/state_loader';

export class SaveLoad extends React.Component {
    render() {
        const { cells, onImportGrid } = this.props;
        return (
            <div className="save-load">
                <label htmlFor="current_state">
                    Current State (save or share this to re-load your progress).
                </label>
                <textarea
                    id="current_state"
                    name="new_state"
                    defaultValue={saveCells(cells)}
                    readOnly
                />
                <form
                    id="loadState"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onImportGrid(this.input.value);
                    }}
                >
                    <label htmlFor="new_state">Load State</label>
                    <textarea
                        id="new_state"
                        name="new_state"
                        ref={(node) => { this.input = node; }}
                        placeholder='Paste a saved state here and press "Load"'
                    />
                    <input 
                        type="submit" 
                        onClick={() => confirm('Loading this state will clear your current state')} 
                    />
                </form>
            </div>
        );
    }
}

SaveLoad.propTypes = {
    cells: React.PropTypes.array,
    onImportGrid: React.PropTypes.func,
};
