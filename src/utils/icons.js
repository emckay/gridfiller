import React from 'react';

export const icon = (toolOrGroup) => {
    if (toolOrGroup.fontAwesome !== undefined) {
        return <i className={`fa fa-${toolOrGroup.fontAwesome}`} />;
    }

    return <i className="material-icons">{toolOrGroup.materialIcon}</i>;
};
