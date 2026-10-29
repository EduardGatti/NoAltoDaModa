import { useState } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrash, FaSearch, FaSpinner } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient.js'; // Ajuste o caminho se necessário
import './Admin.css';

function AdminPanel({ aberto, fechar, produtos, setProdutos, recarregarProdutos }) {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroClassificacao, setFiltroClassificacao] = useState('todos');
  const [formAberto, setFormAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  const [form, setForm] = useState({ 
    nome: '', descricao: '', preco: '', classificacao: 'novo', imagem: '' 
  });

  const classificacoes = ['novo', 'promoção', 'em estoque', 'esgotado'];

  const abrirCriar = () => {
    setProdutoEditando(null);
    setForm({ nome: '', descricao: '', preco: '', classificacao: 'novo', imagem: '' });
    setFormAberto(true);
  };

  const abrirEditar = (produto) => {
    setProdutoEditando(produto);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      classificacao: produto.classificacao,
      imagem: produto.imagem || ''
    });
    setFormAberto(true);
  };

  const handleImagem = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imagem: reader.result });
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.preco.trim()) return;
    
    setCarregando(true);
    let imagemFinalUrl = form.imagem;

    try {
      // 1. Se a imagem for um Base64 novo (foi upada agora), envia pro Supabase Storage
      if (form.imagem && form.imagem.startsWith('data:image')) {
        // Converte a string base64 em um arquivo (Blob) real
        const resposta = await fetch(form.imagem);
        const blob = await resposta.blob();
        
        // Cria um nome único para o arquivo
        const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        
        // Sobe para o bucket "produtos"
        const { error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(nomeArquivo, blob, { contentType: blob.type });

        if (uploadError) throw uploadError;

        // Pega a URL pública da imagem
        const { data: publicUrlData } = supabase.storage
          .from('produtos')
          .getPublicUrl(nomeArquivo);
          
        imagemFinalUrl = publicUrlData.publicUrl;
      }

      // 2. Salva os dados no Banco de Dados (Tabela 'produtos')
      const dadosParaSalvar = { ...form, imagem: imagemFinalUrl };

      if (produtoEditando) {
        const { error } = await supabase
          .from('produtos')
          .update(dadosParaSalvar)
          .eq('id', produtoEditando.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([dadosParaSalvar]);
        if (error) throw error;
      }

      // 3. Atualiza a lista local e limpa o formulário
      await recarregarProdutos(); 
      setFormAberto(false);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Ocorreu um erro ao salvar o produto. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const deletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
      const { error } = await supabase.from('produtos').delete().eq('id', id);
      if (error) throw error;
      
      // Remove da tela sem precisar recarregar tudo
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar o produto.');
    }
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchPesquisa = !termoPesquisa.trim() || p.nome.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchClassificacao = filtroClassificacao === 'todos' || p.classificacao === filtroClassificacao;
    return matchPesquisa && matchClassificacao;
  });

  if (!aberto) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-painel">
        {/* ... O restante do HTML do painel continua EXATAMENTE igual ... */}
        <div className="admin-header">
          <h2>Painel Admin — Produtos</h2>
          <button className="admin-fechar" onClick={fechar}><FaTimes /></button>
        </div>

        <div className="admin-acoes">
          <div className="admin-pesquisa">
            <FaSearch />
            <input type="search" placeholder="Pesquisar produto..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} />
          </div>
          <select value={filtroClassificacao} onChange={(e) => setFiltroClassificacao(e.target.value)}>
            <option value="todos">Todas as classificações</option>
            {classificacoes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="admin-btn-novo" onClick={abrirCriar}><FaPlus /> Novo Produto</button>
        </div>

        <div className="admin-lista">
          {produtosFiltrados.length === 0 ? (
            <p className="admin-vazio">Nenhum produto cadastrado.</p>
          ) : (
            produtosFiltrados.map((produto) => (
              <div className="admin-card" key={produto.id}>
                {produto.imagem && <img src={produto.imagem} alt={produto.nome} className="admin-card-img" />}
                <div className="admin-card-info">
                  <div className="admin-card-topo">
                    <h3>{produto.nome}</h3>
                    <span className={`admin-tag ${produto.classificacao.replace(/\s/g, '-')}`}>{produto.classificacao}</span>
                  </div>
                  <p className="admin-card-desc">{produto.descricao}</p>
                  <p className="admin-card-preco">{produto.preco}</p>
                </div>
                <div className="admin-card-acoes">
                  <button onClick={() => abrirEditar(produto)} className="admin-btn-editar"><FaEdit /> Editar</button>
                  <button onClick={() => deletar(produto.id)} className="admin-btn-deletar"><FaTrash /> Deletar</button>
                </div>
              </div>
            ))
          )}
        </div>

        {formAberto && (
          <div className="admin-form-overlay">
            <form className="admin-form" onSubmit={salvar}>
              <h3>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</h3>
              
              <label>Nome:<input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /></label>
              <label>Descrição:<textarea rows="2" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></label>
              <label>Preço:<input type="text" placeholder="R$ 0,00" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required /></label>
              <label>Classificação:
                <select value={form.classificacao} onChange={(e) => setForm({ ...form, classificacao: e.target.value })}>
                  {classificacoes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <div className="upload-area">
                <label htmlFor="upload-foto" className="upload-label"><FaPlus /> Escolher Foto da Roupa</label>
                <input id="upload-foto" type="file" accept="image/*" onChange={handleImagem} style={{ display: 'none' }} />
              </div>

              {form.imagem && <div className="preview-imagem"><img src={form.imagem} alt="Preview" /></div>}

              <div className="admin-form-botoes">
                <button type="button" className="admin-btn-cancelar" onClick={() => setFormAberto(false)} disabled={carregando}>Cancelar</button>
                <button type="submit" className="admin-btn-salvar" disabled={carregando}>
                  {carregando ? <><FaSpinner className="spin" /> Salvando...</> : (produtoEditando ? 'Salvar Alterações' : 'Criar Produto')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;