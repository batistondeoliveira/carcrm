import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { MdAccessTime, MdAccountBalance, MdCached, MdCheckCircle, MdDone, MdPrint, MdWarning } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../store/actions/transations.action';
import Header from '../header';

export default function TransactionShow(props) {
    const dispatch = useDispatch();
    const transaction = useSelector(state => state.transactionsReducer.transaction); 
    const transaction_id = props.match.params.id || null;

    const [ isLoading, setLoading ] = React.useState(true);

    React.useEffect(() => {
        dispatch(show(transaction_id)).then(response => response && setLoading(false));
    }, []);

    return (
        <>
            <Header title="Detalhes da transação" />

            <div className="container mt-4 pt-3">
                {(isLoading) 
                    ? 
                        <div className="d-flex justify-content-center mt-5 pt-5">
                            <CircularProgress />
                        </div> 
                    :
                        <>
                            <div className="mb-4">
                                <h3 className="font-weight-normal">
                                    Operação {transaction.transaction_id}
                                </h3>                                              
                            </div>

                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-lg-between">
                                    <h5 className="mb-0">
                                        Recebimentos
                                    </h5>

                                    <h4 className="mb-0">
                                        { new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(transaction.transaction_amount) }
                                    </h4>
                                </div>

                                <div className="card-body">                                    
                                    <div className="d-flex">
                                        <div className="mr-4">  
                                            {(transaction.status === 'pending' || transaction.status === 'in_process') &&
                                                <MdAccessTime className={'h1 ' + transaction.status} />
                                            }

                                            {(transaction.status === 'approved') &&
                                                <MdCheckCircle className={'h1 ' + transaction.status} />
                                            }

                                            {(transaction.status === 'authorized') &&
                                                <MdDone className={'h1 ' + transaction.status} />
                                            }

                                            {(transaction.status === 'in_mediation' || transaction.status === 'cancelled' || transaction.status === 'rejected') &&
                                                <MdWarning className={'h1 ' + transaction.status} />
                                            }

                                            {(transaction.status === 'refunded' || transaction.status === 'charged_back') &&
                                                <MdCached className={'h1 ' + transaction.status} />
                                            }
                                        </div>

                                        <div>
                                            <h5>
                                                {transaction.description}                                                        
                                            </h5>

                                            <span className={'font-weight-bold ' + transaction.status}>
                                                {transaction.status_pt}
                                            </span>
                                        </div>
                                    </div>                                    
                                </div>                                
                            </div>

                            {(transaction.payment_method_id === 'bolbradesco') &&
                                <div className="card">
                                    <div className="card-header d-flex align-items-center pt-3 pb-3">
                                        <img className="mr-3" alt="" src='/boleto.svg' />

                                        <div>
                                            <h5 className="mb-md-0">
                                                Boleto de pagamento
                                            </h5>
                                            <label className="text-muted">
                                                #{transaction.transaction_id} - Pagamento {transaction.status_pt}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="d-flex">
                                            <a href={transaction.external_resource_url} target="_blank" rel="noopener noreferrer">
                                                <Button 
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<MdPrint />}
                                                    className="mt-3 mb-5 font-weight-bold"
                                                >
                                                    Imprimir Boleto
                                                </Button>
                                            </a>
                                        </div>

                                        <strong>
                                            O seu pagamento será aprovado entre 1 a 3 dias úteis
                                        </strong> 

                                        <label className="text-muted d-block">
                                            Enviamos estas informações para o seu e-mail para que você as tenha a mão.
                                        </label>
                                    </div>
                                </div>
                            }

                            {(transaction.payment_method_id === 'pec') &&
                                <div className="card">
                                    <div className="card-header d-flex align-items-center pt-3 pb-3">
                                        <img className="mr-3" alt="" src='/caixa.svg' />

                                        <div>
                                            <h5 className="mb-md-0">
                                                Pagamento na lotérica
                                            </h5>
                                            <label className="text-muted">
                                                #{transaction.transaction_id} - Pagamento {transaction.status_pt}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="d-flex">
                                            <a href={transaction.external_resource_url} target="_blank" rel="noopener noreferrer">
                                                <Button 
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<MdAccountBalance />}
                                                    className="mt-3 mb-5 font-weight-bold"
                                                >
                                                    Pagar na lotérica
                                                </Button>
                                            </a>
                                        </div>

                                        <strong>
                                            O seu pagamento será aprovado em até 1 hora
                                        </strong> 

                                        <label className="text-muted d-block">
                                            Enviamos estas informações para o seu e-mail para que você as tenha a mão.
                                        </label>
                                    </div>
                                </div>
                            }

                            {(!transaction.barcode) &&
                                <div className="card">
                                    <div className="card-header d-flex align-items-center pt-3 pb-3">
                                        <img className="mr-3" alt="" src='/card.png' />

                                        <div>
                                            <h5 className="mb-md-0">
                                                Cartão terminado em {transaction.last_four_digits}
                                            </h5>
                                            <label className="text-muted">
                                                #{transaction.transaction_id} - Pagamento {transaction.status_pt}
                                            </label>
                                        </div>
                                    </div>

                                    {(transaction.status === 'rejected') &&
                                        <div className="card-body">                                        
                                            <strong className='text-danger'>
                                                {transaction.status_detail}
                                            </strong>                                         
                                        </div>
                                    }                                    
                                </div>
                            }
                        </>
                }
            </div>
        </>
    )
}
