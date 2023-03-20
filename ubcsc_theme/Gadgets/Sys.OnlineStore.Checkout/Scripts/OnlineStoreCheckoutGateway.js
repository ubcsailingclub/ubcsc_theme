(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckoutGateway)
    {
        window.WaOnlineStoreCheckoutGateway = OnlineStoreCheckoutGateway;
    }

    function OnlineStoreCheckoutGateway()
    {
        var self = this;

        self.invoiceMe = invoiceMe;
        self.payOnline = payOnline;
        self.freeOrder = freeOrder;
        self.checkEmail = checkEmail;

        function payRequest(url, model)
        {
            return WA.Ajax({
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(model),
                dataType: 'json',
                processData: false,
                type: 'POST',
                url: url
            });
	      }

        function invoiceMe(model)
        {
            return payRequest('/Sys/Store/Checkout/InvoiceMe', model)
        }

        function payOnline(model)
        {
            return payRequest('/Sys/Store/Checkout/PayOnline', model);
        }

        function freeOrder(model)
        {
            return payRequest('/Sys/Store/Checkout/FreeOrder', model);
        }

        function checkEmail(model)
        {
          return WA.Ajax({
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(model),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: '/Sys/Store/Checkout/CheckEmail' //<$Model.CheckoutCheckEmail$>
          });
        }
    }
})(window, window.WA);