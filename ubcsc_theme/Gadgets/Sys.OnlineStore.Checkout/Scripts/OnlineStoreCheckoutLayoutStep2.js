(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckoutLayoutStep2)
    {
        window.WaOnlineStoreCheckoutLayoutStep2 = OnlineStoreCheckoutLayoutStep2;
    }

    function OnlineStoreCheckoutLayoutStep2(service, initModel)
    {
        var SHIPPING = WaOnlineStoreCheckout.SHIPPING, PICKUP = WaOnlineStoreCheckout.PICKUP;

        var formName = 'delivery_details',
            container = document.getElementById('step-2'),
            $container = jq$(container),
            self = this, validator,
            deliveryOptionId = null,
            deliveryEnable = initModel.deliveryEnable,
            deliveryOptions = initModel.deliveryOptions,
            $shippingAddressContainer = $container.find('.delivery.delivery__shipping-address'),
            $pickupContainer = $container.find('.delivery.delivery__pickup-address'),
            $deliveryDetailsForm = $container.find('form[name=' + formName + ']'),
            $shippingAddressContainer = $shippingAddressContainer,
            $deliveryOptionsContainer = $container.find('.delivery-methods'),
            $pickupContainer = $container.find('.delivery.delivery__pickup-address'),
            $deliveryOptionsRadio = $container.find('input[type="radio"][name="delivery-options"]'),
            deliveryOptionType = null;

        self.render = render;
        self.saveForm = saveForm;

        $deliveryOptionsRadio.on('change', function() {
          deliveryOptionId = jq$(this).val();
          var isShipping = jq$(this).hasClass('delivery-method-radio-button_shipping-option');
          deliveryOptionType = isShipping ? SHIPPING : PICKUP;
          showFormByType(deliveryOptionType);
        });

        deliveryOptionId = $deliveryOptionsRadio.first().val();

        init();

        function init()
        {
          // Refactoring on CSS
          $deliveryOptionsContainer.hide();
          $pickupContainer.hide();
          $shippingAddressContainer.hide();

          if (!deliveryEnable)
          {
            $container.find('.formFieldContainer.required').removeClass('required');
          }

          validatorInit();
          disableNextButton();

          if (deliveryEnable)
          {
            $deliveryOptionsContainer.show();
            $shippingAddressContainer.show();
          }
          else
          {
            $shippingAddressContainer.show();
          }

          if (deliveryEnable && deliveryOptions.length > 0)
          {
            $deliveryOptionsRadio.first().attr('checked', true);
            $deliveryOptionsRadio.first().trigger('change');
          }
        }

        function validatorInit()
        {
          if (deliveryEnable)
          {
            validator = new FormValidator({
              form: formName,
              autoConfig: true,
              validateOnBlur: true,
              onBlurField: onBlurValidate,
              onSubmit: onSubmitValidate
            });
          }
          else
          {
            validator = {
              isValidateForm: function() { return true; },
              validateForm: function() { return true; }
            };
          }
          
          var onChangeField = function() { tryEnableNextButton(); };

          $shippingAddressContainer.find('#shippingAddress_address1').on('input', onChangeField);
          $shippingAddressContainer.find('#shippingAddress_city').on('input', onChangeField);
          $shippingAddressContainer.find('#shippingAddress_region').on('input', onChangeField);
          $shippingAddressContainer.find('#shippingAddress_zipcode').on('input', onChangeField);

          $shippingAddressContainer.find('#shippingAddress_country').on('change', function(evt)
          {
            var errors = [], sender = jq$(evt.target);

            if (deliveryEnable && !isSelectedCountry())
            {
              errors = [{ message: 'The Country is required' }];
            }

            putErrors(errors, sender);
            tryEnableNextButton();
          });

          $deliveryOptionsRadio.on('change', onChangeField);
        }

        function onSubmitValidate(errors, evt)
        {
          if (errors.length > 0) {
            disableNextButton();
          } else {
            enableNextButton();
          }
        }

        function onBlurValidate(errors, evt)
        {
          var sender = jq$(evt.target);
          putErrors(errors, sender);
        }

        function putErrors(errors, sender)
        {

          if (!sender.next('.errorField').length)
          {
            sender.after('<div class="errorField"></div>');
          }

          var errorField = sender.next('.errorField');

          if (errors.length > 0) {
            errorField.html(errors[0].message).addClass('errorField__visible');
            sender.parents('.formFieldContainer').addClass('error');
            disableNextButton();
          } else {
            errorField.removeClass('errorField__visible');
            sender.parents('.formFieldContainer').removeClass('error');
            tryEnableNextButton();
          }
        }

        function showFormByType(optionType)
        {
          if (optionType === SHIPPING)
          {
            $pickupContainer.hide();
            $shippingAddressContainer.show();
          }
          else
          {
            $pickupContainer.show();
            $shippingAddressContainer.hide();
          }
        }

        function render()
        {
          service.getDeliveryModel().done(function(deliveryModel)
          {
            var shippingAddress = deliveryModel.shippingAddress;
            jq$('input[name="delivery-options"][value="' + deliveryOptionId + '"]').prop('checked', true);

            if (shippingAddress)
            {
              $shippingAddressContainer.find('#shippingAddress_address1').val(shippingAddress.addressLine1);
              $shippingAddressContainer.find('#shippingAddress_address2').val(shippingAddress.addressLine2);
              $shippingAddressContainer.find('#shippingAddress_city').val(shippingAddress.city);
              $shippingAddressContainer.find('#shippingAddress_country').val(shippingAddress.countryId);
              $shippingAddressContainer.find('#shippingAddress_region').val(shippingAddress.province);
              $shippingAddressContainer.find('#shippingAddress_zipcode').val(shippingAddress.zip);

            }

            tryEnableNextButton();
          });
        }

        function disableNextButton()
        {
          getNextButton().attr('disabled','disabled');
        }

        function enableNextButton()
        {
          getNextButton().removeAttr('disabled');
        }

        function getNextButton()
        {
          return $container.find('.wizardNextButton');
        }

        function tryEnableNextButton()
        {
          if (!deliveryEnable)
          {
            return enableNextButton();
          }

          if ((validator.isValidateForm() && isSelectedCountry()) || (deliveryOptionType === PICKUP))
          {
            enableNextButton();
          }
          else
          {
            disableNextButton();
          }
        }

        function getSelectedCountry()
        {
          var $countrySelect = $shippingAddressContainer.find('#shippingAddress_country'),
            countryId = +$countrySelect.val(), countryName = '';

          if (countryId === 0) {
            countryId = null;
            countryName = '';
          } else {
            countryName = $countrySelect.find('option:selected').text();
          }

          return { countryName: countryName, countryId: countryId };
        }

        function isSelectedCountry()
        {
          var country = getSelectedCountry();
          return country.countryId !== null;
        }

        function saveForm()
        {
            var selectedCountry = getSelectedCountry(),
              countryName = selectedCountry.countryName, countryId = selectedCountry.countryId;


            var shippingAddress = {
              addressLine1: $shippingAddressContainer.find('#shippingAddress_address1').val(),
              addressLine2: $shippingAddressContainer.find('#shippingAddress_address2').val(),
              city: $shippingAddressContainer.find('#shippingAddress_city').val(),
              countryId: countryId,
              countryName: countryName,
              province: $shippingAddressContainer.find('#shippingAddress_region').val(),
              zip: $shippingAddressContainer.find('#shippingAddress_zipcode').val()
            };

            var deliveryModel = {
              shippingAddress: shippingAddress,
              deliveryOptionId: deliveryOptionId
            };

            return service.saveDeliveryModel(deliveryModel);
        }
    }

})(window, window.WA);