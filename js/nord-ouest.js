(function(window) {
  function getHeaders() {
    const settings = window.EclipseStore.getSettings();
    const token = settings.nordOuestApiToken || settings.nordOuestApiKey || '';
    return {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
  }

  async function apiCall(method, endpoint, body = null) {
    const options = { method, headers: getHeaders() };
    if (body) options.body = JSON.stringify(body);
    
    try {
      const response = await fetch('/api/nord-ouest/' + endpoint, options);
      let data = null;
      try {
        data = await response.json();
      } catch(e) {}

      if (!response.ok) {
        let msg = '';
        if (data && data.errors && typeof data.errors === 'object') {
          const details = Object.entries(data.errors)
            .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' | ');
          msg = details || data.message || response.statusText;
        } else {
          msg = (data && (data.message || data.error || data.details)) || response.statusText || ('HTTP ' + response.status);
        }
        throw new Error(typeof msg === 'object' ? JSON.stringify(msg) : msg);
      }
      return data || {};
    } catch (error) {
      console.error('NOEST API Error:', error);
      throw error;
    }
  }

  const NordOuestAPI = {
    fetchWilayas: async function() {
      return await apiCall('GET', 'api/public/get/wilayas');
    },

    fetchCommunes: async function(wilayaId) {
      return await apiCall('GET', 'api/public/get/communes' + (wilayaId ? '/' + wilayaId : ''));
    },

    fetchDeliveryFees: async function() {
      return await apiCall('GET', 'api/public/fees');
    },

    createParcel: async function(order) {
      const settings = window.EclipseStore.getSettings();
      const userGuid = settings.nordOuestGuid || settings.nordOuestApiSecret || '';
      
      const productList = order.items.map(item => `${item.title} (${item.size}) x${item.quantity}`).join(', ');
      
      let ref = order.id || 'ECL-10001';
      if (ref.length < 5) ref = 'ECL-' + ref;

      const wilayaId = parseInt(order.customer.wilayaCode, 10) || 16;
      let phoneClean = (order.customer.phone || '').replace(/\D/g, '');
      if (phoneClean.startsWith('213')) phoneClean = '0' + phoneClean.slice(3);

      const parcelData = {
        user_guid: userGuid,
        reference: ref,
        client: `${order.customer.firstName || order.customer.name || ''} ${order.customer.lastName || ''}`.trim() || 'Client',
        phone: phoneClean || '0550000000',
        adresse: order.customer.address || 'Adresse de livraison',
        wilaya_id: wilayaId,
        commune: order.customer.commune || 'Commune',
        montant: Number(order.total) || 0,
        produit: productList || 'Streetwear',
        type_id: 1,
        stop_desk: order.customer.deliveryType === 'desk' ? 1 : 0,
        poids: 0.5,
        remarque: 'Commande Eclipse Store'
      };

      const res = await apiCall('POST', 'api/public/create/order', parcelData);
      
      if (res && res.success && res.tracking) {
        return { success: true, trackingNumber: res.tracking, response: res };
      } else if (res && res.tracking) {
        return { success: true, trackingNumber: res.tracking, response: res };
      } else {
        const errStr = typeof res === 'object' ? (res.message || res.error || JSON.stringify(res)) : res;
        throw new Error(errStr || 'Erreur lors de la création de la commande');
      }
    },

    getTrackingHistory: async function(tracking) {
      const settings = window.EclipseStore.getSettings();
      const userGuid = settings.nordOuestGuid || settings.nordOuestApiSecret || '';
      try {
        return await apiCall('POST', 'api/public/get/trackings/info', {
          user_guid: userGuid,
          trackings: [tracking]
        });
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
  };

  window.NordOuestAPI = NordOuestAPI;
})(window);
