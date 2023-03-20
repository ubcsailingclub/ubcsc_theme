<script>
  function recaptchaReady()
  {
      jq$(function()
      {
        var checkout = WaOnlineStoreCheckout.getInstance();
        var cart = WaOnlineStoreCart.getInstance();
        var cartService = cart.getService();
        var serviceCheckout = checkout.getService();
        var serviceCart = cart.getService();
        var presetContactModel = <$Model.CheckoutBillingDetails$>;
        var isAuthorized = !!presetContactModel.Email;
        var isAdminView = <$Model.IsAdminView$>;

        if (isAuthorized)
        {
            serviceCheckout.saveContactModel(presetContactModel);
        }

        var redirectEmptyCart = function(cartModel)
        {
          if (isAdminView) { return false; }

          var items = cartModel.items || [];
          if (items.length === 0)
          {
            window.location.href = '/Sys/Store/Cart';
            return true;
          }
          return false;
        }

        var checkEmptyCart = function ()
        {
          var cart = serviceCart.localLoad() || {};
          return redirectEmptyCart(cart);
        }

        var layout = new WaOnlineStoreCheckoutLayout(serviceCheckout, cartService,
        {
              initModel: {
                productDetailsUrl: '<$Model.CartInfo.ProductDetailsUrlTemplate$>',
                currencySymbol: '<$Model.CartInfo.CurrencySymbol$>',
                currency: '<$Model.CartInfo.Currency$>',
                taxesEnable: <$Model.IsTaxesFeatureEnabled$>,
                deliveryEnable: <$Model.IsShippingFeatureEnabled$>,
                deliveryOptions: <$Model.DeliveryOptionsJson$>
              },
              checkEmptyCart: checkEmptyCart,
              isAuthorized: isAuthorized
        });

        cart.load()
            .done(function(cartModel) {
                if (redirectEmptyCart(cartModel)) { return; }
                layout.showContainer();
                layout.render();
            })
            .fail(function() {
                layout.renderGeneralError();
            })
      });
  }
</script>

<div class="OnlineStoreCheckout_content_container sw-theme-default" id="OnlineStoreCheckout_content_container">
  <div class="storeCartContent" id="step-inventoryIssues">
    <h1 class="stepsContainer"><span><span class="step" href="#step-inventoryIssues">Inventory issues</span></span></h1>
    <div class="noticeBox boxTypeWarning" style="display:block;">
      <div class="text">Some products are no longer available for purchase. Would you like to update your cart and continue?</div>
    </div>
    <div id="step-inventoryIssues-tableContainer"></div>

    <form class="standardForm inventoryIssuesForm" name="form_invetory_issues" action="" method="post">

    </form>

    <div class="storeCartControlNav">
        <div class="storeCartControlNav_left">
            <a href="/Sys/Store/Cart">< Back to cart</a>
        </div>
        <div class="storeCartControlNav_right">
            <input type="button" id="idUpdateAndContinueButton" name="continue" value="Update and continue" class="functionalButton wizardNextButton">
        </div>
    </div>
  </div>
  <div id="idCheckoutWizardContainer">
    <h1 class="stepsContainer">
      <span><span class="step" href="#step-1"><span class="stepNumber">1.</span> Contact</span></span>
      <span class="storeCartTabSeparator"></span>
      <span><span class="step step_withDelivery" href="#step-2"><span class="stepNumber">2.</span> Delivery</span></span>
      <span class="storeCartTabSeparator storeCartTabSeparator_withDelivery"></span>
      <span>
        <span class="step" href="#step-3">
          <span class="stepNumber stepNumber_withDelivery">3.</span>
          <span class="stepNumber stepNumber_withoutDelivery">2.</span>
          Confirmation
        </span>
      </span>
    </h1>

    <div class="pagesContainer">

      <div id="noticePlaceholder">
          <div class="noticeBox hiddenError boxTypeError" id="generalError">
              <div class="text">
                  Cannot complete operation. Please try again later or contact administrator
              </div>
          </div>
          <div class="noticeBox hiddenError boxTypeError" id="captchaFailed">
              <div class="text">
                  Sorry! Captcha validation is failed.
              </div>
          </div>
          <div class="noticeBox hiddenError boxTypeWarning" id="existEmail">
              <div class="text">
                  <div class="notificationSplitContentBox">
                      <div class="notificationSplitContent notificationSplitContent__left">
                          You've already created an account with this email, please log in to continue
                      </div>
                      <div class="notificationSplitContent notificationSplitContent__right">
                          <input type="button" name="login" value="Login" id="loginPageButton" class="functionalButton">
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div class="storeCartContent" id="step-1">

          <div class="formAnnotates">Please fill in your contact information</div>

          <h2>Billing details</h2>

          <form class="standardForm billingDetailsForm" name="contact_details" action="" method="post">
            <div class="formContainer">
              <div class="error_box" style="color: red;"></div>
              <div class="success_box"></div>
              <div class="formFieldContainer horizontalErrorMsg required">
                <label for="billingDetails_email">Contact email</label>
                <div class="formField">
                  <input id="billingDetails_email" maxlength="100" type="text" name="email" data-validate="required|valid_email" <$if (Model.IsAuthorized)$>disabled<$endif$>>
                </div>
                <div class="formFieldAnnotate">
                  We'll send an order confirmation to this address
                </div>
              </div>
              <div class="formFieldContainer">
                <label for="billingDetails_firstName">First name</label>
                <div class="formField"><input maxlength="50" id="billingDetails_firstName" type="text" name="first_name"></div>
              </div>
              <div class="formFieldContainer">
                <label for="billingDetails_lastName">Last name</label>
                <div class="formField"><input maxlength="50" id="billingDetails_lastName" type="text" name="last_name"></div>
              </div>
              <div class="formFieldContainer">
                <label for="billingDetails_phone">Phone</label>
                <div class="formField"><input maxlength="32" id="billingDetails_phone" type="text" name="phone"></div>
              </div>
                <$Model.RulesAndTermsFields:{
                    <div class="formFieldContainer storeCheckoutTerms required">
                      <div class="storeCheckoutTermContainer">
                        <input type="checkbox" class="storeCheckoutTerm" id="term_<$it.Id$>" value="<$it.Id$>"></input>
                        <label for="term_<$it.Id$>"><a href="<$it.Url$>" target="_blank"><$it.Text$></a></label><br />
                        <span class="formFieldAnnotate"><$it.Description$></span>
                      </div>
                    </div>
                }$>
            </div>
          </form>

          <div class="storeCartControlNav">
              <div class="storeCartControlNav_left">
                  <a href="/Sys/Store/Cart">Back</a>
              </div>
              <div class="storeCartControlNav_right">
                  <input type="button" name="continue" value="Continue" class="functionalButton wizardNextButton">
              </div>
          </div>

      </div>

      <div class="storeCartContent" id="step-2">

        <form class="standardForm shippingAddressForm" name="delivery_details" action="" method="post">

            <div class="delivery-methods">
                <$if(length(Model.DeliveryOptionsShipping)>0)$>
                    <div class="delivery-methods__shipping-options-container">
                        <h2>Shipping</h2>
                        <div class="delivery-methods_delivery-options">
                            <$Model.DeliveryOptionsShipping:DeliveryShippingOption()$>
                        </div>
                    </div>
                <$endif$>
                <$if(length(Model.DeliveryOptionsPickup)>0)$>
                    <div class="delivery-methods__pickup-options-container">
                        <h2>Pickup</h2>
                        <div class="delivery-methods__delivery-options">
                            <$Model.DeliveryOptionsPickup:DeliveryPickupOption()$>
                        </div>
                    </div>
                <$endif$>
            </div>

            <div class="delivery delivery__shipping-address formContainer">
                <h2>Shipping address</h2>
                <div class="formFieldContainer required">
                  <label for="shippingAddress_address1">Address line 1</label>
                  <div class="formField"><input maxlength="150" id="shippingAddress_address1" data-validate="required" type="text" name="address1"></div>
                </div>
                <div class="formFieldContainer">
                  <label for="shippingAddress_address2">Address line 2</label>
                  <div class="formField"><input maxlength="150" id="shippingAddress_address2" type="text" name="address2"></div>
                </div>
                <div class="formFieldContainer required">
                  <label for="shippingAddress_city">City/Town</label>
                  <div class="formField"><input maxlength="50" id="shippingAddress_city" data-validate="required" type="text" name="city"></div>
                </div>

                <div class="comboFieldsContainerTwoFields">
                  <div class="formFieldContainer required">
                    <label for="shippingAddress_country">Country</label>
                    <div class="formField"><select id="shippingAddress_country" name="shipping_country" data-validate="required">
                      <option value="">&lt; Select &gt;</option>
                      <$Model.Countries:{<option value="<$it.Id$>"><$it.Name$></option>}$>
                    </select></div>
                  </div>
                  <div class="formFieldContainer formFieldRegion required">
                    <label for="shippingAddress_region">State/Province/Region</label>
                    <div class="formField"><input maxlength="50" id="shippingAddress_region" type="text" data-validate="required" name="region"></div>
                  </div>
                </div>

                <div class="comboFieldsContainerTwoFields">
                  <div class="formFieldContainer required">
                    <label for="shippingAddress_zipcode">Zip/Postal code</label>
                    <div class="formField"><input maxlength="16" id="shippingAddress_zipcode" type="text" data-validate="required" name="zipcode" value=""></div>
                  </div>
                  <div class="formFieldContainer">
                  </div>
                </div>
            </div>

            <div class="delivery delivery__pickup-address">
            </div>

        </form>

        <div class="storeCartControlNav">
          <div class="storeCartControlNav_left">
            <a href="#" class="wizardBackButton">Back</a>
          </div>
          <div class="storeCartControlNav_right">
            <input type="button" name="continue" value="Continue" class="functionalButton wizardNextButton">
          </div>
        </div>
      </div>

      <div class="storeCartContent" id="step-3">
        <div id="step-3-content"></div>
        <form class="standardForm" name="order_details" action="" method="post">
            <div class="formContainer">
                <h2>Comments</h2>
                <div class="formFieldContainer">
                    <div class="formField">
                        <textarea maxlength="250" id="order_comments" name="comments"></textarea>
                    </div>
                </div>
            </div>
        </form>
        <div id="recaptchaContainer" class="checkoutRecaptcha" data-sitekey="<$Model.ReCaptchaSiteKey$>"></div>
        <div class="storeCartControlNav">
            <div class="storeCartControlNav_left">
              <a href="#" class="wizardBackButton">Back</a>
            </div>
            <div class="storeCartControlNav_right">
              <input type="button" style="display:none" id="button_free_order" name="continue" value="Confirm" class="functionalButton payButton" />
              <$if(Model.IsOfflinePaymentSupported||!Model.IsPaymentMethodsFeatureEnabled)$>
			            <input type="button" id="button_pay_invoice" name="continue" value="Invoice me" class="functionalButton payButton" />
			        <$endif$>
              <$if(Model.IsOnlinePaymentSupported)$>
                <input type="button" id="button_pay_online" name="continue" value="Pay online" class="functionalButton payButton" />
              <$endif$>
            </div>
        </div>
      </div>
    </div>
  </div>
  <script src="https://www.google.com/recaptcha/api.js?onload=recaptchaReady&render=explicit" async defer></script>
</div>