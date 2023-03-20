(function(jq$)
{
    if(!window.OAuthButtons)
    {
        window.OAuthButtons = OAuthButtons;
    }

    function OAuthButtons(args)
    {
        if (!args.id) { throw new Error('id was not defined!'); }

        var container,
            form;

        function onContainerClick(e)
        {
            var attr = e.target.getAttribute('provider');

            if (!attr)
            {
                return;
            }

            switch (attr)
            {
                case 'Facebook':
                case 'GooglePlus':
                {
                    submitExternalAuthForm(attr);
                    break;
                }
                default :
                {
                    throw new Error('unsupported provider: ' + attr);
                }
            }
        }

        function submitExternalAuthForm(providerName)
        {
            var providerField = jq$(form).find('.oAuthProvider');

            providerField.val(providerName);

            jq$(form).submit();
        }

        function init()
        {
			var containerId = args.id + '_container';
            container = document.getElementById(containerId);
            form = document.getElementById(args.formId);
			
			var browserCapabilitiesField = document.getElementById(args.id + '_browserCapabilities');
            var browserData = browserInfo.getBrowserCapabilitiesData();
            browserCapabilitiesField.value = browserData;

            if (!container) { throw new Error('Could not find container by id: ' + containerId); }
            if (!form) { throw new Error('Could not find form by id: ' + args.formId); }

            jq$(container).click(onContainerClick);
        }

        init();
    }

})(window.jq$);