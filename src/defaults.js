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

export default {
    cellWidth,
    contentFontSize,
    contentTop,
    contentLeft,
};
