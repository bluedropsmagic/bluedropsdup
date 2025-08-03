import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, ExternalLink, Copy, Eye, Settings } from 'lucide-react';
import { 
  getAllTrackingParams, 
  getStoredTrackingParams, 
  buildUrlWithParams,
  initializeTracking 
} from '../utils/urlUtils';

interface ParameterTest {
  name: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  value?: string;
}

export const ParameterTestPanel: React.FC = () => {
  const [parameterTests, setParameterTests] = useState<ParameterTest[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [currentParams, setCurrentParams] = useState<Record<string, string>>({});
  const [storedParams, setStoredParams] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});

  // URLs de teste para diferentes cenários
  const testUrls = [
    {
      name: 'Pacote 6 Frascos',
      url: 'https://pagamento.paybluedrops.com/checkout/176849703:1',
      type: 'main'
    },
    {
      name: 'Pacote 3 Frascos', 
      url: 'https://pagamento.paybluedrops.com/checkout/176845818:1',
      type: 'main'
    },
    {
      name: 'Pacote 1 Frasco',
      url: 'https://pagamento.paybluedrops.com/checkout/176654642:1',
      type: 'main'
    },
    {
      name: 'Upsell Accept (1BT)',
      url: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=yes',
      type: 'upsell'
    },
    {
      name: 'Downsell Accept (DWS1)',
      url: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=yes',
      type: 'downsell'
    }
  ];

  // Parâmetros importantes para verificar
  const importantParams = [
    'utm_source',
    'utm_medium', 
    'utm_campaign',
    'utm_term',
    'utm_content',
    'fbclid',
    'gclid',
    'cid',
    'affiliate_id',
    'sub_id',
    'ad_name',
    'ad_pid',
    'campaign_pid',
    'original_filename'
  ];

  useEffect(() => {
    loadCurrentParameters();
    runAllParameterTests();
  }, []);

  const loadCurrentParameters = () => {
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const current: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      current[key] = value;
    });
    setCurrentParams(current);

    // Get stored parameters
    const stored = getStoredTrackingParams();
    setStoredParams(stored);
  };

  const runAllParameterTests = async () => {
    setIsTestingAll(true);
    const tests: ParameterTest[] = [];

    // Test 1: Current URL Parameters
    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentCount = Array.from(currentUrlParams.keys()).length;
    
    if (currentCount > 0) {
      tests.push({
        name: 'Parâmetros URL Atual',
        status: 'success',
        message: `${currentCount} parâmetros detectados na URL`,
        details: Array.from(currentUrlParams.keys()).join(', '),
        value: currentCount.toString()
      });
    } else {
      tests.push({
        name: 'Parâmetros URL Atual',
        status: 'warning',
        message: 'Nenhum parâmetro na URL atual',
        details: 'Adicione ?utm_source=test&utm_campaign=admin_test para testar'
      });
    }

    // Test 2: SessionStorage Parameters
    const storedParams = getStoredTrackingParams();
    const storedCount = Object.keys(storedParams).length;
    
    if (storedCount > 0) {
      tests.push({
        name: 'Parâmetros Armazenados',
        status: 'success',
        message: `${storedCount} parâmetros no sessionStorage`,
        details: Object.keys(storedParams).join(', '),
        value: storedCount.toString()
      });
    } else {
      tests.push({
        name: 'Parâmetros Armazenados',
        status: 'warning',
        message: 'Nenhum parâmetro armazenado',
        details: 'Navegue com UTMs para armazenar parâmetros'
      });
    }

    // Test 3: buildUrlWithParams Function
    const testUrl = 'https://pagamento.paybluedrops.com/checkout/176849703:1';
    const builtUrl = buildUrlWithParams(testUrl);
    
    if (builtUrl !== testUrl) {
      const addedParams = builtUrl.split('?')[1] || '';
      const paramCount = addedParams.split('&').length;
      
      tests.push({
        name: 'Função buildUrlWithParams',
        status: 'success',
        message: `Função funcionando - ${paramCount} parâmetros adicionados`,
        details: `URL original vs URL com parâmetros`,
        value: paramCount.toString()
      });
    } else {
      tests.push({
        name: 'Função buildUrlWithParams',
        status: 'warning',
        message: 'Função não modificou URL',
        details: 'Pode ser porque não há parâmetros para adicionar'
      });
    }

    // Test 4: Important Parameters Check
    const allParams = getAllTrackingParams();
    const foundImportant = importantParams.filter(param => allParams[param]);
    
    if (foundImportant.length > 0) {
      tests.push({
        name: 'Parâmetros Importantes',
        status: 'success',
        message: `${foundImportant.length}/${importantParams.length} parâmetros importantes encontrados`,
        details: foundImportant.join(', '),
        value: foundImportant.length.toString()
      });
    } else {
      tests.push({
        name: 'Parâmetros Importantes',
        status: 'error',
        message: 'Nenhum parâmetro importante encontrado',
        details: 'UTMs, FBCLID, CID, etc. não detectados'
      });
    }

    // Test 5: UTM Content Format
    const utmContent = allParams.utm_content;
    if (utmContent && utmContent.includes('-')) {
      const parts = utmContent.split('-');
      if (parts.length >= 4) {
        tests.push({
          name: 'Formato UTM Content',
          status: 'success',
          message: 'Formato correto detectado',
          details: `${parts.length} partes: ${utmContent}`,
          value: utmContent
        });
      } else {
        tests.push({
          name: 'Formato UTM Content',
          status: 'warning',
          message: 'Formato incompleto',
          details: `Esperado: ad_name-ad_pid-campaign_pid-original_filename, Atual: ${utmContent}`
        });
      }
    } else {
      tests.push({
        name: 'Formato UTM Content',
        status: 'info',
        message: 'UTM Content não presente',
        details: 'Adicione utm_content com formato ad_name-ad_pid-campaign_pid-original_filename'
      });
    }

    // Test 6: CID Parameter
    const cid = allParams.cid;
    if (cid) {
      tests.push({
        name: 'RedTrack CID',
        status: 'success',
        message: 'CID detectado',
        details: `Valor: ${cid}`,
        value: cid
      });
    } else {
      tests.push({
        name: 'RedTrack CID',
        status: 'info',
        message: 'CID não presente',
        details: 'Adicione ?cid=test123 para testar RedTrack'
      });
    }

    setParameterTests(tests);
    setIsTestingAll(false);
  };

  const testUrlBuilding = (url: string, label: string) => {
    const builtUrl = buildUrlWithParams(url);
    setTestResults(prev => ({
      ...prev,
      [label]: builtUrl
    }));
    
    console.log(`🧪 Teste de URL Building para ${label}:`, {
      original: url,
      built: builtUrl,
      parametersAdded: builtUrl !== url
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('📋 Copiado para clipboard:', text);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Eye className="w-5 h-5 text-blue-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Teste de Passagem de Parâmetros UTM
            </h2>
            <p className="text-gray-600 mt-1">
              Verifique se todos os parâmetros estão sendo capturados e passados corretamente
            </p>
          </div>
          <button
            onClick={() => {
              loadCurrentParameters();
              runAllParameterTests();
            }}
            disabled={isTestingAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isTestingAll ? 'animate-spin' : ''}`} />
            Atualizar Testes
          </button>
        </div>

        {/* Current URL Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">📍 URL Atual:</h3>
          <div className="bg-white p-3 rounded border border-blue-200 font-mono text-sm break-all">
            {window.location.href}
          </div>
          
          {Object.keys(currentParams).length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-blue-800 mb-2">Parâmetros na URL:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(currentParams).map(([key, value]) => (
                  <div key={key} className="bg-white p-2 rounded border border-blue-100">
                    <span className="font-medium text-blue-700">{key}:</span>
                    <span className="text-blue-600 ml-1 break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stored Parameters Info */}
        {Object.keys(storedParams).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">💾 Parâmetros Armazenados (SessionStorage):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(storedParams).map(([key, value]) => (
                <div key={key} className="bg-white p-2 rounded border border-green-100">
                  <span className="font-medium text-green-700">{key}:</span>
                  <span className="text-green-600 ml-1 break-all">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parameter Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parameterTests.map((test, index) => (
          <div
            key={index}
            className={`border rounded-xl p-6 transition-all duration-300 ${getStatusColor(test.status)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{test.name}</h3>
                {test.details && (
                  <p className="text-sm text-gray-600">{test.details}</p>
                )}
              </div>
              {getStatusIcon(test.status)}
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800">{test.message}</p>
              {test.value && (
                <div className="mt-2 bg-white p-2 rounded border border-gray-200">
                  <code className="text-xs text-gray-700 break-all">{test.value}</code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* URL Building Tests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Teste de Construção de URLs
        </h3>
        <p className="text-gray-600 mb-4">
          Teste como as URLs ficam após aplicar buildUrlWithParams():
        </p>
        
        <div className="space-y-4">
          {testUrls.map((testUrl, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{testUrl.name}</h4>
                  <p className="text-sm text-gray-600">Tipo: {testUrl.type}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => testUrlBuilding(testUrl.url, testUrl.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Testar
                  </button>
                  {testResults[testUrl.name] && (
                    <button
                      onClick={() => copyToClipboard(testResults[testUrl.name])}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copiar
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">URL Original:</p>
                  <code className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-200 block break-all">
                    {testUrl.url}
                  </code>
                </div>
                
                {testResults[testUrl.name] && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">URL com Parâmetros:</p>
                    <code className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200 block break-all">
                      {testResults[testUrl.name]}
                    </code>
                    
                    {/* Show added parameters */}
                    {testResults[testUrl.name] !== testUrl.url && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-600 mb-1">Parâmetros Adicionados:</p>
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          {testResults[testUrl.name].split('?')[1]?.split('&').map((param, i) => (
                            <span key={i} className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                              {param}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test URLs for Different Scenarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 URLs de Teste para Diferentes Cenários</h3>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-700 mb-1">Teste Completo (Facebook Ads + RedTrack):</p>
            <code className="text-sm text-blue-600 break-all">
              {window.location.origin}/?utm_source=facebook&utm_medium=cpc&utm_campaign=test_campaign&utm_content=ad_test-123-456-video.mp4&fbclid=test123&cid=category_test
            </code>
            <button
              onClick={() => copyToClipboard(`${window.location.origin}/?utm_source=facebook&utm_medium=cpc&utm_campaign=test_campaign&utm_content=ad_test-123-456-video.mp4&fbclid=test123&cid=category_test`)}
              className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Copiar
            </button>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-green-700 mb-1">Teste Google Ads:</p>
            <code className="text-sm text-green-600 break-all">
              {window.location.origin}/?utm_source=google&utm_medium=cpc&utm_campaign=google_test&gclid=test456&affiliate_id=aff123
            </code>
            <button
              onClick={() => copyToClipboard(`${window.location.origin}/?utm_source=google&utm_medium=cpc&utm_campaign=google_test&gclid=test456&affiliate_id=aff123`)}
              className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
            >
              Copiar
            </button>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-purple-700 mb-1">Teste Afiliado Completo:</p>
            <code className="text-sm text-purple-600 break-all">
              {window.location.origin}/?utm_source=affiliate&utm_campaign=partner_test&affiliate_id=partner123&sub_id=sub456&click_id=click789
            </code>
            <button
              onClick={() => copyToClipboard(`${window.location.origin}/?utm_source=affiliate&utm_campaign=partner_test&affiliate_id=partner123&sub_id=sub456&click_id=click789`)}
              className="ml-2 bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm">
        <h3 className="text-white font-bold mb-3">🖥️ Console de Debug - Parâmetros:</h3>
        <div className="space-y-1">
          <p>📍 URL atual: {window.location.pathname}</p>
          <p>🔍 Parâmetros URL: {Object.keys(currentParams).length}</p>
          <p>💾 Parâmetros armazenados: {Object.keys(storedParams).length}</p>
          <p>🎯 UTM Content: {getAllTrackingParams().utm_content || 'não presente'}</p>
          <p>🔗 CID: {getAllTrackingParams().cid || 'não presente'}</p>
          <p>📊 FBCLID: {getAllTrackingParams().fbclid || 'não presente'}</p>
          <p>⚙️ Sistema: buildUrlWithParams() {Object.keys(getAllTrackingParams()).length > 0 ? 'ATIVO' : 'STANDBY'}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-white text-xs mb-2">🧪 Funções de Debug Disponíveis:</p>
          <p className="text-gray-400 text-xs">• window.debugParameterStatus()</p>
          <p className="text-gray-400 text-xs">• window.generateTestUrls()</p>
          <p className="text-gray-400 text-xs">• console.log(getAllTrackingParams())</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">📋 Como Testar:</h3>
        <div className="space-y-2 text-sm text-yellow-700">
          <p><strong>1. Teste com URL limpa:</strong> Acesse a página sem parâmetros e veja os resultados</p>
          <p><strong>2. Teste com UTMs:</strong> Use uma das URLs de teste acima</p>
          <p><strong>3. Teste navegação:</strong> Navegue entre páginas e veja se parâmetros persistem</p>
          <p><strong>4. Teste botões:</strong> Clique em "Testar" nas URLs e veja como ficam</p>
          <p><strong>5. Teste real:</strong> Use os botões de compra e verifique se UTMs passam</p>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ O que deve funcionar 100%:</h4>
          <div className="space-y-1 text-sm text-green-700">
            <p>• Todos os parâmetros UTM preservados entre páginas</p>
            <p>• CID (RedTrack) adicionado automaticamente</p>
            <p>• FBCLID e outros click IDs mantidos</p>
            <p>• Parâmetros de afiliado preservados</p>
            <p>• buildUrlWithParams() funciona em qualquer botão</p>
          </div>
        </div>
      </div>
    </div>
  );
};