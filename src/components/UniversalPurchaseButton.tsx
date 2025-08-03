import React from 'react';
import { handleUniversalPurchase, UniversalPurchaseButtonProps } from '../utils/purchaseUtils';

/**
 * 🎯 COMPONENTE UNIVERSAL DE BOTÃO DE COMPRA
 * 
 * SEMPRE use este componente para criar novos botões de compra
 * Garante passagem automática de TODOS os parâmetros UTM
 * 
 * Exemplo de uso:
 * 
 * <UniversalPurchaseButton 
 *   url="https://pagamento.paybluedrops.com/checkout/176849703:1"
 *   trackingLabel="main-6-bottle"
 *   className="bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl"
 * >
 *   COMPRAR AGORA
 * </UniversalPurchaseButton>
 */
export const UniversalPurchaseButton: React.FC<UniversalPurchaseButtonProps> = ({
  url,
  children,
  className = '',
  trackingLabel,
  delay = 150,
  disabled = false,
  style,
  onClick
}) => {
  const handleClick = () => {
    try {
      // ✅ Executar callback adicional se fornecido
      if (onClick) {
        onClick();
      }
      
      // ✅ SEMPRE usar o sistema universal
      handleUniversalPurchase(url, trackingLabel, delay);
      
    } catch (error) {
      console.error('❌ Error in UniversalPurchaseButton:', error);
      
      // ✅ Fallback: redirecionar mesmo com erro
      setTimeout(() => {
        window.location.href = url;
      }, delay);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`checkout-button ${className}`}
      disabled={disabled}
      style={{
        touchAction: 'manipulation',
        ...style
      }}
      data-fttrack="checkout"
    >
      {children}
    </button>
  );
};

/**
 * 🎯 COMPONENTE DE BOTÃO PARA PACOTES PRINCIPAIS
 * Pré-configurado para os 3 pacotes principais
 */
interface MainPackageButtonProps {
  packageType: '1-bottle' | '3-bottle' | '6-bottle';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const MainPackageButton: React.FC<MainPackageButtonProps> = ({
  packageType,
  children,
  className = '',
  disabled = false,
  onClick
}) => {
  const urls = {
    '1-bottle': 'https://pagamento.paybluedrops.com/checkout/176654642:1',
    '3-bottle': 'https://pagamento.paybluedrops.com/checkout/176845818:1',
    '6-bottle': 'https://pagamento.paybluedrops.com/checkout/176849703:1'
  };

  return (
    <UniversalPurchaseButton
      url={urls[packageType]}
      trackingLabel={`main-${packageType}`}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </UniversalPurchaseButton>
  );
};

/**
 * 🎯 COMPONENTE DE BOTÃO PARA UPSELLS
 * Pré-configurado para aceitar/rejeitar upsells
 */
interface UpsellButtonProps {
  action: 'accept' | 'reject';
  variant: string;
  acceptUrl: string;
  rejectUrl: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const UpsellButton: React.FC<UpsellButtonProps> = ({
  action,
  variant,
  acceptUrl,
  rejectUrl,
  children,
  className = '',
  disabled = false,
  onClick
}) => {
  const targetUrl = action === 'accept' ? acceptUrl : rejectUrl;

  return (
    <UniversalPurchaseButton
      url={targetUrl}
      trackingLabel={`upsell-${variant}-${action}`}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </UniversalPurchaseButton>
  );
};

/**
 * 🎯 COMPONENTE DE BOTÃO PARA DOWNSELLS
 * Pré-configurado para aceitar/rejeitar downsells
 */
interface DownsellButtonProps {
  action: 'accept' | 'reject';
  variant: string;
  acceptUrl: string;
  rejectUrl: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const DownsellButton: React.FC<DownsellButtonProps> = ({
  action,
  variant,
  acceptUrl,
  rejectUrl,
  children,
  className = '',
  disabled = false,
  onClick
}) => {
  const targetUrl = action === 'accept' ? acceptUrl : rejectUrl;

  return (
    <UniversalPurchaseButton
      url={targetUrl}
      trackingLabel={`downsell-${variant}-${action}`}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </UniversalPurchaseButton>
  );
};