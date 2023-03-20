 <$if (Model.DisplayAdminInfoEmptySystemPageBool)$>
        <$control.MessageBox(Text=Model.AdminInfoEmptySystemPageMessages, Info="True")$>
<$else$>
<a href="<$Model.BackUrl$>" class="backLink"><$Model.Text.BackLabel$></a>
  <div style="padding-top: 10px;">
     <$if (Model.ShowInvoice)$>
        <$Invoice()$>
     <$endif$>
     <$if (Model.ShowPayment)$>
        <$Payment()$>
     <$endif$>
     <$if (Model.ShowRefund)$>
        <$Refund()$>
     <$endif$>
     <$if (Model.ShowDonation)$>
        <$Donation()$>
     <$endif$>
  </div>

<script language="javascript">
  (function ()
  {
    if (!window.FinDocumentRenderer)
    {
        window.FinDocumentRenderer = {};
    }	

    FinDocumentRenderer.PayButtonsMessageBoxGroup = document.getElementById('payButtonsMessageBoxGroup');

    FinDocumentRenderer.Labels =
    {    
      PleaseWaitText: '<$Model.Text.PleaseWaitText$>'
    };

	FinDocumentRenderer.PreventNewWindow = function()
	{
      var form = document.getElementById('idMemberInvoiceDetailsForm');
      if (form == null)
      {
        return;
      }

	  form.target = "";
	}

    FinDocumentRenderer.DisablePaymentButtonsInWidget = function()
    {
      if (FinDocumentRenderer.PayButtonsMessageBoxGroup)
      {
        var content = document.createElement('DIV');
        var a = new Array();
        a.push(FinDocumentRenderer.Labels.PleaseWaitText);
        content.innerHTML = a.join('');

        var inputs = FinDocumentRenderer.PayButtonsMessageBoxGroup.getElementsByTagName("input");
 
        for (var i = 0; i < inputs.length; i++) 
        {
            inputs[i].style.display='none';
        }

        FinDocumentRenderer.PayButtonsMessageBoxGroup.appendChild(content);
       }      
    } 

    FinDocumentRenderer.DisablePaymentButtons = function()
    {
       if (FinDocumentRenderer.PayButtonsMessageBoxGroup)
       {
          setTimeout(function()
          {
             var inputs = FinDocumentRenderer.PayButtonsMessageBoxGroup.getElementsByTagName("input");
          
             for (var i = 0; i < inputs.length; i++) 
             {
                inputs[i].disabled = true;
             }
          }, 1);
       }
    }   
  })();
</script>

 <$endif$>