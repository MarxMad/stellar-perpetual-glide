import { NextApiRequest, NextApiResponse } from 'next';
import { webhookHandler, ReflectorWebhookPayload } from '@/lib/webhook-handler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📡 Webhook recibido:', req.body);
    
    // Verificar que es un webhook de Reflector
    const payload = req.body as ReflectorWebhookPayload;
    
    if (!payload.update || !payload.update.event) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // TODO: Agregar validación de firma para seguridad en producción
    // const signature = req.headers['x-reflector-signature'];
    // if (!validateSignature(payload, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // Procesar el webhook
    await webhookHandler.handleReflectorWebhook(payload);

    // Responder con éxito
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Configurar para que Next.js no parse el body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
