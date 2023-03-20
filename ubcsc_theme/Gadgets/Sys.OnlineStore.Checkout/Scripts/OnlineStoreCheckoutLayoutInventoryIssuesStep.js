(function (window, WA, undefined)
{
    'use strict';

    if (!window.OnlineStoreCheckoutLayoutInventoryIssuesStep)
    {
        window.OnlineStoreCheckoutLayoutInventoryIssuesStep = OnlineStoreCheckoutLayoutInventoryIssuesStep;
    }

    function OnlineStoreCheckoutLayoutInventoryIssuesStep(service, serviceCart)
    {
        var formName = 'form_invetory_issues',
            container = document.getElementById('step-inventoryIssues'),
            tableContainer = document.getElementById('step-inventoryIssues-tableContainer'),
            tableRenderer = new InventoryIssuesStepTableRenderer(),
            $container = jq$(container),
            form = jq$('form[name=' + formName + ']'),
            updateAndContinueEventName = 'CheckoutInventoryIssueUpdateAndContinueClick',
            self = this, validator, model;

        self.render = render;
        self.updateAndContinue = updateAndContinue;
        self.deleteProduct = deleteProduct;
        self.show = show;
        self.hide = hide;
        self.onUpdateAndContinueClick = onUpdateAndContinueClick;
        
        init();

        function init()
        {
          service.getConfirmModel().done(function(confirmModel) {
            model = jq$.extend(true, {}, confirmModel.cart); // TODO: rename to confirmModel
          });
        }

        function show()
        {
          container.style.display = 'block';
        }

        function hide()
        {
          container.style.display = 'none';
        }

        function render()
        {
          service.getConfirmModel().done(function(confirmModel) {
            model = model ? model : jq$.extend(true, {}, confirmModel.cart); // TODO: rename to confirmModel

            tableContainer.innerHTML = tableRenderer.render(model);
            jq$('button.storeCartTable_deleteButton', tableContainer).click(deleteProduct)
          });

          jq$('#idUpdateAndContinueButton', container).click(updateAndContinue)
        }

        function deleteProduct(e)
        {
          var productId = e.target.getAttribute('item-productId'), 
          variantId = e.target.getAttribute('item-variantId');

          if(variantId == '')
          {
            variantId = null; //TODO: remove
          }

          var itemsToDelete = jq$.grep(model.items, function(el, idx) {
            return el.productId == productId && el.variantId == variantId;
          });

          for (var i = itemsToDelete.length - 1; i >= 0; i--) {
            itemsToDelete[i].isDeleted = true;
          }

          render();
        }

        function updateAndContinue()
        {
          model.items = $.grep(model.items, function(obj){ return obj.isDeleted; }, true);

          for (var i = model.items.length - 1; i >= 0; i--) {
            var item = model.items[i];

            if (InventoryIssuesHelper.hasInventoryIssues(item, model.issues))
            {
              var issue = InventoryIssuesHelper.getInventoryIssue(item, model.issues);

              switch(issue.type)
              {
                case 'NOTENOUGH':
                {
                  model.items[i].quantity = issue.stock;
                  break;
                }
                case 'OUTOFSTOCK':
                {
                  model.items[i] = null;
                  break;
                }
                default:{
                  throw ({
                    'message':'Invalid issue type',
                    'productId': item.productId,
                    'variantId': item.variantId
                  });
                }
              }
            }
          }

          model.items = $.grep(model.items, function(obj){ return obj; });

          serviceCart.saveWithDelay(model).done(function(cart) {
            jq$.event.trigger(updateAndContinueEventName);
            serviceCart.saveInCache(cart);
          });
        }

        function onUpdateAndContinueClick(actionFunc)
        {
          jq$(document).bind(updateAndContinueEventName, actionFunc);
        }
    }

})(window, window.WA);