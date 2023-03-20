(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCartGateway)
    {
        window.WaOnlineStoreCartGateway = OnlineStoreCartGateway;
    }

    function OnlineStoreCartGateway()
    {
        var self = this;

        self.addProduct = addProduct;
        self.loadCurrent = loadCurrent;
        self.recalculateCurrent = recalculateCurrent;

        function addProduct(model)
        {
            return WA.Ajax({
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(model),
                dataType: 'json',
                processData: false,
                type: 'POST',
                url: '/Sys/Store/Cart/Add'
            });
        }

        function loadCurrent()
        {
            return WA.Ajax({ dataType: 'json', type: 'GET', url: '/Sys/Store/Cart/Current' });
        }

        function transformCartModel(oldCartModel)
        {
            var newCart = jq$.extend(true, {}, oldCartModel);
            jq$.each(newCart.items, function(i, item) {
                delete item.price;
                delete item.title;
                delete item.total;
                delete item.pictureUrl;
            });
            delete newCart.total;
            return newCart;
        }

        function recalculateCurrent(model, deliveryOptionId)
        {
            var url = '/Sys/Store/Cart/RecalculateCart';

            if (deliveryOptionId)
            {
                url = url + '?deliveryOptionId=' + deliveryOptionId;
            }

            return WA.Ajax({
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(transformCartModel(model)),
                dataType: 'json',
                processData: false,
                type: 'POST',
                url: url
            });
        }
    }
})(window, window.WA);