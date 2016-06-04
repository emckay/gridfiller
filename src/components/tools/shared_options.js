import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions/action_creators';

export class SharedOptions extends React.Component {
    componentDidMount() {
        window.addEventListener('keydown', this.swapColorsIfShift.bind(this));
        window.addEventListener('keyup', this.swapColorsIfShift.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.swapColorsIfShift.bind(this));
        window.removeEventListener('keyup', this.swapColorsIfShift.bind(this));
    }
    swapColorsIfShift(e) {
        if (e.keyCode === 16) {
            this.props.swapColors();
        }
    }
    render() {
        return (
            <div className="shared-options" onKeyDown={() => { console.log('key'); }}>
                <div className="color-pickers">
                    {['primaryColor', 'secondaryColor'].map((opt) => {
                        return (
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
                        );
                    })}
                </div>
            </div>
        );
    }
}

SharedOptions.propTypes = {
    primaryColor: React.PropTypes.string.isRequired,
    secondaryColor: React.PropTypes.string.isRequired,
    setSharedOption: React.PropTypes.func,
    swapColors: React.PropTypes.func,
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
        swapColors: () => {
            dispatch(actions.swapColors());
        },
    };
};

export const SharedOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(SharedOptions);
