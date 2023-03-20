<div class="siteSearchResults">
	<div class="searchControls">
		<span class="label"><$Model.Text.Search$></span>
		<input id="<$Model.Id$>_searchBox" class="typeText searchBoxField" value="<$Model.SearchString$>" maxlength="300" />
		<span id="<$Model.Id$>_foundLabel" class="foundLabel" style="display: none;"><$Model.Text.Found$></span>
		<span id="<$Model.Id$>_foundRecords" class="foundRecords"></span>
	</div>

	<div class="categories jsonly">
		<a id="<$Model.Id$>_togglePanelLink" class="togglePanelLink fa-caret-right"><span id="<$Model.Id$>_selectedTypesCaption"><$Model.SelectedTypesCaption$></span></a>
		<div id="<$Model.Id$>_contentTypesPanel" class="contentTypesPanel">
			<$Model.ContentTypes:ContentType()$>
		</div>
  	</div>

	<$if (Model.SearchUnavailable)$>
    <$control.MessageBox(Text={<$Model.SearchUnavailableText$>}, WrapText="True", Warning="True")$>
	<$else$>
    <noscript>
      <style> .jsonly { display: none } </style>
	    <$control.MessageBox(Text=Model.Text.NoJsMessageText, Warning="True")$>
    </noscript>
  <$endif$>
  

	<div id="<$Model.Id$>_resultDiv" class="resultDiv"></div>
	<div class="bottomLine">
		<div id="<$Model.Id$>_recordsFoundMessage" class="recordsFoundMessage"></div>
		<div id="<$Model.Id$>_pager" class="searchPager"></div>
	</div>
</div>



<script type="text/javascript">
	(function(){
		function init()
		{
			var model = {};
			model.modelId = '<$Model.Id$>';
			model.pageNumber = '<$Model.PageNumber$>';
			model.getUrlTemplate = '<$Model.Urls.SearchTemplate$>';
      model.searchActionUrl = '<$Model.Urls.SearchActionUrl$>';

			<$if(Model.SearchUnavailable)$>
				model.searchUnavailable = true;
			<$else$>
				model.searchUnavailable = false;
			<$endif$>

			<$if(Model.NoPaging)$>
				model.noPaging = true;
			<$else$>
				model.noPaging = false;
			<$endif$>

			model.text = {};
			model.text.noResultsFound = '<$Model.Text.NoResultsFound$>';
			model.text.contentTypeTemplate = '<$Model.Text.ContentTypeTemplate$>';
			model.text.searchInProgress = '<$Model.Text.SearchInProgress$>';
			model.text.first = '<$Model.Text.Pager_First$>';
			model.text.previous = '<$Model.Text.Pager_Previous$>';
			model.text.next = '<$Model.Text.Pager_Next$>';
			model.text.last = '<$Model.Text.Pager_Last$>';

			var WASearchResults = new WASearchResultsGadget(model);
		}

		jq$(document).ready(init);
	}) ();
  
</script>