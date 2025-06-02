import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';

function Navbar() {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            padding: '10px 20px',
            borderBottom: '1px solid #dee2e6'
        }}>
            {/* Logo */}
            <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                <Link to="/">
                    <img src={logo} alt="logo" style={{ height: '40px', cursor: 'pointer' }} />
                </Link>
            </div>

            {/* Navigation Links */}
            <div>
                <Link to="/menu" style={{ margin: '0 15px', color: '#007bff', textDecoration: 'none' }}>
                    Menu
                </Link>
                <Link to="/menu" style={{ margin: '0 15px', color: '#007bff', textDecoration: 'none' }}>
                    Menu
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
