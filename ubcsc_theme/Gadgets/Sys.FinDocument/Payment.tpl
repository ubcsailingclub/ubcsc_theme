<$control.Form(formBegin = "true", action = Model.Urls.FinDocumentAction, id = "idMemberPaymentDetailsForm", class="paymentDetailsForm", target=Model.SubmitFormTarget)$>
			<h1 class="pageTitle SystemPageTitle">
				<$Model.PaymentDetails.Text.PaymentTitleLabel$>
			</h1>

			<div class="formContainer">
				<div class="generalFieldsContainer">

					<$control.FormHelpers (caption="true", name=Model.PaymentDetails.Text.DetailsLabel)$>

					<$control.FormHelpers (sectionStart="true")$>

						<$control.FormHelpers (simpleText="true", name=Model.PaymentDetails.Text.PaymentAvailableBalanceLabel, value=Model.PaymentDetails.AvailableBalance)$>

						<div class="fieldContainer simpleTextContainer">
							<div class="fieldSubContainer labeledTextContainer">
								<div class="fieldLabel">
									<span>
										<$Model.PaymentDetails.Text.AmountLabel$>
									</span>
								</div>
								<div class="fieldBody">
									<span>
										<$Model.PaymentDetails.Amount$>
									</span>
									<$if (Model.PaymentDetails.IsRefundedPayment)$>
										<span>
											<$Model.PaymentDetails.Text.RefundedLabel$>
										</span>
									<$endif$>
								</div>
							</div>
						</div>

						<$control.FormHelpers (simpleText="true", name=Model.PaymentDetails.Text.DateLabel, value=Model.PaymentDetails.Date)$>

						<$control.FormHelpers (simpleText="true", name=Model.PaymentDetails.Text.TenderLabel, value=Model.PaymentDetails.Tender)$>


						<div class="fieldContainer simpleTextContainer">
							<div class="fieldSubContainer labeledTextContainer">
								<div class="fieldLabel">
									<span>
										<$Model.PaymentDetails.Text.PaymentReceivedFromLabel$>
									</span>
								</div>
								<div class="fieldBody">
									<span>
										<$if (Model.PaymentDetails.ReceivedFromFullNameIsEmpty)$>
											<$Model.PaymentDetails.ReceivedFromEmail$>
										<$else$>
											<$Model.PaymentDetails.ReceivedFrom$>
											<br />
											<$Model.PaymentDetails.ReceivedFromEmail$>
										<$endif$>
									</span>
								</div>
							</div>
						</div>

						<$if (Model.PaymentDetails.MemoIsNotEmpty)$>
							<$control.FormHelpers (simpleText="true", name=Model.PaymentDetails.Text.MemoLabel, value=Model.PaymentDetails.Memo)$>
						<$endif$>

					<$control.FormHelpers (sectionEnd="true")$>

					<$control.FormHelpers (caption="true", name=Model.PaymentDetails.Text.PaymentForLabel)$>

					<$control.FormHelpers (sectionStart="true")$>
						<$if (Model.PaymentDetails.ShowPaymentsDocument)$>
							<$Model.PaymentDetails.PaymentsDocument:
							{
								<div class="fieldContainer simpleTextContainer">
									<div class="fieldSubContainer labeledTextContainer">
										<div class="fieldLabel">
											<span>
												<$if (it.ShowAsLink)$>
													<a href="<$it.DocumentUrl$>"><$it.DocumentName$></a>
												<$else$>
													<$it.DocumentName$>
												<$endif$>

												<div class="date">
													<$it.Date$>
												</div>
											</span>
										</div>

										<div class="fieldBody">
											<span>
												<$it.Amount$>
												<div class="tender">
													<$it.Tender$>
												</div>
											</span>
										</div>
									</div>
								</div>

							}
							$>
						<$else$>
							<div class="fieldContainer simpleTextContainer">
								<div class="fieldSubContainer labeledTextContainer">
									<div class="fieldLabel emptyComment">
										<span>
											<$Model.PaymentDetails.Text.PaymentEmptyCommentLabel$>
										</span>
									</div>
								</div>
							</div>
						<$endif$>
					<$control.FormHelpers (sectionEnd="true")$>
				</div>
			</div>
<$control.Form(formEnd = "true")$>
