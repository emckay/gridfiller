import { fromJS } from 'immutable';

export const fillCellTool = fromJS({
    name: 'Fill Cell',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.get('primaryColor'),
    },
    materialIcon: 'format_color_fill',
    mode: 'cell',
});

export const removeFillTool = fromJS({
    name: 'Remove Fill',
    style: {
        backgroundColor: undefined,
    },
    materialIcon: 'format_color_reset',
    mode: 'cell',
});

export const changeBorderWidthTool = (width) => fromJS({
    name: `Change Width (${width})`,
    style: {
        width,
    },
    materialIcon: 'add',
    mode: 'single-border',
});

export const toggleSolidDashedTool = fromJS({
    name: 'Toggle Solid/Dashed',
    style: {
        style: ['solid', 'dashed'],
    },
    materialIcon: 'line_style',
    mode: 'single-border',
});

export const mainContentTool = fromJS({
    name: 'Main Content',
    materialIcon: 'mode_edit',
    mode: 'main-content',
});

export const miniContentTool = fromJS({
    name: 'Mini Content',
    materialIcon: 'grid_on',
    mode: 'mini-content',
});

export default fromJS([
    {
        name: 'Cell',
        materialIcon: 'select_all',
        tools: [fillCellTool, removeFillTool],
    },
    {
        name: 'Border',
        materialIcon: 'border_all',
        tools: [
            changeBorderWidthTool(2),
            changeBorderWidthTool(-2),
            toggleSolidDashedTool,
        ],
    },
    {
        name: 'Text',
        materialIcon: 'text_format',
        tools: [mainContentTool, miniContentTool],
    },
]);
