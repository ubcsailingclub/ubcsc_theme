(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCartService)
    {
        window.WaOnlineStoreCartService = OnlineStoreCartService;
    }

    function OnlineStoreCartService()
    {
        var cache = {}, cacheKey = { cart: 'OnlineStoreCart' },
            defaultSaveDelay = 400, delayedSave, delayedSaveTimerId, gateway = new WaOnlineStoreCartGateway(),
            self = this;

        self.addProduct = addProduct;
        self.getProduct = getProduct;
        self.loadCurrent = loadCurrent;
        self.removeProduct = removeProduct;
        self.setQuantity = setQuantity;
        self.savingStart = null;
        self.savingCompleted = null;
        self.resetCart = resetCart;
        self.localLoad = localLoad;
        self.saveWithDelay = saveWithDelay;
        self.saveInCache = saveInCache;
        
        cache.get = function (key)
        {
            var serialized = WA.Storage.read(key);

            if (typeof serialized !== 'string') {
                return undefined;
            }

            try {
                return JSON.parse(serialized);
            } catch(e) {
                console.log(e);
                return serialized || undefined;
            }
        };
        cache.remove = function(key) { WA.Storage.del(key); };
        cache.set = function (key, value)
        {
            var serialized = JSON.stringify(value);

            try {
                WA.Storage.write(key, serialized);
            } catch(e) {
                console.log(e);
            }
        };

        function onSavingStart(cart)
        {
            if (typeof self.savingStart === "function") {
              self.savingStart(cart);
            }
        }

        function onSavingCompleted(cart)
        {
            if (typeof self.savingCompleted === "function") {
                self.savingCompleted(cart);
            }
        }

        function resetCart()
        {
          cache.remove(cacheKey.cart);
        }

        function addProduct(productId, variantId, quantity)
        {
            var cart = cache.get(cacheKey.cart), cartItems, i, productNotFound = true;
            variantId = variantId || undefined;

            quantity = validateQuantity(quantity, 1);

            if (cart) {
                cartItems = cart.items;

                for (i = 0, productNotFound = true; i < cartItems.length; i++) {
                    if (cartItems[i].productId === productId && cartItems[i].variantId == variantId) {
                        cartItems[i].quantity += quantity;
                        productNotFound = false;
                        break;
                    }
                }

                if (productNotFound) {
                    cartItems.push({ productId: productId, variantId: variantId, quantity: quantity });
                }

                return gateway.recalculateCurrent(cart).done(saveInCache);
            }

            return gateway
              .addProduct({ productId: productId, variantId: variantId, quantity: quantity })
              .done(saveInCache);
        }

        function getProduct(productId, variantId)
        {
            var cart = cache.get(cacheKey.cart), cartItems, i;
            variantId = variantId || undefined;

            if (cart) {
                cartItems = cart.items;

                for (i = 0; i < cartItems.length; i++) {
                    if (cartItems[i].productId === productId && cartItems[i].variantId == variantId) {
                        return cartItems[i];
                    }
                }
            }

            return null;
        }

        function localLoad()
        {
            var cart = cache.get(cacheKey.cart);
            return cart;
        }

        function loadCurrent(deliveryOptionId)
        {
            var cart = cache.get(cacheKey.cart);

            if (cart) {
                return gateway.recalculateCurrent(cart, deliveryOptionId).done(saveInCache);
            }

            return gateway.loadCurrent().done(saveInCache);
        }

        function removeProduct(productId, variantId)
        {
            var cart = cache.get(cacheKey.cart), cartItems, i;
            variantId = variantId || undefined;

            cartItems = cart.items;

            for (i = cartItems.length - 1; i >=0; i--) {
                if (cartItems[i].productId === productId && cartItems[i].variantId == variantId) {
                    cartItems.splice(i, 1);
                    break;
                }
            }

            return saveWithDelay(cart);
        }

        function setQuantity(productId, variantId, quantity)
        {
            var cart = cache.get(cacheKey.cart), cartItems, i;
            variantId = variantId || undefined;

            cartItems = cart.items;
            quantity = validateQuantity(quantity, 0);

            for (i = 0; i < cartItems.length; i++) {
                if (cartItems[i].productId === productId && cartItems[i].variantId == variantId) {
                    cartItems[i].quantity = quantity;
                    break;
                }
            }

            return saveWithDelay(cart);
        }

        function save(cart)
        {
            return gateway.recalculateCurrent(cart);
        }

        function saveInCache(cart)
        {
            onSavingCompleted(cart);
            cache.set(cacheKey.cart, cart);
        }

        function saveWithDelay(cart, delay)
        {
            var deferred;

            if (delayedSave && delayedSave.state() === 'pending') {
                deferred = jq$.Deferred();
            } else {
                deferred = delayedSave = jq$.Deferred().done(saveInCache);
            }

            clearTimeout(delayedSaveTimerId);
            delayedSaveTimerId = setTimeout(
                function () {
                    onSavingStart(cart);
                    save(cart)
                      .done(function(cart) {
                          delayedSave.resolve(cart);
                      })
                      .fail(function(error) {
                          delayedSave.reject(cache.get(cacheKey.cart), error);
                      });
                }, delay || defaultSaveDelay);

            return deferred;
        }

        function validateQuantity(quantity, quantityMinimum)
        {
            quantity = +quantity;

            return quantity < quantityMinimum || isNaN(quantity) ? quantityMinimum : quantity;
        }
    }
})(window, window.WA);
