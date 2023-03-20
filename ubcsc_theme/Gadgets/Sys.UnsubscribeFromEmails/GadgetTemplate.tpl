<p>
    <$if(Model.Result.IsUndefined)$>
		<$if(Model.UnsubscribeSource.IsNewsletters)$>
			<$Model.Text.InitialMessageForNewsletters$>
		 <$else$>
			<$if(Model.UnsubscribeSource.IsReminders)$>
				<$Model.Text.InitialMessageForReminders$>
			<$else$>
				<$if(Model.UnsubscribeSource.IsTopic)$>
					<$Model.Text.InitialMessageForForumAndTopic$>
				<$else$>
					<$if(Model.UnsubscribeSource.IsForum)$>
						<$Model.Text.InitialMessageForForumAndTopic$>
					<$endif$>
				<$endif$>
			<$endif$>
		<$endif$>
    <$endif$>
</p>
<$if(Model.Result.IsUndefined)$>
    <$control.Form(formBegin = "true", action = Model.Urls.SubmitUrl)$>
    <p>
        <input type="submit" name="confirmBtn" value="<$Model.Text.SubmitButtonText$>" id="ctl00_ContentArea_ConfirmBtn">&nbsp;
        <input type="submit" name="cancelBtn" value="<$Model.Text.CancelButtonText$>" id="ctl00_ContentArea_CancelBtn">
    </p>
    <$control.Form(formEnd = "true")$>
<$endif$>

<$if(Model.Result.IsSucceded)$>
    <$if(Model.IsMember)$>
        <$Model.Text.SuccededMessage$>
    <$else$>
        <$Model.Text.SuccededMessageNotMember$>
    <$endif$>
<$else$>
    <$if(Model.Result.IsError)$>
        <$control.MessageBox(Text=Model.Text.IncorrectUrlMessage, WrapText="True", ShowHeader="True", HeaderText = Model.Text.ErrorMessageHeader, Warning="True", OuterContainerId="ctl00_ContentArea_UnsubscibeErrorWarning_idConfirmWindow", StyleContainerId="ctl00_ContentArea_UnsubscibeErrorWarning_idConfirmWindowStyle", InnerPId="ctl00_ContentArea_UnsubscibeErrorWarning_messageHeader", HeaderSpanId="ctl00_ContentArea_UnsubscibeErrorWarning_messageHeader",
        TextDivId="ctl00_ContentArea_UnsubscibeErrorWarning_messageText",InnerSpanId="ctl00_ContentArea_UnsubscibeErrorWarning_messageText")$>
    <$else$>
        <$if(Model.Result.IsErrorDuringSave)$>
            <$control.MessageBox(Text=Model.Text.FailedMessage, WrapText="True", ShowHeader="True", HeaderText = Model.Text.ErrorMessageHeader, Warning="True", OuterContainerId="ctl00_ContentArea_UnsubscibeErrorWarning_idConfirmWindow", StyleContainerId="ctl00_ContentArea_UnsubscibeErrorWarning_idConfirmWindowStyle", InnerPId="ctl00_ContentArea_UnsubscibeErrorWarning_messageHeader", HeaderSpanId="ctl00_ContentArea_UnsubscibeErrorWarning_messageHeader",
            TextDivId="ctl00_ContentArea_UnsubscibeErrorWarning_messageText",InnerSpanId="ctl00_ContentArea_UnsubscibeErrorWarning_messageText")$>
        <$endif$>
    <$endif$>
<$endif$>
