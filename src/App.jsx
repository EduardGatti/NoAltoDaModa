import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import PaginaInicial from "./Pages/PaginaInicial/PaginaInicial.jsx";
import { supabase } from './services/supabaseClient.js'; 

function App() {
  const [produtos, setProdutos] = useState([]);

  const carregarProdutos = async () => {
    // 👇 LOGS DE TESTE AQUI 👇
    console.log("--- INICIANDO CONEXÃO COM SUPABASE ---");
    console.log("URL do Supabase:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Chave configurada?", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Sim" : "Não");
    // 👆 FIM DOS LOGS 👆

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('ERRO AO BUSCAR PRODUTOS:', error);
    } else {
      console.log("SUCESSO! Produtos recebidos do banco:", data);
      setProdutos(data);
    }
  };

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