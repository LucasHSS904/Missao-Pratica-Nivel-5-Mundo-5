// Melhorar o Gerenciamento de Sessões

const jwt = require('jsonwebtoken');

function generateSessionToken(user) {
    const payload = { id: user.id, perfil: user.perfil };
  const secretKey = process.env.SECRET_KEY; // Variável de ambiente
  const options = { expiresIn: '1h' }; // Token válido por 1 hora
    return jwt.sign(payload, secretKey, options);
}

function verifyToken(token) {
    const secretKey = process.env.SECRET_KEY;
    try {
    return jwt.verify(token, secretKey);
    } catch (err) {
    throw new Error('Token inválido ou expirado');
    }
}

// Sanitizar e Validar Parâmetros

const { Pool } = require('pg'); // Exemplo usando PostgreSQL
const pool = new Pool();

async function getContracts(empresa, inicio) {
  const query = 'SELECT * FROM contracts WHERE empresa = $1 AND data_inicio = $2';
const values = [empresa, inicio];
    try {
    const result = await pool.query(query, values);
    return result.rows;
    } catch (err) {
    console.error('Erro na consulta:', err);
    throw new Error('Erro ao buscar contratos');
    }
}

// Implementar Controle de Acesso Rigoroso

function authorize(permittedRoles) {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Acesso negado' });

        try {
        const user = verifyToken(token);
        if (!permittedRoles.includes(user.perfil)) {
            return res.status(403).json({ error: 'Permissão insuficiente' });
        }
        req.user = user;
        next();
        } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
        }
    };
}

// Corrigir Endpoint Problemáticos 

// Login (/api/auth/login):

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = generateSessionToken(user);
    res.status(200).json({ token });
});

// Recuperação de Usuários (/api/users):

app.get('/api/users', authorize(['admin']), (req, res) => {
    res.status(200).json({ data: users });
});

// Recuperação de Contratos (/api/contracts):

    app.get('/api/contracts/:empresa/:inicio', authorize(['admin', 'user']), async (req, res) => {
    const { empresa, inicio } = req.params;
    try {
    const result = await getContracts(empresa, inicio);
    res.status(200).json({ data: result });
    } catch (err) {
    res.status(500).json({ error: 'Erro ao recuperar contratos' });
    }
});
