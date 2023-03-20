jq$(document).ready(function(){
    jq$('.repliesCount, .topicsCount').filter(function() {
        var text = $(this).text().replace(/\s*/g, '');
        return !text;
    }).remove();
    jq$('.lastReply > a').filter(function() {
        var text = $(this).text().replace(/\s*/g, '');
        return !text;
    }).replaceWith('<p class="nomessages">(no messages)</p>');
})