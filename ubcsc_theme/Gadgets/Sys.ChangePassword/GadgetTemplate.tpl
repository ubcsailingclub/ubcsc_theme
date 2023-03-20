<div class="cornersContainer"><$control.Divs(cornersDivsTop = "true")$></div>
<div class="introContainer">
	<$control.Divs(designDivsBegin = "true")$>
	<$Model.Text.Intro$>
	<div class="clearEndContainer"></div>
	<$control.Divs(designDivsEnd = "true")$>
</div>
<div class="cornersContainer"><$control.Divs(cornersDivsBottom = "true")$></div>   

<div class="formOuterContainer">
	<div class="cornersContainer"><$control.Divs(cornersDivsTop = "true")$></div>
	<div class="formContainer"><$control.Divs(designDivsBegin = "true")$>
		<div class="generalFieldsOuterContainer">
			<div class="cornersContainer"><$control.Divs(cornersDivsTop = "true")$></div>
			<div class="generalFieldsContainer"><$control.Divs(designDivsBegin = "true")$>
				<$if(Model.Result.DisabledByAdmin)$>
					<$control.MessageBox(Text=Model.Text.DisabledByAdmin, Error="True")$>
				<$else$>
					<$if(Model.Result.Success)$>
						<$control.MessageBox(Text=Model.Text.Success, Success="True")$>
						<a href="<$Model.Text.BackUrl$>"><$Model.Text.BackLink$></a>						
					<$else$>

						<$if(Model.Result.Error)$>
							<$control.MessageBox(Text=Model.Text.Error, Error="True")$>
						<$else$>
							<$control.Form(formBegin = "true", action = Model.Urls.ChangePassword, id = "idRequestForm")$>
							
								<input type="hidden" name="ReturnUrl" value="<$Model.Urls.Return$>" />

								<div id="idOldPasswordContainer" class="fieldContainer textFieldContainer">
									<div class="fieldSubContainer singleStringContainer">
										<table>
											<tr>
												<td class="left">
													<div class="fieldLabel">
														<span validateOnLoad="true" validatorType="required" controlToValidate="ctl00_ContentArea_OldPasswordTextBox" display="static" errorMessage="<$Model.Text.CurrentPasswordRequired$>" class="mandatorySymbol" style="visibility:hidden;" id="ctl00_ContentArea_OldPasswordRfv">*</span><strong><label for="ctl00_ContentArea_OldPasswordTextBox" id="ctl00_ContentArea_OldPasswordLabel"><$Model.Text.CurrentPasswordLabel$></label></strong>
													</div>
												</td>
												<td class="right">
													<div class="fieldBody">
														<input name="oldPassword" maxlength="50" id="ctl00_ContentArea_OldPasswordTextBox" tabindex="1" class="typeText" autocomplete="off" type="password">
														<span style="display: <$if(Model.Result.InvalidOldPassword)$>inline<$else$>none<$endif$>;" class="validationError" id="ctl00_ContentArea_OldPasswordCv">
															<$Model.Text.InvalidOldPassword$>
														</span>
													</div>
												</td>
											</tr>
										</table>

									</div>
								</div>
								<div id="idNewPasswordContainer" class="fieldContainer textFieldContainer">
									<div class="fieldSubContainer singleStringContainer">
										<table>
											<tr>
												<td class="left">
													<div class="fieldLabel">
														<span validateOnLoad="true" validatorType="required" controlToValidate="ctl00_ContentArea_NewPasswordTextBox" display="static" errorMessage="<$Model.Text.NewPasswordRequired$>" class="mandatorySymbol" style="visibility:hidden;" id="ctl00_ContentArea_NewPasswordRfv">*</span><strong><label for="ctl00_ContentArea_NewPasswordTextBox" id="ctl00_ContentArea_NewPasswordLabel"><$Model.Text.NewPasswordLabel$></label></strong>
													</div>
												</td>
												<td class="right">
													<div class="fieldBody">
<div style="position: relative;">
														<input name="newPassword" maxlength="50" id="ctl00_ContentArea_NewPasswordTextBox" tabindex="2" class="typeText" autocomplete="off" type="password">
<div id="passwordMeterContainer"></div>

                                                        <$if(Model.Result.PasswordStrengthInvalid)$>
                                                        <span validatorType="passwordStrength" errorMessage="<$Model.Text.PasswordStrengthInvalid$>" controlToValidate="ctl00_ContentArea_NewPasswordTextBox" id="ctl00_ContentArea_PasswordStrengthCustomValidator" class="validationError" style="display: <$if(Model.Result.PasswordStrengthInvalid)$>inline-block<$else$>none<$endif$>;">
                                                            <$Model.Text.PasswordStrengthInvalid$>
                                                        </span>
														<$else$>
														<span validatorType="passwordContainSpaces" errorMessage="<$Model.Text.PasswordContainSpaces$>" controlToValidate="ctl00_ContentArea_NewPasswordTextBox" id="ctl00_ContentArea_PasswordContainSpacesCustomValidator" class="validationError" style="display: <$if(Model.Result.PasswordContainSpaces)$>inline-block<$else$>none<$endif$>;">
															<$Model.Text.PasswordContainSpaces$>
														</span>
														<$endif$>

													</div>
</div>
												</td>
											</tr>
										</table>
									</div>
								</div>

								<div id="idNewPasswordConfirmContainer" class="fieldContainer textFieldContainer">
									<div class="fieldSubContainer singleStringContainer">
										<table>
											<tr>
												<td class="left">
													<div class="fieldLabel">
														<span validateOnLoad="true" validatorType="required" controlToValidate="ctl00_ContentArea_ConfirmNewPasswordTextBox" display="static" errorMessage="<$Model.Text.NewPasswordConfirmationRequired$>" class="mandatorySymbol" style="visibility:hidden;" id="ctl00_ContentArea_NewPasswordConfirmRfv">*</span><strong><label for="ctl00_ContentArea_ConfirmNewPasswordTextBox" id="ctl00_ContentArea_Label1"><$Model.Text.NewPasswordConfirmLabel$></label></strong>
													</div>
												</td>
												<td class="right">
													<div class="fieldBody">
														<input name="newPasswordConfirm" maxlength="50" id="ctl00_ContentArea_ConfirmNewPasswordTextBox" tabindex="3" class="typeText" autocomplete="off" type="password">
														<span validatorType="passwordCompare" controlToValidate="ctl00_ContentArea_ConfirmNewPasswordTextBox" errorMessage="<$Model.Text.PasswordsDoNotMatch$>" display="static" compareWith="ctl00_ContentArea_NewPasswordTextBox" id="ctl00_ContentArea_NewPasswordsCompareValidator" class="validationError" style="visibility: <$if(Model.Result.PasswordsDoNotMatch)$>visible<$else$>hidden<$endif$>;">
														<$Model.Text.PasswordsDoNotMatch$>
														</span>
													</div>
												</td>
											</tr>
										</table>
									</div>
								</div>

								<div id="idNewPasswordConfirmContainer" class="fieldContainer textFieldContainer">
									<div class="fieldSubContainer singleStringContainer">
										<table>
											<tr>
												<td class="left">
													<div class="fieldLabel">
													
													</div>
												</td>
												<td class="right">
													<div class="fieldBody">
<div id="pswmeter-message">
                  </div>
													</div>
												</td>
											</tr>
										</table>
									</div>
								</div>


								<div id="idActionButtonsContainer" class="fieldContainer textFieldContainer">
									<div class="fieldSubContainer singleStringContainer">
										<table>
											<tr>
												<td class="left">
													<div class="fieldLabel">&nbsp;</div>
												</td>
												<td class="right">
													<div class="fieldBody">
														<input name="submitNewPasswordButton" value="<$Model.Text.ButtonSubmit$>" id="ctl00_ContentArea_SubmitNewPasswordBtn" tabindex="4" type="submit" >
														<input name="cancelButton" causesValidation="false" value="<$Model.Text.ButtonCancel$>" id="ctl00_ContentArea_CancelBtn" tabindex="5" type="submit">
													</div>
												</td>
											</tr>
										</table>
									</div>
								</div>

							<$control.Form(formEnd = "true")$>

							<script language="javascript" type="text/javascript">
								jq$(document).ready(function () {
								jq$('#idRequestForm').FormValidate({ ignoreSpace: true });
								});

							</script>

						<$endif$>

					<$endif$>

				<$endif$>

				<div class="clearEndContainer"></div>
			<$control.Divs(designDivsEnd = "true")$></div>
			<div class="cornersContainer"><$control.Divs(cornersDivsBottom = "true")$></div>

		</div>
	<$control.Divs(designDivsEnd = "true")$></div>
	<div class="cornersContainer"><$control.Divs(cornersDivsBottom = "true")$></div>
</div>
<script>
 PasswordStrengthValidator.Init({
          containerElement: '#passwordMeterContainer',
          messageContainer: '#pswmeter-message',
          passwordInput: '#ctl00_ContentArea_NewPasswordTextBox',
          height: 2,
          borderRadius: 0
      });
</script>