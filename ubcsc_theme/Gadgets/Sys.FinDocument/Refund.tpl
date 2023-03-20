<$control.Form(formBegin = "true", action = Model.Urls.FinDocumentAction, id = "idMemberRefundDetailsForm", class="paymentDetailsForm", target=Model.SubmitFormTarget)$>
        <h1 class="pageTitle SystemPageTitle">
            <$Model.RefundDetails.Text.RefundTitleLabel$>
        </h1>

        <div class="formContainer">
            <div class="generalFieldsContainer">

                <$control.FormHelpers (caption="true", name=Model.RefundDetails.Text.DetailsLabel)$>

                <$control.FormHelpers (sectionStart="true")$>

                <div class="fieldContainer simpleTextContainer">
                    <div class="fieldSubContainer labeledTextContainer">
                        <$if (Model.RefundDetails.IsRefundUnSettled)$>
                        <div class="fieldLabel warning">
                        <$else$>
                        <div class="fieldLabel">
                        <$endif$>
                           <span>
                                <$Model.RefundDetails.Text.AmountLabel$>
                            </span>
                         </div>
                        <$if (Model.RefundDetails.IsRefundUnSettled)$>
                        <div class="fieldBody warning">
                        <$else$>
                        <div class="fieldBody">
                        <$endif$>
                        <span>
                        <$Model.RefundDetails.Amount$>
                        </span>
                        </div>
                    </div>
                </div>


                <$control.FormHelpers (simpleText="true", name=Model.RefundDetails.Text.DateLabel, value=Model.RefundDetails.Date)$>

                <$control.FormHelpers (simpleText="true", name=Model.RefundDetails.Text.TenderLabel, value=Model.RefundDetails.Tender)$>

                <div class="fieldContainer simpleTextContainer">
                    <div class="fieldSubContainer labeledTextContainer">
                        <div class="fieldLabel">
                            <span>
                                <$Model.RefundDetails.Text.RefundToLabel$>
                            </span>
                        </div>
                        <div class="fieldBody">
                            <span>
                                <$if (Model.RefundDetails.RefundToFullNameIsEmpty)$>
                                    <$Model.RefundDetails.RefundToEmail$>
                                <$else$>
                                    <$Model.RefundDetails.RefundTo$>
                                    <br />
                                    <$Model.RefundDetails.RefundToEmail$>
                                <$endif$>
                            </span>
                        </div>
                    </div>
                </div>

                <$if (Model.RefundDetails.MemoIsNotEmpty)$>
                    <$control.FormHelpers (simpleText="true", name=Model.RefundDetails.Text.MemoLabel, value=Model.RefundDetails.Memo)$>
                <$endif$>

                <$control.FormHelpers (sectionEnd="true")$>

                <$control.FormHelpers (caption="true", name=Model.RefundDetails.Text.RefundDetailsLabel)$>

                <$control.FormHelpers (sectionStart="true")$>
                <$if (Model.RefundDetails.ShowPaymentsRefundDocument)$>
                    <$Model.RefundDetails.PaymentsRefundDocument:
                    {
                        <div class="fieldContainer simpleTextContainer">
                            <div class="fieldSubContainer labeledTextContainer">
                                <div class="fieldLabel">
                                    <span>
                                        <a href="<$it.DocumentUrl$>"><$it.DocumentName$></a>
                                        <div class="date"><$it.Date$></div>
                                    </span>
                                </div>
                                <div class="fieldBody">
                                    <span>
                                        <$it.Amount$>
                                        <div class="tender"><$it.Tender$></div>
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
                                    <$Model.RefundDetails.Text.RefundEmptyComment$>
                                </span>
                            </div>
                        </div>
                    </div>
                <$endif$>
                <$control.FormHelpers (sectionEnd="true")$>
            </div>
        </div>
<$control.Form(formEnd = "true")$>
