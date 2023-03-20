<$if(it.IsSuggestion)$>
<li class="optionItem otherOption">
  <input id="<$ it.Id $>" name="<$ it.Name $>" type="<$ it.Type $>" value="<$ it.Value $>" <$if(!Model.AllowSubmit)$>disabled<$endif$>>
  <label for="<$ it.Id $>"><$ it.Title $></label>&nbsp;<input type="text" name="<$ it.Id $>" value="" maxlength="256">
</li>
<$else$>
<li class="optionItem">
  <input id="<$ it.Id $>" name="<$ it.Name $>" type="<$ it.Type $>" value="<$ it.Value $>" <$if(!Model.AllowSubmit)$>disabled<$endif$>>
  <label for="<$ it.Id $>"><$ it.Title $></label>
</li>
<$endif$>