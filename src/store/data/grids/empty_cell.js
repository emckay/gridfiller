import { fromJS } from 'immutable';

export class EmptyCell {
    constructor() {
        return fromJS({
            content: {
                0: '',
                1: '',
                2: '',
                3: '',
                4: '',
                5: '',
                6: '',
                7: '',
                8: '',
                main: '',
            },
            style: {},
            borders: {},
        });
    }
}
