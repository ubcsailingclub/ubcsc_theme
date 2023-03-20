jq$(function(){
	jq$('.WaGadgetForumStateTopicList .boxBodyOuterContainer .threadImage img[src*=stickies]').each(function(){
		jq$(this).parent().addClass('stickyForumTopic');
	});
});