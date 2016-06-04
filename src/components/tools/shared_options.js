import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions/action_creators';

export const SharedOptions = ({ primaryColor, secondaryColor, setSharedOption }) => {
    const props = { primaryColor, secondaryColor };
    return (
        <div className="shared-options">
            <div className="color-pickers">
                {['primaryColor', 'secondaryColor'].map((opt) => {
                    return (
                        <label
                            key={opt}
                            className="color-picker"
                            style={{ backgroundColor: props[opt] }}
                        >
                            <input
                                className="color-picker-input"
                                type="color"
                                defaultValue={props[opt]}
                                onChange={(e) => {
                                    setSharedOption(opt, e.target.value);
                                }}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

SharedOptions.propTypes = {
    primaryColor: React.PropTypes.string.isRequired,
    secondaryColor: React.PropTypes.string.isRequired,
    setSharedOption: React.PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        primaryColor: state.gridEditor.getIn(['tools', 'sharedOptions', 'primaryColor']),
        secondaryColor: state.gridEditor.getIn(['tools', 'sharedOptions', 'secondaryColor']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSharedOption: (option, newColor) => {
            dispatch(actions.setSharedOption(option, newColor));
        },
    };
};

export const SharedOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(SharedOptions);
