<$if(!Model.Success && Model.Text.ExternalLoginErrorMessage)$>
	<p class="oAuthError">
		<span class="mandatorySymbol"><$Model.Text.ExternalLoginErrorMessage$></span>
	</p>
<$endif$>
<$if(!Model.Success && Model.Text.ErrorMessage!= "")$>
	<p>
		<span class="mandatorySymbol"><$Model.Text.ErrorMessage$></span>
	</p>
<$endif$>


<$control.OAuthForm(id=Model.Id + "_oAuthForm")$>


<div class="authFormContainer">
<$control.Form(formBegin = "true", action = Model.Urls.Authenticate, id = "idLoginForm")$>
	<table cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;" class="loginPageTable" id="ctl00_ContentArea_loginViewControl_loginControl">
		<tr>
			<td>
				<div id="idLoginBox">
					<span class="mandatory"><$Model.Text.LabelEmail$></span>
					<span validatortype="required" controltovalidate="ctl00_ContentArea_loginViewControl_loginControl_userName" display="static" errormessage="<$Model.Text.EmailIsRequired$>" id="ctl00_ContentArea_loginViewControl_loginControl_userNameRequiredValidator" class="mandatorySymbol" style="visibility: <$if(!Model.Success)$><$if(Model.EmailEmpty)$>visible<$endif$><$else$>hidden<$endif$>;">*</span>
					<div>
						<input type="text" tabindex="1" id="ctl00_ContentArea_loginViewControl_loginControl_userName" maxlength="100" name="email" value="<$Model.Email$>" />
					</div>
				</div>
				<div id="idPasswordBox">
					<span class="mandatory"><$Model.Text.LabelPassword$></span>
					<span validatortype="required" controltovalidate="ctl00_ContentArea_loginViewControl_loginControl_Password" display="static" errormessage="<$Model.Text.PasswordIsRequired$>" id="ctl00_ContentArea_loginViewControl_loginControl_passwordRequiredValidator" class="mandatorySymbol" style="visibility: <$if(!Model.Success)$><$if(Model.PasswordEmpty)$>visible<$endif$><$else$>hidden<$endif$>;">*</span>
					<div>
						<input type="password" tabindex="1" id="ctl00_ContentArea_loginViewControl_loginControl_Password" maxlength="50" name="password" />
					</div>
				</div>
				<div id="idRememberMe">
					<input type="checkbox" tabindex="3" name="rememberMe" id="ctl00_ContentArea_loginViewControl_loginControl_RememberMe" />
					<label for="ctl00_ContentArea_loginViewControl_loginControl_RememberMe"><$Model.Text.LabelRemember$></label>
				</div>
				<$if(Model.Captcha.Enabled)$>
					<div id="idCaptcha">
						<$control.GoogleReCaptcha(Model=Model.Captcha)$>
					</div>
				<$endif$>
				<div id="idSubmitBox">
					<div id="idLoginButtonBox">
						<span>
							<input type="submit" class="loginButton" tabindex="1" id="ctl00_ContentArea_loginViewControl_loginControl_Login" value="<$Model.Text.ButtonLoginText$>" name="ctl00$ContentArea$loginViewControl$loginControl$Login" onclick="if (!WA.isWidgetMode && !browserInfo.clientCookiesEnabled()) {alert('<$Model.Text.WarningCookiesNotAvailable$>'); return false;}"/>
						</span>
					</div>
					<div id="idForgotLinkBox"><a id="ctl00_ContentArea_loginViewControl_loginControl_forgottenPassword" href="<$Model.Urls.ForgotPassword$>" tabindex="1"><$Model.Text.LinkForgotPasswordText$></a></div>
				</div>
			</td>
		</tr>
	</table>
	<input type="hidden" name="browserData" id="ctl00_ContentArea_loginViewControl_BrowserCapabilitiesData" />
	<input type="hidden" name="ReturnUrl" id="returnUrl" value="<$Model.Urls.Return$>" />

	<$if (Model.StayOnTheSamePage)$>

	   <input type="hidden" name="stayOnTheSamePage" value="true">

	<$endif$>




	<div id="ctl00_ContentArea_validationSummary" style="color: Red; display: none;"></div>
	<div style="margin: 0; padding: 0; overflow: hidden; width: 0; height: 0; font-size: 0;">&nbsp;</div>
<$control.Form(formEnd = "true")$>
</div>


<script type="text/javascript" language="javascript">
	var browserFields = jq$("input[name='browserData']");
	browserFields.each( function(idx, item){
		if (item && window.browserInfo) {
		item.value = browserInfo.getBrowserCapabilitiesData();
	}});

	jq$(document).ready(function() { jq$('#idLoginForm').FormValidate(); });
</script>
