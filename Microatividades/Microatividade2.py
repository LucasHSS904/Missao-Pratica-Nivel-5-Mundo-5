# Definições de segurança
MAX_LOGIN_ATTEMPTS = 5  # Limite de tentativas de login
MIN_PASSWORD_LENGTH = 8  # Quantidade mínima de caracteres para senha

# Variáveis para controle de tentativas
login_attempts = {}

# Verifica se o nome de usuário já está em uso
if USER_EXISTS(username):
    return Error("Usuário ou senha incorretos")  # Mensagem genérica

# Verifica se a senha atende ao requisito de tamanho mínimo
if len(password) < MIN_PASSWORD_LENGTH:
    return Error(f"A senha deve conter pelo menos {MIN_PASSWORD_LENGTH} caracteres.")

# Permite caracteres alfanuméricos e especiais na senha
# Nenhuma restrição adicional aplicada

# Limita as tentativas inválidas de login
if username in login_attempts and login_attempts[username] >= MAX_LOGIN_ATTEMPTS:
    return Error("Conta temporariamente bloqueada devido a tentativas de login inválidas.")

# Verifica as credenciais no banco de dados
is_valid_credentials = LOOKUP_CREDENTIALS_IN_DATABASE(username, password)

if not is_valid_credentials:
    # Incrementa a contagem de tentativas para o usuário
    if username not in login_attempts:
        login_attempts[username] = 0
    login_attempts[username] += 1

    return Error("Usuário ou senha incorretos")  # Mensagem genérica

# Limpa as tentativas ao realizar login com sucesso
if username in login_attempts:
    del login_attempts[username]

# Login bem-sucedido
return Success("Login realizado com sucesso!")