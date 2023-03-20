<$if(inlineScript)$>
	<$if (it.UseScriptTags)$><script type="text/javascript" language="javascript" id="<$it.Id$>"><$endif$>
		<$it.Source$>
	<$if (it.UseScriptTags)$></script><$endif$>
<$endif$>
<$if(script)$><script type="text/javascript" language="javascript" src="<$it.Path$>" id="<$it.Id$>"></script><$endif$>
<$if(stylesheet)$><link href="<$it.Path$>" rel="stylesheet" type="text/css" /><$endif$>
<$if(rss)$><link href="<$it.Path$>" rel="alternate" type="application/rss+xml" title="<$it.Title$>" /><$endif$>