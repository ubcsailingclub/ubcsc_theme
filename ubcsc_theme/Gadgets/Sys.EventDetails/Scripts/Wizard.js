(function()
{
  if (window.Wizard == null)
  {
    window.Wizard = new Object();
  }

  Wizard.SetRadioChosen = SetRadioChosen;
  Wizard.SetMethosRadioChosen = SetMethosRadioChosen;
  Wizard.SetMethodValidate = SetMethodValidate;
  Wizard.SetCreditCardIsChosen = SetCreditCardIsChosen;
  Wizard.GetCreditCardIsChosen = GetCreditCardIsChosen;
  Wizard.ValidateIsRadioChosen = ValidateIsRadioChosen;
  Wizard.ValidateIsMethodRadioChosen = ValidateIsMethodRadioChosen;
  Wizard.SetRadioValidatorsIds = SetRadioValidatorsIds;
  Wizard.DisableButtons = DisableButtonsWithTimeout;
  Wizard.NavigateToCreditCard = NavigateToCreditCard;
  Wizard.SetContainerVisibility = SetContainerVisibility;
  Wizard.StopWatching = StopWatching;
  Wizard.ShowAdminCancelDialog = ShowAdminCancelDialog;
  Wizard.SubstituteFormTargetIfReq = SubstituteFormTargetIfReq;
  
  var isRadioChosen = false;
  var isMethodRadioChosen = false;
  var isMethodValidate = false;
  var isCreditCardChosen = false;
  var radioValidatorId = false;
  var radioMethodValidatorId = false;

  function SetRadioChosen()
  {
    isRadioChosen = true;

    if (radioValidatorId)
    {
      ValidatorValidate(document.getElementById(radioValidatorId));
    }
    else
    {
      Page_ClientValidate("WizardValidationGroup");
    }

    if (radioMethodValidatorId)
    {
      ValidatorValidate(document.getElementById(radioMethodValidatorId));
    }
  }
  function SetMethosRadioChosen()
  {
    isMethodRadioChosen = true;

    if (radioValidatorId)
    {
      ValidatorValidate(document.getElementById(radioValidatorId));
    }

    if (radioMethodValidatorId)
    {
      ValidatorValidate(document.getElementById(radioMethodValidatorId));
    }
  }
  function validateRados()
  {
  }
  function SetMethodValidate(isValidate)
  {
    isMethodValidate = isValidate;
  }
  function SetCreditCardIsChosen(isChosen)
  {
    isCreditCardChosen = isChosen;
  }
  function GetCreditCardIsChosen()
  {
    return isCreditCardChosen;
  }
  function ValidateIsRadioChosen(sender, args)
  {
    args.IsValid = isRadioChosen;
  }
  function ValidateIsMethodRadioChosen(sender, args)
  {
    args.IsValid = !isMethodValidate || isMethodRadioChosen;
  }
  function SetRadioValidatorsIds(radioValidatorClientId, radioMethodValidatorClientId)
  {
    radioValidatorId = radioValidatorClientId;
    radioMethodValidatorId = radioMethodValidatorClientId;
  }
  function DisableButtonsWithTimeout()
  {
    if (typeof (Page_ValidationActive) != 'undefined' && Page_ValidationActive && Page_IsValid == false)
      return;

    var ids = arguments;
    setTimeout(function() { DisableButtons(ids); }, 50);
  }
  function NavigateToCreditCard(url)
  {
    document.body.style.display = 'none';
    WA.topWindow.location = url;
  }
  function DisableButtons(ids)
  {
    if (!ids)
      return;

    for (i = 0; i < ids.length; i++)
    {
      var elemToDisable = document.getElementById(ids[i]);
      if (elemToDisable) elemToDisable.disabled = true;
    }
  }
  function SetContainerVisibility(containerId, visible)
  {
    var container = document.getElementById(containerId);

    if (!container)
      return;

    container.style.display = visible ? 'block' : 'none';
  }
  function StopWatching()
  {
    if (window.DataChangeWatcher)
    {
      DataChangeWatcher.pauseWatching();
    }

    if (window.Page_ClientValidate)
    {
      Page_ClientValidate('WizardValidationGroup');
    }

    var resumeWatching = false;

    if (window.Page_IsValid)
    {
      resumeWatching = !Page_IsValid;
    }

    if (window.DataChangeWatcher && resumeWatching)
    {
      DataChangeWatcher.resumeWatching();
    }
  }
  function ShowAdminCancelDialog(text)
  {
    if (!confirm(text))
    {
      return false;
    }

    return true;
  }
  function SubstituteFormTargetIfReq()
  {
    var planRadiosContainer = document.getElementById('idPlansContainer');
    var selectedPlanId = getSelectedRadioAttrVal(planRadiosContainer.getElementsByTagName('INPUT'), 'planId');
    var selectedSubscriptionPeriod = getSelectedSubscriptionPeriod();


    if (selectedPlanId == 0 || selectedPlanId == null)
    {
      return;
    }

    var shouldSubstituteTarget = false;
    var wasFreePlanChoosen = selectedPlanId == freePlanId;
    var payOutstandingBalanceNowRadio = document.getElementById(payOutstandingBalanceNowId)
    var newCreditCardRadio = document.getElementById(newCreditCardRadioId);
    var shouldPayOutstandingAmountNow = wasFreePlanChoosen && isAccountOverdue && payOutstandingBalanceNowRadio && payOutstandingBalanceNowRadio.checked;
    var isSelectedPeriodAnnualInvoice = selectedSubscriptionPeriod == 3; //AnnualInvoice = 3, should not substitute

    if (isSelectedPeriodAnnualInvoice)
    {
      shouldSubstituteTarget = false;
    }
    else if (!isCurrentPlanChargeable)
    {
      shouldSubstituteTarget = true;
    }
    else
    {
      var shouldEnterNewCard = wasFreePlanChoosen ? shouldPayOutstandingAmountNow : (newCreditCardRadio && newCreditCardRadio.checked) || isBillingInfoEmpty;
      shouldSubstituteTarget = shouldEnterNewCard;
    }

    if (shouldSubstituteTarget)
    {
      document.getElementById(formClientId).target = '_top';
    }
  };
  function getSelectedSubscriptionPeriod()
  {
    var selectedMethodId = 0;
    var paymentMethodRadiosContainer = document.getElementById('idPaymentMethodsContainer');

    if (paymentMethodRadiosContainer)
    {
      var paymentMethodRadios = paymentMethodRadiosContainer.getElementsByTagName('INPUT');
      selectedMethodId = getSelectedRadioAttrVal(paymentMethodRadiosContainer.getElementsByTagName('INPUT'), 'methodId');
    }

    return selectedMethodId;
  }
  function getSelectedRadioAttrVal(radios, attrName)
  {
    for (var i = 0; i < radios.length; i++)
    {
      if (radios[i].checked)
      {
        return radios[i].getAttribute(attrName);
      }
    }
  }
}
)();
