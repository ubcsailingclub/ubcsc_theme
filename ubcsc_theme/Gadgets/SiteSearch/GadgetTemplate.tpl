<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>
	<div class="searchBoxOuter align<$Model.Settings.Align$>">
	<div class="searchBox">
	<$control.Form(formBegin = "true", action = Model.Urls.Search, id = Model.Id + "_form", class="generalSearchBox")$>
		<span class="searchBoxFieldContainer"><input class="searchBoxField" type="text" name="searchString" id="id<$Model.Id$>_searchBox" value="" maxlength="300" <$if(Model.Settings.ShowAutosuggestion)$>autocomplete="off"<$endif$>  placeholder="<$Model.Settings.SearchPrompt$>"></span>
		<$if(Model.Settings.ShowAutosuggestion)$>
			<div class="autoSuggestionBox" id="id<$Model.Id$>_resultDiv"></div>
		<$endif$>
    <$control.Form(formEnd = "true")$>
	</div>
	</div>
	<script type="text/javascript">
		(function(){

			function init()
			{
				var model = {};
				model.gadgetId = 'id<$Model.Id$>';
				model.searchBoxId = 'id<$Model.Id$>_searchBox';
				model.resultDivId = 'id<$Model.Id$>_resultDiv';
				model.selectedTypes = '<$Model.SelectedTypes$>';
				model.searchTemplate = '<$Model.Urls.SearchTemplate$>';
				model.searchActionUrl = '<$Model.Urls.SearchActionUrl$>';
				model.GoToSearchPageTextTemplate = '<$Model.Text.GoToSearchPageTextTemplate$>';
			<$if(Model.Settings.ShowAutosuggestion)$>
				model.autoSuggest = true;
			<$else$>
				model.autoSuggest = false;
			<$endif$>

				var WASiteSearch = new WASiteSearchGadget(model);
			}

			jq$(document).ready(init);
		}) ();
	</script>
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>