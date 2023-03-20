(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckout)
    {
        window.WaOnlineStoreCheckout = OnlineStoreCheckout;
    }

    var SHIPPING = 'SHIPPING', PICKUP = 'PICKUP';
    var DELIVERY_OPTION_TYPES = {};
    DELIVERY_OPTION_TYPES[SHIPPING] = SHIPPING;
    DELIVERY_OPTION_TYPES[PICKUP] = PICKUP;

    window.WaOnlineStoreCheckout.SHIPPING = SHIPPING;
    window.WaOnlineStoreCheckout.PICKUP = PICKUP;
    window.WaOnlineStoreCheckout.DELIVERY_OPTION_TYPES = DELIVERY_OPTION_TYPES;

    function OnlineStoreCheckout()
    {
        var serviceCart = WaOnlineStoreCart.getInstance().getService(),
            serviceCheckout = new WaOnlineStoreCheckoutService(serviceCart),
            self = this;

        self.getService = getService;

        function getService()
        {
          return serviceCheckout;
        }
    }
    
    var instance;

    OnlineStoreCheckout.getInstance = function()
    {
        return instance || (instance = new OnlineStoreCheckout());
    };
    OnlineStoreCheckout.load = function() {
      return WaOnlineStoreCart.getInstance().load();
    };
})(window, window.WA);
