// 🚀 SISTEMA UNIVERSAL DE BOTÕES DE COMPRA
// Garante que TODOS os botões passem parâmetros UTM automaticamente

import { buildUrlWithParams } from './urlUtils';
import { trackInitiateCheckout } from './facebookPixelTracking';

/**
 * 🎯 FUNÇÃO UNIVERSAL PARA TODOS OS BOTÕES DE COMPRA
 * Use esta função para QUALQUER botão que redirecione para checkout
 * Garante passagem automática de TODOS os parâmetros UTM
 */
export const handleUniversalPurchase = (
  targetUrl: string,
  trackingLabel?: string,
  delay: number = 150
): void => {
  try {
    console.log('🛒 Universal Purchase Handler:', {
      targetUrl,
      trackingLabel,
      delay
    });

    // ✅ SEMPRE track InitiateCheckout primeiro
    trackInitiateCheckout(targetUrl);
    
    // ✅ SEMPRE usar buildUrlWithParams para capturar TODOS os UTMs
    const finalUrl = buildUrlWithParams(targetUrl);
    
    // ✅ Log para debug (apenas em desenvolvimento)
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('stackblitz') ||
        window.location.hostname.includes('bolt.new')) {
      console.log('🎯 Universal Purchase Debug:', {
        original: targetUrl,
        final: finalUrl,
        trackingLabel,
        utmsAdded: finalUrl !== targetUrl
      });
    }
    
    // ✅ SEMPRE redirecionar com delay para garantir tracking
    setTimeout(() => {
      window.location.href = finalUrl;
    }, delay);
    
  } catch (error) {
    console.error('❌ Error in Universal Purchase Handler:', error);
    
    // ✅ Fallback: redirecionar mesmo com erro
    setTimeout(() => {
      window.location.href = targetUrl;
    }, delay);
  }
};

/**
 * 🎯 HOOK UNIVERSAL PARA COMPONENTES REACT
 * Use este hook em qualquer componente que tenha botões de compra
 */
export const usePurchaseHandler = () => {
  return {
    /**
     * Função principal para todos os botões de compra
     */
    handlePurchase: handleUniversalPurchase,
    
    /**
     * Função específica para botões principais (6-bottle, etc.)
     */
    handleMainPurchase: (packageType: '1-bottle' | '3-bottle' | '6-bottle') => {
      const urls = {
        '1-bottle': 'https://pagamento.paybluedrops.com/checkout/176654642:1',
        '3-bottle': 'https://pagamento.paybluedrops.com/checkout/176845818:1',
        '6-bottle': 'https://pagamento.paybluedrops.com/checkout/176849703:1'
      };
      
      handleUniversalPurchase(urls[packageType], `main-${packageType}`);
    },
    
    /**
     * Função para upsells
     */
    handleUpsellPurchase: (action: 'accept' | 'reject', variant: string, acceptUrl: string, rejectUrl: string) => {
      const targetUrl = action === 'accept' ? acceptUrl : rejectUrl;
      handleUniversalPurchase(targetUrl, `upsell-${variant}-${action}`);
    },
    
    /**
     * Função para downsells
     */
    handleDownsellPurchase: (action: 'accept' | 'reject', variant: string, acceptUrl: string, rejectUrl: string) => {
      const targetUrl = action === 'accept' ? acceptUrl : rejectUrl;
      handleUniversalPurchase(targetUrl, `downsell-${variant}-${action}`);
    },
    
    /**
     * Função para qualquer URL customizada
     */
    handleCustomPurchase: (url: string, label?: string) => {
      handleUniversalPurchase(url, label);
    }
  };
};

/**
 * 🎯 COMPONENTE UNIVERSAL DE BOTÃO DE COMPRA
 * Use este componente para criar botões que SEMPRE passam UTMs
 */
export interface UniversalPurchaseButtonProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  trackingLabel?: string;
  delay?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void; // Callback adicional antes do redirecionamento
}

/**
 * 🎯 VALIDAÇÃO DE URL DE CHECKOUT
 * Verifica se uma URL é válida para checkout
 */
export const isValidCheckoutUrl = (url: string): boolean => {
  const validDomains = [
    'pagamento.paybluedrops.com',
    'cartpanda.com',
    'paybluedrops.com'
  ];
  
  return validDomains.some(domain => url.includes(domain));
};

/**
 * 🎯 GERADOR DE URLs DE TESTE
 * Para desenvolvimento e testes
 */
export const generateTestUrls = () => {
  const baseUrls = {
    '1-bottle': 'https://pagamento.paybluedrops.com/checkout/176654642:1',
    '3-bottle': 'https://pagamento.paybluedrops.com/checkout/176845818:1',
    '6-bottle': 'https://pagamento.paybluedrops.com/checkout/176849703:1'
  };
  
  const testParams = 'utm_source=test&utm_medium=cpc&utm_campaign=test_campaign&utm_content=ad_name-ad_pid-campaign_pid-original_filename&cid=test_category_id&fbclid=test123';
  
  return Object.entries(baseUrls).reduce((acc, [key, url]) => {
    acc[key] = `${url}?${testParams}`;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * 🎯 DEBUG: Verificar status dos parâmetros
 */
export const debugParameterStatus = () => {
  const currentParams = new URLSearchParams(window.location.search);
  const storedParams = sessionStorage.getItem('tracking_params');
  
  console.log('🔍 Parameter Debug Status:', {
    currentUrl: window.location.href,
    currentParams: Object.fromEntries(currentParams.entries()),
    storedParams: storedParams ? JSON.parse(storedParams) : null,
    sessionStorage: {
      tracking_params: sessionStorage.getItem('tracking_params'),
      admin_authenticated: sessionStorage.getItem('admin_authenticated')
    }
  });
  
  return {
    currentParams: Object.fromEntries(currentParams.entries()),
    storedParams: storedParams ? JSON.parse(storedParams) : null
  };
};

// ✅ Expor função de debug globalmente para testes
if (typeof window !== 'undefined') {
  (window as any).debugParameterStatus = debugParameterStatus;
  (window as any).generateTestUrls = generateTestUrls;
  console.log('🧪 Debug functions available:');
  console.log('- window.debugParameterStatus()');
  console.log('- window.generateTestUrls()');
}