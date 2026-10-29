import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import PaginaInicial from "./Pages/PaginaInicial/PaginaInicial.jsx";
import { supabase } from './services/supabaseClient.js'; // Ajuste se o caminho for diferente

function App() {
  const [produtos, setProdutos] = useState([]);

  // Função que busca os produtos no Supabase
  const carregarProdutos = async () => {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
    } else {
      setProdutos(data);
    }
  };

  // Roda quando o site abre
  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <PaginaInicial produtos={produtos} />
        </main>
        {/* Passamos a função carregarProdutos como recarregarProdutos */}
        <Footer 
          produtos={produtos} 
          setProdutos={setProdutos} 
          recarregarProdutos={carregarProdutos} 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;