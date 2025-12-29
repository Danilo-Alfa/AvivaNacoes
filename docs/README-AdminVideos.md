# 🎥 Admin de Vídeos - AvivaNacoes

Sistema completo de gerenciamento de vídeos e playlists do YouTube integrado com Supabase.

---

## 📋 O QUE FOI CRIADO

### 1. **Schema do Banco de Dados** (`supabase-schema-videos.sql`)
Duas tabelas completas com RLS (Row Level Security):
- ✅ `videos` - Gerencia vídeos individuais do YouTube
- ✅ `playlists` - Gerencia playlists/séries de vídeos

### 2. **Service** (`src/services/videoService.ts`)
API completa para comunicação com Supabase:
- CRUD de vídeos
- CRUD de playlists
- Funções otimizadas para buscar vídeos ativos, destaques e recentes

### 3. **Painel Admin** (`src/pages/AdminVideos.tsx`)
Interface administrativa com duas abas:
- 📹 **Vídeos**: Gerenciar vídeos individuais
- 📚 **Playlists**: Gerenciar séries e playlists

### 4. **Página Pública** (`src/pages/Videos.tsx`)
Atualizada para buscar dados dinamicamente:
- Vídeo em destaque
- Grid de vídeos recentes
- Séries e playlists

### 5. **Rota** (`src/App.tsx`)
- ✅ Rota `/admin/videos` adicionada

---

## 🚀 COMO USAR

### **Passo 1: Criar as Tabelas no Supabase**

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **"SQL Editor"** no menu lateral
3. Abra o arquivo `supabase-schema-videos.sql`
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor e clique em **"Run"**
6. As tabelas serão criadas com dados de exemplo

### **Passo 2: Acessar o Painel Administrativo**

1. Inicie o projeto: `npm run dev`
2. Acesse: `http://localhost:5173/AvivaNacoes/admin/videos`
3. Você verá duas abas:
   - **Vídeos**: Para gerenciar vídeos individuais
   - **Playlists**: Para gerenciar playlists do YouTube

### **Passo 3: Adicionar Vídeos**

#### **Aba Vídeos**:
1. Preencha os campos do formulário:
   - **Título*** (obrigatório)
   - **Descrição** (opcional)
   - **URL do YouTube*** (obrigatório) - Ex: `https://youtu.be/xxxxx`
   - **URL da Thumbnail** (opcional) - Deixe vazio para usar a thumbnail padrão do YouTube
   - **Duração** - Ex: "1h 15min" ou "45min"
   - **Pregador/Orador** - Ex: "Pastor João Silva"
   - **Categoria** - Ex: "Culto", "Pregação", "Testemunho"
   - **Ordem de Exibição** - Menor número aparece primeiro (0 = primeira posição)
   - **Data/Hora de Publicação** - Data real do vídeo
   - ☑️ **Marcar como destaque** - Aparece no topo da página pública
   - ☑️ **Vídeo ativo** - Visível na página pública

2. Clique em **"Criar Vídeo"**

#### **Aba Playlists**:
1. Preencha os campos:
   - **Nome da Playlist*** (obrigatório) - Ex: "Série: Fundamentos da Fé"
   - **Descrição** (opcional)
   - **URL da Playlist do YouTube*** (obrigatório)
     - Exemplo: `https://www.youtube.com/playlist?list=PLrRqXJYWjYhW8CqXBqXzV4ZJNqZ5Ck3gK`
   - **Quantidade de Vídeos** - Ex: 8
   - **Categoria** - Ex: "Série", "Testemunhos", "Estudos"
   - **Ordem de Exibição** - Menor número aparece primeiro
   - ☑️ **Playlist ativa** - Visível na página pública

2. Clique em **"Criar Playlist"**

### **Passo 4: Como Obter URLs do YouTube**

#### **Para Vídeos Individuais**:
1. Abra o vídeo no YouTube
2. Clique em **"Compartilhar"**
3. Copie a URL curta: `https://youtu.be/xxxxx`
4. Cole no campo "URL do YouTube"

#### **Para Playlists**:
1. Abra a playlist no YouTube
2. Copie a URL completa da barra de endereço
3. A URL deve conter `playlist?list=`
4. Exemplo: `https://www.youtube.com/playlist?list=PLrRqXJYWjYhW8CqXBqXzV4ZJNqZ5Ck3gK`

---

## 🎯 FUNCIONALIDADES

### **Vídeos**:
- ✅ Adicionar, editar e deletar vídeos
- ✅ Marcar vídeo como destaque (aparece no topo)
- ✅ Ativar/desativar vídeos
- ✅ Ordenar vídeos por prioridade
- ✅ Adicionar pregador, categoria, duração
- ✅ Definir data de publicação
- ✅ Thumbnail personalizada (opcional)

### **Playlists**:
- ✅ Adicionar, editar e deletar playlists
- ✅ Link direto para playlist do YouTube
- ✅ Quantidade de vídeos na playlist
- ✅ Ativar/desativar playlists
- ✅ Ordenar playlists por prioridade
- ✅ Categorizar playlists

### **Página Pública**:
- ✅ Vídeo em destaque no topo
- ✅ Grid de 9 vídeos recentes
- ✅ Exibição de playlists com link direto
- ✅ Data relativa ("5 dias atrás", "2 semanas atrás")
- ✅ Responsivo para mobile, tablet e desktop

---

## 📊 ESTRUTURA DAS TABELAS

### **Tabela: videos**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único (gerado automaticamente) |
| titulo | VARCHAR | Título do vídeo |
| descricao | TEXT | Descrição completa |
| url_video | VARCHAR | URL do YouTube |
| thumbnail_url | VARCHAR | URL da thumbnail (opcional) |
| duracao | VARCHAR | Duração formatada ("1h 15min") |
| pregador | VARCHAR | Nome do pregador/orador |
| categoria | VARCHAR | Categoria (Culto, Pregação, etc) |
| destaque | BOOLEAN | Se é o vídeo em destaque |
| ordem | INTEGER | Ordem de exibição (0 = primeiro) |
| ativo | BOOLEAN | Se está visível publicamente |
| data_publicacao | TIMESTAMP | Data real do vídeo |

### **Tabela: playlists**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único (gerado automaticamente) |
| nome | VARCHAR | Nome da playlist |
| descricao | TEXT | Descrição da série |
| url_playlist | VARCHAR | URL da playlist do YouTube |
| quantidade_videos | INTEGER | Quantidade de vídeos |
| categoria | VARCHAR | Categoria (Série, Testemunhos, etc) |
| ordem | INTEGER | Ordem de exibição |
| ativo | BOOLEAN | Se está visível publicamente |

---

## 🔒 SEGURANÇA (RLS - Row Level Security)

As políticas de segurança configuradas:
- ✅ **Leitura pública**: Qualquer pessoa pode ver vídeos/playlists ativos
- ✅ **Escrita protegida**: Apenas admins autenticados podem criar/editar/deletar
- ✅ **Timestamps automáticos**: `created_at` e `updated_at` são gerenciados automaticamente

---

## 📱 PÁGINAS E ROTAS

| Página | Rota | Descrição |
|--------|------|-----------|
| Painel Admin | `/admin/videos` | Gerenciar vídeos e playlists |
| Página Pública | `/videos` | Visualizar vídeos e playlists |

---

## 💡 DICAS

### **Vídeo em Destaque**:
- Apenas **1 vídeo** deve estar marcado como destaque por vez
- Use a opção **"Ordem"** para decidir qual destaque aparece se houver múltiplos

### **Ordem de Exibição**:
- **0** = Primeiro
- **1** = Segundo
- E assim por diante...
- Vídeos com mesma ordem são ordenados por data de publicação

### **Thumbnail Personalizada**:
- Se deixar em branco, o ReactPlayer usa a thumbnail padrão do YouTube
- Se quiser personalizar, use uma URL de imagem hospedada

### **Categorias Sugeridas**:
- Vídeos: "Culto", "Pregação", "Testemunho", "Estudo Bíblico", "Louvor"
- Playlists: "Série", "Testemunhos", "Estudos", "Eventos Especiais"

---

## 🎨 COMPONENTES UTILIZADOS

- **shadcn/ui**: Card, Button, Input, Label, Textarea, Checkbox, Tabs
- **lucide-react**: Ícones (VideoIcon, List, Edit, Trash2, Eye, EyeOff, Play, Clock)
- **react-player**: Player de vídeo do YouTube
- **sonner**: Notificações toast
- **supabase**: Banco de dados e autenticação

---

## 🐛 TROUBLESHOOTING

### **Erro ao carregar vídeos**:
1. Verifique se as tabelas foram criadas no Supabase
2. Verifique se as políticas RLS estão ativas
3. Verifique o console do navegador para mensagens de erro

### **Vídeos não aparecem na página pública**:
1. Certifique-se de marcar o checkbox **"Vídeo ativo"** no admin
2. Verifique se o vídeo tem uma data de publicação

### **Playlist não abre**:
1. Verifique se a URL da playlist está correta
2. A URL deve conter `playlist?list=`

---

## 🎉 PRÓXIMOS PASSOS (OPCIONAL)

Melhorias futuras que você pode implementar:
- [ ] Upload de thumbnails personalizadas direto para o Supabase Storage
- [ ] Filtros por categoria na página pública
- [ ] Busca de vídeos
- [ ] Estatísticas de visualizações
- [ ] Comentários nos vídeos
- [ ] Sistema de likes/favoritos

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Verifique o console do navegador (F12) para erros
2. Verifique os logs do Supabase (SQL Editor > Logs)
3. Revise este documento

---

**Desenvolvido para AvivaNações** 🙏
