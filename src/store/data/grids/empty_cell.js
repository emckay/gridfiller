import { fromJS } from 'immutable';


export const emptyContent = () => fromJS({
    text: '',
    style: {},
});

export const emptyContents = () => fromJS({
    0: emptyContent(),
    1: emptyContent(),
    2: emptyContent(),
    3: emptyContent(),
    4: emptyContent(),
    5: emptyContent(),
    6: emptyContent(),
    7: emptyContent(),
    8: emptyContent(),
    main: emptyContent(),
});

export const emptyCell = () => fromJS({
    content: {
        ...emptyContents().toJS(),
    },
    style: {},
    borders: {},
});
