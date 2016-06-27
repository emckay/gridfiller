import React from 'react';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';

import selectors from '../selectors';

import { GridContainer } from './grid/grid';

export class Gallery extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        return (
            <div className="gallery">
                {this.props.grids.map((grid, i) => (
                    <GridContainer key={i} rows={grid} gridId={i} />
                ))}
            </div>
        );
    }
}

Gallery.propTypes = {
    grids: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    grids: selectors.getGallery(state),
});

export const GalleryContainer = connect(mapStateToProps)(Gallery);
