// sw.js
// =====================================================
// Service Worker para Push Notification REAL
// Compatível com tela bloqueada / app fechado
// =====================================================

// Força atualização imediata do SW
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Assume o controle das abas abertas
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// =====================================================
// ✅ RECEBIMENTO DO PUSH (NÚCLEO DA SOLUÇÃO)
// =====================================================
self.addEventListener('push', event => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'Vivo Transporte';

  const options = {
    body: data.body || '',
    icon: 'favicon.png',
    badge: 'favicon.png',
    vibrate: [200, 100, 200],
    tag: 'alerta-fretado',
    renotify: true,
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// =====================================================
// ✅ CLICK NA NOTIFICAÇÃO
// =====================================================
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

// =====================================================
// (Opcional) Fecha notificação automaticamente
// =====================================================
self.addEventListener('notificationclose', event => {
  // Ponto de extensão futuro (logs, analytics, etc.)
});
