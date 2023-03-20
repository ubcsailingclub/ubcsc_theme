<$if (Model.ShowInvoice)$>
    <$if (Model.InvoiceAndPayment.AvailablePayOnlineBool)$>
        <div class="text">
	    	<$Model.InvoiceDetails.Text.PaymentInstructions$>
		</div>
    <$else$>
        <div class="text">
            <$Model.InvoiceDetails.Text.PaymentInstructions$>
        </div>        
        <div class="text">
            <$Model.InvoiceAndPayment.Text.WaitingForPayment$>
        </div>
    <$endif$>
	<$if (Model.InvoiceDetails.IsRecurringDocumentBool)$>
		<div class="text">
			<$Model.InvoiceDetails.Text.RecurringDescription$>
		</div>
    <$endif$>
	<$Model.InvoiceAndPayment.PaymentSystemsCardTypes:
	{                
		<div class="waPaymentSystemIcon <$it.Type$>" title="<$it.ToolTip$>"></div>
	}
    $>
    <$if (Model.InvoiceAndPayment.AvailablePayOnlineBool)$>
	    <div id="payButtonsMessageBoxGroup" class="buttons">
		    
			<$if (Model.InvoiceAndPayment.PayOnlineBool)$>
				<input type="submit" class="button" id="payOnlineButton" name="payOnlineButton" onclick="<$if (Model.InvoiceAndPayment.IsInWidgetMode)$>FinDocumentRenderer.DisablePaymentButtonsInWidget();<$else$>FinDocumentRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPayment.Text.PayOnlineButtonLabel$>">
			<$endif$>

			<$if (Model.InvoiceAndPayment.PayByCreditCardBool)$>
				<input type="submit" class="button" id="payByCreditCardButton" name="payByCreditCardButton" onclick="<$if (Model.InvoiceAndPayment.IsInWidgetMode)$>FinDocumentRenderer.DisablePaymentButtonsInWidget();<$else$>FinDocumentRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPayment.Text.PayByCreditCardButtonLabel$>">
			<$endif$>

			<$if (Model.InvoiceAndPayment.PayByExpressBool)$>
				<input type="submit" class="button" id="payByExpressButton" name="payByExpressButton" onclick="<$if (Model.InvoiceAndPayment.IsInWidgetMode)$>FinDocumentRenderer.DisablePaymentButtonsInWidget();<$else$>FinDocumentRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPayment.Text.PayByExpressButtonLabel$>">
			<$endif$>            
            <$if (Model.InvoiceAndPayment.AvailablePayOfflineBool)$>
                <$Model.InvoiceAndPayment.Text.OfflinePaymentAlsoAvailableTextLabel$>
            <$endif$>
	    </div>
    <$endif$>
<$endif$>

<$if (Model.ShowDonation)$>
    <$Model.InvoiceAndPayment.Text.PaymentInstructions$>
	<div class="buttons" id='payButtonsMessageBoxGroup'>
		<$if (Model.InvoiceAndPayment.PayOnlineBool)$>
			<input type="submit" class="button" id="payOnlineButton" name="payOnlineButton" onclick="<$if (Model.InvoiceAndPayment.IsInWidgetMode)$>FinDocumentRenderer.DisablePaymentButtonsInWidget();<$else$>FinDocumentRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPayment.Text.PayOnlineButtonLabel$>">
		<$endif$>

		<$if (Model.InvoiceAndPayment.PayByCreditCardBool)$>
			<input type="submit" class="button" id="payByCreditCardButton" name="payByCreditCardButton" onclick="<$if (Model.InvoiceAndPayment.IsInWidgetMode)$>FinDocumentRenderer.DisablePaymentButtonsInWidget();<$else$>FinDocumentRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPayment.Text.PayByCreditCardButtonLabel$>">
		<$endif$>

		<$if (Model.InvoiceAndPayment.PayByExpressBool)$>
			<input type="submit" class="button" id="payByExpressButton" name="payByExpressButton" onclick="<$if (Model.InvoiceAndPayment.IsInWidgetMode)$>FinDocumentRenderer.DisablePaymentButtonsInWidget();<$else$>FinDocumentRenderer.DisablePaymentButtons();<$endif$>"value="<$Model.InvoiceAndPayment.Text.PayByExpressButtonLabel$>">
		<$endif$>
		<input type="submit" class="button" value="<$Model.InvoiceAndPayment.Text.CancelButtonLabel$>" name="cancelDonationButton" id="cancelDonationButton">
	</div>
<$endif$>
