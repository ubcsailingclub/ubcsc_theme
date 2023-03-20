<div class="votingBlock" data-limit="<$ it.ChoiceLimit $>" data-isRequired="<$ it.IsRequired $>">
  <$if(it.Title != "")$>
  <h2><$ it.Title $><$if(it.IsRequired)$> <span class="mandatorySymbol">*</span><$endif$></h2>
  <$endif$>
  <$if(it.ChoiceLimit > 0)$>
  <div class="pollNote">You can choose a maximum of <$ it.ChoiceLimit $> options</div>
  <$endif$>
  <ul>
    <$ it.Options:QuestionOption() $>
  </ul>
  <div class="errorMsg">An answer is required</div>
</div>