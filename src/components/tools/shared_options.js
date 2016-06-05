import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';

import actions from '../../actions/action_creators';
import * as selectors from '../../selectors';

export class SharedOptions extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        return (
            <div className="shared-options">
                <div className="color-pickers">
                    {['primaryColor', 'secondaryColor'].map((opt) => (
                        <label
                            key={opt}
                            className="color-picker"
                            style={{ backgroundColor: this.props[opt] }}
                        >
                            <input
                                className="color-picker-input"
                                type="color"
                                defaultValue={this.props[opt]}
                                onChange={(e) => {
                                    this.props.setSharedOption(opt, e.target.value);
                                }}
                            />
                        </label>
                    ))}
                </div>
            </div>
        );
    }
}

SharedOptions.propTypes = {
    primaryColor: React.PropTypes.string.isRequired,
    secondaryColor: React.PropTypes.string.isRequired,
    setSharedOption: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    primaryColor: selectors.getPrimaryColor(state),
    secondaryColor: selectors.getSecondaryColor(state),
});

const mapDispatchToProps = (dispatch) => ({
    setSharedOption: (option, newColor) => {
        dispatch(actions.setSharedOption(option, newColor));
    },
});

export const SharedOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(SharedOptions);
