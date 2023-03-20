<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<div class="socialProfileWrapper align<$Model.Settings.Align$> fixed<$Model.Settings.FixPosition$>">
	<ul class="orientation<$Model.Settings.Layout$>"><$if (Model.Settings.FacebookLink!="")$><li><a href="<$Model.Settings.FacebookLink$>" title="Facebook" class="Facebook" target="_blank"></a></li><$endif$><$if (Model.Settings.TwitterLink!="")$><li><a href="<$Model.Settings.TwitterLink$>" title="Twitter" class="Twitter" target="_blank"></a></li><$endif$><$if (Model.Settings.LinkedInLink!="")$><li><a href="<$Model.Settings.LinkedInLink$>" title="LinkedIn" class="LinkedIn" target="_blank"></a></li><$endif$><$if (Model.Settings.YouTubeLink!="")$><li><a href="<$Model.Settings.YouTubeLink$>" title="YouTube" class="YouTube" target="_blank"></a></li><$endif$><$if (Model.Settings.InstagramLink!="")$><li><a href="<$Model.Settings.InstagramLink$>" title="Instagram" class="Instagram" target="_blank"></a></li><$endif$><$if (Model.Settings.PinterestLink!="")$><li><a href="<$Model.Settings.PinterestLink$>" title="Pinterest" class="Pinterest" target="_blank"></a></li><$endif$></ul>
</div>
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>


<script>
    jq$(document).ready(function() {
        jq$(".socialProfileWrapper.fixedtrue").closest(".WaGadgetSocialProfile").addClass("fixed");
        jq$(".socialProfileWrapper.fixedtrue ul").removeClass("orientationHorizontal").addClass("orientationVertical");

        // new stuff
        var mobileResolution = 959,
                innerPadding = 10,
                target = jq$('#<$Model.Id$>.WaGadgetSocialProfile.fixed'),
                stickyAnchor = target.closest('.WaPlaceHolder');

        if( target && stickyAnchor.length > 0 )
        {
            makeSocialSticky(stickyAnchor, target);

            jq$(window).scroll( function()
            {
                makeSocialSticky(stickyAnchor, target);
            });

            jq$(window).resize( function()
            {
                makeSocialSticky(stickyAnchor, target);
            });

            makeSocialSticky(stickyAnchor, target);
        }

        function makeSocialSticky(anchor, target){
            var anchorOffset = anchor.offset().top,
                windowTop = jq$(window).scrollTop(),
                styleNoneMargin = (target.hasClass('gadgetStyleNone'))? 6:0;


            if ( window.innerWidth < mobileResolution){ // for inner position
                if (windowTop > anchorOffset+innerPadding && target.height() < jq$(window).height()) {
                    var innerOffset = anchor.offset().left + anchor.width() - target.width() - innerPadding;
                    target.addClass('sticky').css("left", innerOffset).css("right", "auto");
                }
                else{
                    target.removeClass('sticky').css("left","").css("right","");
                }
            }
            else{ //for outer position
                if (windowTop > anchorOffset && target.height() < jq$(window).height()) {
                    target.addClass('sticky').css("left", anchor.offset().left + anchor.width() + styleNoneMargin).css("right", "auto");
                }
                else{
                    target.removeClass('sticky').css("left","").css("right","");
                }
            }


        };
        //end of new stuff
    });
</script>
