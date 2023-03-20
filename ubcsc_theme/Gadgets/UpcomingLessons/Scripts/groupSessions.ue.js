jq$(document).ready(function() {
    if(!jq$('.WaGadgetUpcomingEvents').size()) {
        return;
    }

    jq$('.WaGadgetUpcomingEvents .lessonTag a:contains("(session")').each(function() {
        var text = $(this).html();
        var match = text.match(/\(session ([0-9]+) of ([0-9]+)\)/);
        var sessionNumber = match[1];
        var sessionTotal = match[2];
        if (sessionNumber == 1) {
            var newText = text.replace(/session[\w\s]+/, sessionTotal + " sessions");
            $(this).html(newText); 
        } else {
            $(this).parent().parent().hide();
            // TODO: If we've removed all list items, display the empty list message
            // $(this).parent().parent().html('<div class="title">No upcoming events</div>'); 
        }
    });
});
