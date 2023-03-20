<$if(designDivsBegin)$>
	<div class="d1<$if(extraClass)$> d1<$extraClass$><$endif$>">
	<div class="d2<$if(extraClass)$> d2<$extraClass$><$endif$>">
	<div class="d3<$if(extraClass)$> d3<$extraClass$><$endif$>">
	<div class="d4<$if(extraClass)$> d4<$extraClass$><$endif$>">
	<div class="d5<$if(extraClass)$> d5<$extraClass$><$endif$>">
	<div class="d6<$if(extraClass)$> d6<$extraClass$><$endif$>">
	<div class="d7<$if(extraClass)$> d7<$extraClass$><$endif$>">
	<div class="d8<$if(extraClass)$> d8<$extraClass$><$endif$>">
	<div class="d9<$if(extraClass)$> d9<$extraClass$><$endif$>">
	<div <$if(innerDivId)$>id="<$innerDivId$>" <$endif$> class="inner<$if(extraClass)$> inner<$extraClass$><$endif$>">
<$endif$>

<$if(designDivsEnd)$></div></div></div><$if(ExtraClearEnd)$><div class="clearEndContainer"></div><$endif$></div></div></div></div></div></div></div><$endif$>

<$if(cornersDivsTop)$>
	<div class="topCorners"><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div><div class="c5"></div><$if (!hideInnerDivs)$><!--[if gt IE 6]><!--><div class="r1"><div class="r2"><div class="r3"><div class="r4"><div class="r5"></div></div></div></div></div><!--<![endif]--><$endif$></div>
<$endif$>

<$if(cornersDivsBottom)$>
	<div class="bottomCorners"><$if (!hideInnerDivs)$><!--[if gt IE 6]><!--><div class="r1"><div class="r2"><div class="r3"><div class="r4"><div class="r5"></div></div></div></div></div><!--<![endif]--><$endif$><div class="c5"></div><div class="c4"></div><div class="c3"></div><div class="c2"></div><div class="c1"></div></div>
<$endif$>