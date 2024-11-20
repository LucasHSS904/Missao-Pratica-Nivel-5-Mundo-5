const express = require('express');
const jwt = require('jsonwebtoken'); // Biblioteca para manipulação de JWT

const app = express();

// Chave secreta para assinar os tokens (em produção, utilize variáveis de ambiente)
const SECRET_KEY = 'seu_segredo_seguro';

// Middleware para autenticação
function authenticateToken(req, res, next) {
    // Captura o token do cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer TOKEN"

    if (!token) {
        // Retorna erro se o token não for encontrado
        return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    // Verifica a validade do token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Token inválido ou expirado
            return res.status(401).json({ message: 'Acesso não autorizado' });
        }

        // Se o token for válido, armazena o usuário na requisição e avança
        req.user = user;
        next();
    });
}

// Simulação do serviço fictício
const service = {
    call: (req) => {
        return { data: 'Este é um dado confidencial', user: req.user };
    },
};

// Endpoint protegido
app.get('/confidential-data', authenticateToken, (req, res) => {
    // Processa a requisição e retorna os dados
    const jsonData = service.call(req);
    res.json(jsonData);
});

// Rota para gerar tokens (apenas para simulação)
app.post('/login', (req, res) => {
    const username = req.body.username; // Normalmente, isso seria validado com um banco de dados
    const user = { name: username };

    // Gera um token com validade de 1h
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});