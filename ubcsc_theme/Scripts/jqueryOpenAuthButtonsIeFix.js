//:active state fix for openAuthButtons in IE
(function()
{
	function activeStateIeFix()
	{
		var authenticateLoginLink = jq$('a.wa-authenticateLoginLink');
		
		authenticateLoginLink.mouseup(function(){
			jq$(this).addClass("activeState");
		});
		
		authenticateLoginLink.mouseout(function(){
			jq$(this).removeClass("activeState");
		});
	}
	jq$(document).ready(activeStateIeFix);
	
})();