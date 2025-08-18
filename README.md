# AutoSync - Sistema de Gestão de Peças

Sistema SAAS para gestão de loja de venda de peças, desenvolvido com React + TypeScript.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilização
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd autosync-front
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse o projeto em: `http://localhost:5173`

## 🔐 Credenciais de Teste

Para testar o sistema, use as seguintes credenciais:
- **Email:** admin@autosync.com
- **Senha:** 123456

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── services/      # Serviços de API
├── stores/        # Stores do Zustand
├── types/         # Tipos TypeScript
└── utils/         # Utilitários
```

## 🎯 Funcionalidades Implementadas

### ✅ V1 - Concluída
- [x] Sistema de autenticação (login/logout)
- [x] Layout responsivo com sidebar
- [x] Dashboard com métricas
- [x] Rotas protegidas
- [x] Gerenciamento de estado global
- [x] Validação de formulários
- [x] Interface moderna e responsiva

### 🚧 Próximas Versões
- [ ] Módulo de Estoque (CRUD de produtos)
- [ ] Módulo de Vendas (CRUD de vendas)
- [ ] Relatórios e gráficos
- [ ] Gestão de clientes
- [ ] Controle de usuários
- [ ] Notificações em tempo real

## 🎨 Design System

O projeto utiliza um design system consistente com:
- **Cores primárias:** Tons de azul (#3b82f6)
- **Tipografia:** Inter (sans-serif)
- **Componentes:** Cards, botões, inputs padronizados
- **Responsividade:** Mobile-first approach

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa linter
```

## 🌐 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🚀 Deploy

Para fazer deploy em produção:

1. Gere o build:
```bash
npm run build
```

2. Os arquivos estarão em `dist/`

3. Faça upload para seu servidor web

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub.
