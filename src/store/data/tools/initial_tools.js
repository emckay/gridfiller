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
                    width: 2,
                },
                icon: 'plus-square-o',
            },
            {
                name: 'Decrease Thickness',
                style: {
                    width: -2,
                },
                icon: 'minus-square-o',
            },
        ],
    },
    {
        name: 'Text',
        icon: 'font',
        tools: [
            {
                name: 'Mini-text',
                icon: 'th',
            },
        ],
    },
]);
