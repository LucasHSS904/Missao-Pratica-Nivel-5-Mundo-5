<?php

// Define o domínio permitido para redirecionamentos
$allowedDomain = "meusite.com";

// Obtém o URL de redirecionamento via GET
$redirectUrl = $_GET['url'] ?? '';

// Remove caracteres de controle (CRLF, etc.)
$sanitizedUrl = preg_replace('/[\r\n]/', '', $redirectUrl);

// Valida se o domínio é permitido
$parsedUrl = parse_url($sanitizedUrl);

if (isset($parsedUrl['host']) && $parsedUrl['host'] === $allowedDomain) {
    // Executa o redirecionamento apenas para URLs válidas
    header('Location: ' . $sanitizedUrl);
    exit();
} else {
    // Retorna erro caso o redirecionamento seja inválido
    http_response_code(400);
    echo "Redirecionamento inválido.";
}
?>