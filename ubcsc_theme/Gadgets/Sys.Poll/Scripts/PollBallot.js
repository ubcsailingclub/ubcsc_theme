(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaPollBallot)
    {
        window.WaPollBallot = PollBallot;
    }

    function PollBallot()
    {
        var self = this,
        confirmDialogId = 'pollSubmitConfirmationDialog',
        pollGadgetSelector = '.WaGadgetPoll',
        validator = new WaPollBallotValidator('.WaGadgetPoll .votingBlock');
        self.Dispose = WA.Tools.EventHandlers.createHandlers(self, { id: 'Dispose' });
        var confirmDialog = new WA.UI.ConfirmationDialog(
            {
                id:confirmDialogId,
                resources:{
                    Title:'Confirmation',
                    ContentHTML:'Do you want to submit your answers?',
                    ConfirmButtonLabel:'Yes',
                    CancelButtonLabel:'No'
                }
            },
            {parentComponent: self});

        init();

        function init()
        {
            jq$(pollGadgetSelector).on("keydown",'form input', onKeyDown);
            confirmDialog.CancelClick.addHandler(onCancelClick);
            confirmDialog.ConfirmClick.addHandler(onConfirmClick);
         
            jq$(pollGadgetSelector).on('click', 'form input[type=submit]', onSubmit);
            jq$(pollGadgetSelector).on('click', 'form input[type=checkbox], form input[type=radio]', onPressCheckbox);
         }
        
        function onSubmit() {
            return validator.validate();
        }

        function onPressCheckbox(e) {
            return validator.validateOption(e.target);
        }

        function onKeyDown(e) {

            if(e.which == 13 && validator.validate())
            {
                var confirmDialogElement = jq$("#" + confirmDialogId);
                var top = (jq$(window).height() - confirmDialogElement.outerHeight()) / 2;

                confirmDialog.show();
                confirmDialogElement.css({ top: top + "px" });
                return false;
            }
        }

        function onConfirmClick()
        {
            confirmDialog.hide();
            document.getElementById("pollBallotForm").submit();
        }

        function onCancelClick()
        {
            confirmDialog.hide();
        }
    }

    var instance;

    PollBallot.getInstance = function()
    {
        return instance || (instance = new PollBallot());
    };

})(window, window.WA);