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

export const changeBorderWidthTool = (width, icon) => fromJS({
    name: `Change Width (${width})`,
    style: {
        width,
    },
    ...icon,
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

export const contentFillTool = fromJS({
    name: 'Content Fill',
    materialIcon: 'format_color_fill',
    mode: 'main-content-style',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.get('primaryColor'),
    },
});

export const miniContentFillTool = fromJS({
    name: 'Mini Content Fill',
    materialIcon: 'format_color_fill',
    iconClass: 'mini-icon',
    mode: 'mini-content-style',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.get('primaryColor'),
    },
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
            changeBorderWidthTool(4, { materialIcon: 'add', iconClass: 'material-icon-bold' }),
            changeBorderWidthTool(2, { materialIcon: 'add' }),
            changeBorderWidthTool(-4, { materialIcon: 'remove', iconClass: 'material-icon-bold' }),
            changeBorderWidthTool(-2, { materialIcon: 'remove' }),
            toggleSolidDashedTool,
        ],
    },
    {
        name: 'Text',
        materialIcon: 'text_format',
        tools: [mainContentTool, miniContentTool],
    },
    {
        name: 'Text Formatting',
        materialIcon: 'text_format',
        tools: [contentFillTool, miniContentFillTool],
    },
]);
