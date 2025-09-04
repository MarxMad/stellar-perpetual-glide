#!/usr/bin/env node

// Script para verificar qué activos tienen datos en Reflector Testnet
const { execSync } = require('child_process');

const REFLECTOR_CONTRACT = 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP';

// Lista de activos conocidos en Stellar Testnet
const knownAssets = [
  { symbol: 'XLM', address: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA' }, // De la documentación
  { symbol: 'USDC', address: 'CDJF2JQINO7WRFXB2AAHLONFDPPI4M3W2UM5THGQQ7JMJDIEJYC4CMPG' }, // Que sabemos que tiene datos
  { symbol: 'BTC', address: 'CABWYQLGOQ5Y3RIYUVYJZVA355YVX4SPAMN6ORDAVJZQBPPHLHRRLNMS' }, // Que sabemos que tiene datos
  { symbol: 'ETH', address: 'CCTQVWJYOKUJJSTTKJ4CHJKTOR7PH6TZAABJU56UXXEETLA2Q5HBGFVU' },
  { symbol: 'SOL', address: 'CA4DYJSRG7HPVTPJZAIPNUC3UJCQEZ456GPLYVYR2IATCBAPTQV6UUKZ' },
  { symbol: 'ADA', address: 'CBARCMJYRRNSYCWCR3EU2PEHAHWHBCQSMIKQIUSDWR3BK7CBCP622Q2R' },
  { symbol: 'UNKNOWN1', address: 'CAWH4XMRQL7AJZCXEJVRHHMT6Y7ZPFCQCSKLIFJL3AVIQNC5TSVWKQOR' },
  { symbol: 'UNKNOWN2', address: 'CCBINL4TCQVEQN2Q2GO66RS4CWUARIECZEJA7JVYQO3GVF4LG6HJN236' },
  { symbol: 'UNKNOWN3', address: 'CAOTLCI7DROK3PI4ANOFPHPMBCFWVHURJM2EKQSO725SYCWBWE5U22OG' },
];

async function checkAsset(symbol, address) {
  try {
    const command = `stellar contract invoke --id ${REFLECTOR_CONTRACT} --source-account alice --network testnet -- lastprice --asset '{"Stellar":"${address}"}'`;
    const result = execSync(command, { encoding: 'utf8', timeout: 10000 });
    
    if (result.includes('null')) {
      return { symbol, address, hasData: false, price: null };
    } else {
      // Extraer el precio del resultado
      const priceMatch = result.match(/"price":"(\d+)"/);
      const timestampMatch = result.match(/"timestamp":(\d+)/);
      
      return {
        symbol,
        address,
        hasData: true,
        price: priceMatch ? priceMatch[1] : 'unknown',
        timestamp: timestampMatch ? timestampMatch[1] : 'unknown'
      };
    }
  } catch (error) {
    return { symbol, address, hasData: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Verificando activos en Reflector Testnet...\n');
  
  const results = [];
  
  for (const asset of knownAssets) {
    console.log(`Verificando ${asset.symbol}...`);
    const result = await checkAsset(asset.symbol, asset.address);
    results.push(result);
    
    if (result.hasData) {
      console.log(`✅ ${asset.symbol}: Tiene datos - Precio: ${result.price}, Timestamp: ${result.timestamp}`);
    } else {
      console.log(`❌ ${asset.symbol}: Sin datos`);
    }
  }
  
  console.log('\n📊 RESUMEN:');
  console.log('===========');
  
  const assetsWithData = results.filter(r => r.hasData);
  const assetsWithoutData = results.filter(r => !r.hasData);
  
  console.log(`\n✅ Activos CON datos (${assetsWithData.length}):`);
  assetsWithData.forEach(asset => {
    console.log(`  - ${asset.symbol}: ${asset.address}`);
  });
  
  console.log(`\n❌ Activos SIN datos (${assetsWithoutData.length}):`);
  assetsWithoutData.forEach(asset => {
    console.log(`  - ${asset.symbol}: ${asset.address}`);
  });
  
  console.log('\n🎯 Activos disponibles para usar en la aplicación:');
  assetsWithData.forEach(asset => {
    console.log(`  '${asset.symbol}': '${asset.address}',`);
  });
}

main().catch(console.error);
