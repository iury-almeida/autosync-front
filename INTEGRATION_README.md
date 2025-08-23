# Integração Frontend-Backend - AutoSync

## Status da Integração

✅ **INTEGRAÇÃO COMPLETA E FUNCIONAL**
- Login integrado com backend ASP.NET Core
- Validação de usuário e controle de acesso
- Token JWT salvo e utilizado automaticamente
- Proteção de rotas implementada
- Sistema de logout funcional

## Configuração

### Backend
- **URL**: http://localhost:5165
- **Porta**: 5165
- **Framework**: ASP.NET Core 8.0
- **Autenticação**: JWT Bearer Token

### Frontend
- **URL**: http://localhost:5173 (Vite)
- **Framework**: React + TypeScript
- **Estado**: Zustand com persistência

## Como Testar

### 1. Iniciar o Backend
```bash
cd autosync-back-end/AutoSync
dotnet run
```

### 2. Iniciar o Frontend
```bash
cd autosync-front-end/autosync-front
npm run dev
```

### 3. Testar Login
1. Acesse http://localhost:5173
2. Use as credenciais de teste: `123.456.789-00` / `123456`
3. Após login bem-sucedido, você será redirecionado para o Dashboard
4. No Dashboard, você verá o status da autenticação e informações do token

## Funcionalidades Implementadas

### ✅ Autenticação Completa
- **Login integrado** com backend real
- **Validação de token** JWT
- **Controle de tentativas** (máximo 3)
- **Bloqueio temporário** após falhas
- **Formatação automática** de CPF
- **Validação de formulário** robusta
- **Feedback visual** de erros e estados

### ✅ Proteção de Rotas
- **ProtectedRoute** para páginas que requerem autenticação
- **Redirecionamento automático** para login
- **Validação de token** em cada acesso
- **Preservação da rota original** para retorno após login

### ✅ Gerenciamento de Estado
- **Token JWT** armazenado no localStorage
- **Persistência** do estado de autenticação
- **Interceptor automático** para requisições autenticadas
- **Logout** com limpeza completa do estado

### ✅ Interface e UX
- **Design responsivo** e moderno
- **Status da autenticação** visível no Dashboard
- **Informações do token** com opção de visualização/cópia
- **Contador de tentativas** de login
- **Avisos de segurança** e bloqueio

## Estrutura de Arquivos

```
src/
├── services/
│   ├── api.ts              # Configuração base do axios
│   └── authService.ts      # Serviços de autenticação
├── stores/
│   └── authStore.ts        # Estado global de autenticação
├── hooks/
│   ├── useAuth.ts          # Hook para validação de autenticação
│   └── useCpfFormat.ts     # Hook para formatação de CPF
├── components/
│   ├── ProtectedRoute.tsx  # Proteção de rotas
│   └── AuthStatus.tsx      # Status da autenticação
├── pages/
│   ├── Login.tsx           # Página de login
│   └── Dashboard.tsx       # Dashboard com status de auth
└── types/
    └── index.ts            # Tipos TypeScript
```

## Fluxo de Autenticação

1. **Usuário acessa rota protegida**
2. **ProtectedRoute** verifica autenticação
3. **Se não autenticado** → redireciona para login
4. **Usuário faz login** com credenciais
5. **Backend valida** e retorna token JWT
6. **Frontend salva token** no localStorage
7. **Usuário é redirecionado** para página original
8. **Interceptor adiciona token** automaticamente nas requisições
9. **Token expirado** → logout automático

## Endpoints Utilizados

### Login
- **POST** `/Login/autenticacao`
- **Parâmetros**: `CPFUsuario`, `SenhaUsuario`, `Tentativa`
- **Resposta**: `{ status: boolean, token?: string, erro?: string, qtdTentativa?: number }`

### Recuperação de Senha
- **POST** `/Login/recuperarsenha`
- **GET** `/Login/novasenha`
- **POST** `/Login/novasenha`

## Segurança Implementada

- ✅ **Controle de tentativas** de login
- ✅ **Bloqueio temporário** após 3 tentativas
- ✅ **Token JWT** com expiração
- ✅ **Validação de token** em cada acesso
- ✅ **Logout automático** em caso de token inválido
- ✅ **Persistência segura** no localStorage

## Próximos Passos

1. ✅ **Integração completa** realizada
2. ✅ **Proteção de rotas** implementada
3. ✅ **Sistema de logout** funcional
4. 🔄 **Implementar refresh token** para renovação automática
5. 🔄 **Adicionar validação de CPF** mais robusta
6. 🔄 **Implementar recuperação de senha** completa
7. 🔄 **Adicionar perfil do usuário** com informações reais

## Troubleshooting

### Erro de CORS
- Verificar se o backend está rodando na porta 5165
- Verificar se o CORS está configurado no backend

### Erro de Rede
- Verificar se ambos os serviços estão rodando
- Verificar se as URLs estão corretas

### Token não está sendo enviado
- Verificar se o localStorage está funcionando
- Verificar se o interceptor está configurado corretamente

### Login não funciona
- Verificar se as credenciais estão corretas
- Verificar se o backend está respondendo
- Verificar se o formato da resposta está correto

## Credenciais de Teste

- **CPF**: 123.456.789-00
- **Senha**: 123456

*Nota: Estas são credenciais de teste. Em produção, use credenciais reais do banco de dados.*

## Status Final

🎉 **INTEGRAÇÃO 100% FUNCIONAL**

O sistema de autenticação está completamente integrado e funcionando. O frontend se comunica corretamente com o backend ASP.NET Core, valida usuários, salva tokens JWT e protege rotas adequadamente.
