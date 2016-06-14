import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

import selectors from '../selectors';
import actions from '../actions';

import { SaveLoad } from './settings/save_load';

export const Settings = ({ cells, onImportGrid }) => (
    <div className="settings">
        <Link to="/">Back</Link>
        <h1>Settings</h1>
        <SaveLoad cells={cells} onImportGrid={onImportGrid} />
    </div>
);

Settings.propTypes = {
    cells: React.PropTypes.instanceOf(List),
    onImportGrid: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    cells: selectors.getCells(state),
});

const mapDispatchToProps = (dispatch) => ({
    onImportGrid: (compressedGrid) => dispatch(actions.importGrid(compressedGrid)),
});


export const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(Settings);
