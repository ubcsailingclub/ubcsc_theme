<$if(Model.IsInvisible)$> 
    <input id="g-recaptcha-invisible_<$Model.ParentId$>" name="g-recaptcha-invisible" value="recaptcha" type="hidden"/> 
    <div id="recapcha_placeholder_<$Model.ParentId$>" style="display:none"></div>
    <span id="idReCaptchaValidator_<$Model.ParentId$>" errorMessage="<$Model.ErrorMessage$>" style="display:none" validatorType="method" ></span>
    <script>
        $("#idReCaptchaValidator_<$Model.ParentId$>").on( "wavalidate", function(event, validationResult) {
            if (grecaptcha.getResponse(widgetId_<$Model.ParentId$>).length == 0){
                grecaptcha.execute(widgetId_<$Model.ParentId$>);	
                validationResult.shouldStopValidation = true;
                return;
            }

            validationResult.result = true;
        });
  
            var widgetId_<$Model.ParentId$>;

            var onloadCallback_<$Model.ParentId$> = function() {
                // Renders the HTML element with id 'recapcha_placeholder_<$Model.ParentId$>' as a reCAPTCHA widget.
                // The id of the reCAPTCHA widget is assigned to 'widgetId_<$Model.ParentId$>'.
                widgetId_<$Model.ParentId$> = grecaptcha.render('recapcha_placeholder_<$Model.ParentId$>', {
                'sitekey' : '<$Model.SiteKey$>',
                'size': 'invisible',
                'callback': function(){
                    document.getElementById('g-recaptcha-invisible_<$Model.ParentId$>').form.submit();
                },
                'theme' : 'light'
            });
        };
    </script>
	
    <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback_<$Model.ParentId$>&render=explicit" async defer></script>

 <$else$>
    <div id="recapcha_placeholder_<$Model.ParentId$>"></div>
	
    <span id="idReCaptchaValidator_<$Model.ParentId$>" errorMessage="<$Model.ErrorMessage$>" style="display:none" validatorType="method" ></span>
	
	<script>
        $("#idReCaptchaValidator_<$Model.ParentId$>").on( "wavalidate", function(event, validationResult) {	
            validationResult.result = grecaptcha.getResponse(widgetId_<$Model.ParentId$>).length != 0;
        });

        var widgetId_<$Model.ParentId$>;
  
        var onloadCallback_<$Model.ParentId$> = function() {
            // Renders the HTML element with id 'recapcha_placeholder_<$Model.ParentId$>' as a reCAPTCHA widget.
            // The id of the reCAPTCHA widget is assigned to 'widgetId_<$Model.ParentId$>'.
            widgetId_<$Model.ParentId$> = grecaptcha.render('recapcha_placeholder_<$Model.ParentId$>', {
            'sitekey' : '<$Model.SiteKey$>',
            'theme' : 'light'
            });
        };
	</script>
	
    <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback_<$Model.ParentId$>&render=explicit" async defer></script>
<$endif$>
