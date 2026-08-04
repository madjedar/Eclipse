(function(window) {
  function getHeaders() {
    const settings = window.EclipseStore.getSettings();
    return {
      'X-API-ID': settings.yalidineApiId,
      'X-API-TOKEN': settings.yalidineApiToken,
      'Content-Type': 'application/json'
    };
  }

  async function apiCall(method, endpoint, body = null) {
    const options = { method, headers: getHeaders() };
    if (body) options.body = JSON.stringify(body);
    
    try {
      const response = await fetch('/api/yalidine/' + endpoint, options);
      if (!response.ok) throw new Error('API Error: ' + response.statusText);
      return await response.json();
    } catch (error) {
      console.error('Yalidine API Error:', error);
      throw error;
    }
  }

  const YalidineAPI = {
    fetchWilayas: async function() {
      return await apiCall('GET', 'wilayas/');
    },

    fetchCommunes: async function(wilayaId) {
      return await apiCall('GET', `communes/?wilaya_id=${wilayaId}`);
    },

    fetchCenters: async function(wilayaId) {
      return await apiCall('GET', `centers/?wilaya_id=${wilayaId}`);
    },

    fetchDeliveryFees: async function() {
      return await apiCall('GET', 'deliveryfees/');
    },

    createParcel: async function(order) {
      const productList = order.items.map(item => `${item.title} (${item.size}) x${item.quantity}`).join(', ');
      
      const parcelData = {
        order_id: order.id,
        firstname: order.customer.firstName,
        familyname: order.customer.lastName,
        contact_phone: order.customer.phone,
        address: order.customer.address,
        to_wilaya_name: order.customer.wilaya,
        to_commune_name: order.customer.commune,
        product_list: productList,
        price: order.total,
        freeshipping: false,
        is_stopdesk: order.customer.deliveryType === 'stopdesk',
        stopdesk_id: null,
        declared_value: order.total,
        weight: 0.5,
        has_exchange: false
      };

      return await apiCall('POST', 'parrels/', [parcelData]);
    },

    getParcelStatus: async function(tracking) {
      return await apiCall('GET', `parcels/?tracking=${tracking}`);
    },

    getTrackingHistory: async function(tracking) {
      return await apiCall('GET', `histories/?tracking=${tracking}`);
    },

    testConnection: async function() {
      try {
        await this.fetchWilayas();
        return { success: true, message: 'Connection successful' };
      } catch (error) {
        return { success: false, message: error.message || 'Connection failed' };
      }
    }
  };

  window.YalidineAPI = YalidineAPI;
})(window);
