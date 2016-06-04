import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions/action_creators';

export const SharedOptions = ({ primaryColor, setPrimaryColor }) => {
    return (
        <div className="shared-options">
            <label
                className="color-picker"
                style={{ backgroundColor: primaryColor }}
            >
                <input
                    className="color-picker-input"
                    type="color"
                    defaultValue={primaryColor}
                    onChange={(e) => { setPrimaryColor(e.target.value); }}
                />
            </label>
        </div>
    );
};

SharedOptions.propTypes = {
    primaryColor: React.PropTypes.string.isRequired,
    setPrimaryColor: React.PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        primaryColor: state.gridEditor.getIn(['tools', 'sharedOptions', 'primaryColor']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPrimaryColor: (newColor) => {
            dispatch(actions.setSharedOption('primaryColor', newColor));
        },
    };
};

export const SharedOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(SharedOptions);
