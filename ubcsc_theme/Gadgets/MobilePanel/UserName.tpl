<div class="loginUserName">
	<$if (!Model.Settings.LabelsInside)$>
		<div class="loginUserNameLabel">
			<label for='<$Model.Id$>_userName'>
				<$Model.Login.Text.LabelEmail$>
				<span validatorType="required" controlToValidate="<$Model.Id$>_userName" errorMessage="<$Model.Login.Text.EmailIsRequired$>" id="<$Model.Id$>_userNameRequiredValidator" class="mandatorySymbol loginUserNameValidationInfo">*</span>
			</label>
		</div>
	<$endif$>
	<div class="loginUserNameTextBox">
		<input name="email" type="text" maxlength="100" <$if (Model.Settings.LabelsInside)$>placeholder="<$Model.Login.Text.LabelEmail$>" <$endif$> id="<$Model.Id$>_userName" tabindex="1" class="emailTextBoxControl"/>
	</div>
</div>