# Gestão de Usuários - AutoSync

Este módulo implementa um sistema completo de gestão de usuários para o AutoSync, incluindo cadastro, listagem, edição, visualização e exclusão de usuários.

## Funcionalidades Implementadas

### 1. Cadastro de Usuários (`UsuarioRegistration.tsx`)
- **Formulário completo** com todos os campos da tabela Usuario
- **Validação** usando Zod schema
- **Formatação automática** de CPF e telefone
- **Suporte a nome social** (campo opcional)
- **Mascaramento de senha** com toggle para mostrar/ocultar
- **Feedback visual** com mensagens de sucesso/erro

### 2. Listagem de Usuários (`UsuarioList.tsx`)
- **Tabela responsiva** com informações organizadas
- **Busca em tempo real** por nome, email ou CPF
- **Filtro por status** (Ativo, Inativo, Bloqueado)
- **Ações por usuário**: Visualizar, Editar, Excluir
- **Contador** de usuários encontrados
- **Loading states** e estados vazios

### 3. Edição de Usuários (`UsuarioEdit.tsx`)
- **Formulário pré-preenchido** com dados do usuário
- **Senha opcional** (mantém a atual se não alterada)
- **Validação** e formatação igual ao cadastro
- **Redirecionamento** automático após sucesso

### 4. Visualização de Usuários (`UsuarioView.tsx`)
- **Layout em modo somente leitura**
- **Informações organizadas** em seções
- **Ícones visuais** para melhor UX
- **Botão de edição** para acessar o formulário de edição

## Estrutura de Dados

### Interface Usuario
```typescript
interface Usuario {
  idUsuario: number;
  idPerfil: number;
  nomeCompleto: string;
  apelido: string;
  temNomeSocial: boolean;
  nomeSocial: string;
  telefone: string;
  email: string;
  cpf: string;
  senha: string;
  dataCadastro: string;
  ultimoAcesso: string;
  status: string;
}
```

### Campos Obrigatórios
- **idPerfil**: Perfil do usuário (1=Admin, 2=Usuário, 3=Gerente)
- **nomeCompleto**: Nome completo do usuário
- **telefone**: Número de telefone (formatado automaticamente)
- **email**: Email válido
- **cpf**: CPF (formatado automaticamente)
- **senha**: Senha (mínimo 6 caracteres)
- **status**: Status do usuário (ATIVO, INATIVO, BLOQUEADO)

### Campos Opcionais
- **apelido**: Apelido/nickname
- **temNomeSocial**: Boolean para indicar se possui nome social
- **nomeSocial**: Nome social (exibido apenas se temNomeSocial = true)

## APIs Utilizadas

### Endpoints
- `GET /Usuario/listarusuarios` - Listar todos os usuários (com paginação)
- `POST /Usuario/cadastrarusuario` - Cadastrar novo usuário
- `GET /Usuario/:IdUsuario` - Buscar usuário por ID
- `PUT /Usuario/:IdUsuario` - Atualizar usuário
- `DELETE /Usuario/:IdUsuario` - Excluir usuário

### Estrutura de Resposta - Listar Usuários
```json
{
  "acesso": "ok",
  "listaUsuarios": {
    "paginaAtual": 1,
    "tamanhoPagina": 10,
    "dados": [
      {
        "idUsuario": 1,
        "nomeCompleto": "Alex Cardozo"
      }
    ],
    "totalPaginas": 1,
    "totalRegistros": 2
  }
}
```

### Serviço (`usuarioService.ts`)
```typescript
class UsuarioService {
  async listarUsuarios(): Promise<ApiResponse<Usuario[]>> // Transforma ListaUsuariosResponse
  async buscarUsuarioPorId(idUsuario: number): Promise<ApiResponse<Usuario>>
  async cadastrarUsuario(data: CreateUsuarioData): Promise<ApiResponse<Usuario>>
  async atualizarUsuario(idUsuario: number, data: UpdateUsuarioData): Promise<ApiResponse<Usuario>>
  async excluirUsuario(idUsuario: number): Promise<ApiResponse<void>>
}
```

## Hooks Personalizados

### useCpfFormat
- Formatação automática de CPF (000.000.000-00)
- Validação de 11 dígitos
- Remoção de caracteres não numéricos

### usePhoneFormat
- Formatação automática de telefone ((11) 99999-9999)
- Validação de até 11 dígitos
- Remoção de caracteres não numéricos

## Rotas Implementadas

- `/usuarios` - Lista de usuários
- `/usuarios/cadastrar` - Cadastro de usuário
- `/usuarios/editar` - Edição de usuário
- `/usuarios/visualizar` - Visualização de usuário

## Navegação

### Dashboard
- Botão "Gestão de Usuários" adicionado ao dashboard
- Redireciona para `/usuarios`

### Fluxo de Navegação
1. **Dashboard** → **Lista de Usuários**
2. **Lista** → **Cadastro** (botão "Novo Usuário")
3. **Lista** → **Visualização** (ícone de olho)
4. **Lista** → **Edição** (ícone de lápis)
5. **Visualização** → **Edição** (botão "Editar")

## Validações

### Schema Zod
```typescript
const usuarioSchema = z.object({
  idPerfil: z.number().min(1, 'Perfil é obrigatório'),
  nomeCompleto: z.string().min(1, 'Nome completo é obrigatório'),
  apelido: z.string().optional(), // Não é obrigatório no backend
  temNomeSocial: z.boolean(),
  nomeSocial: z.string().optional(),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  status: z.string().min(1, 'Status é obrigatório'),
});
```

## Estilos e UI

### Design System
- **Cores**: Azul como cor primária, verde para sucesso, vermelho para erro
- **Ícones**: Lucide React para consistência
- **Layout**: Responsivo com Tailwind CSS
- **Feedback**: Mensagens toast para ações do usuário

### Componentes Reutilizáveis
- **Formulários**: Estrutura consistente com validação
- **Tabelas**: Layout responsivo com ações
- **Botões**: Estilos padronizados com ícones
- **Loading States**: Spinners e estados de carregamento

## Funcionalidades de Segurança

### Autenticação
- Todas as rotas protegidas com `ProtectedRoute`
- Token de autenticação incluído nas requisições
- Redirecionamento automático para login se não autenticado

### Validação de Dados
- Validação no frontend com Zod
- Sanitização de dados antes do envio
- Formatação automática de campos sensíveis

## Próximos Passos

### Melhorias Sugeridas
1. **Paginação** na listagem de usuários
2. **Filtros avançados** (por perfil, data de cadastro)
3. **Exportação** de dados (PDF, Excel)
4. **Histórico** de alterações
5. **Logs** de acesso
6. **Reset de senha** por email
7. **Upload de foto** do usuário

### Integrações
1. **Notificações** por email
2. **Auditoria** de ações
3. **Backup** automático
4. **Sincronização** com sistemas externos

## Como Usar

1. **Acesse** o dashboard
2. **Clique** em "Gestão de Usuários"
3. **Navegue** pelas funcionalidades:
   - Cadastrar novo usuário
   - Visualizar lista de usuários
   - Editar usuários existentes
   - Excluir usuários (com confirmação)

## Tecnologias Utilizadas

- **React** 18+ com TypeScript
- **React Router** para navegação
- **React Hook Form** para formulários
- **Zod** para validação
- **Tailwind CSS** para estilos
- **Lucide React** para ícones
- **Axios** para requisições HTTP
