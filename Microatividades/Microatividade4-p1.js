const mysql = require("mysql2");

// Criação de conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "example_db",
});

// Função segura para buscar usuário no banco de dados
function doDBAction(id, callback) {
  // Query com placeholders para evitar SQL Injection
  const query = "SELECT * FROM users WHERE userID = ?";

  // Execução da query com parâmetros seguros
    db.execute(query, [id], (err, results) => {
    if (err) {
    console.error("Erro ao executar a query:", err.message);
    callback({ success: false, message: "Erro no servidor" });
    return;
    }

    // Retorna os resultados da consulta
    callback({ success: true, data: results });
    });
}