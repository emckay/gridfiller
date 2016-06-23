import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import actions from '../../actions';

class CellContentForm extends React.Component {
    render() {
        const {
            fields: { content },
            handleSubmit,
        } = this.props;

        const onContentChange = (event) => {
            content.onChange(event);
            this.props.updateGridContent(event.target.value);
        };

        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        id="content_field"
                        type="text"
                        placeholder="Content"
                        {...content}
                        onChange={onContentChange}
                    />
                </div>
            </form>
        );
    }
}

CellContentForm.propTypes = {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    resetForm: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    updateGridContent: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    updateGridContent: (text) => {
        dispatch(actions.updateCellContent(text));
    },
});

export const CellContentFormContainer = reduxForm({
    form: 'content',
    fields: ['content'],
})(connect(undefined, mapDispatchToProps)(CellContentForm));
