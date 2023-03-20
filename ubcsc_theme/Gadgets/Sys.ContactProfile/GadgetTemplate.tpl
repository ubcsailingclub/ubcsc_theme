<$if (Model.UseTabTemplates || Model.UseFinancesTemplate)$>
    <$FinancesTemplate()$>
<$else$>
    <$Model.GadgetHtml$>
<$endif$>
