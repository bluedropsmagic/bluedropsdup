# 🚀 GUIA UNIVERSAL PARA BOTÕES DE COMPRA

## ⚠️ REGRA OBRIGATÓRIA

**A partir de agora, TODOS os botões de compra DEVEM usar o sistema universal.**

**❌ NUNCA MAIS faça isso:**
```typescript
// ❌ ERRADO - Não garante passagem de UTMs
window.location.href = 'https://pagamento.paybluedrops.com/checkout/123';

// ❌ ERRADO - Tracking manual sem UTMs
onClick={() => {
  trackInitiateCheckout(url);
  window.location.href = url;
}}
```

**✅ SEMPRE faça isso:**
```typescript
// ✅ CORRETO - Sistema universal
import { handleUniversalPurchase } from '../utils/purchaseUtils';

onClick={() => handleUniversalPurchase(url, 'meu-botao')}
```

---

## 🎯 MÉTODOS DISPONÍVEIS

### **1. Função Universal (Mais Flexível)**
```typescript
import { handleUniversalPurchase } from '../utils/purchaseUtils';

// Para qualquer URL de checkout
const handleClick = () => {
  handleUniversalPurchase(
    'https://pagamento.paybluedrops.com/checkout/176849703:1',
    'meu-botao-personalizado'
  );
};
```

### **2. Hook Universal (Para Componentes)**
```typescript
import { usePurchaseHandler } from '../utils/purchaseUtils';

const MyComponent = () => {
  const { handlePurchase, handleMainPurchase } = usePurchaseHandler();
  
  return (
    <button onClick={() => handleMainPurchase('6-bottle')}>
      Comprar 6 Frascos
    </button>
  );
};
```

### **3. Componente Universal (Mais Simples)**
```typescript
import { UniversalPurchaseButton } from '../components/UniversalPurchaseButton';

<UniversalPurchaseButton 
  url="https://pagamento.paybluedrops.com/checkout/176849703:1"
  trackingLabel="meu-botao"
  className="bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl"
>
  COMPRAR AGORA
</UniversalPurchaseButton>
```

### **4. Componentes Pré-Configurados**
```typescript
import { MainPackageButton, UpsellButton, DownsellButton } from '../components/UniversalPurchaseButton';

// Para pacotes principais
<MainPackageButton packageType="6-bottle" className="...">
  COMPRAR 6 FRASCOS
</MainPackageButton>

// Para upsells
<UpsellButton 
  action="accept" 
  variant="6bt" 
  acceptUrl="..." 
  rejectUrl="..." 
  className="..."
>
  ACEITAR OFERTA
</UpsellButton>

// Para downsells
<DownsellButton 
  action="reject" 
  variant="dws1" 
  acceptUrl="..." 
  rejectUrl="..." 
  className="..."
>
  REJEITAR OFERTA
</DownsellButton>
```

---

## 🔧 EXEMPLOS PRÁTICOS

### **Botão Simples**
```typescript
import { UniversalPurchaseButton } from '../components/UniversalPurchaseButton';

<UniversalPurchaseButton 
  url="https://pagamento.paybluedrops.com/checkout/176849703:1"
  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300"
  trackingLabel="hero-cta"
>
  🛒 COMPRAR AGORA
</UniversalPurchaseButton>
```

### **Botão com Callback Personalizado**
```typescript
<UniversalPurchaseButton 
  url="https://pagamento.paybluedrops.com/checkout/176849703:1"
  className="..."
  trackingLabel="special-offer"
  onClick={() => {
    console.log('Usuário clicou na oferta especial');
    // Qualquer lógica adicional aqui
  }}
>
  OFERTA ESPECIAL
</UniversalPurchaseButton>
```

### **Botão Condicional**
```typescript
const MyComponent = () => {
  const { handlePurchase } = usePurchaseHandler();
  
  const handleSpecialOffer = () => {
    // Lógica personalizada
    if (someCondition) {
      handlePurchase('https://url-especial.com', 'oferta-condicional');
    } else {
      handlePurchase('https://url-padrao.com', 'oferta-padrao');
    }
  };
  
  return <button onClick={handleSpecialOffer}>Oferta Dinâmica</button>;
};
```

---

## 🎯 PARÂMETROS GARANTIDOS

**TODOS** os botões criados com o sistema universal passarão automaticamente:

### **UTM Parameters**
- ✅ `utm_source`
- ✅ `utm_medium` 
- ✅ `utm_campaign`
- ✅ `utm_term`
- ✅ `utm_content` (incluindo formato `{ad_name}-{ad_pid}-{campaign_pid}-{original_filename}`)

### **Tracking Parameters**
- ✅ `fbclid` (Facebook Click ID)
- ✅ `gclid` (Google Click ID)
- ✅ `ttclid` (TikTok Click ID)
- ✅ `twclid` (Twitter Click ID)
- ✅ `cid` (RedTrack Category ID)

### **Affiliate Parameters**
- ✅ `affiliate_id`
- ✅ `sub_id`
- ✅ `click_id`
- ✅ `transaction_id`

### **Customer Parameters**
- ✅ `order_id`
- ✅ `customer_id`
- ✅ `email`
- ✅ `phone`
- ✅ `first_name`
- ✅ `last_name`
- ✅ `address`
- ✅ `city`
- ✅ `state`
- ✅ `zip`
- ✅ `country`

### **Campaign Parameters**
- ✅ `ad_name`
- ✅ `ad_pid`
- ✅ `campaign_pid`
- ✅ `original_filename`

---

## 🧪 TESTES E DEBUG

### **Função de Debug Global**
```javascript
// No console do navegador:
window.debugParameterStatus()

// Retorna status completo dos parâmetros
```

### **URLs de Teste**
```javascript
// No console do navegador:
window.generateTestUrls()

// Retorna URLs com parâmetros de teste
```

### **Verificação Manual**
1. Abra as Ferramentas do Desenvolvedor (F12)
2. Vá para Application → Session Storage
3. Procure por `tracking_params`
4. Verifique se todos os parâmetros estão armazenados

---

## 🚨 REGRAS OBRIGATÓRIAS

### **1. SEMPRE Import o Sistema Universal**
```typescript
// ✅ Para funções
import { handleUniversalPurchase, usePurchaseHandler } from '../utils/purchaseUtils';

// ✅ Para componentes
import { UniversalPurchaseButton, MainPackageButton } from '../components/UniversalPurchaseButton';
```

### **2. NUNCA Redirecione Manualmente**
```typescript
// ❌ NUNCA faça isso
window.location.href = url;

// ✅ SEMPRE use o sistema universal
handleUniversalPurchase(url, 'label');
```

### **3. SEMPRE Adicione Tracking Label**
```typescript
// ✅ Sempre forneça um label descritivo
handleUniversalPurchase(url, 'hero-6-bottle');
handleUniversalPurchase(url, 'sidebar-3-bottle');
handleUniversalPurchase(url, 'footer-1-bottle');
```

### **4. SEMPRE Use Classes CSS Padrão**
```typescript
// ✅ Sempre adicione a classe checkout-button
className="checkout-button bg-yellow-500 ..."

// ✅ Sempre adicione data-fttrack para FTTrack
data-fttrack="checkout"
```

---

## 📋 CHECKLIST PARA NOVOS BOTÕES

Antes de criar qualquer botão de compra, verifique:

- [ ] ✅ Importei o sistema universal?
- [ ] ✅ Usei `UniversalPurchaseButton` ou `handleUniversalPurchase`?
- [ ] ✅ Adicionei um `trackingLabel` descritivo?
- [ ] ✅ Adicionei a classe `checkout-button`?
- [ ] ✅ Adicionei `data-fttrack="checkout"`?
- [ ] ✅ Testei se os UTMs estão passando?

---

## 🎯 EXEMPLOS DE IMPLEMENTAÇÃO

### **Página Nova com Botões**
```typescript
import React from 'react';
import { UniversalPurchaseButton } from '../components/UniversalPurchaseButton';

export const MinhaNovaPageina: React.FC = () => {
  return (
    <div>
      <h1>Minha Nova Página</h1>
      
      {/* ✅ Botão que SEMPRE passará UTMs */}
      <UniversalPurchaseButton 
        url="https://pagamento.paybluedrops.com/checkout/176849703:1"
        trackingLabel="nova-pagina-6-bottle"
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl"
      >
        🛒 COMPRAR 6 FRASCOS
      </UniversalPurchaseButton>
    </div>
  );
};
```

### **Componente com Múltiplos Botões**
```typescript
import React from 'react';
import { MainPackageButton } from '../components/UniversalPurchaseButton';

export const MeuComponente: React.FC = () => {
  return (
    <div className="space-y-4">
      <MainPackageButton 
        packageType="6-bottle"
        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl"
      >
        6 FRASCOS - MELHOR VALOR
      </MainPackageButton>
      
      <MainPackageButton 
        packageType="3-bottle"
        className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg"
      >
        3 FRASCOS
      </MainPackageButton>
      
      <MainPackageButton 
        packageType="1-bottle"
        className="w-full bg-blue-400 text-white font-bold py-3 px-6 rounded-lg"
      >
        1 FRASCO
      </MainPackageButton>
    </div>
  );
};
```

---

## 🔥 GARANTIA

**Com este sistema, é IMPOSSÍVEL criar um botão que não passe os parâmetros UTM.**

Todos os botões criados daqui para frente terão:
- ✅ Passagem automática de UTMs
- ✅ Tracking de InitiateCheckout
- ✅ Preservação de CID (RedTrack)
- ✅ Delay para garantir tracking
- ✅ Fallback em caso de erro
- ✅ Debug automático em desenvolvimento

**🎯 RESULTADO: 100% de precisão na passagem de parâmetros para QUALQUER botão futuro!**