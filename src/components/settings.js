import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import selectors from '../selectors';
import actions from '../actions';

import { SaveLoad } from './settings/save_load';

export const Settings = ({ grid, onImportGrid }) => (
    <div className="settings">
        <Link to="/">Back</Link>
        <h1>Settings</h1>
        <SaveLoad grid={grid} onImportGrid={onImportGrid} />
    </div>
);

Settings.propTypes = {
    grid: React.PropTypes.object.isRequired,
    onImportGrid: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    grid: selectors.getGrid(state),
});

const mapDispatchToProps = (dispatch) => ({
    onImportGrid: (compressedGrid) => dispatch(actions.importGrid(compressedGrid)),
});


export const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(Settings);
