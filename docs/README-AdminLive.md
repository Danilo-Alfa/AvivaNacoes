# 📡 Admin de Transmissão ao Vivo - AvivaNacoes

Sistema completo de gerenciamento de transmissão ao vivo com controle em tempo real através do Supabase.

---

## 📋 O QUE FOI CRIADO

### 1. **Schema do Banco de Dados** (`supabase-schema-live.sql`)
Duas tabelas:
- ✅ `live_config` - Configuração única da transmissão (single row table)
- ✅ `live_schedule` - Agendamento de múltiplas lives futuras (opcional)

### 2. **Service** (`src/services/liveService.ts`)
API completa para comunicação com Supabase:
- Ligar/desligar live rapidamente
- Atualizar configurações completas
- CRUD de agendamentos

### 3. **Painel Admin** (`src/pages/AdminLive.tsx`)
Interface administrativa **protegida por senha** com:
- 🔴 **Botão Ligar/Desligar** - Controle instantâneo
- ⚙️ **Configurações** - Título, descrição, URL do stream
- 📅 **Próxima Live** - Agendar próxima transmissão
- 🎨 **Visual** - Customizar cor do badge, contador de viewers

### 4. **Página Pública** (`src/pages/Live.tsx`)
Atualizada para buscar dados dinamicamente:
- Status da live (ativa/offline) do Supabase
- Informações configuradas pelo admin
- Próxima live agendada exibida automaticamente

### 5. **Rota** (`src/App.tsx`)
- ✅ Rota `/admin/live` adicionada

---

## 🚀 COMO USAR

### **Passo 1: Criar as Tabelas no Supabase**

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **"SQL Editor"** no menu lateral
3. Abra o arquivo `supabase-schema-live.sql`
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor e clique em **"Run"**
6. As tabelas serão criadas com dados de exemplo

### **Passo 2: Acessar o Painel Administrativo**

1. Inicie o projeto: `npm run dev`
2. Acesse: `http://localhost:5173/AvivaNacoes/admin/live`
3. **Digite a senha** configurada no `.env`
4. Você verá o painel de controle da live

### **Passo 3: Configurar a Live**

#### **Opção A: Ligar/Desligar Rápido**
1. Preencha a **URL do Stream**
2. Clique em **"Ligar Live"** para ativar
3. Clique em **"Desligar Live"** para desativar

#### **Opção B: Configuração Completa**
1. Preencha todos os campos do formulário:
   - **URL do Stream*** (obrigatório)
   - **Título da Live*** (obrigatório)
   - **Descrição** (aparece enquanto está ao vivo)
   - **Mensagem Offline*** (aparece quando está offline)
   - **Próxima Live** (título, data, hora, descrição)
   - **Configurações Visuais** (contador de viewers, cor do badge)

2. Clique em **"Salvar Configurações"**

---

## 🎯 FUNCIONALIDADES

### **Controle da Transmissão**:
- ✅ Ligar/desligar com 1 clique
- ✅ Status em tempo real (AO VIVO ou Offline)
- ✅ Atualização automática a cada 10 segundos

### **Configurações**:
- ✅ URL do stream (HLS, RTMP, YouTube)
- ✅ Título customizado
- ✅ Descrição da live atual
- ✅ Mensagem customizada quando offline
- ✅ Próxima live agendada (exibida automaticamente)
- ✅ Mostrar/ocultar contador de viewers
- ✅ Cor personalizada do badge "AO VIVO"

### **Página Pública**:
- ✅ Exibe live quando ativa
- ✅ Mensagem personalizada quando offline
- ✅ Mostra próxima live agendada
- ✅ Atualização automática (verifica a cada 10s)
- ✅ Contador de viewers (simulado)
- ✅ Badge "AO VIVO" animado

---

## 📊 ESTRUTURA DAS TABELAS

### **Tabela: live_config** (Configuração Principal)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID fixo (sempre o mesmo) |
| ativa | BOOLEAN | Se a live está ligada |
| url_stream | VARCHAR | URL do stream |
| titulo | VARCHAR | Título da live |
| descricao | TEXT | Descrição |
| mensagem_offline | TEXT | Mensagem quando offline |
| proxima_live_titulo | VARCHAR | Título da próxima live |
| proxima_live_data | TIMESTAMP | Data/hora da próxima live |
| proxima_live_descricao | TEXT | Descrição da próxima live |
| mostrar_contador_viewers | BOOLEAN | Mostrar contador |
| cor_badge | VARCHAR | Cor hexadecimal (#ef4444) |

**IMPORTANTE**: Esta tabela tem sempre **1 único registro**. Nunca faça INSERT, apenas UPDATE.

### **Tabela: live_schedule** (Agendamentos - Opcional)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| titulo | VARCHAR | Título da live |
| descricao | TEXT | Descrição |
| data_inicio | TIMESTAMP | Data/hora de início |
| data_fim | TIMESTAMP | Data/hora de fim (opcional) |
| url_stream | VARCHAR | URL específica (opcional) |
| ativa | BOOLEAN | Se está ativo |
| notificar_usuarios | BOOLEAN | Enviar notificação (futuro) |

---

## 🔒 SEGURANÇA

A página **AdminLive** está protegida por senha:
- ✅ Usa o componente `ProtectedAdmin`
- ✅ Senha configurada no `.env` (variável `VITE_ADMIN_PASSWORD`)
- ✅ Sessão mantida enquanto a aba estiver aberta
- ✅ Botão "Sair" no topo da tela

---

## 💡 CASOS DE USO

### **Caso 1: Culto ao Vivo**
1. Acesse `/admin/live`
2. Cole a URL do stream do YouTube: `https://youtube.com/live/xxxxx`
3. Digite o título: `Culto de Domingo - Ao Vivo`
4. Clique em **"Ligar Live"**
5. ✅ A live aparece no site em `/live`

### **Caso 2: Agendar Próxima Live**
1. Acesse `/admin/live`
2. Role até "Próxima Live Agendada"
3. Preencha:
   - Título: `Culto de Quarta-feira`
   - Data: Próxima quarta
   - Hora: `19:30`
   - Descrição: `Culto de Doutrina - 19:30h`
4. Clique em **"Salvar Configurações"**
5. ✅ Aparece na página pública quando a live está offline

### **Caso 3: Customizar Aparência**
1. Acesse `/admin/live`
2. Role até "Configurações Visuais"
3. Escolha uma cor para o badge "AO VIVO"
4. Desmarque "Mostrar Contador de Viewers" se quiser
5. Clique em **"Salvar Configurações"**

---

## 🎨 EXEMPLOS DE URL DE STREAM

### **YouTube Live**
```
https://www.youtube.com/embed/live_stream?channel=SEU_CANAL_ID
```
ou
```
https://www.youtube.com/watch?v=VIDEO_ID_DA_LIVE
```

### **HLS Stream (servidor próprio)**
```
https://seu-servidor.com/live/stream.m3u8
```

### **Facebook Live**
```
https://www.facebook.com/plugins/video.php?href=URL_DA_LIVE
```

---

## 📱 PÁGINAS E ROTAS

| Página | Rota | Descrição | Protegida |
|--------|------|-----------|-----------|
| Painel Admin | `/admin/live` | Controle da transmissão | ✅ Sim (senha) |
| Página Pública | `/live` | Assistir live | ❌ Não (pública) |

---

## 🐛 TROUBLESHOOTING

### **Live não aparece no site**:
1. Verifique se marcou "Ligar Live" no admin
2. Verifique se a URL do stream está correta
3. Verifique o console do navegador (F12)

### **"Mixed Content" bloqueado**:
- Se o site usa HTTPS mas o stream é HTTP, o navegador bloqueia
- Solução: Use stream HTTPS ou configure exceções no navegador
- Instruções aparecerão automaticamente na tela

### **Botão "Ligar Live" não funciona**:
1. Verifique se preencheu a URL do stream
2. Verifique se tem permissão de admin (senha correta)
3. Verifique o console para erros

---

## 🔄 FLUXO COMPLETO

```
1. Admin acessa /admin/live
2. Admin preenche URL do stream
3. Admin clica em "Ligar Live"
4. Status muda para "AO VIVO"
5. Visitantes acessam /live
6. Veem a transmissão ao vivo
7. Admin clica em "Desligar Live"
8. Status muda para "Offline"
9. Visitantes veem mensagem offline + próxima live
```

---

## 🚀 PRÓXIMOS PASSOS (OPCIONAL)

Melhorias futuras:
- [ ] Histórico de lives anteriores
- [ ] Notificações push quando live começa
- [ ] Chat integrado na live
- [ ] Estatísticas de viewers reais
- [ ] Múltiplas lives simultâneas
- [ ] Gravação automática

---

## 📞 DICAS

### **Para Lives do YouTube**:
1. Vá no YouTube Studio
2. Inicie uma transmissão ao vivo
3. Copie o link da live
4. Cole no campo "URL do Stream"
5. Ligue a live no admin

### **Para Contador de Viewers Real**:
- Atualmente é simulado (número aleatório)
- Para viewers reais, precisa integrar com API do YouTube ou servidor próprio

### **Para Melhor Performance**:
- Use stream HLS (.m3u8) para baixa latência
- Configure CDN se tiver muitos viewers
- Use HTTPS sempre que possível

---

**Desenvolvido para AvivaNações** 🙏
**Data da Implementação:** 21 de Janeiro de 2026
