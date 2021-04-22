import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './global.css';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from './Routes';

import { Loading, Notify, Alert } from './view/components';


const theme = createMuiTheme({
    palette: {
        primary: {          
            //main: '#ff4400',          
            main: blue[500],
        }
    },

    props: {
        MuiTextField: {
            variant: 'outlined',
            fullWidth: true
        },

        MuiSelect: {
            variant: 'outlined',
            fullWidth: true
        }
    }
});

const App = () => (
    <Provider store={store}>
        <ThemeProvider theme={theme}>    
            <Loading />    
            <Notify />   
            <Alert />            
            
            <Routes />
        </ThemeProvider>
    </Provider>
)

export default App;