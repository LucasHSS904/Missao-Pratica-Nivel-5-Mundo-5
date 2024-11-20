const express = require("express");
const app = express();

app.get("/app/usuario", (req, res) => {
    const id = req.query.id;

    if (!id) {
    res.status(400).json({ success: false, message: "ID é obrigatório" });
    return;
    }

  // Chamada da função doDBAction para realizar a busca no banco
    doDBAction(id, (response) => {
    if (response.success) {
        res.status(200).json(response.data);
    } else {
        res.status(500).json({ success: false, message: response.message });
    }
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});