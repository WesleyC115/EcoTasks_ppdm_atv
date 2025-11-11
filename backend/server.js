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
    database: "eco_tasks"   // O banco de dados que criamos
});

// 2. Middlewares
app.use(express.json());
app.use(cors());

// 3. Rota de Teste (Opcional)
app.get("/", (req, res) => {
    res.json("Olá, este é o backend do EcoTasks!");
});

// 4. Implementação das Rotas CRUD

// Rota GET: Listar todas as tarefas
app.get("/tarefas", (req, res) => {
    // ATUALIZADO: Seleciona a data_tarefa também
    const q = "SELECT *, DATE_FORMAT(data_tarefa, '%Y-%m-%d') AS data_tarefa FROM tarefas ORDER BY id DESC";
    
    db.query(q, (err, data) => {
        if (err) {
            console.log("Erro ao buscar tarefas:", err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// Rota POST: Adicionar nova tarefa
app.post("/tarefas", (req, res) => {
    // ATUALIZADO: Pega 'data_tarefa' do corpo da requisição
    const { titulo, categoria, data_tarefa } = req.body;
    
    // ATUALIZADO: Insere a data_tarefa (pode ser null se não for enviada)
    const q = "INSERT INTO tarefas (titulo, categoria, data_tarefa) VALUES (?, ?, ?)";
    
    // ATUALIZADO: Passa data_tarefa para a query
    db.query(q, [titulo, categoria, data_tarefa || null], (err, data) => {
        if (err) {
            console.log("Erro ao criar tarefa:", err);
            return res.status(500).json(err);
        }
        return res.json({ message: "Tarefa criada com sucesso!", id: data.insertId });
    });
});


// Rota PUT: Atualizar status da tarefa
app.put("/tarefas/:id", (req, res) => {
    const { id } = req.params;
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

// Rota DELETE: Remover tarefa
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
const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Backend 'EcoTasks' rodando em: http://localhost:${PORT} 🚀`);
});