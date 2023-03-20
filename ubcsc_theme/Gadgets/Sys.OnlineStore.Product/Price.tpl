<$if(Model.Currency.Symbol && Model.Currency.Symbol != "")$>
    <$Model.Currency.Symbol$><$it$>
<$else$>
    <$it$> <$Model.Currency.Code$>
<$endif$>