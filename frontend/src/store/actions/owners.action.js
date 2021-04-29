import { HttpAuth } from '../../config/Http';
import { changeNotify } from '../actions/notify.action';
import { changeLoading } from '../actions/loading.action';

export const actionTypes = {
    INDEX: 'OWNER_INDEX',
    STORE: 'OWNER_STORE',    
    UPDATE: 'OWNER_UPDATE',
    DESTROY: 'OWNER_DESTROY',    
    VEHICLES: 'OWNER_VEHICLES',
    CHANGE: 'OWNER_CHANGE',
    SUCCESS: 'OWNER_SUCCESS',
    ERROR: 'OWNER_ERROR'    
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
});

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
});

export const error = (payload) => ({
    type: actionTypes.ERROR,
    payload
});

//INDEX
export const indexResponse = (payload, isLoadMore) => ({
    type: actionTypes.INDEX,
    payload,
    isLoadMore
});

export const index = (query, isLoadMore) => dispatch => {
    return HttpAuth.get('/owners?' + new URLSearchParams(query))
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data, isLoadMore)));
}

//STORE
export const storeResponse = (payload) => ({
    type: actionTypes.STORE,
    payload
});

export const store = (data) => dispatch => {
    dispatch(changeLoading({ open: true }));

    return HttpAuth.post('/owners', data)
        .then(response => {
            dispatch(changeLoading({ open: false }));

            if (typeof response !== 'undefined') {
                if (response.data.error) {
                    dispatch(error(response.data.error));
                }

                if (response.data.id) {
                    dispatch(storeResponse(response.data));
                    dispatch(success(true));
                    dispatch(changeNotify({ 
                        open: true, 
                        msg: 'Proprietário cadastrado com sucesso',
                        class: 'success'
                    }));
                }
            }
        })
}

//SHOW
export const show = (id) => dispatch => {
    return HttpAuth.get('/owners/' + id)
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)));
}

//UPDATE
export const updateResponse = (payload) => ({
    type: actionTypes.UPDATE,
    payload
});

export const update = (data) => dispatch => {
    dispatch(changeLoading({ open: true }));

    return HttpAuth.put('/owners/' + data.id, data)
        .then(response => {
            dispatch(changeLoading({ open: false }));

            if (response.data.error) {
                dispatch(error(response.data.error));                
            }

            if (response.data.status === 200) {
                dispatch(updateResponse(data));
                dispatch(success(true));
                dispatch(changeNotify({ 
                    open: true,
                    msg: response.data.success,
                    class: 'success'
                }));
            }
        })
}

//DESTROY
export const destroyResponse = (payload) => ({
    type: actionTypes.DESTROY,
    payload
});

export const destroy = (id) => dispatch => {
    return HttpAuth.delete('/owners/' + id)
        .then(response => typeof response !== 'undefined' && dispatch(destroyResponse(id)));
}

//VEHICLES
export const vehiclesResponse = (payload) => ({
    type: actionTypes.VEHICLES,
    payload
});

export const vehicles = (query, isLoadMore) => dispatch => {
    return HttpAuth.get('/vehicles?' + new URLSearchParams(query))
        .then(response => typeof response !== 'undefined' && dispatch(vehiclesResponse(response.data, isLoadMore)));
}

//CEP
export const cep = (zipCode) => dispatch => {        
    if (zipCode.length > 8) {
        return HttpAuth.post('/webservice/cep', {
            cep: zipCode
        }).then(response => typeof response !== 'undefined' && dispatch(change(response.data)));
    }
}
