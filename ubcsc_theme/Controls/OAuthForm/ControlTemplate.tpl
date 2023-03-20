<$if (!PageModel.IsWidgetMode)$>
  <div class="openAuthFormContainer">
		<$control.Form(formBegin="true", action=Model.Urls.AuthenticateExternal, id=id, class="oAuthForm")$>
			<div id="<$Model.Id$>_container" class="oAuthButtonsContainer">
			  <a class="wa-authenticateLoginLink facebook" provider="Facebook">
					<span class="authenticateLoginIcon" provider="Facebook"></span>
					<span class="authenticateLoginText" provider="Facebook">Log in with Facebook</span>
			  </a><a class="wa-authenticateLoginLink googlePlus" provider="GooglePlus">
					<span class="authenticateLoginIcon" provider="GooglePlus"></span>
					<span class="authenticateLoginText" provider="GooglePlus">Log in with Google</span>
			  </a>
			  <input type="hidden" name="ReturnUrl" value="<$Model.Urls.Return$>" />
			  <input type="hidden" name="Provider" class="oAuthProvider" value="Undefined" />   
              <input type="hidden" id="<$Model.Id$>_browserCapabilities" name="browserCapabilities" />  
			</div>
		<$control.Form(formEnd = "true")$>
	</div>
 
    <script type="text/javascript" language="javascript">
        jq$(document).ready(function()
		{
            new OAuthButtons({id:'<$Model.Id$>', formId: '<$id$>'});
		});
    </script>
<$endif$>