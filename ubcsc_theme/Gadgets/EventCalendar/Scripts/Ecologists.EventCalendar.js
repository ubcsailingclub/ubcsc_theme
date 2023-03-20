jq$(document).ready(function() {

    function setMarginForDetails(){
        var eventHeaderHeight = jq$('.WaGadgetEvents.WaGadgetEventsStateDetails .pageTitleOuterContainer .eventsTitleContainer').height();
        if (eventHeaderHeight > 0)
        {
            jq$('.WaGadgetEvents.WaGadgetEventsStateDetails .boxOuterContainer .boxBodyOuterContainer .boxBodyContainer .boxBodyInfoOuterContainer.boxBodyInfoViewFill').css('margin-top',-eventHeaderHeight-4+'px');
        }
    }

    var eventListCalendar = jq$('.EventListCalendar'),
        str = location.search,
        pattern = /CalendarViewType=(\d+)/i,
        viewType = str.match(pattern);

    if (viewType && viewType.length > 1)
    {
        switch (+viewType[1])
        {
            case 0:
                eventListCalendar.addClass('viewTypeYear');
                break;

            case 1:
                eventListCalendar.addClass('viewTypeMonth');
                break;

            case 4:
                eventListCalendar.addClass('viewTypeWeek');
                break;
            default:
                break;
        }
    }

    function yearsShortener(width){
        jq$('.EventListCalendar a.yearViewHeader').each(function(){
                var year = jq$(this).html();

                var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                if (jq$(window).width() < width){
                    jq$(fullMonths).each(function(index, value){
                        year = year.replace(value, shortMonths[index]);
                    });
                };
            jq$(this).html(year);
        });
    }

    yearsShortener(520);

    $(window).load(function() {
        setMarginForDetails();
    });

    jq$(window).resize(function()
    {
        yearsShortener(520);
        setMarginForDetails();
    });

});