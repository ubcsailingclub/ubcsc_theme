(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCartLayout)
    {
        window.WaOnlineStoreCartLayout = OnlineStoreCartLayout;
    }

    function OnlineStoreCartLayout(service, initModel)
    {
        var container = document.getElementById('cartLayout'), self = this;
        var productDetailsUrl = '/Sys/ProductDetails', currencySymbol = '$', currency = 'USD';

        self.render = render;
        self.onError = onError;

        var isSaveFailed = null;
        var isDisabled = null;
        var checkoutURL = '/Sys/Store/Checkout';

        init();
        resetViewStates();

        function init()
        {
            jq$(container).on('input', '.storeCartTable_tdQuantity input', onProductQuantityInput);
            jq$(container).on('click', '.storeCartTable_deleteButton', onProductDelete);
            jq$(container).on('click', '.quantitySnippet .quantity-button', onProductQuantityUpDown);
            jq$(container).on('click', '.storeCartControlNav__back', onBackToShopping);
            jq$(container).on('click', '.toCheckout', onCheckout);

            service.savingStart = onSavingStart;
        }

        function onBackToShopping()
        {
            window.history.go(-1);
            return false;
        }

        function onCheckout()
        {
            window.location.href = checkoutURL;
        }

        function resetViewStates()
        {
          isSaveFailed = false;
          isDisabled = false;
        }

        function render(model)
        {
            container.innerHTML = model.items && model.items.length > 0 ? renderTable(model) : renderEmpty();
        }

        function renderEmpty()
        {
            var html = [];

            if (isSaveFailed)
            {
              html.push(renderGeneralError());
            }

            html.push('<div class="emptyCartContainer">');
            html.push('<div class="emptyCartIcon2"></div>');
            html.push('<p class="emptyCartMessage">Your cart is empty.</p>');
            html.push('</div>');

            return html.join('');
        }

        function renderTable(model)
        {
            var html = [];

            if (isSaveFailed)
            {
              html.push(renderGeneralError());
            }

            html.push('<table class="storeCartTable">');
            html.push(renderItems(model.items));
            html.push(renderTotal(model));
            html.push('</table>');
            html.push(renderControlNav());

            return html.join('');
        }

        function renderItems(items)
        {
            var html = [], i, length = items.length;

            for (i = 0; i < length; i++) {
                html.push(renderItem(items[i]));
            }

            return html.join('');
        }

        function renderItem(item)
        {
            var html = [];

            html.push('<tr class="storeCartTable_row" data-product-id="', item.productId, '" data-variant-id="', item.variantId, '">');
            html.push('<td class="storeCartTable_tdImage">', renderImage(item), '</td>');
            html.push('<td class="storeCartTable_tdTitle">');
            html.push('<a href="', getItemUrl(item.productId, item.variantId), '">', BonaPage.encodeHtml(item.title), '</a>');
            html.push(renderOptions(item));
            html.push('</td>');
            html.push('<td class="storeCartTable_tdPprice">', renderPrice(item.price), '</td>');
            html.push('<td class="storeCartTable_tdQuantity">');
            html.push('<div class="quantitySnippet">');
            if (item.productType === 'DIGITAL') {
                html.push('<span class="typeNumber">' + item.quantity + '</span>')
            }
            else {
                html.push('<input ', (isDisabled && 'disabled="disabled"'), ' class="typeNumber" min="1" size="2" type="number" value="', item.quantity, '">');
                html.push('<div class="quantity-button quantity-down">&nbsp;</div><div class="quantity-button quantity-up">&nbsp;</div>');
            }
            html.push('</div>');
            html.push('</td>');
            html.push('<td class="storeCartTable_tdAmount">', renderPrice(item.total), '</td>');
            html.push('<td class="storeCartTable_tdDelete">');
            html.push('<button title="Remove item" class="storeCartTable_deleteButton"></button>');
            html.push('</td>');
            html.push('</tr>');

            return html.join('');
        }

        function renderOption(option)
        {
            return '<div class="storeCartTable_itemOption">' + BonaPage.encodeHtml(option.title) + ': ' + BonaPage.encodeHtml(option.value) + '</div>';
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

        function renderImage(item)
        {
            var html = [];

            if (item.pictureUrl)
            {
                html.push('<a class="storeCartTable_img" href="', getItemUrl(item.productId, item.variantId), '">');
                html.push('<img src="', item.pictureUrl, '" width="100"/></a>');
            } else
            {
                html.push('<div class="storeCartTable_img storeCartTable_no_img" title="No photo"></div>');
            }

            return html.join('');
        }

        function getItemUrl(productId, variantId)
        {
            return initModel.productDetailsUrl + '/' + productId;
        }

        function renderPrice(price)
        {
            if (initModel.currencySymbol) {
                return '<span class="priceContainer">' + initModel.currencySymbol + price.toFixed(2) + '</span>';
            } else {
                return '<span class="priceContainer">' + price.toFixed(2) + ' ' + initModel.currency + '</span>';
            }
        }

        function renderTotal(model)
        {
            var html = [];
            var total = model.total;
            var subTotal = model.subTotal;
            var isTaxesApplied = model.isTaxesApplied || false;
            var isTaxesIncludedTotal = model.isTaxesIncludedTotal || false;
            var taxes = model.taxes || [];

            if (initModel.taxesEnable && isTaxesApplied && !isTaxesIncludedTotal)
            {
                html.push('<tr class="storeCartSubTotalInfoRowFirst">');
                html.push('<td colspan="4" class="storeCartTable_totalLabel">Subtotal:</td>');

                if (initModel.currencySymbol) {
                    html.push('<td class="storeCartTable_totalValue">', initModel.currencySymbol, subTotal.toFixed(2), '</td>');
                } else {
                    html.push('<td class="storeCartTable_totalValue">', subTotal.toFixed(2), ' ', initModel.currency, '</td>');
                }

                html.push('<td class="storeCartTable_totalValue"></td>');
                html.push('</tr>');

                html.push(renderTaxes(taxes, isTaxesIncludedTotal));
            }

            if (total || total === 0)
            {
                if (!isTaxesIncludedTotal)
                {
                  html.push('<tr class="storeCartTotal storeCartTotalInfoRow">');
                }
                else
                {
                  html.push('<tr class="storeCartTotal storeCartTotalInfoRowFirst">');
                }

                html.push('<td colspan="4" class="storeCartTable_totalLabel">Total:</td>');

                if (initModel.currencySymbol) {
                    html.push('<td class="storeCartTable_totalValue">', initModel.currencySymbol, total.toFixed(2), '</td>');
                } else {
                    html.push('<td class="storeCartTable_totalValue">', total.toFixed(2), ' ', initModel.currency, '</td>');
                }

                html.push('<td class="storeCartTable_totalValue"></td>');
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
                  taxLabel = 'Incl.' + tax.title + ':';
              }

              html.push('<tr class="storeCartTotalInfoRow">');
              html.push('<td colspan="4" class="storeCartTable_totalLabel">', taxLabel, '</td>');

              if (initModel.currencySymbol) {
                html.push('<td class="storeCartTable_totalValue">', initModel.currencySymbol, tax.amount.toFixed(2), '</td>');
              } else {
                html.push('<td class="storeCartTable_totalValue">', tax.amount.toFixed(2), ' ', initModel.currency, '</td>');
              }

              html.push('<td class="storeCartTable_totalValue"></td>');
              html.push('</tr>');
            }

            return html.join('');
        }

        function renderControlNav()
        {
            var html = [];

            html.push('<div class="storeCartControlNav">');
            html.push('<div class="storeCartControlNav_left">');
            html.push('<a href="#" class="storeCartControlNav__back">Continue shopping</a>');
            html.push('</div>');
            html.push('<div class="storeCartControlNav_right">');
            html.push('<input ', (isDisabled && 'disabled="disabled"'),' type="button" name="continue" value="Proceed to checkout" class="functionalButton toCheckout">');
            html.push('</div>');
            html.push('</div>');

            return html.join('');
        }

        function renderGeneralError()
        {
            var html = [];

            html.push('<div class="noticeBox boxTypeError">');
            html.push('<div class="text">');
            html.push('Cannot complete operation. Please try again later or contact administrator');
            html.push('</div>');
            html.push('</div>');

            return html.join('');
        }

        function onError(cart)
        {
            isSaveFailed = true;
            render(cart);
            resetViewStates();
        }

        function onSaved(cart)
        {
            render(cart);
            resetViewStates();
        }

        function onSavingStart(cart)
        {
            isDisabled = true;
            render(cart);
            resetViewStates();
        }

        function onProductDelete()
        {
            if (isDisabled)
            {
                return;
            }

            var sender = jq$(this),
                productId = sender.closest('.storeCartTable_row').data('productId'),
                variantId = sender.closest('.storeCartTable_row').data('variantId');

            service.removeProduct(productId, variantId).done(onSaved).fail(onError);
        }

        function onProductQuantityInput()
        {
            var sender = jq$(this),
                productId = sender.closest('.storeCartTable_row').data('productId'),
                variantId = sender.closest('.storeCartTable_row').data('variantId'),
                quantity = +sender.val(),
                min = +sender.attr('min');

            if (quantity <= min) {
                quantity = min;
            }

            service.setQuantity(productId, variantId, quantity).done(onSaved).fail(onError);
        }

        function onProductQuantityUpDown()
        {
            var sender = jq$(this),
                input = sender.closest('.quantitySnippet').find('input'),
                value = +input.val();

            value += sender.hasClass('quantity-up') ? 1 : -1;
            input.val(value).trigger("input");
        }
    }
})(window, window.WA);