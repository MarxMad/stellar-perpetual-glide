# Integración con Wallets de Stellar

## Para el Hackathon

Los contratos están desplegados en testnet y listos para integración con wallets reales. Aquí está la guía para completar la integración:

### Contratos Desplegados

- **Price Oracle Contract**: `CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD`
- **Perpetual Trading Contract**: `CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2`
- **Red**: Testnet
- **RPC**: `https://soroban-testnet.stellar.org:443`

### Integración con Freighter

```typescript
import { 
  Contract, 
  Soroban, 
  Address, 
  xdr,
  TransactionBuilder,
  Operation,
  Keypair,
  Networks,
  BASE_FEE
} from '@stellar/stellar-sdk';

// Crear cliente del contrato
const contract = new Contract('CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2');
const rpc = new Soroban.Server('https://soroban-testnet.stellar.org:443');

// Depositar XLM
async function depositXlm(amount: number) {
  const operation = contract.call(
    'deposit_xlm',
    xdr.ScVal.scvAddress(trader.toScAddress()),
    xdr.ScVal.scvI128(xdr.Int128.fromString((amount * 10_000_000).toString()))
  );

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: 'Test SDF Network ; September 2015',
  })
  .addOperation(operation)
  .setTimeout(30)
  .build();

  // Firmar con Freighter
  const signedTransaction = await window.freighter.signTransaction(transaction.toXDR());
  
  // Enviar transacción
  const result = await rpc.sendTransaction(signedTransaction);
  return result.successful;
}
```

### Integración con Albedo

```typescript
import { albedo } from '@albedo-link/intent';

// Depositar XLM con Albedo
async function depositXlmWithAlbedo(amount: number) {
  const operation = contract.call(
    'deposit_xlm',
    xdr.ScVal.scvAddress(trader.toScAddress()),
    xdr.ScVal.scvI128(xdr.Int128.fromString((amount * 10_000_000).toString()))
  );

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: 'Test SDF Network ; September 2015',
  })
  .addOperation(operation)
  .setTimeout(30)
  .build();

  // Firmar con Albedo
  const signedTransaction = await albedo.tx({
    xdr: transaction.toXDR(),
    network: 'testnet'
  });
  
  // Enviar transacción
  const result = await rpc.sendTransaction(signedTransaction);
  return result.successful;
}
```

### Funciones del Contrato

#### Perpetual Trading Contract

1. **deposit_xlm(trader: Address, amount: i128)**
   - Deposita XLM para margin
   - Requiere firma de wallet

2. **open_position(trader: Address, asset: Symbol, margin: i128, leverage: u32, is_long: bool)**
   - Abre una nueva posición
   - Requiere firma de wallet

3. **close_position(trader: Address, position_id: u64)**
   - Cierra una posición existente
   - Requiere firma de wallet

4. **withdraw_xlm(trader: Address, amount: i128)**
   - Retira XLM del contrato
   - Requiere firma de wallet

5. **get_trader_balance(trader: Address) -> i128**
   - Obtiene el balance del trader
   - Solo lectura

6. **get_current_position(trader: Address) -> PositionData**
   - Obtiene la posición actual del trader
   - Solo lectura

#### Price Oracle Contract

1. **get_xlm_price() -> i128**
   - Obtiene el precio actual de XLM
   - Solo lectura

2. **get_btc_price() -> i128**
   - Obtiene el precio actual de BTC
   - Solo lectura

3. **get_eth_price() -> i128**
   - Obtiene el precio actual de ETH
   - Solo lectura

### Testing

```bash
# Verificar contratos en Stellar Expert
https://testnet.stellar.expert/contract/CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD
https://testnet.stellar.expert/contract/CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2

# Probar con Stellar CLI
stellar contract invoke --id CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2 --source-account YOUR_ACCOUNT --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015" get_config
```

### Próximos Pasos

1. **Integrar Freighter/Albedo** en el frontend
2. **Implementar firmas de transacciones** reales
3. **Probar todas las funciones** del contrato
4. **Desplegar a mainnet** cuando esté listo
5. **Integrar con Reflector Oracle** para precios reales

### Recursos

- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://freighter.app/)
- [Albedo Wallet](https://albedo.link/)
- [Stellar Testnet](https://testnet.stellar.org/)
- [Stellar Expert](https://stellar.expert/)
