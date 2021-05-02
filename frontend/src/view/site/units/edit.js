import { 
    AppBar, 
    Button, 
    CircularProgress, 
    IconButton, 
    InputAdornment, 
    TextField, 
    Toolbar, 
    Typography 
} from '@material-ui/core';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import MaskedInput from 'react-text-mask';
import { changeScreenB } from '../../../store/actions/navigation.action';
import { show, change, success, store, update, cep } from '../../../store/actions/units.action';

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [];

    if (props.name === 'phone') {
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

export default function UnitEdit(props) {
    const dispatch = useDispatch();
    const unit = useSelector(state => state.unitsReducer.unit);
    const error = useSelector(state => state.unitsReducer.error);
    const response = useSelector(state => state.unitsReducer.success);
    const unit_id = (props.uid) ? props.uid : null;

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
        if (unit_id) {
            dispatch(show(unit_id)).then(response => response && setLoading(false));
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
                        { (unit_id) ? 'Editar unidade' : 'Nova unidade' }
                    </Typography>

                    <Button 
                        onClick={() => (unit_id ? dispatch(update(unit)) : dispatch(store(unit)))} 
                        color="inherit" 
                        className="ml-auto"
                    >
                        <FaSave className="mr-2" />
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar>

            <div className="card-body scroll">
                {(isLoading) 
                    ? 
                        <div className="d-flex justify-content-center mt-5 pt-5">
                            <CircularProgress />
                        </div> 
                    : 
                        <>
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
                                        value: unit.phone,
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

                            {(unit.phone) && 
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
                                            value: unit.phone2,
                                            onChange: input => dispatch(change({ phone2: input.target.value }))                                                
                                        }}                                    
                                    />                                    
                                </div>
                            }

                            {(unit.phone2) && 
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
                                            value: unit.phone3,
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
                                        value: unit.zipCode,
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
                                            value={unit.city || ''}                                        
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
                                            value={unit.uf || ''}                                        
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
                                    value={unit.neighborhood || ''}                                        
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
                                            value={unit.street || ''} 
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
                                            value={unit.street_number || ''} 
                                            onChange={input => dispatch(change({ street_number: input.target.value }))}                                                                              
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
