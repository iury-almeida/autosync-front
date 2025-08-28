# Sistema de Autenticação - AutoSync

## Visão Geral

O sistema de autenticação do AutoSync foi completamente reformulado para garantir segurança e uma melhor experiência do usuário. O sistema agora inclui gerenciamento automático de tokens, verificação de expiração e redirecionamento inteligente.

## Funcionalidades Implementadas

### 1. Gerenciamento de Token com Expiração
- **Duração do Token**: 30 minutos
- **Verificação Automática**: O sistema verifica automaticamente se o token expirou
- **Renovação Inteligente**: Tentativa de renovação quando o token está próximo da expiração (5 minutos antes)

### 2. Redirecionamento Automático
- **Proteção de Rotas**: Todas as rotas protegidas verificam a autenticação
- **Redirecionamento para Login**: Usuários não autenticados são automaticamente redirecionados para `/login`
- **Retorno à Página Original**: Após o login, o usuário é redirecionado para a página que tentava acessar

### 3. Componentes de Interface

#### AuthStatus
- Exibe informações do usuário logado
- Mostra o tempo restante do token em tempo real
- Botão de logout integrado
- Indicadores visuais de status (verde, amarelo, vermelho)

#### TokenExpirationAlert
- Alerta quando o token está próximo da expiração (últimos 5 minutos)
- Permite renovar a sessão ou fazer logout
- Contador regressivo em tempo real

### 4. Hooks Personalizados

#### useAuth
- Gerencia o estado de autenticação
- Valida tokens automaticamente
- Detecta expiração e renova tokens quando necessário

#### useTokenRefresh
- Monitora a expiração do token em background
- Tenta renovar automaticamente quando necessário
- Gerencia intervalos de verificação

### 5. Interceptadores de API
- **Request Interceptor**: Adiciona token automaticamente às requisições
- **Response Interceptor**: Trata erros 401 (não autorizado) automaticamente
- **Verificação de Expiração**: Verifica se o token expirou antes de fazer requisições

## Estrutura de Arquivos

```
src/
├── components/
│   ├── AuthStatus.tsx           # Status de autenticação no header
│   ├── TokenExpirationAlert.tsx # Alerta de expiração
│   ├── ProtectedRoute.tsx       # Proteção de rotas
│   └── Layout.tsx              # Layout principal com AuthStatus
├── hooks/
│   ├── useAuth.ts              # Hook principal de autenticação
│   └── useTokenRefresh.ts      # Hook de refresh automático
├── stores/
│   └── authStore.ts            # Store Zustand para autenticação
├── services/
│   ├── api.ts                  # Configuração do axios com interceptadores
│   └── authService.ts          # Serviços de autenticação
└── pages/
    └── Login.tsx               # Página de login com redirecionamento
```

## Fluxo de Autenticação

### 1. Login
1. Usuário acessa `/login`
2. Sistema verifica se já está autenticado
3. Se autenticado, redireciona para a página original ou dashboard
4. Se não autenticado, exibe formulário de login

### 2. Validação de Token
1. Token é validado a cada requisição
2. Se expirado, usuário é redirecionado para login
3. Se próximo da expiração, sistema tenta renovar automaticamente

### 3. Proteção de Rotas
1. Todas as rotas protegidas verificam autenticação
2. Se não autenticado, redireciona para login
3. Após login bem-sucedido, retorna à página original

### 4. Logout
1. Token é removido do store
2. Dados de autenticação são limpos
3. Usuário é redirecionado para login

## Configurações

### Duração do Token
```typescript
const TOKEN_DURATION = 30 * 60 * 1000; // 30 minutos em milissegundos
```

### Tempo de Renovação
```typescript
const fiveMinutes = 5 * 60 * 1000; // 5 minutos antes da expiração
```

### Intervalo de Verificação
```typescript
const oneMinute = 60 * 1000; // Verificação a cada minuto
```

## Melhorias de Segurança

1. **Verificação de Expiração**: Tokens são verificados antes de cada requisição
2. **Renovação Automática**: Sistema tenta renovar tokens próximos da expiração
3. **Logout Automático**: Usuário é deslogado automaticamente quando o token expira
4. **Proteção de Rotas**: Todas as rotas sensíveis são protegidas
5. **Interceptadores**: Tratamento automático de erros de autenticação

## Logs e Debug

O sistema inclui logs detalhados para facilitar o debug:

```typescript
console.log('Login realizado com sucesso. Token salvo:', token);
console.log('Token expira em:', new Date(expiration).toLocaleString());
console.log('Token expirado. Fazendo logout...');
console.log('Token próximo da expiração. Tentando renovar...');
```

## Próximas Melhorias

1. **Refresh Token**: Implementar refresh tokens para maior segurança
2. **Validação no Backend**: Adicionar endpoint para validar tokens no servidor
3. **Lembrar Sessão**: Opção para manter usuário logado
4. **Múltiplas Abas**: Sincronização de estado entre abas
5. **Auditoria**: Logs de login/logout para auditoria

## Como Usar

### Para Desenvolvedores

1. **Proteger uma Rota**:
```typescript
<Route
  path="/minha-rota"
  element={
    <ProtectedRoute>
      <MinhaPagina />
    </ProtectedRoute>
  }
/>
```

2. **Usar o Hook de Autenticação**:
```typescript
const { isAuthenticated, isValidating } = useAuth();
```

3. **Acessar o Store**:
```typescript
const { user, token, logout } = useAuthStore();
```

### Para Usuários

1. Acesse o sistema
2. Faça login com suas credenciais
3. O sistema manterá você logado por 30 minutos
4. Você será alertado 5 minutos antes da expiração
5. Pode renovar a sessão ou fazer logout

## Credenciais de Teste

- **CPF**: 123.456.789-00
- **Senha**: 123456
