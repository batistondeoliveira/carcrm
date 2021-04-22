import { actionTypes } from '../actions/alert.action';

const initialState = {    
    class: 'success',
    time: 3000,
    open: false,
    msg: ''
}

//eslint-disable-next-line 
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHANGE:
            return { ...state, ...payload }

        default:
            return state
    }
}
