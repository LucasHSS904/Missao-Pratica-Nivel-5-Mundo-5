// Função de login
function login(username, password) {
    const _data = {
        username: username,
        password: password,
    };

    fetch("https://dominio.com/auth", {
        method: "POST",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then((response) => response.json())
        .then((json) => {
        if (json.jwt_token) {
          // Armazena o token e a data de expiração no localStorage
            const decoded = parseJwt(json.jwt_token);
            localStorage.setItem("token", json.jwt_token);
          localStorage.setItem("token_expiration", decoded.exp * 1000); // Salva em milissegundos
        }
        })
        .catch((err) => console.error("Erro no login:", err));
    }

  // Validação antes de realizar uma ação
    function doAction() {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("token_expiration");

    // Verifica se o token está expirado
    if (!token || Date.now() > tokenExpiration) {
        console.warn("Token expirado ou ausente. Redirecionando para login...");
      // Redireciona para a página de login ou renova o token
        window.location.href = "/login";
        return;
    }

    // Caso o token seja válido, prossegue com a requisição
    fetch("https://dominio.com/do_SomeAction", {
        method: "POST",
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(`Resposta: ${json.message}`))
        .catch((err) => console.error("Erro ao realizar ação:", err));
    }

  // Função para decodificar um token JWT sem verificar a assinatura
    function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}