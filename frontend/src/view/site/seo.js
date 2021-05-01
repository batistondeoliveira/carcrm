import { AppBar, Button, IconButton, TextField, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { FaSave } from 'react-icons/fa'
import { MdKeyboardBackspace } from 'react-icons/md'
import { changeScreenA } from '../../store/actions/navigation.action'
import { change, update } from '../../store/actions/app.action';
import { useDispatch, useSelector } from 'react-redux';

export default function Seo() {
    const dispatch = useDispatch();
    const app = useSelector(state => state.appReducer.app);
    
    const _update = () => {
        dispatch(update(app)).then(response => dispatch(changeScreenA({ open: false })));
    }

    return (
        <>
            <AppBar position="absolute">
                <Toolbar>
                    <IconButton onClick={() => dispatch(changeScreenA({ open: false }))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                    </IconButton>

                    <Typography variant="h6" color="inherit">
                        Otimização Google
                    </Typography>

                    <Button 
                        onClick={() => _update()} 
                        color="inherit" 
                        className="ml-auto"
                    >
                        <FaSave className="mr-2" />
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar>  

            <div className="scroll card-body">
                <div className="form-group">
                    <label className="label-custom">
                        TÍTULO DO SITE
                    </label>

                    <TextField
                        value={app.site_title || ''}
                        onChange={input => dispatch(change({ site_title: input.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label className="label-custom">
                        PALAVRAS CHAVES
                    </label>

                    <TextField
                        placeholder="Separe cada palavra por vírgula"
                        value={app.site_keywords || ''}
                        onChange={input => dispatch(change({ site_keywords: input.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label className="label-custom">
                        DESCRIÇÃO DO SITE
                    </label>

                    <TextField
                        multiline
                        rows={5}
                        value={app.site_description || ''}
                        onChange={input => dispatch(change({ site_description: input.target.value }))}
                    />
                </div>
            </div>
        </>
    )
}
