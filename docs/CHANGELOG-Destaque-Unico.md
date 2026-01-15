# 🎯 Destaque Único - Sistema Automático

## 📋 O QUE FOI IMPLEMENTADO

Sistema automático que garante que **apenas 1 vídeo** seja marcado como destaque por vez.

---

## ⚙️ COMO FUNCIONA

### **Ao Criar um Novo Vídeo**
Quando você marca um vídeo como destaque:
1. ✅ O sistema **remove automaticamente** o destaque de todos os outros vídeos
2. ✅ O novo vídeo se torna o único destaque
3. ✅ Notificação confirmando: *"Vídeo foi criado como destaque. Os outros destaques foram removidos automaticamente."*

### **Ao Editar um Vídeo Existente**
Quando você marca um vídeo como destaque:
1. ✅ O sistema **remove automaticamente** o destaque de todos os outros vídeos (exceto o que está sendo editado)
2. ✅ O vídeo editado se torna o único destaque
3. ✅ Notificação confirmando: *"Vídeo agora é o vídeo em destaque. Os outros destaques foram removidos automaticamente."*

---

## 🎨 INTERFACE ATUALIZADA

### **Aviso Visual no Formulário**
Quando você marcar o checkbox "Marcar como vídeo em destaque", aparece um aviso:

```
☑️ Marcar como vídeo em destaque (aparece no topo da página)
⚠️ Ao marcar este vídeo como destaque, todos os outros destaques
   serão removidos automaticamente
```

---

## 📂 ARQUIVOS MODIFICADOS

### **1. src/services/videoService.ts**

#### **Nova Função Adicionada:**
```typescript
/**
 * Remove o destaque de todos os vídeos
 * Usado quando um novo vídeo é marcado como destaque
 */
async function removerTodosDestaques(): Promise<void>
```

#### **Função `criarVideo` Atualizada:**
```typescript
// Se este vídeo será destaque, remove o destaque dos outros
if (destaque) {
  await removerTodosDestaques();
}
```

#### **Função `atualizarVideo` Atualizada:**
```typescript
// Se este vídeo será destaque, remove o destaque dos outros (exceto este)
if (destaque) {
  const { error: removeError } = await supabase
    .from("videos")
    .update({ destaque: false })
    .eq("destaque", true)
    .neq("id", id);  // NÃO remove o destaque do próprio vídeo sendo editado

  if (removeError) throw removeError;
}
```

### **2. src/pages/AdminVideos.tsx**

#### **Notificações Atualizadas:**
```typescript
toast.success("Vídeo atualizado!", {
  description: destaqueVideo
    ? `"${tituloVideo}" agora é o vídeo em destaque. Os outros destaques foram removidos automaticamente.`
    : `O vídeo "${tituloVideo}" foi atualizado com sucesso.`,
});
```

#### **Aviso Visual Adicionado:**
```typescript
{destaqueVideo && (
  <p className="text-xs text-yellow-600 dark:text-yellow-500 ml-6">
    ⚠️ Ao marcar este vídeo como destaque, todos os outros destaques
       serão removidos automaticamente
  </p>
)}
```

---

## 🧪 TESTES

### **Cenário 1: Criar Novo Vídeo como Destaque**
1. ✅ Já existe um vídeo A marcado como destaque
2. ✅ Você cria um vídeo B e marca como destaque
3. ✅ **Resultado**: Vídeo A deixa de ser destaque, vídeo B se torna destaque

### **Cenário 2: Editar Vídeo e Marcar como Destaque**
1. ✅ Vídeo A é o destaque atual
2. ✅ Você edita o vídeo B e marca como destaque
3. ✅ **Resultado**: Vídeo A deixa de ser destaque, vídeo B se torna destaque

### **Cenário 3: Desmarcar Destaque**
1. ✅ Vídeo A é o destaque atual
2. ✅ Você edita o vídeo A e desmarca o destaque
3. ✅ **Resultado**: Nenhum vídeo fica como destaque (a página pública não mostra vídeo em destaque)

### **Cenário 4: Criar Vídeo Sem Destaque**
1. ✅ Você cria um vídeo novo SEM marcar como destaque
2. ✅ **Resultado**: O destaque anterior permanece inalterado

---

## 🔍 DETALHES TÉCNICOS

### **Lógica de Remoção**

**Na criação (`criarVideo`):**
```sql
-- Remove TODOS os destaques antes de inserir o novo
UPDATE videos SET destaque = false WHERE destaque = true;
```

**Na atualização (`atualizarVideo`):**
```sql
-- Remove TODOS os destaques EXCETO o vídeo sendo editado
UPDATE videos
SET destaque = false
WHERE destaque = true AND id != 'id_do_video_editado';
```

### **Por Que Usar `.neq("id", id)` na Atualização?**
- Evita problema de race condition
- Se remover o destaque do próprio vídeo antes de atualizar, pode causar conflito
- A query exclui o próprio vídeo da remoção, depois o atualiza corretamente

---

## ✅ VANTAGENS

1. ✅ **Automático**: Não precisa lembrar de desmarcar o vídeo anterior manualmente
2. ✅ **Seguro**: Impossível ter 2 vídeos em destaque simultaneamente
3. ✅ **Intuitivo**: Avisos visuais informam o que vai acontecer
4. ✅ **Feedback claro**: Notificações confirmam a ação realizada
5. ✅ **Consistência**: A página pública sempre mostra apenas 1 destaque

---

## 🚀 COMO USAR

### **Para Marcar um Novo Vídeo como Destaque:**
1. Acesse `/admin/videos`
2. Edite o vídeo desejado
3. Marque o checkbox **"Marcar como vídeo em destaque"**
4. Observe o aviso amarelo que aparece
5. Clique em **"Atualizar Vídeo"**
6. ✅ Pronto! O vídeo anterior automaticamente deixará de ser destaque

### **Para Remover o Destaque (sem colocar outro):**
1. Acesse `/admin/videos`
2. Edite o vídeo que está em destaque
3. **Desmarque** o checkbox **"Marcar como vídeo em destaque"**
4. Clique em **"Atualizar Vídeo"**
5. ✅ Pronto! Nenhum vídeo ficará em destaque

---

## 🎯 COMPORTAMENTO NA PÁGINA PÚBLICA

### **Quando Há um Destaque:**
```tsx
{videoDestaque && (
  <section className="mb-6 sm:mb-8 md:mb-16">
    {/* Card grande com o vídeo em destaque */}
  </section>
)}
```

### **Quando NÃO Há Destaque:**
- A seção de destaque simplesmente não aparece
- A página mostra direto o grid de vídeos recentes
- Nenhum erro é exibido

---

## 💡 DICA PRO

Se você quiser **sempre ter um vídeo em destaque**, basta:
1. Nunca desmarcar o checkbox de destaque
2. Sempre que adicionar um vídeo novo importante, marque como destaque
3. O sistema cuida automaticamente da troca

---

**Desenvolvido para AvivaNações** 🙏
**Data da Implementação:** 21 de Janeiro de 2026
