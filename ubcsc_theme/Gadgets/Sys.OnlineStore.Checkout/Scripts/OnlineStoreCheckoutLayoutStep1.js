(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaOnlineStoreCheckoutLayoutStep1)
    {
        window.WaOnlineStoreCheckoutLayoutStep1 = OnlineStoreCheckoutLayoutStep1;
    }

    function OnlineStoreCheckoutLayoutStep1(service, isAuthorized)
    {
        var container = document.getElementById('step-1'), $container = jq$(container), self = this,
          validator,
          loginURL = '/Sys/Login?ReturnUrl=%2fSys%2fStore%2fCheckout',
          formName = 'contact_details',
          form = jq$('form[name=' + formName + ']'),
          $terms = form.find('input.storeCheckoutTerm');

        self.render = render;
        self.checkEmail = checkEmail;
        self.activatePreload = activatePreload;
        self.deactivatePreload = deactivatePreload;
        self.saveContactModel = saveContactModel;
        self.emailExistErrorRender = emailExistErrorRender;
        self.checkEmailFailedRender = checkEmailFailedRender;

        init();

        function init()
        {
          validatorInit();
          jq$('#loginPageButton').on('click', function() { window.location.href = loginURL; });
          $terms.on('change', tryEnableNextButton);
          tryEnableNextButton();
        }

        function isCheckedTerms()
        {
          var checkedAllTerms = true;
          $terms.each(function(i, el)
          {
            checkedAllTerms = checkedAllTerms && el.checked;
          });

          return checkedAllTerms;
        }

        function validatorInit()
        {
          validator = new FormValidator({
            form: formName,
            autoConfig: true,
            validateOnBlur: true,
            onBlurField: onBlurValidate,
            onSubmit: onSubmitValidate
          });
        }

        function render()
        {
            service.getContactModel().done(function(model)
            {
              getEmailField().val(model.Email);
              getFirstNameField().val(model.FirstName);
              getLastNameField().val(model.LastName);
              getPhoneField().val(model.Phone);

              jq$(model.RulesAndTerms).each(function(i, id)
              {
                jq$('#term_' + id)[0].checked = true;
              });


              if (!isAuthorized && !model.Email) { disableNextButton(); }
              tryEnableNextButton();
            });
        }

        function getNextButton()
        {
            return $container.find('.wizardNextButton');
        }

        function tryEnableNextButton()
        {
          if (isCheckedTerms() && validator.validateForm())
          {
            enableNextButton();
          }
          else
          {
            disableNextButton();
          }
        }

        function tryHideNotifications()
        {
          if (validator.validateForm())
          {
            getExistEmailNotification().hide();
          }
        }

        function getEmailField()
        {
            return form.find('#billingDetails_email');
        }

        function getFirstNameField()
        {
            return form.find('#billingDetails_firstName');
        }

        function getLastNameField()
        {
            return form.find('#billingDetails_lastName');
        }

        function getPhoneField()
        {
            return form.find('#billingDetails_phone');
        }

        function checkEmail()
        {
            return service.checkEmail({
              Email: getEmailField().val()
            });
        }

        function getGeneralErrorNotification()
        {
          return jq$('#generalError');
        }

        function saveContactModel()
        {
          var checkedTerms = $terms
            .filter(function(i, el) { return el.checked; })
            .map(function(i, el) { return +$(el).val(); }).get();

           var model = {
             Email: getEmailField().val(),
             FirstName: getFirstNameField().val(),
             LastName: getLastNameField().val(),
             Phone: getPhoneField().val(),
             RulesAndTerms: checkedTerms
           };
           getGeneralErrorNotification().hide();
           getExistEmailNotification().hide();

           return service.saveContactModel(model);
        }

        function disableNextButton()
        {
            getNextButton().attr('disabled','disabled');
        }

        function enableNextButton()
        {
            getNextButton().removeAttr('disabled');
        }

        function activatePreload()
        {
            disableNextButton();
        }

        function deactivatePreload()
        {
            enableNextButton();
        }

        function onSubmitValidate(errors, evt)
        {
            if (errors.length > 0 || !isCheckedTerms()) {
              // var scrollTop = form.find('.formFieldContainer.error').offset().top - 20;
              // jq$('html').animate({ scrollTop: scrollTop }, 500);
              disableNextButton();
            } else {
              enableNextButton();
            }
        }

        function onBlurValidate(errors, evt)
        {
            var sender = jq$(evt.target);
            putErrors(errors, sender);
        }

        function putErrors(errors, sender)
        {
            if (!sender.next('.errorField').length)
            {
              sender.after('<div class="errorField"></div>');
            }

            var errorField = sender.next('.errorField');

            if (errors.length > 0) {
              errorField.html(errors[0].message).addClass('errorField__visible');
              sender.parents('.formFieldContainer').addClass('error');
              disableNextButton();
            } else {
              errorField.removeClass('errorField__visible');
              sender.parents('.formFieldContainer').removeClass('error');
              tryEnableNextButton();
              tryHideNotifications();
            }
        }

        function getExistEmailNotification()
        {
          return jq$('#existEmail');
        }

        function emailExistErrorRender()
        {
            putErrors([{ message: 'Already used' }], getEmailField());
            getExistEmailNotification().show();
        }

        function checkEmailFailedRender()
        {
            getGeneralErrorNotification().show();
            captchaReset();
        }
    }
})(window, window.WA);