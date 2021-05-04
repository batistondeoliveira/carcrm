import React from 'react';
import { index } from '../../store/actions/transations.action';
import { useDispatch, useSelector } from 'react-redux';
import { SCROLL } from '../../config/App';
import Header from '../header';
import { CircularProgress } from '@material-ui/core';

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
                            <div className="mb-4">
                                <h3 className="font-weight-normal">
                                    Transações
                                </h3>                                
                            </div>
                        </>
                }
            </div>
        </>
    )
}
