(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckoutService)
    {
        window.WaOnlineStoreCheckoutService = OnlineStoreCheckoutService;
    }

    function OnlineStoreCheckoutService(serviceCart)
    {
        var cache = {}, cacheKey = {
            billingDetails: 'billingDetails',
            deliveryModel: 'deliveryModel',
            rulesAndTerms: 'rulesAndTerms'
          },
          gateway = new WaOnlineStoreCheckoutGateway(),
          self = this;

        var defaultShippingAddressModel = {
          addressLine1: null,
          addressLine2: null,
          city: null,
          countryId: null,
          province: null,
          zip: null
        };

        var defaultDeliveryModel = {
          shippingAddressModel: defaultShippingAddressModel,
          deliveryOptionId: null
        };

        self.invoiceMe = invoiceMe;
        self.payOnline = payOnline;
        self.freeOrder = freeOrder;
        self.checkEmail = checkEmail;
        self.saveContactModel = saveContactModel;
        self.getContactModel = getContactModel;
        self.getShippingAddressModel = getShippingAddressModel;
        self.getDeliveryModel = getDeliveryModel;
        self.saveDeliveryModel = saveDeliveryModel;
        self.getConfirmModel = getConfirmModel;

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

        function getShippingAddressModel()
        {
            var model = cache.get(cacheKey.deliveryModel);

            if (model)
            {
              return jq$.Deferred().resolve(model.shippingAddress || defaultShippingAddressModel);
            }
            else
            {
              return defaultShippingAddressModel;
            }
        }

        function getDeliveryModel()
        {
          var model = cache.get(cacheKey.deliveryModel);
          return jq$.Deferred().resolve(model || defaultDeliveryModel);
        }

        function saveDeliveryModel(model)
        {
            cache.set(cacheKey.deliveryModel, model);
            return jq$.Deferred().resolve(model);
        }

        function resetAllData()
        {
          serviceCart.resetCart();
          cache.remove(cacheKey.deliveryModel);
          cache.remove(cacheKey.billingDetails);
        }

        function invoiceMe(checkoutModel, captchaToken)
        {
           var data = {
             CheckoutModel: checkoutModel,
             Captcha: captchaToken
           };
           return gateway.invoiceMe(data).fail(payFailed).done(paySuccess);
        }

        function payOnline(checkoutModel, captchaToken)
        {
            var data = {
              CheckoutModel: checkoutModel,
              Captcha: captchaToken
            };
            return gateway.payOnline(data).fail(payFailed).done(paySuccess);
        }

        function freeOrder(checkoutModel, captchaToken)
        {
            var data = {
              CheckoutModel: checkoutModel,
              Captcha: captchaToken
            };
            return gateway.freeOrder(data).fail(payFailed).done(paySuccess);
        }

        function paySuccess(data)
        {
          if (data.IsReCaptchaValid && data.RedirectUrl)
          {
              resetAllData();
              window.location = data.RedirectUrl;
          }
        }

        function payFailed(data, textStatus)
        {
          console.log('Failed!', data, textStatus);
        }

        function checkEmail(model)
        {
            return gateway.checkEmail(model);
        }

        function getContactModel()
        {
          var model = cache.get(cacheKey.billingDetails);
          return jq$.Deferred().resolve(model || {});
        }

        function saveContactModel(model)
        {
            var contactModel = cache.get(cacheKey.billingDetails);
            var billingDetails = jq$.extend(contactModel, model);
            cache.set(cacheKey.billingDetails, billingDetails);

            return jq$.Deferred().resolve(billingDetails);
        }

        function getConfirmModel()
        {
            var def = jq$.Deferred();

            getContactModel().done(function(billingDetails) {
              getDeliveryModel().done(function(deliveryModel) {
                serviceCart.loadCurrent(deliveryModel.deliveryOptionId).done(function(cart) {
                  def.resolve({
                    billingDetails: billingDetails,
                    deliveryModel: deliveryModel,
                    cart: cart
                  });
                });
              });
            });

            return def;
        }
    }
})(window, window.WA);
