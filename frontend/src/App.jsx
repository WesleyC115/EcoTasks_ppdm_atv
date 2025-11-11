import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

// URL base da sua API. Ajuste se o seu backend rodar em outra porta.
const API_URL = "http://localhost:8800/tarefas";

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  
  // NOVO ESTADO: Para armazenar a categoria do filtro
  const [filterCategory, setFilterCategory] = useState(""); // "" significa "Todas"

  // 1. Buscar tarefas (READ)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Falha ao buscar tarefas");
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTasks();
  }, []); // O array vazio [] faz o useEffect rodar apenas uma vez, no início.

  // 2. Adicionar tarefa (CREATE)
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error("Falha ao adicionar tarefa");
      }
      
      // A API que você criou em server.js retorna { message, id }
      // Para funcionar corretamente aqui, precisamos buscar a tarefa completa ou
      // construir o objeto da nova tarefa localmente.
      // Vamos assumir a construção local por simplicidade, já que a API não retorna a tarefa inteira.
      
      // ATUALIZAÇÃO: Para pegar o ID real da API
      const apiResponse = await response.json(); 
      const newTask = { 
        id: apiResponse.id, // O ID retornado pelo backend
        ...taskData,        // titulo e categoria
        status: false       // status padrão
      };

      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };


  // 3. Atualizar status (UPDATE)
  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Inverte o status
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }), // Envia o novo status
      });
      if (!response.ok) {
        throw new Error("Falha ao atualizar status");
      }
      // Atualiza o estado local
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // 4. Deletar tarefa (DELETE)
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Falha ao deletar tarefa");
      }
      // Remove a tarefa do estado local
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // --- LÓGICA DO FILTRO ---

  // 1. Obter categorias únicas da lista de tarefas
  const categories = [...new Set(tasks.map((task) => task.categoria))];

  // 2. Criar a lista de tarefas filtradas
  const filteredTasks = filterCategory
    ? tasks.filter((task) => task.categoria === filterCategory)
    : tasks;

  // --- FIM DA LÓGICA DO FILTRO ---

  return (
    <div className="app-container">
      <header>
        <h1>EcoTasks</h1>
        <p>Seu gerenciador de tarefas sustentáveis</p>
      </header>

      {/* Mensagem de feedback (sucesso/erro) */}
      {error && <p className="error-message">{error}</p>}

      {/* Formulário para adicionar tarefas  */}
      <TaskForm onAddTask={handleAddTask} />

      {/* NOVO: Seletor de Filtro */}
      <div className="filter-container">
        <label htmlFor="category-filter">Filtrar por Categoria:</label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de tarefas (agora usa a lista filtrada) */}
      <TaskList
        tasks={filteredTasks} 
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
}

export default App;