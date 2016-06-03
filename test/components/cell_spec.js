import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import { Cell } from '../../src/components/grid/cell';

describe('<Cell />', () => {
    describe('render()', () => {
        const props = {
            row: 0,
            col: 1,
            style: new Map({ backgroundColor: 'red' }),
        };
        const wrapper = shallow(<Cell {...props} />);

        it('gives style to root div', () => {
            expect(wrapper.prop('style')).to.eql({ backgroundColor: 'red' });
        });
    });
});
