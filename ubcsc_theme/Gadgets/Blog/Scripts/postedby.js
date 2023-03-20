jq$(document).ready(function(){
    if (jq$('.WaGadgetBlogStateDetails').length > 0)
    {
        jq$('.WaGadgetBlogStateDetails .blogEntryOuterContainer .postedByLink').append(" on ");
        jq$('.WaGadgetBlogStateDetails .blogEntryOuterContainer .blogEntryContainer .postedOn').appendTo('.WaGadgetBlogStateDetails .postedByLink');
    }
});
