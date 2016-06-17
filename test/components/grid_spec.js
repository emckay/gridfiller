import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Grid } from '../../src/components/grid/grid';
import { tenByTen } from '../../src/store/data/grids/initial_grids';

describe('<Grid />', () => {
    describe('render()', () => {
        const wrapper = shallow(<Grid rows={tenByTen} />);

        it('renders correct number of rows', () => {
            expect(wrapper).to.have.exactly(10).descendants('.grid-row');
        });

        it('renders correct number of cells', () => {
            expect(wrapper).to.have.exactly(100).descendants('Cell');
        });

        it('passes style prop as immutable object to cells', () => {
            wrapper.find('Cell').forEach((cell) => {
                expect(cell).to.have.prop('style');
                const styleProp = cell.prop('style');
                expect(styleProp).to.be.instanceOf(Object);
                expect(() => { styleProp.a = 1; }).to.throw(TypeError);
            });
        });
    });
});
