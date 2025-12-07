# Como Configurar o Google Maps

## Passo 1: Obter API Key do Google Maps

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Maps JavaScript API**:
   - No menu lateral, vá em **APIs & Services > Library**
   - Procure por "Maps JavaScript API"
   - Clique em "Enable"
4. Ative a **Maps Embed API** (opcional, mas recomendado)
5. Crie uma API Key:
   - Vá em **APIs & Services > Credentials**
   - Clique em **Create Credentials > API Key**
   - Copie a chave gerada

## Passo 2: Configurar Restrições da API Key (Segurança)

1. Clique na API Key recém-criada
2. Em **Application restrictions**:
   - Selecione "HTTP referrers (web sites)"
   - Adicione seus domínios:
     - `http://localhost:*` (para desenvolvimento)
     - `https://seu-dominio.com/*` (para produção)
3. Em **API restrictions**:
   - Selecione "Restrict key"
   - Marque apenas:
     - Maps JavaScript API
     - Maps Embed API (se habilitado)

## Passo 3: Adicionar a API Key no Projeto

Abra o arquivo `src/pages/NossasIgrejas.tsx` e substitua:

```typescript
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
```

Por:

```typescript
const GOOGLE_MAPS_API_KEY = "SUA_CHAVE_REAL_AQUI";
```

**IMPORTANTE**: Para produção, é recomendado usar variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do projeto:
```
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

2. Atualize o código para:
```typescript
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

3. Adicione `.env` ao `.gitignore` para não commitar a chave

## Passo 4: Adicionar os Dados das Suas Igrejas

No arquivo `src/pages/NossasIgrejas.tsx`, atualize o array `churches` com os dados reais:

```typescript
const churches = [
  {
    id: 1,
    name: "Sede Central",
    neighborhood: "Centro",
    address: "Rua Real, 123 - Centro",
    city: "São Paulo - SP, CEP 01000-000",
    phone: "(11) 1234-5678",
    schedule: "Domingo: 09h e 19h\nQuarta: 19h30",
    pastor: "Pastor João Silva",
    position: { lat: -23.5505, lng: -46.6333 }, // Coordenadas reais
  },
  // ... adicione mais igrejas
];
```

### Como Obter Coordenadas (lat, lng):

1. Abra o [Google Maps](https://maps.google.com)
2. Procure pelo endereço da igreja
3. Clique com o botão direito no marcador
4. Clique em "What's here?"
5. As coordenadas aparecerão na parte inferior (ex: -23.5505, -46.6333)

## Passo 5: Personalizar o Mapa (Opcional)

### Criar um Map ID Personalizado:

1. No Google Cloud Console, vá em **Map Management > Map Styles**
2. Clique em **Create Map ID**
3. Escolha um estilo (ou crie customizado)
4. Copie o Map ID gerado
5. Substitua `mapId="church-map"` pelo seu Map ID real

### Ajustar Zoom e Centro:

```typescript
<Map
  defaultCenter={centerMap}
  defaultZoom={12}  // Ajuste conforme necessário (10-15 é comum)
  ...
/>
```

## Recursos Implementados

✅ Mapa interativo com marcadores
✅ Pins coloridos que mudam ao clicar
✅ Sincronização entre mapa e cards
✅ Link direto para Google Maps
✅ Cálculo automático do centro do mapa
✅ Responsivo e mobile-friendly

## Custos

- **Gratuito até**: $200 de créditos mensais (≈ 28,000 carregamentos de mapa)
- Para sites pequenos/médios, geralmente permanece gratuito

## Problemas Comuns

### Mapa não aparece:
- Verifique se a API Key está correta
- Confirme que a Maps JavaScript API está habilitada
- Verifique o console do navegador para erros

### "This page can't load Google Maps correctly":
- Verifique as restrições da API Key
- Certifique-se de que seu domínio está na whitelist

### Marcadores não aparecem:
- Verifique se as coordenadas estão corretas (lat, lng)
- Confirme que o array `churches` tem dados válidos

## Suporte

Para mais informações, consulte a [documentação oficial](https://developers.google.com/maps/documentation/javascript)
