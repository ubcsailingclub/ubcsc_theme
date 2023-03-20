(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckoutLayout)
    {
        window.WaOnlineStoreCheckoutLayout = OnlineStoreCheckoutLayout;
    }

    function OnlineStoreCheckoutLayout(serviceCheckout, serviceCart, opts)
    {
        var self = this,
            isAuthorized = opts.isAuthorized,
            initModel = opts.initModel,
            checkEmptyCart = opts.checkEmptyCart,
            checkCartIssues = opts.checkCartIssues,
            step1,
            step2,
            step3,
            inventoryIssuesStep,
            wizard,
            checkoutContentContainer = jq$('#OnlineStoreCheckout_content_container'),
            wizardContainer = document.getElementById('idCheckoutWizardContainer'),
            deliveryEnable = initModel.deliveryEnable,
            deliveryOptions = initModel.deliveryOptions;

        if (!initModel) { throw(new Error('Not define initModel in layout opts')) }
        if (!checkEmptyCart) { throw(new Error('Not define checkEmptyCart in layout opts')) }

        // continue if checkout page
        if(!wizardContainer) return;

        self.render = render;
        self.showContainer = showContainer;
        
        init();

        function init()
        {
            jq$(wizardContainer).on('click', '.wizardBackButton', onPressWizardBackButton);
            jq$(wizardContainer).on('click', '.wizardNextButton', onPressWizardNextButton);
            jq$(wizardContainer).on('showStep', onShowWizardStep);

            step1 = new WaOnlineStoreCheckoutLayoutStep1(serviceCheckout, isAuthorized);
            step2 = new WaOnlineStoreCheckoutLayoutStep2(serviceCheckout, initModel);
            step3 = new WaOnlineStoreCheckoutLayoutStep3(serviceCheckout, initModel);
            step3.onOrderCreateFailed(onOrderCreateFailed);

            inventoryIssuesStep = new OnlineStoreCheckoutLayoutInventoryIssuesStep(serviceCheckout, serviceCart);
            inventoryIssuesStep.onUpdateAndContinueClick(onUpdateAndContinueClick);

            // Create object wizard only after register event "showStep"
            wizard = new WaBasicWizard({
                element: wizardContainer,
                stepsBarContainer: 'h1.stepsContainer',
                selected: 0,
                showStepURLhash: true
            });


            if (isDisableDelivery())
            {
              jq$('.stepsContainer').addClass('stepsContainer_withoutDelivery');
            }
        }

        function showContainer()
        {
          checkoutContentContainer.show();
        }

        function render()
        {
            step1.render();
            step2.render();
            step3.render();

            inventoryIssuesStep.render();
            
            checkCartHasIssues();
        }

        function onSuccessCheckEmail(model)
        {
            if (model.IsEmailExists === null || !model.IsEmailExists)
            {
              step1.saveContactModel().
                done(function()
                {
                    step1.deactivatePreload();

                    if (isSkipDeliveryStep())
                    {
                      wizard.next();
                    }

                    wizard.next();
                })
                .fail(function()
                {
                    step1.deactivatePreload();
                    step1.checkEmailFailedRender();
                });
            }
            else
            {
              step1.deactivatePreload();
              step1.emailExistErrorRender();
              return;
            }
        }

        function onFailureCheckEmail(error)
        {
            console.log(error.message || 'check email: Fail');
            step1.deactivatePreload();
            step1.checkEmailFailedRender();
            wizard.next();
        }

        function isDisableDelivery()
        {
          var card = serviceCart.localLoad() || {};
          var items = card.items || [];
          var isAllProductsDigital = items.length > 0 && items.filter(function (item) {
            return item.productType === 'DIGITAL';
          }).length === items.length;

          return (deliveryOptions.length === 0 && deliveryEnable) || isAllProductsDigital;
        }

        function isSkipDeliveryStep()
        {
          var isDisableDeliveryStep = (wizard.getStep() === 2 || wizard.getStep() === 0);

          return (
            isDisableDelivery() &&
            isDisableDeliveryStep
          );
        }

        function onPressWizardBackButton(e)
        {
          e.preventDefault();

          if (checkEmptyCart()) { return; }
          if (wizard.getStep() === 2 && checkCartHasIssues()) { return false; }

          if (isSkipDeliveryStep())
          {
            wizard.prev();
          }

          wizard.prev();

          if (wizard.getStep() === 0)
          {
            step1.render();
          }

          if (wizard.getStep() === 1)
          {
            step2.render();
          }

          return false;
        }

        function onPressWizardNextButton(e)
        {
            e.preventDefault();
            if (checkEmptyCart()) { return false; }


            var inventoryIssuesStep = 1;

            if (isDisableDelivery())
            {
              inventoryIssuesStep = 0;
            }

            if (wizard.getStep() === inventoryIssuesStep && checkCartHasIssues())
            {
              return false;
            }
            
            if (wizard.getStep() === 0)
            {
                step1.activatePreload();
                step1.checkEmail().done(onSuccessCheckEmail).fail(onFailureCheckEmail);
            }

            if (wizard.getStep() === 1)
            {
                step2.saveForm()
                    .done(function() { wizard.next(); })
                    .fail(function() { renderGeneralError(); });

                return false;
            }

            return false;
        }

        function renderGeneralError()
        {

        }

        function onShowWizardStep(e, anchorObject, stepNumber, stepDirection, stepPosition)
        {
          if (stepNumber === 2)
          {
            step3.render();
          }
        }

        function onOrderCreateFailed(data)
        {
          window.location.reload();
            //serviceCart.loadCurrent().done(checkCartHasIssues).fail(step3.showGeneralError);
        }

        function onUpdateAndContinueClick(e)
        {
            checkCartHasIssues();
        }

        function checkCartHasIssues()
        {
          var cart = serviceCart.localLoad() || {};

          if (cart.isValid)
          {
            inventoryIssuesStep.hide();
            wizardContainer.style.display = 'block';
            if (wizard.getStep() === 2)
            {
                step3.render();
            }
          }
          else
          {
            inventoryIssuesStep.render();
            inventoryIssuesStep.show();
            wizardContainer.style.display = 'none';
          }

          return !cart.isValid;
        }
    }
})(window, window.WA);
