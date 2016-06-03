import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { fromJS } from 'immutable';

import { Cell } from '../../src/components/grid/cell';
import { EmptyCell } from '../../src/store/data/grids/empty_cell';

describe('<Cell />', () => {
    describe('render()', () => {
        const props = new EmptyCell().toObject();
        props.style = fromJS({ backgroundColor: 'red' });
        const wrapper = shallow(<Cell {...props} />);

        it('gives style to root div', () => {
            expect(wrapper.prop('style')).to.eql({ backgroundColor: 'red' });
        });

        it('renders 10 content divs', () => {
            expect(wrapper).to.have.exactly(10).descendants('.cell-content');
        });
    });
});
