import './Header.css';
import { FiUser } from 'react-icons/fi';
import noaltodamodaImg from '../../assets/noaltodamoda.png';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <img 
                    className="logo-img" 
                    src={noaltodamodaImg} 
                    alt="No Alto da Moda" 
                />

            </div>
        </header>
    );
}

export default Header;