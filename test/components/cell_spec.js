import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import immutable from 'seamless-immutable';

import { Cell } from '../../src/components/grid/cell';
import { emptyCell } from '../../src/store/data/grids/empty_cell';

describe('<Cell />', () => {
    describe('render()', () => {
        let props = emptyCell();
        props = props.set('style', immutable({ backgroundColor: 'red' }));
        props = props.setIn(['content', 'main', 'style'], immutable({ backgroundColor: 'yellow' }));

        const wrapper = shallow(<Cell {...props} />);

        it('gives style to root div', () => {
            expect(wrapper.prop('style')).to.eql({ backgroundColor: 'red' });
        });

        it('renders 10 content divs', () => {
            expect(wrapper).to.have.exactly(10).descendants('.cell-content');
        });

        it('renders 4 border-edit divs', () => {
            expect(wrapper).to.have.exactly(4).descendants('.border-edit');
        });

        it('gives style to main content div', () => {
            const mainContentDiv = wrapper.find('.cell-content-main');
            expect(mainContentDiv.prop('style')).to.eql({ backgroundColor: 'yellow' });
        });
    });
});
