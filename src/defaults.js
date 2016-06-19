import constants from './constants.json';

const stringOrInt = (x) => {
    const asInt = parseInt(x, 10);
    return isNaN(asInt) ? x : asInt;
};

export const cellWidth = () => constants['cell-width'];
export const contentFontSize = (contentId) => {
    const id = stringOrInt(contentId);
    if (typeof id === 'string') {
        return cellWidth() * constants['font-size-multiple'];
    }
    return cellWidth() / 3 * constants['font-size-multiple'];
};
export const contentTop = (contentId) => {
    const id = stringOrInt(contentId);
    if (typeof id === 'string') {
        return 0;
    }
    return cellWidth() / 3 * Math.floor(id / 3);
};
export const contentLeft = (contentId) => {
    const id = stringOrInt(contentId);
    if (typeof id === 'string') {
        return 0;
    }
    return cellWidth() / 3 * (id % 3);
};

export const borderWidth = constants['border-width'];

const defaultBorderWidthFunc =
    (neighbor) => (neighbor ? constants['border-width'] : constants['border-width'] * 2);

const marginTop = (neighbor, row) => (row > 0 ? 0 : -1);
const marginLeft = () => 0;
const width = () => cellWidth();
const height = () => width();
const borderStyle = () => 'solid';

export default {
    cellWidth,
    contentFontSize,
    contentTop,
    contentLeft,
    borderWidth,
    borderTopWidth: defaultBorderWidthFunc,
    borderRightWidth: defaultBorderWidthFunc,
    borderBottomWidth: defaultBorderWidthFunc,
    borderLeftWidth: defaultBorderWidthFunc,
    marginTop,
    marginLeft,
    width,
    height,
    borderStyle,
};
