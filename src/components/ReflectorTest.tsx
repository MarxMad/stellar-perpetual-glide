import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { reflectorClient } from '@/lib/reflector-client';
import { perpetualContractClient } from '@/lib/perpetual-contract-client';

export const ReflectorTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    [key: string]: {
      success: boolean;
      data?: any;
      error?: string;
    };
  }>({});

  const testAssets = ['XLM', 'BTC', 'ETH', 'SOL', 'ADA'];

  const runTests = async () => {
    setIsLoading(true);
    setTestResults({});

    const results: typeof testResults = {};

    // Test 1: Verificar estado del contrato
    try {
      const contractInfo = await reflectorClient.getContractInfo();
      results.contract = {
        success: true,
        data: contractInfo,
      };
    } catch (error) {
      results.contract = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Test 2: Obtener precios individuales
    for (const asset of testAssets) {
      try {
        const priceData = await reflectorClient.getLastPrice(asset);
        results[`price_${asset}`] = {
          success: true,
          data: priceData,
        };
      } catch (error) {
        results[`price_${asset}`] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    // Test 3: Obtener múltiples precios
    try {
      const multiplePrices = await reflectorClient.getMultiplePrices(testAssets);
      results.multiple_prices = {
        success: true,
        data: multiplePrices,
      };
    } catch (error) {
      results.multiple_prices = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Test 4: Obtener TWAP
    try {
      const twapData = await reflectorClient.getTWAP('XLM', 5);
      results.twap = {
        success: true,
        data: twapData,
      };
    } catch (error) {
      results.twap = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Test 5: Probar nuestro contrato desplegado
    try {
      const contractInfo = await perpetualContractClient.getContractInfo();
      results.perpetual_contract = {
        success: true,
        data: contractInfo,
      };
    } catch (error) {
      results.perpetual_contract = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Test 6: Calcular funding rate
    try {
      const fundingRate = await perpetualContractClient.calculateFundingRate(0.1234, 0.1235);
      results.funding_rate = {
        success: true,
        data: { fundingRate },
      };
    } catch (error) {
      results.funding_rate = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBadge = (success: boolean) => {
    if (success) {
      return <Badge className="bg-green-100 text-green-800">Éxito</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Error</Badge>;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Prueba de Conexión con Reflector
        </h2>
        <p className="text-muted-foreground mt-2">
          Verifica que la integración con la API real de Reflector funcione correctamente
        </p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={runTests} 
          disabled={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Ejecutando Pruebas...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Ejecutar Pruebas
            </>
          )}
        </Button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <Card key={testName}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {testName.replace('_', ' ')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.success)}
                    {getStatusBadge(result.success)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.success ? (
                  <div className="space-y-2">
                    {testName === 'contract' && (
                      <div className="text-sm space-y-1">
                        <div><strong>Activo:</strong> {result.data.isActive ? 'Sí' : 'No'}</div>
                        <div><strong>Decimals:</strong> {result.data.decimals}</div>
                      </div>
                    )}
                    {testName.startsWith('price_') && (
                      <div className="text-sm space-y-1">
                        <div><strong>Precio:</strong> {formatPrice(result.data.price)}</div>
                        <div><strong>Timestamp:</strong> {new Date(result.data.timestamp).toLocaleString()}</div>
                        <div><strong>Decimals:</strong> {result.data.decimals}</div>
                      </div>
                    )}
                    {testName === 'multiple_prices' && (
                      <div className="text-sm space-y-1">
                        <div><strong>Activos:</strong> {Object.keys(result.data).join(', ')}</div>
                        <div><strong>Total:</strong> {Object.keys(result.data).length} precios</div>
                      </div>
                    )}
                    {testName === 'twap' && (
                      <div className="text-sm space-y-1">
                        <div><strong>TWAP:</strong> {formatPrice(result.data.price)}</div>
                        <div><strong>Período:</strong> {result.data.period} minutos</div>
                        <div><strong>Timestamp:</strong> {new Date(result.data.timestamp).toLocaleString()}</div>
                      </div>
                    )}
                    {testName === 'perpetual_contract' && (
                      <div className="text-sm space-y-1">
                        <div><strong>Contract ID:</strong> {result.data.contractId.substring(0, 20)}...</div>
                        <div><strong>Oracle:</strong> {result.data.oracleAddress.substring(0, 20)}...</div>
                        <div><strong>Versión:</strong> {result.data.version}</div>
                        <div><strong>Red:</strong> {result.data.network}</div>
                      </div>
                    )}
                    {testName === 'funding_rate' && (
                      <div className="text-sm space-y-1">
                        <div><strong>Funding Rate:</strong> {(result.data.fundingRate * 100).toFixed(4)}%</div>
                        <div><strong>Spot Price:</strong> $0.1234</div>
                        <div><strong>Futures Price:</strong> $0.1235</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <strong>Error:</strong> {result.error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Información sobre la API de Reflector */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la API de Reflector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Endpoint Base:</strong> https://api.reflector.network/v1/
            </p>
            <p>
              <strong>Precios:</strong> /price/{'{asset}'}
            </p>
            <p>
              <strong>TWAP:</strong> /twap/{'{asset}'}?period={'{minutes}'}
            </p>
            <p>
              <strong>Resolución:</strong> 5 minutos por defecto
            </p>
            <p>
              <strong>Formato:</strong> Los precios se devuelven como números enteros con decimales especificados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
