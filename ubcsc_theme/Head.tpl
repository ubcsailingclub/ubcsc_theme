<meta name="viewport" content="width=device-width, initial-scale=1">
<$PageModel.Styles:Links(stylesheet = "true")$>
<$PageModel.InlineScripts:Links(inlineScript = "true")$>
<$PageModel.Scripts:Links(script = "true")$>
<$PageModel.Rss:Links(rss = "true")$>

<title><$PageModel.Title$></title>
<$if (PageModel.Keywords)$><meta name="Keywords" content="<$PageModel.Keywords$>"/><$endif$>
<$if (PageModel.Description)$><meta name="Description" content="<$PageModel.Description$>" /><$endif$>
<$if (PageModel.IsNoIndexPage)$><meta name="robots" content="noindex,nofollow,noarchive" /><$endif$>
<$PageModel.RawHeaders$>
<$PageModel.MembersMobileAppHeaders$>
<$if (PageModel.IsSearchEnabled)$><link rel="search" type="application/opensearchdescription+xml" title="<$PageModel.Host$>" href="/opensearch.ashx" /><$endif$>