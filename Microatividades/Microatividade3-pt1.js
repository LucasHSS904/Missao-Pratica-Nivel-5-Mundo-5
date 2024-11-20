const jwt = require("jsonwebtoken");

// Secret key para assinar os tokens
const SECRET_KEY = "super_secret_key";

// Geração do token JWT com expiração
function do_Login(username) {
    const payload = {
    username: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 15, // Token expira em 15 minutos
    };

    const token = jwt.sign(payload, SECRET_KEY);
    return token;
}

// Validação do token JWT
function do_SomeAction(jwtToken) {
    try {
    const decoded = jwt.verify(jwtToken, SECRET_KEY);

    // Caso o token seja válido, prossiga com a ação
    console.log("Token válido. Executando ação...");
    return { success: true, message: "Ação executada com sucesso!" };
    } catch (err) {
    // Caso o token seja inválido ou expirado, retorne um erro genérico
    console.error("Erro na validação do token:", err.message);
    return { success: false, message: "Não autorizado" };
    }
}