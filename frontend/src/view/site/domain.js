import React from 'react';
import { AppBar, Button, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core';
import { FaSave } from 'react-icons/fa';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { changeScreenA } from '../../store/actions/navigation.action';
import { change, success, update, validateSubdomain } from '../../store/actions/app.action';
import { SUBDOMAIN, IP_SERVER } from '../../config/App';

export default function Domain() {
    const dispatch = useDispatch();
    const app = useSelector(state => state.appReducer.app);
    const error = useSelector(state => state.appReducer.error);
    const response = useSelector(state => state.appReducer.success);

    const [ tab, setTab ] = React.useState((app.domain));

    React.useEffect(() => {
        if(response && dispatch(changeScreenA({ open: false })));

        return () => dispatch(success(false)); //so executa quando fecha por conta do return

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    return (
        <>
            <AppBar position="absolute">
                <Toolbar>
                    <IconButton onClick={() => dispatch(changeScreenA({ open: false }))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                    </IconButton>

                    <Typography variant="h6" color="inherit">
                        Domínio
                    </Typography>

                    <Button 
                        onClick={() => dispatch(update(app))} 
                        color="inherit" 
                        className="ml-auto"
                    >
                        <FaSave className="mr-2" />
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar> 

            <div className="card-body scroll">
                <h6 className="text-center mb-4 mt-4">
                    Vamos escolher um endereço para o seu site
                </h6>

                {(!tab) &&
                    <>
                        <div className="form-group">
                            <h3 className="text-center mb-4 mt-4">
                                {(app.subdomain) || 'seusite'}.{SUBDOMAIN}                                
                            </h3>

                            <label className="label-custom">
                                Domínio Grátis
                            </label>

                            <TextField
                                placeholder="seusite"
                                value={app.subdomain || ''}
                                onChange={input => {
                                    dispatch(change({ subdomain: dispatch(validateSubdomain(input.target.value)) }));
        
                                    if (error.subdomain && delete error.subdomain);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <strong>
                                                .{SUBDOMAIN}
                                            </strong>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {(error.subdomain) &&
                                <strong className="text-danger">
                                    {error.subdomain[0]}
                                </strong>
                            }
                        </div>

                        <div className="form-group d-flex justify-content-center mt-5">
                            <Button 
                                variant="contained"
                                color="secondary"
                                onClick={() => setTab(true)}
                            >
                                Usar meu domínio
                            </Button>
                        </div>
                    </>
                }

                {(tab) &&
                    <>
                        <div className="form-group">
                            <Typography className="text-center mt-4 mb-4" component="p">
                                Necessário ter um domínio registrado para utilizar. <br/>
                                Para registrar um domínio acesse 
                                <Button 
                                    color="primary" 
                                    onClick={() => window.open('https://registro.br', '_blank')}
                                >
                                    https://registro.br
                                </Button>
                            </Typography>     

                            <label className="label-custom">
                                Domínio
                            </label>   

                            <TextField
                                placeholder="ex: seusite.com.br"
                                value={app.domain || ''}
                                onChange={input => {
                                    dispatch(change({ domain: input.target.value }));
                                    if (error.domain && delete error.domain);                                    
                                }}
                            />

                            {(error.domain) &&
                                <strong className="text-danger">
                                    {error.domain[0]}
                                </strong>
                            }
                        </div>

                        <div className="form-group d-flex justify-content-center mt-5">
                            <Button
                                variant="contained"
                                onClick={() => setTab(false)}                                
                            >
                                Usar um domínio grátis
                            </Button>
                        </div>

                        <div className="form-group mt-5">
                            <label className="label-custom">
                                Configure essas 2 entradas DNS no seu domínio
                            </label>

                            <table className="table mt-2">
                                <tbody>
                                    <tr>
                                        <th className="border-0">
                                            Nome
                                        </th>

                                        <td className="border-0">
                                            @
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Tipo
                                        </th>

                                        <td>
                                            A
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Dados
                                        </th>

                                        <td>
                                            {IP_SERVER}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table mt-5">
                                <tbody>
                                    <tr>
                                        <th className="border-0">
                                            Nome
                                        </th>

                                        <td className="border-0">
                                            WWW
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Tipo
                                        </th>

                                        <td>
                                            A
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Dados
                                        </th>

                                        <td>
                                            {IP_SERVER}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            </div>
        </>
    )
}
