jq$(function() {

    var service = WaOnlineStoreCart.getInstance().getService();
    service.savingCompleted = showCart;
    var cart = service.localLoad() || {};

    showCart(cart);

    function showCart(cart)
    {
        if (!cart.items || cart.items.length === 0) {
            jq$('.cart-gadget_count').text('');
            jq$('.cart-gadget_quantity').removeClass('cart-gadget_quantity__filled');
            return;
        }

        var quantity = 0;

        cart.items.forEach(function(item) {
            quantity += item.quantity;
        });

        jq$('.cart-gadget_count').text(quantity);
        jq$('.cart-gadget_quantity').addClass('cart-gadget_quantity__filled');

        return quantity;
    }

});