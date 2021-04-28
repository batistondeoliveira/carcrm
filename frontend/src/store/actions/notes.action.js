import { HttpAuth } from '../../config/Http';
import { changeNotify } from './notify.action';

export const actionTypes = {
    INDEX: 'NOTE_INDEX',
    STORE: 'NOTE_STORE',
    UPDATE: 'NOTE_UPDATE',
    DESTROY: 'NOTE_DESTROY',
    CHANGE: 'NOTE_CHANGE'
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

//INDEX
export const indexResponse = (payload, isLoadMore) => ({
    type: actionTypes.INDEX,
    payload,
    isLoadMore
});

export const index = (query, isLoadMore) => dispatch => {
    return HttpAuth.get('/notes?' + new URLSearchParams(query))
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data, isLoadMore)));
}

//STORE
export const storeResponse = (payload) => ({
    type: actionTypes.STORE,
    payload
});

export const store = (data) => dispatch => {
    return HttpAuth.post('/notes', data)
        .then(response => typeof response !== 'undefined' && dispatch(storeResponse(response.data)));

}

//UPDATE
export const updateResponse = (payload) => ({
    type: actionTypes.UPDATE,
    payload
});

export const update = (data) => dispatch => {
    return HttpAuth.put('/notes/' + data.id, data)
        .then(response => {
            if (typeof response !== 'undefined') {
                if (response.data.status === 200) {
                    dispatch(updateResponse(data));
                }

                if (response.data.error) {
                    dispatch(changeNotify({
                        open: true,
                        msg: response.data.error,
                        className: 'error'
                    }));
                }
            }
        });
}

//DESTROY
export const destroyResponse = (payload) => ({
    type: actionTypes.DESTROY,
    payload
});

export const destroy = (id) => dispatch => {
    return HttpAuth.delete('/notes/' + id)
        .then(response => typeof response !== 'undefined' && dispatch(destroyResponse(id)));
}
