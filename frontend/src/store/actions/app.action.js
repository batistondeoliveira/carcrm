import { HttpAuth } from '../../config/Http';
import { changeLoading } from './loading.action';
import { changeNotify } from './notify.action';
import { changeAlert } from './alert.action';

export const actionTypes = {
    INDEX: 'APP_INDEX',
    UPDATE: 'APP_UPDATE',
    CHANGE: 'APP_CHANGE',
    SUCCESS: 'APP_SUCCESS',
    ERROR: 'APP_ERROR'
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
export const indexResponse = (payload) => ({
    type: actionTypes.INDEX,
    payload
});

export const index = () => dispatch => {
    return HttpAuth.get('/app')
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)));
}

//UPDATE
export const update = (data) => dispatch => {
    dispatch(changeLoading({ open: true }));

    return HttpAuth.put('/app/' + data.id, data)
        .then(response => {
            dispatch(changeLoading({ open: false }));

            if (typeof response !== 'undefined') {
                if (response.data.error) {
                    dispatch(error(response.data.error));
                }

                if (response.data.status === 200) {
                    dispatch(changeNotify({
                        open: true,
                        msg: response.data.success,
                        change: 'success'
                    }));

                    dispatch(success(true));
                }
            }
        });
}
