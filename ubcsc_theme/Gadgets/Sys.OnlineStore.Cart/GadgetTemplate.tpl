<script>
  jq$(function()
  {
    var cart =  WaOnlineStoreCart.getInstance(); // server request, if error - layout must render

    var layout = new WaOnlineStoreCartLayout(cart.getService(),
          {
            productDetailsUrl: '<$Model.CartInfo.ProductDetailsUrlTemplate$>',
            currencySymbol: '<$Model.CartInfo.CurrencySymbol$>',
            currency: '<$Model.CartInfo.Currency$>',
            taxesEnable: <$Model.IsTaxesFeatureEnabled$>
          });

    cart.load()
        .done(layout.render)
        .fail(function() { layout.onError({}) });
  });
</script>
<div class="OnlineStoreCart_content_container sw-theme-default" id="OnlineStoreCart_content_container">

  <h1 class="stepsContainer">
    <span>Cart</span>
  </h1>

  <div class="pagesContainer">
    <div class="storeCartContent" id="cartLayout">
    
    </div>
  </div>
</div>