<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<div class="fb-comments" <$if (Model.Settings.urlToCommentOn == "")$>data-href="<$PageModel.Page.Url$>"<$else$>data-href="<$Model.Settings.urlToCommentOn$>"<$endif$> data-width="100%" data-numposts="<$Model.Settings.numberOfPosts$>" <$if (Model.Settings.colorScheme == "Dark")$>data-colorscheme="dark"<$endif$>></div>

<div id="fb-root"></div>
<script>
    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script>

<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>