import immutable from 'seamless-immutable';
import { ActionCreators as UndoActions } from 'redux-undo';
import actions from '../../../actions';

export const fillCellTool = immutable({
    name: 'Fill Cell',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.primaryColor,
    },
    materialIcon: 'format_color_fill',
    mode: 'cell',
});

export const removeFillTool = immutable({
    name: 'Remove Fill',
    style: {
        backgroundColor: undefined,
    },
    materialIcon: 'format_color_reset',
    mode: 'cell',
});

export const clearContentTool = immutable({
    name: 'Remove All Content',
    clear: 'all_content',
    materialIcon: 'text_format',
    iconClass: 'clear',
    mode: 'clear',
});

export const clearBorderTool = immutable({
    name: 'Reset All Borders',
    clear: 'all_borders',
    materialIcon: 'border_all',
    iconClass: 'clear',
    mode: 'clear',
});

export const resetCellTool = immutable({
    name: 'Reset Cell',
    clear: 'all',
    materialIcon: 'delete',
    mode: 'clear',
});

export const changeBorderWidthTool = (width, icon) => immutable({
    name: `Change Width (${width})`,
    style: {
        width,
    },
    ...icon,
    mode: 'single-border',
});

export const resetSingleBorderTool = immutable({
    name: 'Reset Border',
    clear: 'single-border',
    materialIcon: 'add',
    iconClass: 'clear',
    mode: 'single-border',
});

export const toggleSolidDashedTool = immutable({
    name: 'Toggle Solid/Dashed',
    style: {
        style: ['solid', 'dashed'],
    },
    materialIcon: 'power_input',
    mode: 'single-border',
});

export const mainContentTool = immutable({
    name: 'Main Content',
    materialIcon: 'mode_edit',
    mode: 'main-content',
});

export const miniContentTool = immutable({
    name: 'Mini Content',
    materialIcon: 'mode_edit',
    iconClass: 'mini-icon',
    mode: 'mini-content',
});

const addMiniOption = (tool) => (mini) => {
    const upperPrefix = mini ? 'Mini' : 'Main';
    const lowerPrefix = upperPrefix.toLowerCase();

    let newTool = tool.set('name', `${upperPrefix} ${tool.name}`);
    newTool = newTool.set('mode', `${lowerPrefix}-${newTool.mode}`);
    if (mini) newTool = newTool.set('iconClass', 'mini-icon ${newTool.iconClass}');

    return immutable(newTool);
};

const plainContentFillTool = immutable({
    name: 'Content Fill',
    materialIcon: 'format_color_fill',
    mode: 'content-style',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.primaryColor,
    },
});

const plainContentColorTool = immutable({
    name: 'Content Color',
    materialIcon: 'format_color_text',
    mode: 'content-style',
    style: {
        color: (sharedOptions) => sharedOptions.primaryColor,
    },
});

const contentToggleFormatTool = (name, icon, styleName, options) => addMiniOption(
    immutable({
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
    immutable({
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
    'Content Down', 'arrow_downward', 'top', '+2'
);

export const contentLeftTool = contentRelativeTool(
    'Content Left', 'arrow_back', 'left', '-2'
);

export const contentRightTool = contentRelativeTool(
    'Content Right', 'arrow_forward', 'left', '+2'
);

export const increaseFontSize = contentRelativeTool(
    'Increase Font', 'format_size', 'fontSize', '+2'
);

export const decreaseFontSize = contentRelativeTool(
    'Decrease Font', 'text_fields', 'fontSize', '-2'
);


const actionTool = (name, icon, action) => immutable({
    name,
    action,
    ...icon,
});

export const undoTool = actionTool('Undo', { materialIcon: 'undo' }, UndoActions.undo());
export const redoTool = actionTool('Redo', { materialIcon: 'redo' }, UndoActions.redo());

export const createResetCheckpointTool = actionTool(
    'Create Checkpoint',
    { materialIcon: 'assignment_turned_in' },
    actions.createResetCheckpoint()
);

export const resetToCheckpointTool = actionTool(
    'Reset to Checkpoint',
    { materialIcon: 'settings_backup_restore' },
    actions.resetToCheckpoint()
);

export const topTools = immutable([
    undoTool,
    redoTool,
    createResetCheckpointTool,
    resetToCheckpointTool,
]);

export const sideTools = immutable([
    {
        name: 'Cell',
        materialIcon: 'select_all',
        tools: [fillCellTool, removeFillTool, clearContentTool, clearBorderTool, resetCellTool],
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
            resetSingleBorderTool,
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
            increaseFontSize(false),
            decreaseFontSize(false),
            contentUpTool(false),
            contentRightTool(false),
            contentDownTool(false),
            contentLeftTool(false),
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
            increaseFontSize(true),
            decreaseFontSize(true),
            contentUpTool(true),
            contentRightTool(true),
            contentDownTool(true),
            contentLeftTool(true),
        ],
    },
]);
