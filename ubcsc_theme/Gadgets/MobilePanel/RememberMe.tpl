<$if (Model.Settings.ShowRememberMe)$>
	<div class="loginActionRememberMe">
		<input id="<$Model.Id$>_rememberMe" type="checkbox" name="rememberMe" tabindex="3" class="rememberMeCheckboxControl"/>
		<label for="<$Model.Id$>_rememberMe"><$Model.Login.Text.LabelRemember$></label>
	</div>
<$endif$>