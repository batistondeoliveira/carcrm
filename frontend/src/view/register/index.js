import React from 'react'
import { change, register } from '../../store/actions/register.action'
import { TextField, Typography, Button } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

export default function Register() {
    const dispatch = useDispatch();
    const { user, error, success } = useSelector(state => state.registerReducer);

    return (
        <div className="d-flex bg-white min-vh-100">
            <div className="container mt-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4">
                        <div className="form-group text-center">
                            <img height="48" src="/logo.png" alt="CAR CRM" />

                            <Typography className="mt-3" variant="h6" component="h1">
                                Crie sua conta, teste grátis!
                            </Typography> 
                        </div>

                        <TextField
                            error={(error.name) && true}
                            margin="normal"
                            label="Nome"
                            value={user.name}
                            onChange={(input) => {
                                dispatch( change({ name: input.target.value }) )
                                if(error.name && delete error.name);
                            }}
                        />

                        {(error.name) &&
                            <strong className="text-danger">
                                {error.name[0]}
                            </strong>
                        }

                        <TextField
                            error={(error.email) && true}
                            margin="normal"
                            label="Email"
                            value={user.email}
                            type="email"
                            autoComplete="email"
                            onChange={(input) => {
                                dispatch( change({ email: input.target.value }) )
                                if(error.email && delete error.email);
                            }}
                        />

                        {(error.email) &&
                            <strong className="text-danger">
                                {error.email[0]}
                            </strong>
                        }

                        <TextField
                            error={(error.password) && true}
                            margin="normal"
                            label="Senha"
                            value={user.password}
                            type="password"                            
                            onChange={(input) => {
                                dispatch( change({ password: input.target.value }) )
                                if(error.password && delete error.password);
                            }}
                        />

                        {(error.password) &&
                            <strong className="text-danger">
                                {error.password[0]}
                            </strong>
                        }

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            className="mt-4 mb-4"
                            onClick={() => dispatch( register(user) )}
                        >
                            Avançar
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="mt-4 text-danger">
                                Fazer Login
                            </Link>
                        </div>

                        {(success) &&
                            <Redirect to="/vehicles" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
