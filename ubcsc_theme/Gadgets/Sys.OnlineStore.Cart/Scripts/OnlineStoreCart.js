(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCart)
    {
        window.WaOnlineStoreCart = OnlineStoreCart;
    }

    function OnlineStoreCart()
    {
        var service = new WaOnlineStoreCartService(),
            self = this;

        self.add = add;
        self.get = get;
        self.load = load;
        self.remove = remove;
        self.setQuantity = setQuantity;
        self.getService = getService;

        function add(productId, variantId, quantity)
        {
            return service.addProduct(productId, variantId, quantity);
        }

        function getService()
        {
            return service;
        }

        function get(productId, variantId)
        {
            return service.getProduct(productId, variantId);
        }

        function load()
        {
            return service.loadCurrent();
        }

        function remove(productId, variantId)
        {
            return service.removeProduct(productId, variantId);
        }

        function setQuantity(productId, variantId, quantity)
        {
            return service.setQuantity(productId, variantId, quantity);
        }
    }
    
    var instance;

    OnlineStoreCart.getInstance = function()
    {
        return instance || (instance = new OnlineStoreCart());
    };
    OnlineStoreCart.load = function(initModel) {
        var cart = this.getInstance(initModel);
        return cart.load();
    };
})(window, window.WA);
