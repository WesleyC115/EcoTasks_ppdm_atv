// server.js

import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// 1. Configuração da Conexão com o MySQL
const db = mysql.createConnection({
    host: "localhost",      // Ou o IP do seu servidor MySQL
    user: "root",           // Seu usuário do MySQL
    password: "aluno",   // Sua senha do MySQL
    database: "eco_tasks"   // O banco de dados que criamos [cite: 40]
});

// 2. Middlewares
// Permite que o Express entenda JSON vindo do frontend
app.use(express.json());
// Permite que o frontend (em outra porta) acesse esta API
app.use(cors());

// 3. Rota de Teste (Opcional)
app.get("/", (req, res) => {
    res.json("Olá, este é o backend do EcoTasks!");
});

// 4. Implementação das Rotas CRUD

// Rota GET: Listar todas as tarefas [cite: 51]
app.get("/tarefas", (req, res) => {
    const q = "SELECT * FROM tarefas ORDER BY id DESC";
    
    db.query(q, (err, data) => {
        if (err) {
            console.log("Erro ao buscar tarefas:", err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// Rota POST: Adicionar nova tarefa [cite: 53]
app.post("/tarefas", (req, res) => {
    // Pega 'titulo' e 'categoria' do corpo da requisição
    const { titulo, categoria } = req.body;
    
    // O 'status' já tem 'false' como padrão no banco [cite: 46]
    const q = "INSERT INTO tarefas (titulo, categoria) VALUES (?, ?)";
    
    db.query(q, [titulo, categoria], (err, data) => {
        if (err) {
            console.log("Erro ao criar tarefa:", err);
            return res.status(500).json(err);
        }
        // Retorna o ID da nova tarefa criada
        return res.json({ message: "Tarefa criada com sucesso!", id: data.insertId });
    });
});

// Rota PUT: Atualizar status da tarefa [cite: 55]
app.put("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    // Pega o novo 'status' (true ou false) do corpo da requisição
    const { status } = req.body;
    
    const q = "UPDATE tarefas SET status = ? WHERE id = ?";
    
    db.query(q, [status, id], (err, data) => {
        if (err) {
            console.log("Erro ao atualizar status:", err);
            return res.status(500).json(err);
        }
        if (data.affectedRows > 0) {
            return res.json({ message: "Status da tarefa atualizado!" });
        } else {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
    });
});

// Rota DELETE: Remover tarefa [cite: 57]
app.delete("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    
    const q = "DELETE FROM tarefas WHERE id = ?";
    
    db.query(q, [id], (err, data) => {
        if (err) {
            console.log("Erro ao deletar tarefa:", err);
            return res.status(500).json(err);
        }
        if (data.affectedRows > 0) {
            return res.json({ message: "Tarefa deletada com sucesso!" });
        } else {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
    });
});


// 5. Iniciar o Servidor
const PORT = 8800; // Porta padrão para o backend
app.listen(PORT, () => {
    console.log(`Backend 'EcoTasks' rodando em: http://localhost:${PORT} 🚀`);
});