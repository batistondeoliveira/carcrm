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

//UPLOAD LOGO
export const uploadLogo = (item) => dispatch => {
    return HttpAuth.post('/upload/logo', item).then(response => {
        if (typeof response !== 'undefined') {
            if (response.data.logo) {
                dispatch(changeNotify({
                    open: true,
                    msg: 'Logo enviado com sucesso',
                    class: 'success'
                }));

                dispatch(change({ logo: response.data.logo }));
            }
        }
    })
}

//DESTROY LOGO
export const destroyLogo = (id) => dispatch => {
    return HttpAuth.delete('/upload/logo/' + id).then(response => {
        if (typeof response !== 'undefined') {
            if (response.data.status === 200) {
                dispatch(changeNotify({
                    open: true,
                    msg: 'Logo apagada com sucesso',
                    class: 'success'
                }));

                dispatch(change({ logo: null }));
            }
        }
    })
}

//VALIDATE SUBDOMAIN
export const validateSubdomain = (value) => dispatch => {
    value = value.toLowerCase();

    if (value.search(' ') > -1) {
        value = value.replace(" ", "");
        dispatch(changeAlert({ 
            open: true,
            msg: 'O endereço do seu site não pode conter espaços em branco',
            class: 'error'
        }));
    }

    if (value.search('www') > -1) {
        value = value.replace("www", "");
        dispatch(changeAlert({ 
            open: true,
            msg: 'Digite o endereço do seu site sem o www',
            class: 'error'
        }));
    }

    if (value.search('.com') > -1) {
        value = value.replace(".com", "");
        dispatch(changeAlert({ 
            open: true,
            msg: 'Para utilizar o domínio .com clique no botão abaixo "USAR MEU DOMÍNIO"',
            class: 'error'
        }));
    }

    //funcao q remove caracteres especiais
    return value.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z.])/g, ''); 
}
