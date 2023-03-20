--><li>
	<div class="img"><$if (it.Picture)$><img src="<$it.Picture$>" alt=""><$else$><img src="<$PageModel.BaseUrl$>/Gadgets/FeaturedMember/Images/no-image.png" alt=""><$endif$></div>
	<div class="rightPart">
		<$if (it.Title)$><h4><a href="<$it.Link.Href$>" title="<$it.Title$>"><$it.Title$></a></h4><$endif$>
		<$if (it.SubTitle)$><div class="subtitle"><strong><$it.SubTitle$></strong></div><$endif$>
		<$if (it.Description)$><div class="description"><$it.Description$></div><$endif$>
	</div>
</li><!--