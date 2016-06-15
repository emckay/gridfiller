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
    materialIcon: 'mode_edit',
    iconClass: 'mini-icon',
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

const contentToggleFormatTool = (name, icon, styleName, options) => addMiniOption(
    fromJS({
        name,
        materialIcon: icon,
        mode: 'content-style',
        style: {
            [styleName]: options,
        },
    })
);

export const contentFillTool = addMiniOption(plainContentFillTool);
export const contentColorTool = addMiniOption(plainContentColorTool);
export const contentBoldTool = contentToggleFormatTool(
    'Content Bold', 'format_bold', 'fontWeight', ['bold', undefined]
);
export const contentItalicTool = contentToggleFormatTool(
    'Content Italic', 'format_italic', 'fontStyle', ['italic', undefined]
);
export const contentUnderlineTool = contentToggleFormatTool(
    'Content Underline', 'format_underline', 'textDecoration', ['underline', undefined]
);

const contentRelativeTool = (name, icon, styleName, relativeValue) => addMiniOption(
    fromJS({
        name,
        materialIcon: icon,
        mode: 'content-style',
        style: {
            [styleName]: relativeValue,
        },
    })
);

export const contentUpTool = contentRelativeTool(
    'Content Up', 'arrow_upward', 'top', '-2'
);

export const contentDownTool = contentRelativeTool(
    'Content Up', 'arrow_downward', 'top', '+2'
);

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
        name: 'Main Text',
        materialIcon: 'text_format',
        tools: [
            mainContentTool,
            contentFillTool(false),
            contentColorTool(false),
            contentBoldTool(false),
            contentItalicTool(false),
            contentUnderlineTool(false),
            contentUpTool(false),
        ],
    },
    {
        name: 'Mini Text',
        materialIcon: 'grid_on',
        tools: [
            miniContentTool,
            contentFillTool(true),
            contentColorTool(true),
            contentBoldTool(true),
            contentItalicTool(true),
            contentUnderlineTool(true),
            contentUpTool(true),
        ],
    },
]);
