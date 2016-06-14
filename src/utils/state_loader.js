import { fromJS } from 'immutable';
import pako from 'pako';
import { Base64 } from 'js-base64';

export const saveCells = (cells) => {
    const cellsObj = cells.toJS();

    const binaryString = pako.deflate(JSON.stringify(cellsObj), { to: 'string' });

    return Base64.encodeURI(binaryString);
};

export const loadCells = (str) => {
    const inflated = pako.inflate(Base64.decode(str), { to: 'string' });
    const cellsObj = JSON.parse(inflated);

    return fromJS(cellsObj);
};
