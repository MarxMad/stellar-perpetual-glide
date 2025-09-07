// Webhook handler para Reflector Network
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📡 Webhook recibido:', req.body);
    
    // Verificar que es un webhook de Reflector
    const payload = req.body;
    
    if (!payload.update || !payload.update.event) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // TODO: Agregar validación de firma para seguridad en producción
    // const signature = req.headers['x-reflector-signature'];
    // if (!validateSignature(payload, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // Procesar el webhook (simplificado para Vercel)
    console.log('💰 Procesando webhook de Reflector:', {
      asset: `${payload.update.event.base.asset}/${payload.update.event.quote.asset}`,
      price: payload.update.event.price,
      timestamp: payload.update.event.timestamp
    });

    // Responder con éxito
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      timestamp: Date.now(),
      data: {
        asset: `${payload.update.event.base.asset}/${payload.update.event.quote.asset}`,
        price: payload.update.event.price,
        timestamp: payload.update.event.timestamp
      }
    });

  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error'
    });
  }
}