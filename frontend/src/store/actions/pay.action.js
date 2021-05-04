import { HttpAuth } from '../../config/Http';
import { changeLoading } from './loading.action';
import { changeNotify } from './notify.action';

export const actionTypes = {
    CHANGE: 'PAY_CHANGE',
    SUCCESS: 'PAY_SUCCESS',
    ERROR: 'PAY_ERROR'
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

export const alertError = (value) => dispatch => {
    dispatch(changeLoading({ open: false }));
    dispatch(changeNotify({
        open: true,
        msg: Object.values(value)[0],
        class: 'error'
    }));

    dispatch(error(value));
}

export const plans = () => dispatch => {
    return HttpAuth.get('/pay/plans')
        .then(response => typeof response !== 'undefined' && dispatch(change(response.data)));
}

export const payCard = (data) => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Processando pagamento'
    }));

    return HttpAuth.post('/pay/card', data)
        .then(response => {
            dispatch(changeLoading({ open: false }));

            if (typeof response !== 'undefined') {
                if (response.data.success) {
                    dispatch(success(response.data.id));                    
                }

                if (response.data.error) {
                    dispatch(error(response.data.error));
                }
            }
        });
}

export const payPec = (data) => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Processando pagamento'
    }));

    return HttpAuth.post('/pay/pec', data)
        .then(response => {
            dispatch(changeLoading({ open: false }));

            if (typeof response !== 'undefined') {
                if (response.data.success) {
                    dispatch(success(response.data.id));                    
                }

                if (response.data.error) {
                    dispatch(error(response.data.error));
                }
            }
        });
}
