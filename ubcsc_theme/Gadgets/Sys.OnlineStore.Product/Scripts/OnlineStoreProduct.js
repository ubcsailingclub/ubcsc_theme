jq$(function() {
    // cart controls
    if (!window.currentProduct)
    {
        window.currentProduct = { id: 0 };
    }

    if (window.currentProduct.id > 0)
    {
        var cartService = WaOnlineStoreCart.getInstance(),
            cartUrl = '/Sys/Store/Cart',
            cartKey = 'OnlineStoreCart',
            buttonAdd = document.getElementById('OnlineStoreProduct_addToCart'),
            outOfStockLabel = document.getElementById('idOnlineStoreCatalog_OutOfStock_container'),
            alreadyInCartLabel = document.getElementById('idOnlineStoreCatalog_AlreadyInCart_container'),
            buttonView = document.getElementById('OnlineStoreProduct_viewCart'),
            qtyContainer = document.getElementsByClassName('OnlineStoreProductQty')[0],
            inputQty = document.getElementById('idInputQuantity'),
            qtyLimitContainer = document.getElementById('idOnlineStoreCatalog_QuantityLimitContainer'),
            qtyLimit = document.getElementById('idOnlineStoreCatalog_QuantityLimit'),
            quantitySnippet = document.querySelector('.quantitySnippet'),
            options = document.querySelectorAll('SELECT.OnlineStoreProduct_optionsSelect'),
            optionErrorLabels = {},
            variantsModel = {};

        for (var i = options.length - 1; i >= 0; i--) {
            var option = options[i];
            
            var errorLabel = document.getElementById('idOnlineStoreProduct_Option' + option.getAttribute('option-id')  + '_ErrorLabel');

            optionErrorLabels[option.getAttribute('option-id')] = errorLabel;
        }

        if (!window.currentProduct.outOfStock && quantitySnippet)
        {
          quantitySnippet.onclick = function (event)
          {
            var target = event.target, value;

            if (target.className.indexOf('quantity-button') !== -1)
            {
              value = getQuantity();
              value += target.className.indexOf('quantity-up') >= 0 ? 1 : -1;

              inputQty.value = value;
              inputQty.oninput();
            }
          };
        }

        if (!window.currentProduct.outOfStock && inputQty)
        {
          inputQty.oninput = function()
          {
              var value = getQuantity(),
                  min = parseInt(inputQty.getAttribute('min'));

              if (value < min) { value = min; }

              inputQty.value = value;
          };
        }
        
        buttonView.onclick = function(e)
        {
            document.location = cartUrl;
            e.preventDefault();
            return false;
        };

        buttonAdd.onclick = function()
        {
            if(!validate())
            {
                return false;
            }

            var variant = getVariant(), variantId = null, quantity = getQuantity();

            if (variant)
            {
                variantId = variant.id;
            }

            if (quantity > 0) {
                cartService.add(currentProduct.id, variantId, quantity)
                    .fail(function (error) { console.log(error); })
                    .done(update);
            }

            return false;
        };

        cartService.load()
            .fail(function(error) { console.log(error); })
            .done(update);

        function getVariant(selectedOptions)
        {
            // calculate variant based on selected options (need variantsModel json)
            if (!selectedOptions)
            {
                selectedOptions = getSelectedOptions();
            }

            if (!selectedOptions 
                || selectedOptions.length == 0
                || !currentProduct.variants
                || currentProduct.variants.length == 0)
            {
                return null;
            }

            var variant = null;

            for (var i = currentProduct.variants.length - 1; i >= 0; i--) { // each variant
                var optionValues = currentProduct.variants[i].options;
                var isMatch = true;

                for (var j = selectedOptions.length - 1; j >= 0; j--) { // each selected option
                    var  found = false;

                    for (var k = optionValues.length - 1; k >= 0; k--) { // each variant option
                        if (optionValues[k].title == selectedOptions[j].title && optionValues[k].value==selectedOptions[j].value)
                        {
                            found = true;
                            break;
                        }
                    }

                    if (!found)
                    {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch)
                {
                    variant = currentProduct.variants[i];
                }
            }

            return variant;
        }

        function getSelectedOptions()
        {
            var selectedOptions = [];

            for (var i = options.length - 1; i >= 0; i--) {
                var option = options[i]; 

                selectedOptions.push({ title: option.getAttribute('option-title'), value: option.value });
            }

            return selectedOptions;
        }

        function getQuantity()
        {
            if (inputQty) {
                var value = parseInt(inputQty.value);
                return value > 0 ? value : 1;
            }

            return 1;
        }

        function getProductsInCartQuantity(cart)
        {
            if (!cart) { return; }

            var quantity = 0;

            cart.items.forEach(function(item) {
                quantity += item.quantity;
            });

            return quantity;
        }        
       
        function init()
        {
            for (var i = options.length - 1; i >= 0; i--) {
                var optionSelect = options[i];

                optionSelect.onchange = function (event)
                {
                    var hasValue = event.target.value != '';
                    optionErrorLabels[event.target.getAttribute('option-id')].style.display = hasValue ? 'none' : 'block';

                    var variant = getVariant();
                    setVariantData(variant);
                };
            }
        }

        function setVariantData(variant)
        {
            if (!variant)
            {
                outOfStockLabel.style.display = 'none';
                qtyLimitContainer.style.visibility = 'hidden';

                buttonAdd.disabled = true;
                return;
            }

            qtyLimitContainer.style.visibility = variant.outOfStock || !variant.stock ? 'hidden' : 'visible';
            qtyLimit.innerText = variant.stock;

            outOfStockLabel.style.display = variant.outOfStock ? 'block' : 'none';
            buttonAdd.disabled = variant.outOfStock;
        }

        function validate()
        {
            var isValid = false;
            
            var errors = getValidationErrors();
            isValid = errors.length == 0;

            displayErrorState(errors);
            
            return isValid;
        }

        function getValidationErrors()
        {
            var errors = [];
            var selectedOptions = [];

            if (options.length == 0)
                return errors;

            // go through options, if some are not selected - return validation error
            for (var i = options.length - 1; i >= 0; i--) {
                var option = options[i];
                
                if (option.selectedIndex == 0)
                {
                    errors.push({ type: 'option', id: option.getAttribute('option-id') })
                }
                else
                {
                    selectedOptions.push({ title: option.getAttribute('option-title'), value: option.value });
                }
            }

            if (errors.length > 0)
                return errors;

            // calculate selected variant
            var variant = getVariant(selectedOptions);
            
            if (variant && variant.outOfStock)
            {
                return [{ type: 'outOfStock' }];
            }

            return errors;
        }

        function displayErrorState(errors)
        {
            for (var i = optionErrorLabels.length - 1; i >= 0; i--) {
                    optionErrorLabels[i].style.display = 'none';
            }

            // show/hide errors
            for (var i = errors.length - 1; i >= 0; i--) {
                var error = errors[i];

                switch (error.type)
                {
                    case 'option':
                    {
                        optionErrorLabels[error.id].style.display = 'block';
                        break;
                    }
                    case 'outOfStock':
                    {
                        outOfStockLabel.style.display = 'block';
                        break;
                    }
                }
            }

            // disable/enable add button
            buttonAdd.disabled = errors.length > 0;
        }

        function isProductDigital()
        {
            if(!currentProduct) { return false; }
            return currentProduct.type === 'DIGITAL';
        }

        function isProductInCart(productId)
        {
            var cart = JSON.parse(WA.Storage.read(cartKey));

            if (!cart || !cart.items) { return false; }

            var result = false;
            for (var i = 0; i < cart.items.length; i++) {
                if (cart.items[i].productId === productId) {
                    result = true;
                    break;
                }
            }

            return result;
        }

        function displayAlreadyInCartState() 
        {
            alreadyInCartLabel.style.visibility = 'visible';
            buttonAdd.disabled = true;
        }
        
        function updateLayoutForDigitalProduct() {
            if (isProductInCart(currentProduct.id)) {
                displayAlreadyInCartState();
            }
        }

        function update()
        {		
            var cart,
            productsInCartQuantity,
            currentProductQuantity,
            currentProductQuantityLimit;
            
            cart = JSON.parse(WA.Storage.read(cartKey));
            productsInCartQuantity = getProductsInCartQuantity(cart);
            updateViewInCartText(productsInCartQuantity);

            if (isProductDigital())
            {
                updateLayoutForDigitalProduct();
            }
        }

        function updateViewInCartText(value)
        {
            if (typeof value !== 'number') { return; }
            
            buttonView.textContent = value > 0
            ? 'View cart (' + value + ')'
            : 'View cart';
        }

        function quantityLimitElement(options)
        {
            var self = this,
                main = options.element,
                delay = options.delay || 400;

            self.hide = hide;
            self.show = show;
            self.text = text;

            function hide() {
                if (main) {
                    main.style.display = 'none';
                }
            }

            function show() {
                if (main) {
                    main.style.display = 'block';
                    setTimeout(hide, delay);
                }
            }

            function text(value) {
                if (main) {
                    main.textContent = value;
                }
            }
        }

        // image processing
        var coverContainer = document.querySelector('.OnlineStoreProduct_gallery_cover_container'),
            coverImg = document.getElementById('OnlineStoreProduct_gallery_cover_img'),
            thumbs = document.getElementById('OnlineStoreProduct_gallery_thumbs');

        if (thumbs) {
            thumbs.onclick = function(e) {
                var target = e.target;

                while (target != this) {
                    if (target.nodeName == 'A') {
                        showThumbnail(target.href, target.title);
                        return false;
                    }

                    target = target.parentNode;
                }
            };

            // Preloading
            var imgs = thumbs.getElementsByTagName('img');

            for (var i = 0; i < imgs.length; i++) {
                var img = document.createElement('img');
                img.src = imgs[i].parentNode.href;
            }
        }

        function showThumbnail(href, title) {
            coverImg.src = href;
            coverImg.alt = title;
            coverContainer.href = href;
        }

        init();
    }
});