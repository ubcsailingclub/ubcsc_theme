<$if(!Model.IsHiddenOnPage)$>

<div class="mobilePanel">
	
	<div class="mobilePanelButton buttonMenu" title="Menu">Menu</div>
	<$if(Model.Login.CanLoginAsAdmin && !Model.Login.IsAdminView)$>
		<a class="mobilePanelButton buttonAdmin" title="Admin view" href="<$Model.Urls.SwitchToAdminUrl$>">Admin view</a>
	<$endif$>

	<$if(Model.Login.IsAuthenticated)$>
		<div class="mobilePanelButton buttonLogin logged" title="<$if(Model.Login.IsLapsedMembership)$><$Model.Login.Text.LabelLapsed$> <$endif$><$Model.Login.UserFullName$>"><$if(Model.Login.IsLapsedMembership)$><$Model.Login.Text.LabelLapsed$> <$endif$><$Model.Login.UserFullName$></div>
	<$else$>
		<div class="mobilePanelButton buttonLogin" title="<$Model.Login.Text.ButtonLoginText$>"><$Model.Login.Text.ButtonLoginText$></div>
	<$endif$>

	<div class="menuInner">
		<ul class="firstLevel">
			<$Model.Menu.Items:Item()$>
		</ul>
	</div>

	<div class="loginInner">
		<$if(Model.Login.IsAuthenticated && !Model.Login.IsSitePreviewMode)$>
		<div class="loginContainerAuthenticated">
			<div class="labelBox loggedName">
				<$if(Model.Login.IsLapsedMembership)$><$Model.Login.Text.LabelLapsed$> <$endif$><$Model.Login.UserFullName$>
			</div>
			<$if (!Model.Login.IsSystemAdminView)$>
			<div class="labelBox viewProfile">
				<a href="<$if (Model.Login.IsAdminView)$><$Model.Urls.ContactDetails$><$else$><$Model.Urls.Profile$><$endif$>"><$Model.Login.Text.LinkProfileText$></a>
			</div>
			<$endif$>
			<div class="labelBox changePassword">
				<a href="<$Model.Urls.ChangePassword$>"><$Model.Login.Text.LinkChangePasswordText$></a>
			</div>
			<div class="labelBox loggedAction">
				<a href="<$Model.Urls.SignOut$>" class="logout"><$Model.Login.Text.LinkSignOutText$></a>
			</div>
		</div>
		<$else$>
		<div class="loginContainerForm oAuthIs<$Model.Settings.ShowOpenAuthButtons$>">
			<$if(Model.Settings.ShowOpenAuthButtons)$>
				<$control.OAuthForm(id=Model.Id + "_oAuthForm")$>
			<$endif$>
			<$control.Form(formBegin = "true", action = Model.Urls.Authenticate, id = Model.Id + "_form", class="generalLoginBox")$>
				<input type="hidden" name="ReturnUrl" id="<$Model.Id$>_returnUrl" value="<$Model.Urls.Return$>">
				<input type="hidden" name="browserData" id="<$Model.Id$>_browserField">
				<$UserName()$>
				<$Password()$>
                <$control.GoogleReCaptcha(Model=Model.Login.Captcha)$>
				<$RememberMe()$>
				<$ForgotPassword()$>
				<$Button()$>
			<$control.Form(formEnd = "true")$>
		</div>
		<$endif$>
	</div>

</div>

<$endif$>



<script type="text/javascript">

jq$(function()
{
	var gadget = jq$('#<$Model.Id$>'),
		menuContainer = gadget.find('.menuInner'),
		loginContainer = gadget.find('.loginInner');

	gadget.find('.buttonMenu').on("click",function()
	{
		menuContainer.toggle();
		loginContainer.hide();
		jq$(this).toggleClass('active');
        jq$('.buttonLogin').removeClass('active');
		return false;
	});

	gadget.find('.buttonLogin').on("click",function()
	{
		loginContainer.toggle();
		menuContainer.hide();
		jq$(this).toggleClass('active');
        jq$('.buttonMenu').removeClass('active');
		return false;
	});

	gadget.find('.mobilePanel').on("click",function(event)
	{
        if( !(jq$(event.target).parents('.loginInner').size() || event.target.className == 'loginInner') )
        {
            menuContainer.hide();
            loginContainer.hide();
            jq$('.buttonLogin').removeClass('active');
            jq$('.buttonMenu').removeClass('active');
        }

        event.stopPropagation();
	});

	jq$('body').on("click",function()
	{
		menuContainer.hide();
		loginContainer.hide();
		jq$('.buttonLogin').removeClass('active');
        jq$('.buttonMenu').removeClass('active');
	});


	// login
	var browserField = document.getElementById('<$Model.Id$>' + '_browserField');

	if (browserField)
	{
		browserField.value = browserInfo.getBrowserCapabilitiesData();
	}

	jq$('#<$Model.Id$>' + '_form').FormValidate();
	jq$('.WaGadgetMobilePanel form').attr('data-disableInAdminMode', 'false');

});

</script>