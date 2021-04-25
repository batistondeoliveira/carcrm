import { actionTypes } from '../actions/notify.action';

const initialState = {    
    horizontal: 'center',
    vertical: 'top',
    class: 'success',
    time: 3000,
    open: false,
    msg: ''
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHANGE:
            return { ...state, ...payload }

        default:
            return state
    }
}
