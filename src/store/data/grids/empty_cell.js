import immutable from 'seamless-immutable';


export const emptyContent = () => immutable({
    text: '',
    style: {},
});

export const emptyContents = () => immutable({
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

export const emptyCell = () => immutable({
    content: {
        ...emptyContents(),
    },
    style: {},
    borders: {},
});
