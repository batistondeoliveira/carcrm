import { HttpAuth } from '../../config/Http';
import { changeLoading } from './loading.action';

export const actionTypes = {
    INDEX: 'VEHICLE_INDEX',
    DESTROY: 'VEHICLE_DESTROY',
    CHANGE: 'VEHICLE_CHANGE',
    SUCCESS: 'VEHICLE_SUCCES',
    ERROR: 'VEHICLE_ERROR'
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

// INDEX
export const indexResponse = (payload, isLoadMore) => ({
    type: actionTypes.INDEX,
    payload,
    isLoadMore
});

export const index = (query, isLoadMore) => dispatch => {
    return HttpAuth.get('/vehicles?' + new URLSearchParams(query))
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data, isLoadMore)));
}

//STORE
export const store = () => dispatch => {
    return HttpAuth.post('/vehicles')
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)));
}

//SHOW
export const show = (id) => dispatch => {
    return HttpAuth.get('/vehicles/' + id)
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)));
}

//UPDATE
export const update = (data) => dispatch => {
    dispatch(changeLoading({
        open: true
    }));

    return HttpAuth.put('/vehicles/' + data.id, data)
        .then(response => {
            dispatch(changeLoading({
                open: false
            }));    

            if (typeof response !== 'undefined') {
                if (response.data.error) {
                    dispatch(success(false));
                    dispatch(error(response.data.error));
                }

                if (response.data.status === 200) {
                    dispatch(success(true));
                }
            }
        });
}

//DESTROY
export const destroyResponse = (payload) => ({
    type: actionTypes.DESTROY,
    payload
});

export const destroy = (id)  => dispatch => {
    return HttpAuth.delete('/vehicles/' + id)
        .then(response => {
            if (typeof response !== 'undefined') {
                if (response.data.status === 200) {
                    dispatch(destroyResponse(id));
                }
            }
        })
}

// VEHICLE BRAND
export const brand = (vehicle_type) => dispatch => {
    dispatch(changeLoading({
        open: true
    }));

    return HttpAuth.get('/vehicles/' + vehicle_type + '/brand')
        .then(response => { 
            dispatch(changeLoading({
                open: false
            }));

            if (typeof response !== 'undefined') {
                dispatch(indexResponse(response.data));
            }
        })
}

// VEHICLE MODEL
export const model = (vehicle_type, vehicle_brand) => dispatch => {
    dispatch(changeLoading({
        open: true
    }));

    return HttpAuth.get('/vehicles/' + vehicle_type + '/' + vehicle_brand + '/model')
        .then(response => { 
            dispatch(changeLoading({
                open: false
            }));

            if (typeof response !== 'undefined') {
                dispatch(indexResponse(response.data));
            }
        })
}

// VEHICLE VERSION
export const version = (vehicle_brand, vehicle_model) => dispatch => {
    dispatch(changeLoading({
        open: true
    }));

    return HttpAuth.get('/vehicles/' + vehicle_brand + '/' + vehicle_model + '/version')
        .then(response => { 
            dispatch(changeLoading({
                open: false
            }));

            if (typeof response !== 'undefined') {
                dispatch(indexResponse(response.data));
            }
        })
}

//CEP
export const cep = (zipCode) => dispatch => {        
    if (zipCode.length > 8) {
        return HttpAuth.post('/webservice/cep', {
            cep: zipCode
        }).then(response => typeof response !== 'undefined' && dispatch(change(response.data)));
    }
}
