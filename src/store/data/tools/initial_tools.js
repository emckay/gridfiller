import { fromJS } from 'immutable';

export default fromJS([
    {
        name: 'Fill Cell',
        style: {
            backgroundColor: (sharedOptions) => {
                return sharedOptions.get('primaryColor');
            },
        },
        icon: 'square',
    },
]);
