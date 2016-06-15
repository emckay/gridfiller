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
    materialIcon: 'power_input',
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

const addMiniOption = (tool) => (mini) => {
    const upperPrefix = mini ? 'Mini' : 'Main';
    const lowerPrefix = upperPrefix.toLowerCase();

    const newTool = tool.toJS();
    newTool.name = `${upperPrefix} ${newTool.name}`;
    newTool.mode = `${lowerPrefix}-${newTool.mode}`;
    if (mini) newTool.iconClass = 'mini-icon ${newTool.iconClass}';

    return fromJS(newTool);
};

const plainContentFillTool = fromJS({
    name: 'Content Fill',
    materialIcon: 'format_color_fill',
    mode: 'content-style',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.get('primaryColor'),
    },
});

const plainContentColorTool = fromJS({
    name: 'Content Color',
    materialIcon: 'format_color_text',
    mode: 'content-style',
    style: {
        color: (sharedOptions) => sharedOptions.get('primaryColor'),
    },
});

const plainContentBoldTool = fromJS({
    name: 'Content Bold',
    materialIcon: 'format_bold',
    mode: 'content-style',
    style: {
        fontWeight: ['bold', undefined],
    },
});

export const contentFillTool = addMiniOption(plainContentFillTool);
export const contentColorTool = addMiniOption(plainContentColorTool);
export const contentBoldTool = addMiniOption(plainContentBoldTool);

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
        tools: [
            contentFillTool(false),
            contentFillTool(true),
            contentColorTool(false),
            contentColorTool(true),
            contentBoldTool(false),
            contentBoldTool(true),
        ],
    },
]);
