import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Map } from 'immutable';

import { Grid } from '../../src/components/grid/grid';
import { tenByTen } from '../fixtures/grids';

describe('<Grid />', () => {
    describe('render()', () => {
        const wrapper = shallow(<Grid rows={tenByTen} />);

        it('renders correct number of rows', () => {
            expect(wrapper).to.have.exactly(10).descendants('.grid-row');
        });

        it('renders correct number of cells', () => {
            expect(wrapper).to.have.exactly(100).descendants('Cell');
        });

        it('passes style prop as Map to cells', () => {
            wrapper.find('Cell').forEach((cell) => {
                expect(cell).to.have.prop('style');
                expect(cell.prop('style')).to.be.instanceOf(Map);
            });
        });
    });
});
