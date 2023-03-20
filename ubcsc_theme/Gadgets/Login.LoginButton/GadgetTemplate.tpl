<$if(!Model.IsHiddenOnPage)$>
<div class="loginButtonBackground"></div>
<div class="loginButtonWrapper align<$Model.Settings.Align$>">
  <$if(Model.Security.IsAuthenticated)$>
  <$if(Model.IsLapsedMembership)$>
    <div class="loginBoxLapsedMembership"><$Model.Text.LabelLapsed$></div>
  <$endif$>
  <div class="loginBoxProfileLink">
    <$if (!Model.IsSystemAdminView)$>
    <a href=<$if (Model.IsAdminView)$>"<$Model.Urls.ContactDetails$>" target="_blank"<$else$>"<$Model.Urls.Profile$>"<$endif$>><$Model.UserFullName$></a>
    <$endif$>
  </div>
  <a class="loginBoxChangePassword" href="<$Model.Urls.ChangePassword$>"<$if (Model.IsAdminView)$> target="_blank"<$endif$>><$Model.Text.LinkChangePasswordText$></a>
  <a class="loginBoxLogout" <$if (Model.IsAdminView)$>target="_top"<$else$><$endif$> href="<$Model.Urls.SignOut$>"><$Model.Text.LinkSignOutText$></a>
  <$else$>
  <div class="loginBoxLinkContainer">
    <a class="loginBoxLinkButton" href="<$Model.Urls.Authenticate$>"><$Model.Text.LinkSignInText$></a>
  </div>
  <$endif$>
</div>
<script type="text/javascript">
  jq$(function() {
    var gadgetLoginButton = jq$('#<$Model.Id$>');
    var leftOffset;
    
    function resizeBgLogin() {
      // background track
      leftOffset = (gadgetLoginButton.closest('.WaLayoutTable').length > 0) ? gadgetLoginButton.closest('.WaLayoutTable').width() : gadgetLoginButton.width();
        
      gadgetLoginButton.find('.loginButtonBackground').css({
        'width': jq$('body').width(),
        'left': ( ( jq$('body').width() - leftOffset ) * -0.5 )
      });
    }

    resizeBgLogin();
    jq$(window).resize(function() { resizeBgLogin(); });
  });
</script>
<$endif$>