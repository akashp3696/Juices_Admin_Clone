import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin2 = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleCustomLogin = (e) => {
        e.preventDefault()
        if (username == 'aakashprajapat59@gmail.com' && password == 'Akash@123') {
            localStorage.setItem('subloginauth', true);
            console.log('Validataion done');
            navigate('/sub/order');
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Username</Typography>
                    <CustomTextField id="username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" >Password</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remember this Device"
                        />
                    </FormGroup>
                </Stack>
            </Stack>
            <Box>
                <Button
                    onClick={handleCustomLogin}
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    // type="submit"
                >
                    Sign In
                </Button>
            </Box>
            {subtitle}

            {/* Custom Login Button */}
            
        </>
    );
};

export default AuthLogin2;
