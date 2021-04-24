import React from 'react';
import { store, show, change } from '../../store/actions/vehicles.action';
import { CircularProgress, TextField, InputAdornment } from '@material-ui/core';
import Header from '../header';
import MaskedInput from 'react-text-mask';

import { useDispatch, useSelector } from 'react-redux';

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

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

export default function VehicleEdit(props) {
    const dispatch = useDispatch();
    const data = useSelector(state => state.vehiclesReducer);

    const [state, setState] = React.useState({
        isLoading: true,
        isLoadingCep: false,
        isDeleted: null,
        redirect: false,
        tips: 0,
        confirmEl: null,
        vehicle_id: (props.match.params.id) ? props.match.params.id : null
    });

    React.useEffect(() => {
        index();
    }, []);

    const index = () => {
        if (state.vehicle_id) {
            dispatch(show(state.vehicle_id)).then(response => {
                if (response) {
                    setState({isLoading: false});
                }
            })
        } else {
            dispatch(store()).then(response => { 
                if (response) {
                    setState({isLoading: false});
                }
            })
        }
    }
    return (
        <div>
            <Header title="Veículos - gestão" />

            <div className="container mt-4 pt-3">
                {(state.isLoading) 
                    ? 
                        <div className="d-flex justify-content-center mt-5 pt-5">
                            <CircularProgress />
                        </div> 
                    :  
                        <div className="row">
                            <div className="col-md-7">
                                <h3 className="font-weight-normal mb-4">
                                    Localização do Veículo
                                </h3>

                                <div className="card card-body">
                                    <div className="row">
                                        <div className="col-md-7">
                                            <label className="label-custom">
                                                CEP
                                            </label>

                                            <TextField 
                                                style={(state.isLoadingCep) ? {opcaity: 0.5} : {}}
                                                error={(data.error.zipCode) && true}
                                                type="tel"
                                                InputProps={{
                                                    inputComponent: TextMaskCustom,
                                                    value: data.vehicle.zipCode,
                                                    onChange: input => {
                                                        dispatch(change({zipCode: input.target.value}));
                                                        if (input.target.value.length > 8) {
                                                            setState({isLoadingCep: true})
                                                        }
                                                    },
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            {(state.isLoadingCep) 
                                                                ? <CircularProgress size={32} />
                                                                : <></>
                                                            }
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />  

                                            {(data.error.zipCode) &&
                                                <strong className="text-danger">
                                                    {data.error.zipCode[0]}
                                                </strong>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5">
                                
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
