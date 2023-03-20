(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckoutLayoutStep3)
    {
        window.WaOnlineStoreCheckoutLayoutStep3 = OnlineStoreCheckoutLayoutStep3;
    }

    function OnlineStoreCheckoutLayoutStep3(service, initModel)
    {
      var SHIPPING = WaOnlineStoreCheckout.SHIPPING, PICKUP = WaOnlineStoreCheckout.PICKUP,
        DELIVERY_OPTION_TYPES = WaOnlineStoreCheckout.DELIVERY_OPTION_TYPES;

      var self = this, model, captchaVerify = false,
        mainContainer = document.getElementById('step-3-content'),
        captchaEnable = true,
        captchaWidgetId = undefined,
        deliveryEnable = initModel.deliveryEnable,
        recaptchaElementId = 'recaptchaContainer',
        $commentInput = jq$('#order_comments'),
        orderCreateFailedEventName = 'OrderCreateFailedEvent';
     

      self.render = render;
      self.confirmationRender = confirmationRender;
      self.onOrderCreateFailed = onOrderCreateFailed;
      self.showGeneralError = showGeneralError;
      
      init();

      function init()
      {
        var $payInvoiceButton = getPayInvoiceButton();
        var $payOnlineButton = getPayOnlineButton();
        var $freeOrderButton = getFreeOrderButton();

        $payInvoiceButton.on('click', function() { disablePayButtons(); payInvoice(captchaVerify); });
        $payOnlineButton.on('click', function() { disablePayButtons(); payOnline(captchaVerify); });
        $freeOrderButton.on('click', function() { disablePayButtons(); freeOrder(captchaVerify); });

        captchaInit();
      }

      function captchaInit()
      {
        if (captchaEnable)
        {
          var sitekey = getRecaptchaContainer().data('sitekey');
          captchaWidgetId = grecaptcha.render(recaptchaElementId, {
            sitekey: sitekey,
            callback: captchaSuccessCallback
          });
        }
      }

      function captchaSuccessCallback(responseToken)
      {
        captchaVerify = responseToken;
        enablePayButtons();
      }

      function getRecaptchaContainer()
      {
        return jq$('#' + recaptchaElementId);
      }

      function render()
      {                                        
	      getGeneralErrorNotification().hide();
        disablePayButtons();
        captchaReset();
        service.getConfirmModel().done(function(confirmModel) {
          model = confirmModel;
          confirmationRender(model);
          displayPayButtons(model);
        });
      }

      function getFreeOrderButton()
      {
        return jq$('#button_free_order');
      }

      function getPayInvoiceButton()
      {
        return jq$('#button_pay_invoice');
      }

      function getPayOnlineButton()
      {
        return jq$('#button_pay_online');
      }

      function getGeneralErrorNotification()
      {
        return jq$('#generalError');
      }

      function confirmationRender(model)
      {
        mainContainer.innerHTML = confirmationRenderTable(model);
      }

      function displayPayButtons(model)
      {
        if(model.cart && model.cart.total === 0)
        {
          getFreeOrderButton().show();
          getPayInvoiceButton().hide();
          getPayOnlineButton().hide();
        }
        else{
          getFreeOrderButton().hide();
          getPayInvoiceButton().show();
          getPayOnlineButton().show();
        }
      }

      function disablePayButtons()
      {
        getPayInvoiceButton().attr('disabled','disabled');
        getPayOnlineButton().attr('disabled','disabled');
        getFreeOrderButton().attr('disabled','disabled');
      }

      function enablePayButtons()
      {
        getPayInvoiceButton().removeAttr('disabled');
        getPayOnlineButton().removeAttr('disabled');
        getFreeOrderButton().removeAttr('disabled');
      }

      function captchaReset()
      {
        grecaptcha.reset(captchaWidgetId);
      }

      function captchaValidationFailureCallback()
      {
        showGeneralError();
        captchaReset();
      }

      function patchModel(model)
      {
        model.comments = $commentInput.val();
        return model;
      }

      function payInvoice(captchaToken)
      {
        return service.invoiceMe(patchModel(model), captchaToken).done(function(resp) {
          if (!resp.IsReCaptchaValid)
          {
            captchaValidationFailureCallback();
          }
        }).fail(function(data) {
          var err = getErrorData(data);
          if (err.errorType == 'NotEnoughStock') {
            jq$.event.trigger(orderCreateFailedEventName);
          }
          else{
            showGeneralError();
          }
        });
      }

      function payOnline(captchaToken)
      {
        return service.payOnline(patchModel(model), captchaToken).done(function(resp) {
          if (!resp.IsReCaptchaValid)
          {
            captchaValidationFailureCallback();
          }
        }).fail(function(data) {
          var err = getErrorData(data);
          if (err.errorType == 'NotEnoughStock') {
            jq$.event.trigger(orderCreateFailedEventName);
          }
          else{
            showGeneralError();
          }
        });
      }

      function freeOrder(captchaToken)
      {
        return service.freeOrder(patchModel(model), captchaToken).done(function(resp) {
          if (!resp.IsReCaptchaValid)
          {
            captchaValidationFailureCallback();
          }
        }).fail(function(data) {
          var err = getErrorData(data);
          if (err.errorType == 'NotEnoughStock') {
            jq$.event.trigger(orderCreateFailedEventName);
          }
          else{
            showGeneralError();
          }
        });
      }

      function getErrorData(data)
      {        
        try
        {
          return JSON.parse(data.responseText).data;
        }
        catch(e){
          return data.responseText;
        }
      }

      function showGeneralError()
      {
        getGeneralErrorNotification().show();
      }

      function confirmationRenderTable(model)
      {
        var html = [];

        html.push('<table class="storeCartTable">');
        html.push(confirmationRenderItems(model.cart.items));

        if (deliveryEnable && model.deliveryModel && model.deliveryModel.deliveryOptionId)
        {
          html.push(confirmationRenderDelivery(model.deliveryModel));
        }

        html.push(confirmationRenderTotal(model.cart));
        html.push('</table>');
        html.push(deliveryInformationRender(model));

        return html.join('');
      }

      function confirmationRenderItems(items)
      {
        var html = [], i, length = items.length;

        for (i = 0; i < length; i++) {
          html.push(confirmationRenderItem(items[i]));
        }

        return html.join('');
      }


      function renderImage(item)
      {
        var html = [];

        if (item.pictureUrl)
        {
          html.push('<img src="', item.pictureUrl, '" width="100"/>');
        } else
        {
          html.push('<div class="storeCartTable_img storeCartTable_no_img" title="No photo"></div>');
        }

        return html.join('');
      }

      function getItemUrl(productId)
      {
        return initModel.productDetailsUrl + '/' + productId;
      }

      function renderPrice(price)
      {
        var fixedPrice = price ? price.toFixed(2) : '0.0';

        if (initModel.currencySymbol) {
          return '<span class="priceContainer">' + initModel.currencySymbol + fixedPrice + '</span>';
        } else {
          return '<span class="priceContainer">' + fixedPrice + ' ' + initModel.currency + '</span>';
        }
      }

      function confirmationRenderItem(item)
      {
        var html = [];

        html.push('<tr class="storeCartTable_row">');
        html.push('<td class="storeCartTable_tdImage">', renderImage(item), '</td>');
        html.push('<td class="storeCartTable_tdTitle">');
        html.push('<div class="storeCartTable_itemTitle">', enc(item.title), '</div>');
        html.push(renderOptions(item));
        html.push('</td>');
        html.push('<td class="storeCartTable_tdPprice">', renderPrice(item.price), '</td>');
        html.push('<td class="storeCartTable_tdQuantity qtyLabel">', item.quantity, '</td>');
        html.push('<td class="storeCartTable_tdAmount">', renderPrice(item.total), '</td>');
        html.push('</tr>');

        return html.join('');
      }

      function confirmationRenderDelivery(deliveryModel)
      {
        var html = [];

        var deliveryOption = currentDeliveryOption(deliveryModel.deliveryOptionId, initModel.deliveryOptions);

        html.push('<tr class="storeCartTable_row">');
        html.push('<td class="storeCartTable_tdImage"></td>');
        html.push('<td class="storeCartTable_tdTitle">');
        html.push('<div class="storeCartTable_itemTitle">Delivery: ', enc(deliveryOption.title), '</div>');
        html.push('</td>');
        html.push('<td class="storeCartTable_tdPprice"></td>');
        html.push('<td class="storeCartTable_tdQuantity"></td>');
        html.push('<td class="storeCartTable_tdAmount">', renderPrice(deliveryOption.price), '</td>');
        html.push('</tr>');

        return html.join('');
      }

      function renderOption(option)
      {
        return '<div class="storeCartTable_itemOption">' + enc(option.title) + ': ' + enc(option.value) + '</div>';
      }

      function renderOptions(item)
      {
        if (!item.options)
        {
          return '';
        }

        return jq$.map(item.options, function(option, i) {
          return renderOption(option);
        }).join('');
      }

      function confirmationRenderTotal(cart)
      {
        var html = [];
        var total = cart.total;
        var subTotal = cart.subTotal;
        var isTaxesApplied = cart.isTaxesApplied || false;
        var isTaxesIncludedTotal = cart.isTaxesIncludedTotal || false;
        var taxes = cart.taxes || [];

        if (initModel.taxesEnable && isTaxesApplied && !isTaxesIncludedTotal)
        {
          html.push('<tr class="storeCartTotalInfoRowFirst">');
          html.push('<td colspan="4" class="storeCartTable_totalLabel">Subtotal:</td>');

          if (initModel.currencySymbol) {
            html.push('<td class="storeCartTable_totalValue">', initModel.currencySymbol, subTotal.toFixed(2), '</td>');
          } else {
            html.push('<td class="storeCartTable_totalValue">', subTotal.toFixed(2), ' ', initModel.currency, '</td>');
          }

          html.push('</tr>');

          html.push(renderTaxes(taxes, isTaxesIncludedTotal));
        }

        if (total || total === 0)
        {
          if (!isTaxesIncludedTotal)
          {
            html.push('<tr class="storeCartTotalInfoRow">');
          }
          else
          {
            html.push('<tr class="storeCartTotalInfoRowFirst">');
          }
          html.push('<td colspan="4" class="storeCartTable_totalLabel">Total:</td>');

          if (initModel.currencySymbol) {
            html.push('<td class="storeCartTable_totalValue">', initModel.currencySymbol, total.toFixed(2), '</td>');
          } else {
            html.push('<td class="storeCartTable_totalValue">', total.toFixed(2), ' ', initModel.currency, '</td>');
          }

          html.push('</tr>');
        }

        if (initModel.taxesEnable && isTaxesApplied && isTaxesIncludedTotal)
        {
          html.push(renderTaxes(taxes, isTaxesIncludedTotal));
        }

        return html.join('');
      }

      function renderTaxes(taxes, isTaxesIncludedTotal)
      {
        var html = [];

        for (var taxIndex in taxes)
        {
          var tax = taxes[taxIndex];
          var taxLabel = tax.title + ':';

          if (isTaxesIncludedTotal)
          {
            taxLabel = 'Incl.' + enc(tax.title) + ':';
          }

          html.push('<tr class="storeCartTotalInfoRow">');
          html.push('<td colspan="4" class="storeCartTable_totalLabel">', enc(taxLabel), '</td>');

          if (initModel.currencySymbol) {
            html.push('<td class="storeCartTable_totalValue">', initModel.currencySymbol, tax.amount.toFixed(2), '</td>');
          } else {
            html.push('<td class="storeCartTable_totalValue">', tax.amount.toFixed(2), ' ', initModel.currency, '</td>');
          }

          html.push('</tr>');
        }

        return html.join('');
      }


      function enc(val)
      {
        return BonaPage.encodeHtml(val);
      }

      function onOrderCreateFailed(actionFunc)
      {
        jq$(document).bind(orderCreateFailedEventName, actionFunc);
      }

      function currentDeliveryOption(deliveryOptionId, deliveryOptions)
      {
        deliveryOptions = deliveryOptions.filter(function(option) { return +option.id === +deliveryOptionId; })[0];
        return deliveryOptions || { title: null, optionId: null, type: null };
      }

      function deliveryInformationRender(model)
      {
        var shippingAddress, deliveryOption, withShipping = true,
          html = [], owner = (model.billingDetails || {});

        shippingAddress = model.deliveryModel.shippingAddress || model.shippingAddress;

        if (deliveryEnable)
        {
          deliveryOption = currentDeliveryOption(model.deliveryModel.deliveryOptionId, initModel.deliveryOptions);
          withShipping = DELIVERY_OPTION_TYPES[SHIPPING] === deliveryOption.type;
        }
        else
        {
          withShipping = !!shippingAddress;
        }


        html.push('<h2>Billing and shipping information</h2>');
        html.push('<p><strong>Billing details</strong><br />');
        html.push(enc(owner.FirstName), ' ', enc(owner.LastName), ' ', enc(owner.Email), '<br/>');

        if (owner.Phone)
        {
          html.push(enc(owner.Phone), '<br/>');
        }

        html.push('</p>');

        if (withShipping)
        {
          html.push('<p><strong>Shipping address</strong><br/>');

          if (shippingAddress.addressLine1)
          {
            html.push(enc(shippingAddress.addressLine1), ' ');
          }

          if (shippingAddress.addressLine2)
          {
            html.push(enc(shippingAddress.addressLine2), ' ');
          }

          if (shippingAddress.addressLine1 || shippingAddress.addressLine2)
          {
            html.push('<br/>');
          }

          var countryName = (shippingAddress.countryName !== '< Select >') ? enc(shippingAddress.countryName) : '';

          html.push(enc(shippingAddress.city), ' ', enc(shippingAddress.province), ' ', countryName, ' ', enc(shippingAddress.zip), '<br />');
          html.push('</p>');
        }

        html.push('<p>&nbsp;</p>');

        return html.join('');
      }
    }

})(window, window.WA);