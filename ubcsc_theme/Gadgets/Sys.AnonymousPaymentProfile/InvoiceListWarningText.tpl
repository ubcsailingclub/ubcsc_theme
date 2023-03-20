<div class="text" id="waitingForPaymentMessageBoxGroup" style="display:none">
    <$Model.InvoiceAndPaymentList.Text.WaitingForPayment$>
</div>

<div class="text" id="noInvoicesMessageBoxGroup" style="display:none">
	<$Model.InvoiceAndPaymentList.Text.NoInvoicesSelectedLabel$>
</div>

<div class="text" id="recurringInvoiceOnlyMessageBoxGroup" style="display:none">
	<$Model.InvoiceAndPaymentList.Text.PayRecurringInvoiceLabel$>
</div>

<div class="text" id="paymentInstructionsBoxGroup" style="display:none">
  <$Model.GeneralPaymentInstructions$>
</div>

<div class="buttons" id="payButtonsMessageBoxGroup" style="display:none">
	<div class="waPaymentSystemsIconsBox">
	<$Model.InvoiceAndPaymentList.PaymentSystemsCardTypes:
	{
		<div class="waPaymentSystemIcon <$it.Type$>" title="<$it.ToolTip$>"></div>
	}
	$>
	</div>
  <$if (Model.InvoiceAndPaymentList.PayOnlineBool)$>
		<input type="submit" class="button" id="payOnlineButton" name="payOnlineButton" onclick="<$if (Model.InvoiceAndPaymentList.IsInWidgetMode)$>InvoiceListRenderer.DisablePaymentButtonsInWidget();<$else$>InvoiceListRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPaymentList.Text.PayOnlineButtonLabel$>"/>
	<$endif$>
	<$if (Model.InvoiceAndPaymentList.PayByCreditCardBool)$>
		<input type="submit" class="button" id="payByCreditCardButton" name="payByCreditCardButton" onclick="<$if (Model.InvoiceAndPaymentList.IsInWidgetMode)$>InvoiceListRenderer.DisablePaymentButtonsInWidget();<$else$>InvoiceListRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPaymentList.Text.PayByCreditCardButtonLabel$>"/>
	<$endif$>
	<$if (Model.InvoiceAndPaymentList.PayByExpressBool)$>
		<input type="submit" class="button" id="payByExpressButton" name="payByExpressButton" onclick="<$if (Model.InvoiceAndPaymentList.IsInWidgetMode)$>InvoiceListRenderer.DisablePaymentButtonsInWidget();<$else$>InvoiceListRenderer.DisablePaymentButtons();<$endif$>" value="<$Model.InvoiceAndPaymentList.Text.PayByExpressButtonLabel$>"/>
	<$endif$>	
	<$if (Model.InvoiceAndPaymentList.IsOpenRecurringDocumentsExists)$>
		<$Model.InvoiceAndPaymentList.Text.InvoicesSelectedRecurringNote$>
	<$endif$>
</div>

<div class="buttons" id="payByCreditOnlyButtonsMessageBoxGroup" style="display:none">
	<input class="button" id="payButton" name="payButton" onclick="InvoiceListRenderer.PreventNewWindow()" type="submit" value="<$Model.InvoiceAndPaymentList.Text.PayButtonLabel$>"/>
</div>
<input id="selectedDocsHidden" name="selectedDocsHidden"  type="hidden" value=""/>
<input id="selectedCreditHidden" name="selectedCreditHidden"  type="hidden" value=""/>