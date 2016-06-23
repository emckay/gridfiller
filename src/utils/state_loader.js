import immutable from 'seamless-immutable';
import pako from 'pako';
import { Base64 } from 'js-base64';

export const saveGrid = (grid) => {
    const gridObj = grid;

    const binaryString = pako.deflate(JSON.stringify(gridObj), { to: 'string' });

    return Base64.encodeURI(binaryString);
};

export const loadGrid = (str) => {
    const inflated = pako.inflate(Base64.decode(str), { to: 'string' });
    const gridObj = JSON.parse(inflated);

    return immutable(gridObj);
};
