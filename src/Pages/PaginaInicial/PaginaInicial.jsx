import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './PaginaInicial.css';

function PaginaInicial({ produtos }) {
  const [termoPesquisa, setTermoPesquisa] = useState('');

  const produtosFiltrados = produtos.filter((produto) => {
    if (!termoPesquisa.trim()) return true;
    const termo = termoPesquisa.toLowerCase();
    return (
      produto.nome.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo) ||
      produto.preco.toLowerCase().includes(termo)
    );
  });

  const enviarWhatsApp = (produto) => {
    const numeroLoja = '5548984614572'; // Substitua pelo seu número real com 55 e DDD
    
    const mensagem = `Oi, bom dia! Me interessei nessa peça, ainda tem em estoque?\n\n*Nome:* ${produto.nome}\n*Descrição:* ${produto.descricao}\n*Preço:* ${produto.preco}`;
    
    const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pagina-inicial">
      
      <section className="pesquisa">
        <input
          type="search"
          placeholder="Pesquise por nome, descrição ou preço..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
        />
      </section>

      <section className="grid-produtos">
        {produtosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#999', marginTop: '40px' }}>
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          produtosFiltrados.map((produto) => (
            <article className="card-produto" key={produto.id}>
              <div className="card-imagem">
                {produto.imagem ? (
                  <img src={produto.imagem} alt={produto.nome} />
                ) : (
                  <span style={{ color: '#ccc', fontSize: '14px' }}>Sem foto</span>
                )}
              </div>
              
              <div className="card-info">
                <div className="card-topo">
                  <h3>{produto.nome}</h3>
                  <span className={`card-tag ${produto.classificacao.replace(/\s/g, '-')}`}>
                    {produto.classificacao}
                  </span>
                </div>
                
                <p className="card-desc">{produto.descricao}</p>
                
                <div className="card-rodape">
                  <p className="preco">{produto.preco}</p>
                  <button 
                    className="btn-whatsapp" 
                    onClick={() => enviarWhatsApp(produto)}
                  >
                    <FaWhatsapp /> Comprar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default PaginaInicial;