<noscript>
    <$control.MessageBox(Text=Model.Text.NoJsMessageText, Warning="True", ShowHeader="True", HeaderText=Model.Text.NoJsMessageHeader)$>
</noscript>
<div id="invoicesAndPaymentsMainContainer" style="display: none;">
    <$control.Form(formBegin = "true", action = Model.Urls.ProfileInvoicesAction, id = "idMemberInvoicesForm", class="paymentDetailsForm", target=Model.InvoiceAndPaymentList.SubmitFormTarget)$>
    <div id="topMessageBoxDiv">
        <$if (Model.InvoiceAndPaymentList.DisplayPaymentInfoMessageBoxBool)$>
        <$if (Model.InvoiceAndPaymentList.DisplayPaymentSuccessMessageBool)$>
        <$control.MessageBox(Success="True", Text=Model.InvoiceAndPaymentList.PaymentInfoMessages:{<div><$it$></div>})$>
        <$else$>
        <$control.MessageBox(Error="True", Text=Model.InvoiceAndPaymentList.PaymentInfoMessages:{<div><$it$></div>})$>
        <$endif$>
        <$endif$>
        <$if (Model.InvoiceAndPaymentList.DisplayTopMessageBoxBool)$>
        <$InvoiceListWarning(HeaderText=Model.TotalBalanceString, Text=InvoiceListWarningText())$>
        <$endif$>
    </div>
    <$Model.InvoiceAndPaymentList.ListFrame$>
    <$control.Form(formEnd = "true")$>
</div>

<script language="javascript">
    /* overriding default ListHelper behaviour */
    var ListHelper = WA.UI.GenericList.ListHelper,
        InvoiceListRenderer = {};

    ListHelper.onMouseOver = function(obj, next, prev) {};
    ListHelper.onMouseOut = function(obj, next, prev) {};

    InvoiceListRenderer.Initialize = function()
    {
        InvoiceListRenderer.checkBoxeIds = [];
        InvoiceListRenderer.OfflineCheckBoxes = [];
        InvoiceListRenderer.ListHandler.DataSource = InvoiceListRenderer.getDataSource();
        InvoiceListRenderer.ListHandler.ListRenderer.HeaderRenderingFunction = function()
        {
            var a = [
                        '<table class="genericListTable" id="membersTable" cellpadding="0" cellspacing="0" width="100%"><thead><tr>',
                        '<th class="firstTh">',
                        InvoiceListRenderer.Labels.DateColumnHeader,
                        '</th>',
                        '<th class="invoiceNumber">',
                        InvoiceListRenderer.Labels.TransactionColumnHeader,
                        '</th>',
                        '<th class="lastTh rightAlign status">',
                        '<span>',
                        InvoiceListRenderer.Labels.StatusColumnHeader,
                        '</span>',
                    <$if (Model.InvoiceAndPaymentList.DisplayCheckBoxesBool)$>
        ((InvoiceListRenderer.ThereIsOpenDocument) ? '<input type="checkbox" id="listCheckBoxAll" onclick="InvoiceListRenderer.AllCheckBoxClicked(event);" />' : ''),
            <$endif$>
        '</th>',
                '</tr></thead><tbody>'
            ];

            return a.join('');
        };

        InvoiceListRenderer.Constants =
        {
            id: 0,
            number: 1,
            date: 2,
            amount: 3,
            amountAsNum: 4,
            memo: 5,
            status: 6,
            pagerDate: 7,
            documentType: 8,
            originType: 9,
            originDetails: 10,
            isClosed: 11,
            relatedItems: 12,
            statusStyle: 13,
            itemType: 14,
            checked: 15,
            isRecurring: 16,
            isManual: 17,
            continueUrl: 18,
            isOfflineOnly: 19
        };

        InvoiceListRenderer.ListHandler.ListRenderer.ItemRenderingFunction = function(listItem)
        {
            var a = [],
                    id = listItem[InvoiceListRenderer.Constants.id],
                    number = listItem[InvoiceListRenderer.Constants.number],
                    date = listItem[InvoiceListRenderer.Constants.date],
                    amount = listItem[InvoiceListRenderer.Constants.amount],
                    amountAsNum = listItem[InvoiceListRenderer.Constants.amountAsNum],
                    memo = listItem[InvoiceListRenderer.Constants.memo],
                    documentType = listItem[InvoiceListRenderer.Constants.documentType],
                    isClosed = listItem[InvoiceListRenderer.Constants.isClosed],
                    itemType = listItem[InvoiceListRenderer.Constants.itemType],
                    status = listItem[InvoiceListRenderer.Constants.status],
                    originType = listItem[InvoiceListRenderer.Constants.originType],
                    originDetails = listItem[InvoiceListRenderer.Constants.originDetails],
                    relatedItems = listItem[InvoiceListRenderer.Constants.relatedItems],
                    statusStyle = listItem[InvoiceListRenderer.Constants.statusStyle],
                    checked = listItem[InvoiceListRenderer.Constants.checked],
                    isRecurring = listItem[InvoiceListRenderer.Constants.isRecurring],
                    isManual = listItem[InvoiceListRenderer.Constants.isManual],
                    continueUrl = listItem[InvoiceListRenderer.Constants.continueUrl],
                    isOfflineOnly = listItem[InvoiceListRenderer.Constants.isOfflineOnly],
                    detailsUrl;

            if (itemType == 1)
            {
                if (documentType == <$Model.DonationWizardType$>)
                {
                    detailsUrl = WA.String.format(InvoiceListRenderer.DonationDetailsTemplate, id);
                }
                else
                {
                    detailsUrl = continueUrl;
                }
            }
            else
            {
                detailsUrl = WA.String.format(InvoiceListRenderer.InvoiceDetailsUrlTemplate, id);
            }

            a.push('<tr class="noLine' + (isClosed ? ' grayedOut' : '') + ((itemType == 2) ? ' grayedOutBk' : '') +
                    '" id="id_' + id + '"' +
                    ((itemType == 2) ? '' : ' onmouseover="ListHelper.onMouseOver(this, true);" onmouseout="ListHelper.onMouseOut(this, true);" onclick="InvoiceListRenderer.RowClicked(' + itemType + ', ' + documentType + ', ' + id + ', \'' + detailsUrl + '\', window)"') + '>');
            a.push('<td class="firstTd memberDirectoryColumn1' + ((itemType == 1) ? ' pending' : '') + '"><span>' + GetDateTd(date) + '</span></td>');
            a.push('<td class="itemDescription memberDirectoryColumn2">' +
                    GetDocumentLink(itemType, documentType, number, detailsUrl) +
                    GetOrigin(originType) +
                    GetOriginDetails(originDetails) +
                    '</td>');
            a.push('<td class="lastTd rightAlign memberDirectoryColumn3" onclick="WA.stopEventBubbling(event);">' +
                    GetAmount(id, itemType, documentType, status, isClosed, amount, amountAsNum, checked, isRecurring, isManual, isOfflineOnly) +
                    GetButtons(id, itemType, documentType, isRecurring, detailsUrl, isClosed) + GetStatus(id, status, statusStyle, isClosed, isRecurring) +
                    GeRelatedLinks(relatedItems) +
                    '</td>');
            a.push('</tr>');
            a.push(GetBottomRow(memo, detailsUrl));

            return a.join('');
        };

        function GetDateTd(date)
        {
            return date;
        }

        function GetDocumentLink(itemType, documentType, number, detailsUrl)
        {
            var linkText = '';

            if (itemType == 0)
            {
                linkText = (number != '')
                        ? InvoiceListRenderer.DocumentTypes[documentType] + ' #' + number
                        : InvoiceListRenderer.DocumentTypes[documentType];
                return '<div><a href="' + detailsUrl + '">' + linkText + '</a></div>';
            }

            if (itemType == 1)
            {
                return '<div class="alert">' + InvoiceListRenderer.PendingWizardsTypes[documentType] + '</div>';
            }

            return "";
        }

        function GetOrigin(originType)
        {
            return '<div>' + originType + '</div>';
        }

        function GetOriginDetails(originDetails)
        {
            return '<div>' + originDetails + '</div>';
        }

        function GetButtons(id, itemType, documentType, isRecurring, detailsUrl, isClosed)
        {
            if (itemType == 0 && isRecurring && !isClosed) // recurring invoice
            {
                return '<div class="buttonContainer"><input type="button" value="' +
                        '<$Model.InvoiceAndPaymentList.Text.RecurringInvoiceButton$>' +
                        '" name="listButtonShowRecurringInvoice_' + id + '" id="listButtonShowRecurringInvoice_' + id +
                        '" onclick="ListHelper.onClick(\'' + detailsUrl + '\', window);" /></div>';
            }

            if (itemType == 1) //pending wizard
            {
                return '<div class="buttonContainer">' +
                        '<input type="submit" class="button" value="' + InvoiceListRenderer.Labels.ContinueWizardButtonLabel +
                        '" name="listButtonContinue' + (documentType == <$Model.DonationWizardType$> ? "Donation" : "") + '_' + id +
                        '" id="listButtonContinue' + (documentType == <$Model.DonationWizardType$> ? "Donation" : "") + '_' + id +
                        '" onclick="InvoiceListRenderer.PreventNewWindow();InvoiceListRenderer.ContinuePendingWizardClicked(event, ' + id + ');" />' +
                        '<input type="submit" class="button" value="' + InvoiceListRenderer.Labels.CancelWizardButtonLabel +
                        '" name="listButtonCancel' + (documentType == <$Model.DonationWizardType$> ? "Donation" : "") + '_' + id +
                        '" id="listButtonCancel_' + id +
                        '" onclick="InvoiceListRenderer.PreventNewWindow();InvoiceListRenderer.CancelPendingWizardClicked(event, ' + id + ');" /></div>';
            }

            if (itemType == 2) //recurring
            {
            <$if (Model.RecurringMightBeStoppedBool)$>
                return '<div id="listButtonStopRecurringDivContainer" class="buttonContainer"><input type="submit" class="button" value="' +
                        InvoiceListRenderer.Labels.StopRecurringButtonLabel +
                        '" name="listButtonStopRecurring" id="listButtonStopRecurring" onclick="return InvoiceListRenderer.StopRecurringClicked(event);" /></div>';
            <$endif$>
            }

            return '';
        }

        function registerCheckBoxData(checkBoxId, documentType, amountAsNum, id, isManual, isOfflineOnly)
        {
            var j, checkBoxData = null,
                    checkBoxIds = InvoiceListRenderer.checkBoxeIds,
                    len = checkBoxIds.length,
                    test_item,
                    itemData;

            for (j = 0; j < len; j++)
            {
                test_item = checkBoxIds[j];

                if (test_item[1] == checkBoxId)
                {
                    checkBoxData = test_item;
                    break;
                }
            }

            if (checkBoxData == null)
            {
                itemData = [null, checkBoxId, documentType, amountAsNum, id, isManual];

                checkBoxIds.push(itemData);

                if (isOfflineOnly)
                {
                    InvoiceListRenderer.OfflineCheckBoxes.push(itemData);
                }
            }
            else
            {
                checkBoxData[0] = document.getElementById(checkBoxData[1]);
            }
        }

        function GetAmount(id, itemType, documentType, status, isClosed, amount, amountAsNum, checked, isRecurring, isManual, isOfflineOnly)
        {
            var checkBoxId = 'listCheckBox_' + id,
                    a = [];

            if (itemType == 0) // finance document
            {
                if (isClosed || isRecurring)
                {
                    if (status.length == 0 || status[0] == '')
                    {
                        return '<div ' + (isRecurring ? 'class="alert"' : '') + '>' + amount + '</div>';
                    }
                    else
                    {
                        a.push('<div ' + (isRecurring && !isClosed ? 'class="alert"' : '') + '>' + amount + '</div>');
                        a.push('<div ' + (isRecurring && !isClosed ? 'class="alertThin"' : '') + '>');

                        for (var i = 0; i < status.length; i++)
                        {
                            a.push(status[i] + ' ');
                        }

                        a.push('</div>');

                        return a.join('');
                    }
                }

                if (documentType == 4)
                {
                    return '<div class="alert">' + amount + '</div>';
                }

            <$if (Model.InvoiceAndPaymentList.DisplayCheckBoxesBool)$>

            registerCheckBoxData(checkBoxId, documentType, amountAsNum, id, isManual, isOfflineOnly);

                return '<div class="' + ((documentType != 2 && documentType != 7) ? 'alert' : '') + ' checkbox">' +
                        ' <input type="checkbox"' +
                        (checked ? ' checked' : '') +
                        ' id="' + checkBoxId + '" onclick="InvoiceListRenderer.CheckBoxClicked(event);" />' +
                        '<span class="sum">' + amount + '</span></div>';
            <$else$>
                return '<div class="alert">' + amount + '</div>';
            <$endif$>
            }

            if (itemType == 2) // recurring
            {
                return '<div>' + amount + '</div>';
            }

            return '';
        }
		
		function setInvoiceListFormSubmitTarget(target)
		{
		    var form = document.getElementById('idMemberInvoicesForm'),
			    formTarget;
				
			if (!form || !WA || !WA.throttle) { return }
		
		    WA.clearThrottle(resetFormTarget);
		    formTarget = form.target || '';
			form.target = target;
			WA.throttle(resetFormTarget, 500);
			
			function resetFormTarget()
			{
			    try
				{
				    form.target = formTarget;
				}
				catch(e) {}
			}
		}

        InvoiceListRenderer.StopRecurringClicked = function(e)
        {
            if (window.confirm('<$Model.InvoiceAndPaymentList.Text.ConfirmationRecurringText$>'))
            {
                var listButtonStopRecurring = document.getElementById('listButtonStopRecurring'),
                    listButtonStopRecurringDivContainer = document.getElementById('listButtonStopRecurringDivContainer');

                if (listButtonStopRecurring && listButtonStopRecurringDivContainer)
                {
                    var content = document.createElement('DIV');
                    var a = [InvoiceListRenderer.Labels.PleaseWaitText];
                    content.innerHTML = a.join('');
                    listButtonStopRecurringDivContainer.appendChild(content);
                    listButtonStopRecurring.style.display='none';
                }

                BonaPage.stopEventBubbling(e);
                <$if (Model.InvoiceAndPaymentList.RecurringInvoiceOpenInNewWindowBool)$>        
                    setInvoiceListFormSubmitTarget('_blank');
                <$endif$>
                return true;
            }

            return false;
        };

        InvoiceListRenderer.CancelPendingWizardClicked = function(e)
        {
            BonaPage.stopEventBubbling(e);
        };

        InvoiceListRenderer.RowClicked = function(itemType, documentType, id, detailsUrl, win)
        {
            var donationContinueButton;

            if ((itemType == 1) && (documentType  == <$Model.DonationWizardType$>))
            {
                donationContinueButton = document.getElementById('listButtonContinueDonation_' + id);

                if (donationContinueButton)
                {
                    donationContinueButton.click();
                }
            }
            else
            {
                ListHelper.onClick(detailsUrl, win);
            }
        };

        InvoiceListRenderer.ContinuePendingWizardClicked = function(e)
        {
            BonaPage.stopEventBubbling(e);
        };

        InvoiceListRenderer.CheckBoxClicked = function(e)
        {
            if (WA.getEventTarget(e).disabled) { return; }

            InvoiceListRenderer.updateTopBox();
            BonaPage.stopEventBubbling(e);
        };

        InvoiceListRenderer.PreventNewWindow = function()
        {
            var form = document.getElementById('idMemberInvoicesForm');

            if (form)
            {
                form.target = "";
            }
        };

        InvoiceListRenderer.DisablePaymentButtonsInWidget = function()
        {
            if (InvoiceListRenderer.PayButtonsMessageBoxGroup)
            {
                var content = document.createElement('DIV'),
                        a = [InvoiceListRenderer.Labels.PleaseWaitText],
                        i,
                        inputs = InvoiceListRenderer.PayButtonsMessageBoxGroup.getElementsByTagName("input"),
                        len = inputs.length;

                content.innerHTML = a.join('');

                for (i = 0; i < len; i++)
                {
                    inputs[i].style.display='none';
                }

                InvoiceListRenderer.PayButtonsMessageBoxGroup.appendChild(content);
            }
        };

        InvoiceListRenderer.DisablePaymentButtons = function()
        {
            if (InvoiceListRenderer.PayButtonsMessageBoxGroup)
            {
                setTimeout(function()
                {
                    var inputs = InvoiceListRenderer.PayButtonsMessageBoxGroup.getElementsByTagName("input");

                    for (var i = 0; i < inputs.length; i++)
                    {
                        inputs[i].disabled = true;
                    }
                }, 1);
            }
        };

        InvoiceListRenderer.AllCheckBoxClicked = function(e)
        {
            var i,
                    checkBoxesIds = InvoiceListRenderer.checkBoxeIds,
                    len = checkBoxesIds.length,
                    cbx,
                    isChecked = InvoiceListRenderer.ListCheckBoxAll.checked,
                    offlineCheckboxes = InvoiceListRenderer.OfflineCheckBoxes,
                    item,
                    checkboxesData,
                    creditAmount;

            for (i = 0; i < len; i++)
            {
                item = checkBoxesIds[i];

                if (isChecked && WA.Array.indexOfObjectMatching(offlineCheckboxes, testCheckboxById, 0, { itemId: item[4] }) != -1)
                {
                    continue;
                }

                if (item[0])
                {
                    item[0].checked = isChecked;
                }
            }

            if (isChecked)
            {
                checkboxesData = collectCheckboxesData();
                creditAmount = checkboxesData.creditAmount - checkboxesData.amountToPay;

                for (i = 0; i < offlineCheckboxes.length && creditAmount > 0; i++)
                {
                    item = offlineCheckboxes[i];

                    if (item[0] && creditAmount >= item[3])
                    {
                        creditAmount -= item[3];
                        item[0].checked = true;
                    }
                }
            }

            InvoiceListRenderer.updateTopBox();
            BonaPage.stopEventBubbling(e);
        };

        function GetStatus(id, status, statusStyle, isClosed, isRecurring)
        {
            if (isClosed || isRecurring) { return ''; }

            var className = (statusStyle == 1) ? 'alertThin' : 'grayedOut',
                    a = ['<div class="' + className + '">'],
                    i,
                    len = status.length;

            for (i = 0; i < len; i++)
            {
                a.push(
                        ((i + 1 == len) && (len > 1)) ? '<br/>' + status[i] : status[i]
                );
            }

            a.push('</div>');

            return a.join('');
        }

        function GeRelatedLinks(relatedItems)
        {
            var j, len = relatedItems.length, relatedItemLinks = '', item;

            for(j = 0; j < len; j++)
            {
                item = relatedItems[j];
                relatedItemLinks += '<div><a href="' + item[1] + '" onclick="BonaPage.stopEventBubbling(event);">' + item[0] + '</a></div>';
            }

            return relatedItemLinks;
        }

        function GetBottomRow(memo, detailsUrl)
        {
            var a = [];

            if (!memo || memo == 'undefined' || memo.length == 0)
            {
                a.push('<tr class="hiddenRow" onmouseover="ListHelper.onMouseOver(this, false, true);" onmouseout="ListHelper.onMouseOut(this, false, true);" onclick="ListHelper.onClick(\'' + detailsUrl + '\', window)">');
                a.push('<td colspan="3" class="memberDirectoryBottomRow">&nbsp;</td></tr>');
            }
            else
            {
                a.push('<tr class="bottomRow" bottomrow="true" onmouseover="ListHelper.onMouseOver(this, false, true);" onmouseout="ListHelper.onMouseOut(this, false, true);" onclick="ListHelper.onClick(\'' + detailsUrl + '\', window)">');
                a.push('<td colspan="3" class="memberDirectoryBottomRow">' + memo + '</td></tr>');
            }

            return a.join('');
        }

        InvoiceListRenderer.onClick = function(detailsUrl)
        {
            window.location = detailsUrl;
            return false;
        };

        InvoiceListRenderer.ListHandler.ListRenderer.FooterRenderingFunction = function()
        {
            return '</tbody></table>';
        };

        InvoiceListRenderer.ListHandler.ListRenderer.SearchStringFromListItemGenerationFunction = GetSearchString;
        InvoiceListRenderer.ListHandler.ListRenderer.Pager.LabelMaxLength = 11;
        InvoiceListRenderer.ListHandler.ListRenderer.GenerateSingleLabelPager = true;

        InvoiceListRenderer.ListHandler.ListRenderer.PagerLabelGenerationFunction = function(listItem)
        {
            return listItem[InvoiceListRenderer.Constants.pagerDate];
        };

        function GetSearchString(item)
        {
            var listItemFieldsArray = [], i, len = item.length;

            for (i = 0; i < len; i++)
            {
                if (i == InvoiceListRenderer.Constants.documentType)
                {
                    if (item[InvoiceListRenderer.Constants.itemType] == 0)
                    {
                        listItemFieldsArray.push(InvoiceListRenderer.DocumentTypes[item[i]]);
                    }
                    if (item[InvoiceListRenderer.Constants.itemType] == 1)
                    {
                        listItemFieldsArray.push(InvoiceListRenderer.PendingWizardsTypes[item[i]]);
                    }
                }
                else
                {
                    listItemFieldsArray.push(item[i]);
                }
            }

            return listItemFieldsArray.join(' ').toLowerCase();
        }

        function testCheckboxById(itemToTest, args)
        {
            return args.itemId == itemToTest[4];
        }

        function collectCheckboxesData(rebindDomElements)
        {
            var checkBoxesIds = InvoiceListRenderer.checkBoxeIds,
                    i,
                    len = checkBoxesIds.length,
                    item,
                    docType,
                    isOnlineSelected = false,
                    checkedAmount = 0,
                    amountToPay = 0,
                    creditAmount = 0,
                    countToPay = 0,
                    selectedAllDocIds = [],
                    selectedDocs = [],
                    selectedCredit = [],
                    offlineCheckboxes = InvoiceListRenderer.OfflineCheckBoxes,
                    availableCredit,
                    disabledAmount = 0,
                    hiddenAmount = 0;

            for (i = 0; i < len; i++)
            {
                item = checkBoxesIds[i];

                if (rebindDomElements || item[0] == null)
                {
                    item[0] = document.getElementById(item[1]);
                }

                if (!item[0] || !item[0].checked)
                {
                  hiddenAmount += !item[0] ? 1 : 0;
                  continue;
                }

                checkedAmount++;

                docType = item[2];

                if (docType == 1)
                {
                    if (!item[5])
                    {
                        isOnlineSelected = true;
                    }

                    amountToPay += item[3];
                    countToPay++;
                    selectedDocs.push(item[1]);
                }
                else
                {
                    creditAmount += item[3];
                    selectedCredit.push(item[1]);
                }

                selectedAllDocIds.push(item[4]);
            }

            availableCredit = Math.max(0, creditAmount - amountToPay);

            for (i = 0; i < offlineCheckboxes.length; i++)
            {
                item = offlineCheckboxes[i];

                if (creditAmount == 0 && item[0] && item[0].checked)
                {
                    item[0].checked = false;
                    amountToPay -= item[3];
                    checkedAmount--;
                    countToPay--;

                    WA.Array.removeElement(selectedDocs, item[1]);
                    WA.Array.removeElement(selectedAllDocIds, item[4]);
                }

                if (!item[0] || item[0].checked) { continue; }

                if (item[3] > availableCredit)
                {
                    item[0].disabled = true;
                    item[0].setAttribute('title', InvoiceListRenderer.Labels.PayingInvoiceOnlineIsDisabledCheckboxToolTipText);
                    disabledAmount++;
                }
                else
                {
                    item[0].disabled = false;
                    item[0].removeAttribute('title');
                }
            }

            return {
                len: len,
                isOnlineSelected: isOnlineSelected,
                checkedAmount: checkedAmount,
                disabledAmount: disabledAmount,
                hiddenAmount: hiddenAmount,
                hasUnchecked: len > checkedAmount + disabledAmount + hiddenAmount,
                selectedAllDocIds: selectedAllDocIds,
                selectedDocs: selectedDocs,
                selectedCredit: selectedCredit,
                amountToPay: Math.round(amountToPay * 100) / 100,
                creditAmount: Math.round(creditAmount * 100) / 100,
                countToPay: countToPay
            };
        }

        InvoiceListRenderer.updateTopBox = function(rebindDomElements)
        {
            var selectedDocsHidden = document.getElementById('selectedDocsHidden'),
                    checkBoxesIds = InvoiceListRenderer.checkBoxeIds,
                    selectedCreditHidden = document.getElementById('selectedCreditHidden'),
                    checkboxesData = collectCheckboxesData(rebindDomElements);

            if (selectedDocsHidden != null)
            {
                selectedDocsHidden.value = checkboxesData.selectedDocs.join(',');
            }

            if (selectedCreditHidden != null)
            {
                selectedCreditHidden.value = checkboxesData.selectedCredit.join(',');
            }

            if (InvoiceListRenderer.ListCheckBoxAll)
            {
                InvoiceListRenderer.ListCheckBoxAll.checked = checkBoxesIds.length > 0 && !checkboxesData.hasUnchecked;
            }

            <$if (Model.InvoiceAndPaymentList.DisplayCheckBoxesBool)$>
            if (InvoiceListRenderer.NoInvoicesMessageBoxGroup)
            {
                InvoiceListRenderer.NoInvoicesMessageBoxGroup.style.display = (checkboxesData.countToPay == 0) ? '' : 'none';
            }
            <$endif$>

        <$if (Model.InvoiceAndPaymentList.IsRecurringOnlyBool)$>
        InvoiceListRenderer.RecurringInvoiceOnlyMessageBoxGroup.style.display = (checkboxesData.countToPay == 0) ? '' : 'none';
            <$endif$>

            if (InvoiceListRenderer.WaitingForPaymentMessageBoxGroup)
            {
            <$if (!Model.InvoiceAndPaymentList.AvailablePayOnlineBool)$>
            <$if (Model.InvoiceAndPaymentList.DisplayCheckBoxesBool)$>
            InvoiceListRenderer.WaitingForPaymentMessageBoxGroup.style.display = (checkboxesData.countToPay != 0 && checkboxesData.creditAmount <= checkboxesData.amountToPay) ? '' : 'none';
            <$else$>
            InvoiceListRenderer.WaitingForPaymentMessageBoxGroup.style.display = 'block';
            <$endif$>
            <$endif$>
            }

            if (InvoiceListRenderer.PaymentInstructionsBoxGroup)
            {
            <$if (Model.InvoiceAndPaymentList.AvailablePayOnlineBool)$>
            InvoiceListRenderer.PaymentInstructionsBoxGroup.style.display = (checkboxesData.countToPay != 0 && checkboxesData.creditAmount < checkboxesData.amountToPay) ? '' : 'none';
            <$else$>
            <$if (Model.InvoiceAndPaymentList.DisplayCheckBoxesBool)$>
            InvoiceListRenderer.PaymentInstructionsBoxGroup.style.display = (checkboxesData.countToPay != 0 && checkboxesData.creditAmount < checkboxesData.amountToPay) ? '' : 'none';
            <$else$>
            InvoiceListRenderer.PaymentInstructionsBoxGroup.style.display = 'block';
            <$endif$>
            <$endif$>
                if (InvoiceListRenderer.WaitingForPaymentMessageBoxGroup
                        && InvoiceListRenderer.PaymentInstructionsBoxGroup.innerHTML.replace(/\s/g,"") != "")
                {
                    InvoiceListRenderer.WaitingForPaymentMessageBoxGroup.style.display = 'none';
                }
            }

            if (InvoiceListRenderer.TopMessageBoxHeader)
            {
                if (checkboxesData.countToPay == 0)
                {
                    InvoiceListRenderer.TopMessageBoxHeader.innerHTML = "<$Model.TotalBalanceString$>";
                }
                else
                {
                    InvoiceListRenderer.TopMessageBoxHeader.innerHTML = WA.String.format("<$Model.InvoiceAndPaymentList.Text.TotalBalanceTopMessageTemplate$>", checkboxesData.checkedAmount)
                            + "<span style='font-weight: bold;'>"
                            + WA.String.format("<$Model.InvoiceAndPaymentList.PositiveCurrencyTemplate$>", (Math.max(0.0, checkboxesData.amountToPay - checkboxesData.creditAmount)).toFixed(2))
                            + "</span>";
                }
                var availablePayOnline = <$if(Model.InvoiceAndPaymentList.AvailablePayOnlineBool)$>true<$else$>false<$endif$>;
                InvoiceListRenderer.PayButtonsMessageBoxGroup.style.display = (checkboxesData.countToPay == 0 || checkboxesData.creditAmount >= checkboxesData.amountToPay || !availablePayOnline) ? 'none' : '';
                InvoiceListRenderer.PayByCreditOnlyButtonsMessageBoxGroup.style.display = (checkboxesData.countToPay == 0 || checkboxesData.creditAmount < checkboxesData.amountToPay) ? 'none' : '';
            }

            jq$.ajax({
                type: "POST",
                url: "/Sys/Finances/MemberProfileAction/SaveCheckboxes",
                data: { selectedAllDocIds: checkboxesData.selectedAllDocIds }
            });
        };

        InvoiceListRenderer.ListHandler.ListRenderer.OnRenderComplete = function()
        {
            InvoiceListRenderer.TopMessageBoxHeader = document.getElementById('invoiceListTopMessageHeaderId');

            if (InvoiceListRenderer.TopMessageBoxHeader != null)
            {
                InvoiceListRenderer.TopMessageBoxHeader.className = 'text';
                InvoiceListRenderer.TopMessageBoxHeader.style.fontWeight = 'normal';
            }

            InvoiceListRenderer.TopMessageBoxText = document.getElementById('invoiceListTopMessageInnerPId');
            InvoiceListRenderer.ListCheckBoxAll = document.getElementById('listCheckBoxAll');
            InvoiceListRenderer.TopMessageBoxDiv = document.getElementById('topMessageBoxDiv');
            InvoiceListRenderer.NoInvoicesMessageBoxGroup = document.getElementById('noInvoicesMessageBoxGroup');
            InvoiceListRenderer.RecurringInvoiceOnlyMessageBoxGroup = document.getElementById('recurringInvoiceOnlyMessageBoxGroup');
            InvoiceListRenderer.WaitingForPaymentMessageBoxGroup = document.getElementById('waitingForPaymentMessageBoxGroup');
            InvoiceListRenderer.PayButtonsMessageBoxGroup = document.getElementById('payButtonsMessageBoxGroup');
            InvoiceListRenderer.PaymentInstructionsBoxGroup = document.getElementById('paymentInstructionsBoxGroup');
            InvoiceListRenderer.PayByCreditOnlyButtonsMessageBoxGroup = document.getElementById('payByCreditOnlyButtonsMessageBoxGroup');
            InvoiceListRenderer.updateTopBox(true);

            if (InvoiceListRenderer.ListCheckBoxAll && InvoiceListRenderer.ListCheckBoxAll.checked)
            {
              for (var i = 0, len = InvoiceListRenderer.OfflineCheckBoxes.length; i < len; i++)
              {
                if (InvoiceListRenderer.OfflineCheckBoxes[i][0])
				{
				    InvoiceListRenderer.OfflineCheckBoxes[i][0].checked = false;
				}
              }

              InvoiceListRenderer.AllCheckBoxClicked(null);
            }

            document.getElementById('invoicesAndPaymentsMainContainer').style.display = 'block';
        };

    };

    // Set resources here

    InvoiceListRenderer.getDataSource = function()
    {
        return eval(<$Model.InvoiceAndPaymentList.ListItems$>);
    };

    InvoiceListRenderer.Labels =
    {
        DateColumnHeader : '<$Model.InvoiceAndPaymentList.Text.DateColumnHeader$>',
        TransactionColumnHeader : '<$Model.InvoiceAndPaymentList.Text.TransactionColumnHeader$>',
        StatusColumnHeader : '<$Model.InvoiceAndPaymentList.Text.StatusColumnHeader$>',
        CancelWizardButtonLabel : '<$Model.InvoiceAndPaymentList.Text.CancelWizardButton$>',
        ContinueWizardButtonLabel : '<$Model.InvoiceAndPaymentList.Text.ContinueWizardButton$>',
        StopRecurringButtonLabel : '<$Model.InvoiceAndPaymentList.Text.StopRecurringButton$>',
        PleaseWaitText: '<$Model.InvoiceAndPaymentList.Text.PleaseWaitText$>',
        PayingInvoiceOnlineIsDisabledCheckboxToolTipText: '<$Model.InvoiceAndPaymentList.Text.PayingInvoiceOnlineIsDisabledCheckboxToolTipText$>'
    };

    InvoiceListRenderer.DocumentTypes = <$Model.InvoiceAndPaymentList.DocumentTypeList$>;
    InvoiceListRenderer.PendingWizardsTypes = <$Model.InvoiceAndPaymentList.PendingWizardTypeList$>;
    InvoiceListRenderer.RecordPaymentUrlTemplate = '';
    InvoiceListRenderer.InvoiceDetailsUrlTemplate = '<$Model.InvoiceAndPaymentList.InvoiceDetailsTemplate$>';
    InvoiceListRenderer.DonationDetailsTemplate = '<$Model.InvoiceAndPaymentList.DonationDetailsTemplate$>';
    InvoiceListRenderer.ThereIsOpenDocument = <$Model.InvoiceAndPaymentList.ThereIsOpenDocument$>;

    <$Model.InvoiceStartupScripts$>

</script>