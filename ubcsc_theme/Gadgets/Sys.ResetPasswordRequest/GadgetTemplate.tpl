<$if (Model.Result.EmailSent)$>
<$control.MessageBox(Text=Model.Text.EmailSent, WrapText="True", Info="True", OuterContainerId="ctl00_ContentArea_messageBox_idConfirmWindow", StyleContainerId="ctl00_ContentArea_messageBox_idConfirmWindowStyle", InnerPId="ctl00_ContentArea_messageBox_messageTextP", InnerSpanId="ctl00_ContentArea_messageBox_messageText")$>
<a href="<$Model.Text.BackUrl$>"><$Model.Text.BackLink$></a>
<$else$>
<$control.Form(formBegin = "true", action = Model.Urls.PasswordRequest, id = "idRequestForm")$>
    <$if (Model.ShowIntro)$>
    <$control.MessageBox(Text=Model.Text.Intro, WrapText="True",Info="True", OuterContainerId="ctl00_ContentArea_messageBox_idConfirmWindow", StyleContainerId="ctl00_ContentArea_messageBox_idConfirmWindowStyle", InnerPId="ctl00_ContentArea_messageBox_messageTextP", InnerSpanId="ctl00_ContentArea_messageBox_messageText")$>
    <$endif$>
    <$if (Model.Result.Error)$>
    <$control.MessageBox(ShowHeader="True", HeaderText=Model.Text.ErrorHeader, Text=Model.Text.ResultMessage, WrapText="True", Error="True", OuterContainerId="ctl00_ContentArea_messageBox_idConfirmWindow", StyleContainerId="ctl00_ContentArea_messageBox_idConfirmWindowStyle", InnerPId="ctl00_ContentArea_messageBox_messageTextP", InnerSpanId="ctl00_ContentArea_messageBox_messageText")$>
    <$endif$>
    <$if (Model.Result.InvalidEmail)$>
    <$control.MessageBox(ShowHeader="True", HeaderText=Model.Text.ErrorHeader, Text=Model.Text.InvalidEmail, WrapText="True", Error="True", OuterContainerId="ctl00_ContentArea_messageBox_idConfirmWindow", StyleContainerId="ctl00_ContentArea_messageBox_idConfirmWindowStyle", InnerPId="ctl00_ContentArea_messageBox_messageTextP", InnerSpanId="ctl00_ContentArea_messageBox_messageText")$>
    <$endif$>
    <div class="cornersContainer"><$control.Divs(cornersDivsTop = "true")$></div>
    <div class="formContainer">
        <$control.Divs(designDivsBegin = "true")$>
	    <div class="generalFieldsOuterContainer">
            <div class="cornersContainer"><$control.Divs(cornersDivsTop = "true")$></div>
            <div class="generalFieldsContainer"><$control.Divs(designDivsBegin = "true")$>
                <div id="idEmailField" class="fieldContainer textFieldContainer">
					<div class="fieldSubContainer singleStringContainer">
						<table>
							<tr>
								<td class="left">
									<div class="fieldLabel">
										<span validateOnLoad="true" validatorType="required" controlToValidate="ctl00_ContentArea_tbEmail" display="static" errorMessage="<$Model.Text.EmailIsRequired$>" class="mandatorySymbol" style="visibility:hidden;" id="ctl00_ContentArea_rfv">*</span><strong><span><$Model.Text.EmailLabel$></span></strong>
									</div>
								</td>
								<td class="right">
									<div class="fieldBody">
										<input name="email" maxlength="100" id="ctl00_ContentArea_tbEmail" class="typeText" type="text" value="<$Model.Email$>" />
										<span validatorType="email" controlToValidate="ctl00_ContentArea_tbEmail" display="static" errorMessage="<$(Model.Text.InvalidEmail)$>" class="mandatorySymbol" style="visibility:hidden;" id="ctl00_ContentArea_cvEmailFormat">
										<$(Model.Text.InvalidEmail)$>
										</span>
									</div>
								</td>
							</tr>
						</table>
					</div>
                </div>
                <$control.GoogleReCaptchaSection(Model=Model.Captcha)$>
                <div id="idButtonField" class="fieldContainer textFieldContainer">
					<div class="fieldSubContainer singleStringContainer">
						<table>
							<tr>
								<td class="left">
									<div class="fieldLabel"></div>
								</td>
								<td class="right">
									<div class="fieldBody">
										<input name="btnSubmitRequest" value="<$(Model.Text.SubmitButton)$>" id="ctl00_ContentArea_btnSubmitRequest" class="typeButton" type="submit" />
									</div>
								</td>
							</tr>
						</table>
					</div>
                </div>
                <div class="clearEndContainer"></div>
            <$control.Divs(designDivsEnd = "true")$></div>
            <div class="cornersContainer"><$control.Divs(cornersDivsBottom = "true")$></div>
        </div>
        <$control.Divs(designDivsEnd = "true")$>
    </div>
    <div class="cornersContainer"><$control.Divs(cornersDivsBottom = "true")$></div>
    <input type="hidden" name="ReturnUrl" value="<$Model.Urls.ReturnUrl$>" />
<$control.Form(formEnd = "true")$>
<script language="javascript" type="text/javascript">
    jq$(document).ready(function() {
        jq$('#idRequestForm').FormValidate();

        var emailInput = jq$('#ctl00_ContentArea_tbEmail');
        emailInput.focus();
        emailInput.select();
    });
</script>
<$endif$>