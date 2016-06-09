import { fromJS } from 'immutable';

export default fromJS([
    {
        name: 'Cell',
        icon: 'paint-brush',
        tools: [
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
        ],
    },
    {
        name: 'Border',
        icon: 'square-o',
        tools: [
            {
                name: 'Increase Thickness',
                style: {
                    width: { '+=': 2 },
                    margin: { '-=': 1 },
                    dim: { '-=': 1 },
                },
                icon: 'plus-square-o',
            },
        ],
    },
    {
        name: 'Text',
        icon: 'font',
        tools: [
            {
                name: 'Add Text',
                icon: 'i-cursor',
            },
        ],
    },
]);
