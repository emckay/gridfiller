import { fromJS } from 'immutable';

export default fromJS([
    {
        name: 'Fill Cell',
        style: {
            backgroundColor: (sharedOptions) => sharedOptions.get('primaryColor'),
        },
        icon: 'square',
    },
    {
        name: 'Remove Fill',
        style: {
            backgroundColor: undefined,
        },
        icon: 'square-o',
    },
]);
