<div data-sticky-wrapper="true">
    <div class="stickness">
        <div class="menuBackground"></div>
        <div class="menuInner">
            <ul class="firstLevel">
                <$Model.Items:Item()$>
            </ul>
        </div>
    </div>
</div>

<script type="text/javascript">
    if (window.WaMenuHorizontal)
    {
        jq$(document).ready(function()
        {
            new stickyPlaceholder();
            new WaMenuHorizontal({ id: "<$Model.Id$>" });
        });
    }
</script>


<script type="text/javascript">
    jq$(function()
    {
        var gadgetHorMenu = jq$('#<$Model.Id$>');
        var leftOffset;

        function resizeBg()
        {
            // background track

            leftOffset = (gadgetHorMenu.closest('.WaLayoutTable').length > 0) ? gadgetHorMenu.closest('.WaLayoutTable').width() : gadgetHorMenu.width();

            gadgetHorMenu.find('.menuBackground').css(
            {
                'width': jq$('body').width(),
                'left': ( ( jq$('body').width() - leftOffset ) * -0.5 )
            });
        }

        resizeBg();

        jq$(window).resize(function()
        {
            resizeBg();
        });
    });
</script>