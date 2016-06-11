import { fromJS } from 'immutable';

export default fromJS([
    {
        name: 'Cell',
        materialIcon: 'select_all',
        tools: [
            {
                name: 'Fill Cell',
                style: {
                    backgroundColor: (sharedOptions) => sharedOptions.get('primaryColor'),
                },
                materialIcon: 'format_color_fill',
                mode: 'cell',
            },
            {
                name: 'Remove Fill',
                style: {
                    backgroundColor: undefined,
                },
                materialIcon: 'format_color_reset',
                mode: 'cell',
            },
        ],
    },
    {
        name: 'Border',
        materialIcon: 'border_all',
        tools: [
            {
                name: 'Increase Thickness',
                style: {
                    width: 2,
                },
                materialIcon: 'add',
                mode: 'single-border',
            },
            {
                name: 'Decrease Thickness',
                style: {
                    width: -2,
                },
                materialIcon: 'remove',
                mode: 'single-border',
            },
            {
                name: 'Toggle Solid/Dashed',
                style: {
                    style: ['solid', 'dashed'],
                },
                materialIcon: 'line_style',
                mode: 'single-border',
            },
        ],
    },
    {
        name: 'Text',
        materialIcon: 'text_format',
        tools: [
            {
                name: 'Mini-Content',
                materialIcon: 'grid_on',
                mode: 'mini-content',
            },
        ],
    },
]);
