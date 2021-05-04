import { HttpAuth } from '../../config/Http';

export const actionTypes = {
    INDEX: 'TRANSACTIONS_INDEX'
}

//INDEX
export const indexResponse = (payload, isLoadMore) => ({
    type: actionTypes.INDEX,
    payload,
    isLoadMore
});

export const index = (query, isLoadMore) => dispatch => {
    return HttpAuth.get('/transactions?' + new URLSearchParams(query))
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data, isLoadMore)));
}

//SHOW
export const show = (id) => dispatch => {
    return HttpAuth.get('/transactions/' + id)
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)));
}
