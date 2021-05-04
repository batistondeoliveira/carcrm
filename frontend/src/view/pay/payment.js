import React from 'react';
import { MP_PUBLIC_KEY } from '../../config/App';
import { useDispatch, useSelector } from 'react-redux';

import { 
    alertError, 
    change, 
    error as setError, 
    payCard, 
    payPec 
} from '../../store/actions/pay.action';

import { Button, InputAdornment, TextField } from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import { MdArrowBack, MdCreditCard, MdEmail } from 'react-icons/md';

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [];

    if (props.id === 'cardNumber') {
        mask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/,  /\d/, /\d/, ' ', /\d/, /\d/,  /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
    } else if (props.id === 'cardExpiration') {
        mask = [/[0-9]/, /\d/, '/', /\d/, /\d/];
    } else if (props.id === 'securityCode') {
        mask = [/[0-9]/, /\d/, /\d/];
    } else if (props.id === 'cpf') {
        mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/,  /\d/, '.', /\d/, /\d/,  /\d/, '-', /\d/, /\d/];
    } 

    return (
        <MaskedInput
            {...other}            
            ref={ref => {
                inputRef(ref ? ref.inputElement : null)
            }}
            mask={mask}
            guide={false}
        />
    );
}

export default function Payment() {
    const dispatch = useDispatch();
    const plan = useSelector(state => state.payReducer.plan);
    const pay_type = useSelector(state => state.payReducer.pay_type);
    const success = useSelector(state => state.payReducer.success);
    const error = useSelector(state => state.payReducer.error);

    const [ cart, setCart ] = React.useState({});

    React.useEffect(() => {
        const script = document.createElement('script');

        script.src = 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js';

        script.addEventListener('load', () => {
            window.Mercadopago.setPublishableKey(MP_PUBLIC_KEY);
        });

        document.body.appendChild(script);

        return () => {
            let iframe = document.querySelector('iframe');

            document.body.removeChild(iframe);
            document.body.removeChild(script);
        }
    }, []);

    const setPaymentMethod = (status, response) => {
        if (status === 200) {            
            document.getElementById('paymentMethodId').value = response[0].id;
     
            //getIssuers(paymentMethod.id); retorna os parcelamentos

            document.getElementById('secure_thumbnail').src = response[0].secure_thumbnail;
        } else {
            alert("payment method info error: " + response);
        }
    }

    const _cardExpiration = (value) => {
        if (value.length === 5) {
            let cardExpiration = value.split('/');

            setCart({
                ...cart,
                cardExpiration: value,
                cardExpirationMonth: cardExpiration[0],
                cardExpirationYear: cardExpiration[1]
            });
        } else {
            setCart({
                ...cart,
                cardExpiration: value
            });
        }
    }

    const _payCard = () => {
        window.Mercadopago.createToken(document.getElementById('pay'), setCardTokenAndPay);
    }

    const setCardTokenAndPay = (status, response) => {
        if (status === 200 || status === 201) {
            dispatch(payCard({
                token: response.id,
                payment_method_id: document.getElementById('paymentMethodId').value,
                plan_id: plan.id,
                email: cart.email
            }));
        } else {
            _setError(response.cause[0].code);    
        }
    }

    const _setError = (errorCode) => {
        if (errorCode === '205') {
            dispatch(alertError({ cardNumber: 'Digite o número do seu cartão.' }))
        }

        if (errorCode === 'E301') {
            dispatch(alertError({ cardNumber: 'Número do cartão inválido.' }))
        }

        if (errorCode === 'E302') {
            dispatch(alertError({ securityCode: 'Confira o código de segurança.' }))
        }

        if (errorCode === '221') {
            dispatch(alertError({ cardholderName: 'Digite o nome impresso no cartão.' }))
        }

        if (errorCode === '208' || errorCode === '209') {
            dispatch(alertError({ cardExpiration: 'Digite o vencimento cartão.' }))
        }

        if (errorCode === '325' || errorCode === '326') {
            dispatch(alertError({ cardExpiration: 'Vencimento do cartão inválido.' }))
        }

        if (errorCode === '214') {
            dispatch(alertError({ cpf: 'Informe o número do seu CPF.' }))
        }

        if (errorCode === '324') {
            dispatch(alertError({ cpf: 'Número do CPF inválido.' }))
        }
    }

    const _payPec = () => {
        dispatch(payPec({
            payment_method_id: pay_type,
            plan_id: plan.id,
            first_name: cart.first_name,
            last_name: cart.last_name,
            email: cart.email,
            cpf: (cart.cpf) && cart.cpf.replace(/[^a-zA-Z0-9]/g, '')
        }));
    }

    return (
        <form id="pay">
            {(pay_type === 'card') &&
                <div className="row">
                    <div className="col-md-8">
                        <div className="form-group">
                            <label className="label-custom">
                                Número do cartão
                            </label>

                            <TextField 
                                error={(error.cardNumber) && true}
                                id="cardNumber"
                                type="tel"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                    value: cart.cardNumber,
                                    placeholder: '____ ____ ____ ____',
                                    inputProps: {'data-checkout' : 'cardNumber'},
                                    autoComplete: 'off',
                                    onChange: input => {
                                        setCart({
                                            ...cart,
                                            cardNumber: input.target.value
                                        });

                                        if (input.target.value.length >= 7) {
                                            window.Mercadopago.getPaymentMethod({
                                                "bin": input.target.value.substring(0,7)
                                            }, setPaymentMethod);
                                        }
                                    },
                                    startAdornment: (
                                        <InputAdornment>
                                            <MdCreditCard style={{fontSize: '1.5rem'}} className="mr-2 text-muted" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment>
                                            <img alt="" id="secure_thumbnail" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-6 col-md-4">
                        <div className="form-group">
                            <label className="label-custom">
                                Vencimento
                            </label>

                            <TextField
                                error={(error.cardExpirationMonth || error.cardExpirationYear) && true}
                                id="cardExpiration"
                                type="tel"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                    value: cart.cardExpiration,
                                    autoComplete: 'off',
                                    onChange: input => _cardExpiration(input.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-8 order-1 order-md-0">
                        <div className="form-group">
                            <label className="label-custom">
                                Nome impresso no cartão
                            </label>

                            <TextField
                                error={(error.cardholderName) && true}
                                id='cardholderName'
                                value={cart.cardholderName || ''}
                                autoComplete='off'
                                inputProps={{
                                    'data-checkout': 'cardholderName'
                                }}
                                onChange={input => setCart({ ...cart, cardholderName: input.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-6 col-md-4">
                        <div className="form-group">
                            <label className="label-custom">
                                CVV
                            </label>                        

                            <TextField
                                error={(error.securityCode) && true}
                                id="securityCode"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                    value: cart.securityCode,
                                    autoComplete: 'off',
                                    type: 'tel',
                                    inputProps: {'data-checkout': 'securityCode'},
                                    onChange: input => setCart({ ...cart, securityCode: input.target.value }),
                                    endAdornment: (
                                        <InputAdornment>
                                            <div className="cvv_info" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <input type="hidden" id="cardExpirationMonth" value={cart.cardExpirationMonth || ''} data-checkout="cardExpirationMonth" />
                    <input type="hidden" id="cardExpirationYear" value={cart.cardExpirationYear || ''} data-checkout="cardExpirationYear" />
                    <input type="hidden" id="paymentMethodId" />
                </div>
            }

            {(pay_type !== 'card') &&
                <>
                    <div className="form-group">
                        <label className="label-custom">
                            Nome
                        </label>

                        <TextField
                            error={(error.first_name) && true}
                            value={cart.first_name || ''}
                            autoComplete="off"
                            onChange={input => setCart({ ...cart, first_name: input.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label-custom">
                            Sobrenome
                        </label>

                        <TextField
                            error={(error.last_name) && true}
                            value={cart.last_name || ''}
                            autoComplete="off"
                            onChange={input => setCart({ ...cart, last_name: input.target.value })}
                        />
                    </div>
                </>                
            }

            <div className="form-group">
                <label className="label-custom">
                    Email
                </label>

                <TextField
                    error={(error.email) && true}
                    value={cart.email || ''}
                    autoComplete="off"
                    id="email"
                    type="email"
                    onChange={input => setCart({ ...cart, email: input.target.value })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment>
                                <MdEmail style={{fontSize: '1.5rem'}} className="mr-2 text-muted" />
                            </InputAdornment>
                        )
                    }}
                />
            </div>

            <div className="form-group">
                <label className="label-custom">
                    CPF
                </label>

                <TextField
                    error={(error.cpf) && true}
                    value={cart.cpf || ''}
                    autoComplete="off"
                    id="cpf"                    
                    InputProps={{
                        inputComponent: TextMaskCustom,
                        value: cart.cpf,
                        type: 'tel',
                        placeholder: '___.___.___-__',
                        onChange: input => setCart({ 
                            ...cart, 
                            cpf: input.target.value, 
                            docNumber: input.target.value.replace(/[.-]/g, '')
                        })
                    }}
                />

                <input id="docNumber" value={cart.docNumber || ''} data-checkout="docNumber" type="hidden" />
                <input id="docType" value="CPF" data-checkout="docType" type="hidden" />
            </div>

            <div className="d-flex">
                <Button
                    variant="contained"
                    size="large"
                    className="mt-4 mb-4 mr-3 font-weight-bold"
                    startIcon={<MdArrowBack />}
                    onClick={() => {
                        dispatch(setError({}));
                        dispatch(change({ pay_type: null }));
                    }}
                >
                    &nbsp;
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    className="mt-4 mb-4 font-weight-bold"
                    onClick={() => (pay_type === 'card') ? _payCard() : _payPec()}
                >
                    Realizar pagamento
                </Button>
            </div>
        </form>
    )
}
