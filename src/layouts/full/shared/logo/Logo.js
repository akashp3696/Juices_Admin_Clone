import { Link } from 'react-router-dom';
import logo from 'src/assets/images/logos/logo.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
    <img src={logo} alt="Logo" height={50} style={{marginTop:'20px'}}/>
    <span style={{ marginTop: '8px', fontSize: '12px', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}></span>
  </LinkStyled>
  )
};

export default Logo;
