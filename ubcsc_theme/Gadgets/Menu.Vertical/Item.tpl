<li class="<$if (it.IsSelected)$>sel<$endif$> <$if (it.IsItemWithChildren)$>dir<$endif$>">
	<div class="item">
		<a href="<$it.Url$>" title="<$it.Title$>"><span><$it.Title$></span></a>
		<$if (it.IsItemWithChildren)$>
			<ul class="secondLevel">
				<$it.Items:Item()$>
			</ul>
		<$endif$>
	</div>
</li>
	
