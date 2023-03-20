<li>
	<a href="<$it.Url$>"><$it.Title$></a>

	<$if (it.IsItemWithChildren)$>
		<ul class="level2plus">
			<$it.Items:Item()$>
		</ul>
	<$endif$>
</li>

