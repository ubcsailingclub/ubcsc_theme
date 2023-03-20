if (WA.Browser.isWebKitSafari)
{
    jq$(window).on('load', function()
    {
        jq$('.WaGadgetBlog .fixedHeight').dotdotdot();
    });
}
else
{
    jq$(document).ready( function()
    {
        jq$('.WaGadgetBlog .fixedHeight').dotdotdot();
    });
}