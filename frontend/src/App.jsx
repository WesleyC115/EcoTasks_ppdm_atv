import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

// URL base da sua API. Ajuste se o seu backend rodar em outra porta.
const API_URL = "http://localhost:3000/tarefas";

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // 1. Buscar tarefas (READ) [cite: 51]
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

  // 2. Adicionar tarefa (CREATE) [cite: 53]
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
      const newTask = await response.json();
      // Adiciona a nova tarefa (retornada pela API) ao estado local
      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. Atualizar status (UPDATE) [cite: 55]
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

  // 4. Deletar tarefa (DELETE) [cite: 57]
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

  return (
    <div className="app-container">
      <header>
        <h1>EcoTasks</h1>
        <p>Seu gerenciador de tarefas sustentáveis</p>
      </header>

      {/* Mensagem de feedback (sucesso/erro) [cite: 74] */}
      {error && <p className="error-message">{error}</p>}

      {/* Formulário para adicionar tarefas  */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Lista de tarefas  */}
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
}

export default App;
