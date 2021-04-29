import React from 'react';
import { store, show, update, cep, change, success } from '../../store/actions/owners.action';
import { AppBar, Button, CircularProgress, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector  } from 'react-redux';
import { changeScreenB } from '../../store/actions/navigation.action';
import { FaSave } from 'react-icons/fa';
import MaskedInput from 'react-text-mask';
import DateFnsUtils from '@date-io/date-fns';
import { pt } from 'date-fns/locale';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [];

    if (props.name === 'cpf') {
        mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/,  /\d/, '.', /\d/, /\d/,  /\d/, '-', /\d/, /\d/];
    } else if (props.name === 'cnpj') {
        mask = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/,  /\d/, '-', /\d/, /\d/];
    } else if (props.name === 'phone') {
        mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];

        if (other.value) {
            if (other.value.length === 15) {
                mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
            }            
        }
    } else if (props.name === 'cep') {
        mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
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

export default function OwnerEdit(props) {
    const dispatch = useDispatch();
    const owner = useSelector(state => state.ownersReducer.owner);
    const error = useSelector(state => state.ownersReducer.error);
    const response = useSelector(state => state.ownersReducer.success);
    const owner_id = (props.uid) ? props.uid : null;

    const [ isLoading, setLoading ] = React.useState(true);
    const [ isLoadingCep, setLoadingCep ] = React.useState(false);

    React.useEffect(() => {
        if (response && dispatch(changeScreenB({ open: false })));
    
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    React.useEffect(() => {
        _index();

        return () => {
            dispatch(success(false));
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _index = () => {
        if (owner_id) {
            dispatch(show(owner_id)).then(response => response && setLoading(false));
        } else {
            dispatch(change('clear'));
            setLoading(false);
        }
    }

    return (
        <>
            <AppBar position="absolute">
                <Toolbar>
                    <IconButton onClick={() => dispatch(changeScreenB({ open: false }))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                    </IconButton>

                    <Typography variant="h6" color="inherit">
                        { (owner_id) ? 'Editar proprietário' : 'Novo proprietário' }
                    </Typography>

                    <Button 
                        onClick={() => (owner_id ? dispatch(update(owner)) : dispatch(store(owner)))} 
                        color="inherit" 
                        className="ml-auto"
                    >
                        <FaSave className="mr-2" />
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar> 

            <div className="scroll card-body">
                {(isLoading) 
                    ? 
                        <div className="d-flex justify-content-center mt-5 pt-5">
                            <CircularProgress />
                        </div> 
                    : 
                        <>
                            <h6 className="mb-4 text-secondary">
                                Dados pessoais
                            </h6>

                            <div className="form-group">
                                <label className="label-custom">
                                    NOME
                                </label>

                                <TextField
                                    error={(error.name) && true}
                                    value={owner.name || ''}
                                    onChange={input => {
                                        dispatch(change({ name: input.target.value }));
                                        if (error.name && delete error.name);
                                    }}
                                />

                                {(error.name) &&
                                    <strong className="text-danger">
                                        { error.name[0] }
                                    </strong>
                                }
                            </div>

                            <div className="form-group">
                                <label className="label-custom">
                                    TIPO DE PESSOA
                                </label>

                                <br/>

                                <div className="btn-group option-group" role="group">
                                    <button onClick={() => dispatch(change({ type: 0 }))} className={!owner.type ? "btn btn-primary" : "btn btn-light"}>
                                        PESSOA FÍSICA
                                    </button>

                                    <button onClick={() => dispatch(change({ type: 1 }))} className={owner.type ? "btn btn-primary" : "btn btn-light"}>
                                        PESSOA JURÍDICA
                                    </button>
                                </div>
                            </div>

                            {(!owner.type) &&
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="label-custom">
                                                CPF
                                            </label>

                                            <TextField 
                                                name="cpf"
                                                type="tel"
                                                autoComplete="off"
                                                InputProps={{
                                                    inputComponent: TextMaskCustom,
                                                    value: owner.cpf,
                                                    onChange: input => dispatch(change({ cpf: input.target.value }))
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="label-custom">
                                                RG
                                            </label>

                                            <TextField                                                 
                                                type="tel"
                                                value={owner.rg || ''}
                                                onChange={input => dispatch(change({ rg: input.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }

                            {(owner.type) &&
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="label-custom">
                                                CNPJ
                                            </label>

                                            <TextField 
                                                name="cnpj"
                                                type="tel"
                                                autoComplete="off"
                                                InputProps={{
                                                    inputComponent: TextMaskCustom,
                                                    value: owner.cnpj,
                                                    onChange: input => dispatch(change({ cnpj: input.target.value }))
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="label-custom">
                                                INSCR. ESTADUAL
                                            </label>

                                            <TextField                                                 
                                                type="tel"
                                                value={owner.ie || ''}
                                                onChange={input => dispatch(change({ ie: input.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="form-group">
                                <label className="label-custom">
                                    NASCIMENTO
                                </label>

                                <MuiPickersUtilsProvider locale={pt} utils={DateFnsUtils}>
                                    <KeyboardDatePicker 
                                        format="dd/MM/yyyy"
                                        value={owner.birth ? owner.birth : null}
                                        onChange={(date) => dispatch(change({ birth: date }))}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>

                            <h6 className="mt-4 mb-4 text-secondary">
                                Dados de contato
                            </h6>

                            <div className="form-group">
                                <label className="label-custom">
                                    EMAIL
                                </label>

                                <TextField                                                 
                                    type="email"
                                    value={owner.email || ''}
                                    onChange={input => dispatch(change({ email: input.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-custom">
                                    TELEFONE
                                </label>

                                <TextField   
                                    error={error.phone && true}                                              
                                    name="phone"
                                    type="tel"
                                    autoComplete="off"
                                    InputProps={{
                                        inputComponent: TextMaskCustom,
                                        value: owner.phone,
                                        onChange: input => {
                                            dispatch(change({ phone: input.target.value }));
                                            if (error.phone && delete error.phone);
                                        }
                                    }}                                    
                                />

                                {(error.phone) &&
                                    <strong className="text-danger">
                                        {error.phone[0]}
                                    </strong>
                                }
                            </div>

                            {(owner.phone) && 
                                <div className="form-group">
                                    <label className="label-custom">
                                        TELEFONE 2
                                    </label>

                                    <TextField                                                                                        
                                        name="phone"
                                        type="tel"
                                        autoComplete="off"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                            value: owner.phone2,
                                            onChange: input => dispatch(change({ phone2: input.target.value }))                                                
                                        }}                                    
                                    />                                    
                                </div>
                            }

                            {(owner.phone2) && 
                                <div className="form-group">
                                    <label className="label-custom">
                                        TELEFONE 3
                                    </label>

                                    <TextField                                                                                        
                                        name="phone"
                                        type="tel"
                                        autoComplete="off"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                            value: owner.phone3,
                                            onChange: input => dispatch(change({ phone3: input.target.value }))                                                
                                        }}                                    
                                    />                                    
                                </div>
                            }
                        
                            <h6 className="mt-4 mb-4 text-secondary">
                                Endereço
                            </h6>

                            <div className="form-group">
                                <label className="label-custom">
                                    CEP
                                </label>

                                <TextField 
                                    style={(isLoadingCep) ? {opcaity: 0.5} : {}}                                    
                                    type="tel"
                                    name="cep"
                                    InputProps={{
                                        inputComponent: TextMaskCustom,
                                        value: owner.zipCode,
                                        onChange: input => {
                                            dispatch(change({zipCode: input.target.value}));
                                            if (input.target.value.length > 8) {
                                                setLoadingCep(true);
                                                dispatch(cep(input.target.value)).then(response => response && setLoadingCep(false))
                                            }
                                        },
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                {(isLoadingCep) 
                                                    ? <CircularProgress size={32} />
                                                    : <></>
                                                }
                                            </InputAdornment>
                                        )
                                    }}
                                />                                 
                            </div>

                            <div className="row">
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <label className="label-custom">
                                            CIDADE
                                        </label>

                                        <TextField                                                 
                                            disabled
                                            value={owner.city || ''}                                        
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="label-custom">
                                            UF
                                        </label>

                                        <TextField                                                 
                                            disabled
                                            value={owner.uf || ''}                                        
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label-custom">
                                    BAIRRO
                                </label>

                                <TextField                                                 
                                    disabled
                                    value={owner.neighborhood || ''}                                        
                                    onChange={input => dispatch(change({ neighborhood: input.target.value }))}
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <label className="label-custom">
                                            RUA
                                        </label>

                                        <TextField                                                                                             
                                            value={owner.street || ''} 
                                            onChange={input => dispatch(change({ street: input.target.value }))}                                       
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="label-custom">
                                            NÚMERO
                                        </label>

                                        <TextField                                                                                             
                                            value={owner.streetNumber || ''} 
                                            onChange={input => dispatch(change({ streetNumber: input.target.value }))}                                                                              
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                }             
            </div>
        </>
    )
}
