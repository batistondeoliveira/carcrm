import React from 'react';
import { index } from '../../store/actions/transations.action';
import { useDispatch, useSelector } from 'react-redux';
import { SCROLL } from '../../config/App';
import Header from '../header';
import { CircularProgress } from '@material-ui/core';
import { FcOpenedFolder } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { MdAccessTime, MdCached, MdCheckCircle, MdDone, MdWarning } from 'react-icons/md';

export default function Transactions() {
    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactionsReducer.transactions);    
    const [ isLoading, setLoading ] = React.useState(true);
    const [ isLoadMore, setLoadMore ] = React.useState(false);
    const [ query, setQuery ] = React.useState({ page: 1 });
    
    React.useEffect(() => {
        document.addEventListener('scroll', _handleScroll);

        return () => document.removeEventListener('scroll', _handleScroll);

        //eslint-disable-next-line react-hooks/exhaustive-deps
    });

    React.useEffect(() => {
        _index(isLoadMore);

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    React.useEffect(() => {
        if (isLoadMore) {
            setQuery({
                ...query,
                page: query.page + 1
            })
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadMore]);

    const _handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.srcElement.documentElement;

        let scroll = scrollHeight - (clientHeight + scrollTop);

        if (scroll < SCROLL) {
            if (!isLoadMore && _handleLoadMore());
        }
    }

    const _handleLoadMore = () => {
        if (transactions.current_page < transactions.last_page) {
            setLoadMore(true);
        }
    }    

    const _index = (loadMore) => {
        dispatch(index(query, loadMore)).then(response => {
            setLoading(false);
            setLoadMore(false);
        })
    }

    return (
        <>
            <Header title="Transações" /> 

            <div className="container mt-4 pt-3">
                {(isLoading) 
                    ? 
                        <div className="d-flex justify-content-center mt-5 pt-5">
                            <CircularProgress />
                        </div> 
                    :
                        <>
                            <div className="d-flex mb-4">
                                <h3 className="font-weight-normal">
                                    Transações
                                </h3>              

                                <div className="ml-2">
                                    <span className="badge badge-secondary">
                                        {transactions.total}
                                    </span>
                                </div>
                            </div>

                            {(transactions.data.length < 1) &&
                                <div className="text-center mt-5 pt-5 mb-5 pb-5">
                                    <FcOpenedFolder size="70" />
                                    <h6 className="mt-4 text-muted">
                                        Nenhuma transação encontrada
                                    </h6>
                                </div>
                            }

                            {transactions.data.map((item, index) => (
                                <div key={index} className="card mb-3">
                                    <div className="card-header d-flex justify-content-lg-between">
                                        <h5 className="mb-0">
                                            Recebimentos
                                        </h5>

                                        <h4 className="mb-0">
                                            { new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(item.transaction_amount) }
                                        </h4>
                                    </div>

                                    <div className="card-body">
                                        <Link to={'/transactions/' + item.transaction_id}>
                                            <div className="d-flex">
                                                <div className="mr-4">  
                                                    {(item.status === 'pending' || item.status === 'in_process') &&
                                                        <MdAccessTime className={'h1 ' + item.status} />
                                                    }

                                                    {(item.status === 'approved') &&
                                                        <MdCheckCircle className={'h1 ' + item.status} />
                                                    }

                                                    {(item.status === 'authorized') &&
                                                        <MdDone className={'h1 ' + item.status} />
                                                    }

                                                    {(item.status === 'in_mediation' || item.status === 'cancelled' || item.status === 'rejected') &&
                                                        <MdWarning className={'h1 ' + item.status} />
                                                    }

                                                    {(item.status === 'refunded' || item.status === 'charged_back') &&
                                                        <MdCached className={'h1 ' + item.status} />
                                                    }
                                                </div>

                                                <div>
                                                    <h5>
                                                        {item.description}                                                        
                                                    </h5>

                                                    <span className={'font-weight-bold ' + item.status}>
                                                        {item.status_pt}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {(isLoadMore) &&
                                <div className="text-center card-body">
                                    <CircularProgress />
                                </div>
                            }
                        </>
                }
            </div>
        </>
    )
}
