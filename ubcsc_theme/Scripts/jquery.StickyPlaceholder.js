/* Makes placeholders, which have parent with [data-sticky-wrapper=true] sticky */

(function(jq$)
{
    if (!window.stickyPlaceholder)
    {
        window.stickyPlaceholder = stickyPlaceholder;
    }

    function stickyPlaceholder()
    {
        var stickyAnchor = jq$('[data-sticky-wrapper=true]'),
            stickyWrapper = stickyAnchor.children().first();

        if( stickyAnchor.length > 0 )
        {
            jq$(window).scroll( function()
            {
                makePlaceholderSticky(stickyAnchor, stickyWrapper);
            });

            jq$(window).resize( function()
            {
                setWrapperWidth(stickyWrapper);
            });

            setWrapperWidth(stickyWrapper);

            if (jq$(window).scrollTop() != 0) makePlaceholderSticky(stickyAnchor, stickyWrapper);
        }

        function makePlaceholderSticky(anchor, wrapper)
        {
            var windowTop = jq$(window).scrollTop(),
                anchorOffset = anchor.offset().top;


            if (windowTop > anchorOffset && wrapper.height() < jq$(window).height() && !jq$('.menuInner').hasClass('mobileView'))
            {
                wrapper.addClass('stick');
                if (wrapper.closest('.WaGadgetMenuHorizontal').hasClass('menuStyle002')) jq$('.WaGadgetSocialProfile.fixed').addClass('stickywhitemenu');

            } else {
                wrapper.removeClass('stick');
                jq$('.WaGadgetSocialProfile.fixed').removeClass('stickywhitemenu');
            }
        }

        function setWrapperWidth(wrapper)
        {
            var wrapperParent = wrapper.parent(),
                wrapperParentWidth = wrapperParent.width();

                wrapper.css('width', wrapperParentWidth);

            WA.Gadgets.notifyStickyPlaceHolderResized();
        }
    }

})(window.jq$);