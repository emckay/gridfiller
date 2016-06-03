import { fromJS } from 'immutable';

export const dynamicTool = fromJS({
    name: 'Fill Cell',
    style: {
        backgroundColor: (sharedOptions) => {
            return sharedOptions.get('primary-color');
        },
    },
    icon: 'square',
});

export const staticTool = fromJS({
    name: 'Fill Red',
    style: { backgroundColor: 'red' },
    icon: 'square',
});
