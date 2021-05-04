import { actionTypes } from '../actions/transations.action';

const initialState = {
    transactions: {
        data: []
    },
    transaction: {}
}

export default (state = initialState, { type, payload, isLoadMore }) => {
    switch (type) {
        case actionTypes.INDEX:
            if (isLoadMore) {
                payload.transactions.data = state.transactions.data.concat(payload.transactions.data);
            }

            return { ...state, ...payload }

        default:
            return state
    }
}
