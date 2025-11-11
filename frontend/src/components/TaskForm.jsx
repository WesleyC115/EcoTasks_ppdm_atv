import { useState } from "react";

function TaskForm({ onAddTask }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  // NOVO ESTADO: Para a data
  const [data, setData] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação de campos obrigatórios
    if (!titulo || !categoria) {
      alert("Por favor, preencha o título e a categoria.");
      return;
    }
    // Envia os dados para a função em App.jsx
    // ATUALIZADO: Envia a data junto
    onAddTask({ titulo, categoria, data_tarefa: data });
    
    // Limpa o formulário
    setTitulo("");
    setCategoria("");
    setData(""); // Limpa a data também
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="titulo">Tarefa:</label>
        <input
          id="titulo"
          type="text"
          placeholder="Ex: Separar o lixo reciclável"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="categoria">Categoria:</label>
        <input
          id="categoria"
          type="text"
          placeholder="Ex: Reciclagem"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
      </div>
      
      {/* NOVO: Campo de Data */}
      <div className="form-control">
        <label htmlFor="data">Data (Opcional):</label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
}

export default TaskForm;