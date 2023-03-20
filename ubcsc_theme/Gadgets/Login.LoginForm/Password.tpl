<div class="loginPassword">
	<$if (!Model.Settings.LabelsInside)$>
		<div class="loginPasswordLabel">
			<label for='<$Model.Id$>_password'>
				<$Model.Text.LabelPassword$>
				<span validatorType="required" controlToValidate="<$Model.Id$>_password" display="static" errorMessage="<$Model.Text.PasswordIsRequired$>" id="<$Model.Id$>_passwordRequiredValidator" class="mandatorySymbol loginPasswordValidationInfo" style="visibility:hidden;">*</span>
			</label>
		</div>
	<$endif$>
	<div class="loginPasswordTextBox">
		<input name="password" type="password" <$if (Model.Settings.LabelsInside)$>placeholder="<$Model.Text.LabelPassword$>" <$endif$>maxlength="50" id="<$Model.Id$>_password" tabindex="2" class="passwordTextBoxControl" autocomplete="off"/>
	</div>
</div>