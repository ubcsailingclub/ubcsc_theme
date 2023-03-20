<div class="loginUserName">
	<$if (!Model.Settings.LabelsInside)$>
		<div class="loginUserNameLabel">
			<label for='<$Model.Id$>_userName'>
				<$Model.Text.LabelEmail$>
				<span validatorType="required" controlToValidate="<$Model.Id$>_userName" display="static" errorMessage="<$Model.Text.EmailIsRequired$>" id="<$Model.Id$>_userNameRequiredValidator" class="mandatorySymbol loginUserNameValidationInfo" style="visibility:hidden;">*</span>
			</label>
		</div>
	<$endif$>
	<div class="loginUserNameTextBox">
		<input name="email" type="text" maxlength="100" <$if (Model.Settings.LabelsInside)$>placeholder="<$Model.Text.LabelEmail$>" <$endif$> id="<$Model.Id$>_userName" tabindex="1" class="emailTextBoxControl"/>
	</div>
</div>