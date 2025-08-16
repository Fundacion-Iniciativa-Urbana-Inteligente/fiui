const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// 1) Para webhooks necesitamos el raw body:
app.use('/webhooks/goodstack', bodyParser.raw({ type: '*/*' }));

// 2) Resto JSON:
app.use(bodyParser.json());

const API_BASE = process.env.GOODSTACK_API_BASE || 'https://api.goodstack.io/v1';
const SECRET_KEY = process.env.GOODSTACK_SECRET_KEY;
const PUB_KEY = process.env.GOODSTACK_PUBLISHABLE_KEY;
const WEBHOOK_SECRET = process.env.GOODSTACK_WEBHOOK_SECRET;

// --------- FRONT-FACING ENDPOINTS ---------

// (A) Buscar ONGs (seguro desde el front con Publishable Key, pero aquí te muestro un proxy simple con rate-limit si querés)
app.get('/api/orgs/search', async (req, res) => {
  try {
    const { q, countryCode, pageSize = 10 } = req.query;
    const r = await axios.get(`${API_BASE}/organisations`, {
      params: { query: q, countryCode, pageSize },
      headers: { Authorization: `Bearer ${PUB_KEY}` }
    });
    res.json(r.data);
  } catch (e) {
    res.status(e?.response?.status || 500).json(e?.response?.data || { error: 'search_failed' });
  }
});

// (B) Crear donación (API-only flow)
app.post('/api/donations', async (req, res) => {
  try {
    const { organisationId, amountMinor, currencyCode, userId, donor } = req.body;
    // amountMinor: entero en la unidad mínima (p. ej. 100 = 1.00)
    const idempotencyKey = crypto.randomUUID();

    const body = {
      amount: amountMinor,
      currencyCode,
      organisationId,
      ...(userId ? { userId } : {}),
      ...(donor ? {
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
        anonymous: donor.anonymous ? 'yes' : 'no',
        consentedToBeContactedByOrg: donor.optIn ? 'yes' : 'no',
        metadata: donor.metadata || {}
      } : {})
    };

    const r = await axios.post(`${API_BASE}/donations`, body, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Idempotency-Key': idempotencyKey,
        'Content-Type': 'application/json'
      }
    });
    res.json(r.data);
  } catch (e) {
    res.status(e?.response?.status || 500).json(e?.response?.data || { error: 'donation_create_failed' });
  }
});

// (C) Hosted Donation Gateway: generar "Donation Session" si querés que Goodstack maneje el checkout/UX
app.post('/api/donation-sessions', async (req, res) => {
  try {
    const { organisationId, amountMinor, currencyCode, successUrl, cancelUrl } = req.body;
    const idempotencyKey = crypto.randomUUID();

    const r = await axios.post(`${API_BASE}/donation-sessions`, {
      organisationId,
      amount: amountMinor,
      currencyCode,
      successUrl,
      cancelUrl
    }, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Idempotency-Key': idempotencyKey,
        'Content-Type': 'application/json'
      }
    });

    // El response normalmente trae una URL hosted para redirigir al usuario
    res.json(r.data);
  } catch (e) {
    res.status(e?.response?.status || 500).json(e?.response?.data || { error: 'session_failed' });
  }
});

// --------- WEBHOOKS ---------

// Firma del webhook: ejemplo genérico HMAC (ajusta si Goodstack prescribe otro header)
function verifySignature(rawBody, headerSignature, secret) {
  // Algunos proveedores usan sha256=...; Goodstack entrega un `secret` al crear el webhook.
  const h = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  // Compara constantes
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(headerSignature || '', 'utf8'));
}

app.post('/webhooks/goodstack', (req, res) => {
  try {
    const sig = req.header('X-Goodstack-Signature'); // nombre ilustrativo; confirma el nombre exacto en tu panel
    const raw = req.body; // raw buffer

    if (WEBHOOK_SECRET && !verifySignature(raw, sig, WEBHOOK_SECRET)) {
      return res.status(400).send('invalid signature');
    }

    const event = JSON.parse(raw.toString('utf8'));
    // event.type puede ser p.ej. "donation.payment_successful"
    // event.data tiene el objeto relacionado
    switch (event.type) {
      case 'donation.created':
        // marca "pendiente de pago" en tu DB
        break;
      case 'donation.payment_successful':
      case 'donation.hosted.payment_received':
        // acredita, dispara email/whatsapp, emite token $JINETEar si corresponde
        break;
      case 'donation.disbursed':
        // registra que fue remitido a la ONG destino
        break;
      case 'donation.cancelled':
        // revierte estado local
        break;
      default:
        // otros eventos: ver lista oficial
        break;
    }
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send('bad payload');
  }
});

app.listen(3000, () => console.log('Goodstack server up on :3000'));
