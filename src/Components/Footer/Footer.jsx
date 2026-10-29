import './Footer.css';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
// Lembre-se de colocar o nome exato da sua pasta aqui
import AdminPanel from '../AdminPainel/Admin.jsx'; 

function Footer({ produtos, setProdutos, recarregarProdutos }) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState(false);
    const [adminAberto, setAdminAberto] = useState(false);

    const SENHA_ADMIN = 'essencia2024';

    const tentarAcessar = (e) => {
        e.preventDefault();
        if (senha === SENHA_ADMIN) {
            setSenha('');
            setErro(false);
            setMostrarSenha(false);
            setAdminAberto(true);
        } else {
            setErro(true);
            setSenha('');
        }
    };

    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h3>No Alto da Moda</h3>
                        <p>Elegância e estilo para você.</p>
                    </div>
                    <div className="footer-social">
                        <a href="https://instagram.com/noaltodamodaa" target="_blank" rel="noopener noreferrer" className="social-link instagram" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/5548984614572" target="_blank" rel="noopener noreferrer" className="social-link whatsapp" aria-label="WhatsApp">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} No Alto da Moda — Todos os direitos reservados.</p>
                    <button className="admin-trigger" onClick={() => setMostrarSenha((v) => !v)} aria-label="." />
                    
                    {mostrarSenha && (
                        <form className="admin-popup" onSubmit={tentarAcessar}>
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => { setSenha(e.target.value); setErro(false); }}
                                autoFocus
                            />
                            <button type="submit">Entrar</button>
                            {erro && <span className="admin-erro">Senha incorreta</span>}
                        </form>
                    )}
                </div>
            </footer>

            {/* Aqui passamos TUDO que o Admin precisa */}
            <AdminPanel 
                aberto={adminAberto} 
                fechar={() => setAdminAberto(false)} 
                produtos={produtos}
                setProdutos={setProdutos}
                recarregarProdutos={recarregarProdutos}
            />
        </>
    );
}

export default Footer;