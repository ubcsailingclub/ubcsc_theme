jq$(document).ready(function()
{
    var membersDirectoryGadget = jq$(".WaGadgetMemberDirectory");
    membersDirectoryGadget.on('mouseenter', '.membersTable tr',
        function()
        {
            var currentRowItem = jq$(this),
                nextRowItem = currentRowItem.next(),
                previousRowItem = currentRowItem.prev();

            if( currentRowItem.hasClass('hover') && nextRowItem.hasClass('hover'))
            {
                currentRowItem.css('border-bottom-color', 'transparent') && currentRowItem.children().css('border-bottom-color', 'transparent');
                nextRowItem.css('border-top-color', 'transparent') && nextRowItem.children().css('border-top-color', 'transparent');
            }

            if( currentRowItem.hasClass('hover') && previousRowItem.hasClass('hover'))
            {
              currentRowItem.css('border-top-color', 'transparent') && currentRowItem.children().css('border-top-color', 'transparent');
              previousRowItem.css('border-bottom-color', 'transparent') && previousRowItem.children().css('border-bottom-color', 'transparent');
            }
        });
});