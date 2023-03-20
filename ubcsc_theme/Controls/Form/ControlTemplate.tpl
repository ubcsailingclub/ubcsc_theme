<$if(formBegin)$>
	<form method="post" <$if(action)$>action="<$action$>"<$endif$> <$if(id)$>id="<$id$>"<$endif$> <$if(class)$>class="<$class$>"<$endif$> <$if(Model.IsAdminView)$>target="_top"<$else$><$if(target)$>target="<$target$>"<$endif$><$endif$> data-disableInAdminMode="true">
<$if(PageModel.IsCsrfVisible)$><input name="__EVENTSET" value="<$PageModel.CsrfValue$>" type="hidden"><$endif$>
<$endif$>

<$if(formEnd)$></form><$endif$>