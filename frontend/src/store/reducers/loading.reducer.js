import { actionTypes } from '../actions/loading.action';

const initialState = {
    open: false,
    msg: 'Carregando...'
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
