<$if(Model.IsEmpty)$>
<div class="noticeBox boxTypeInfo"><div class="text"><$Model.MessageText$></div></div>
<$else$>
<script>
jq$(function() { var pollBallot = WaPollBallot.getInstance(); });
</script>
<$if(Model.ResponseSubmitted)$>
<h1><$Model.Title$></h1>
<$if(Model.ShowInfo)$>
<div class="noticeBox boxTypeInfo"><div class="text"><$Model.MessageText$></div></div>
<$elseif(Model.ShowSuccess)$>
<div class="noticeBox boxTypeSuccess"><div class="text"><$Model.MessageText$></div></div>
<$endif$>
<div class="pollDetails">
  <h2 class="result">Details</h2>
  <$Model.ResponseQuestions:Response()$>
  <$if(Model.Comments && Model.Comments != "")$>
  <div class="commentBlock">
    <label>Comment</label>
    <$ Model.Comments $>
  </div>
  <$endif$>
  <div class="submittedDate"><$ Model.ResponseSubmittedOn $></div>
</div>
<$if(Model.ShowResults)$>
<div class="pollResults">
  <h2 class="result">Results</h2>
  <$Model.Questions:Result()$>
</div>
<$endif$>
<div class="bottomBlock"><a href="/">Go to home page</a></div>
<$else$>
<h1><$Model.Title$></h1>
<div class="date">Open <span class="startDate"><$ Model.LabelFrom $></span> <span class="endDate"><$ Model.LabelTo $></span></div>
<$if(Model.ShowInfo)$>
<div class="noticeBox boxTypeInfo"><div class="text"><$Model.MessageText$></div></div>
<$elseif(Model.ShowWarning)$>
<div class="noticeBox boxTypeWarning"><div class="text"><$Model.MessageText$></div></div>
<$endif$>
<form id="pollBallotForm" action="<$ Model.RespondUrl $>" method="post" class="<$if(!Model.AllowSubmit)$>votingDisabled<$endif$>">
  <$if(Model.Description && Model.Description != "")$>
  <div class="pollContent gadgetContentEditableArea"><$Model.Description$></div>
  <$endif$>
  <$Model.Questions:Question()$>
  <$if(Model.AllowComment)$>
  <div class="commentBlock">
    <label>Comment</label>
    <textarea <$if(!Model.AllowSubmit)$>disabled<$endif$> name="comment" rows="5"></textarea>
  </div>
  <$endif$>
  <div class="bottomLine">
    <input type="submit" value="Submit" <$if(!Model.AllowSubmit)$>disabled="disabled"<$endif$> >
    <span class="notice"><$ Model.LabelSubmit $></span>
  </div>
</form>
<$endif$>
<$endif$>