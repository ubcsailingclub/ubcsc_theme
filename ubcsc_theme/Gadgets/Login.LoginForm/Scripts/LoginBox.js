(function(jq$)
{
    if(!window.LoginBox)
    {
        window.LoginBox = LoginBox;
    }

    function LoginBox(args)
    {
        var loginLink,
            loginContainer,
            loginContainerIsOpened;

        args.linkId = args.Id + '_loginLink';
        args.containerId = args.Id + '_loginContainer';

        function onLoginBoxLinkClick(e)
        {
            loginContainerIsOpened = true;
            jq$(loginLink).toggleClass('showLoginContainer');

            WA.stopEvent(e);
        }

        function onGlobalClick(e)
        {
            if( !loginContainerIsOpened )
            {
                return;
            }

            if(jq$(e.target).closest(loginContainer).length == 0 )
            {
                jq$(loginLink).removeClass('showLoginContainer');
                loginContainerIsOpened = false;
            }
        }

        function init()
        {
            jq$(document).bind('click.showLoginContainer', onGlobalClick);

            loginLink = document.getElementById(args.linkId);
            loginContainer = document.getElementById(args.containerId);

            if (!loginLink) { throw new Error('Could not find link by id: ' + args.linkId); }
            if (!loginContainer) { throw new Error('Could not find container by id: ' + args.containerId); }

            jq$(loginLink).click(onLoginBoxLinkClick);
        }

        init();
    }
})(window.jq$);