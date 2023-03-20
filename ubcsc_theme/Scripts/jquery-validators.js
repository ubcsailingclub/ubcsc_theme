/* <form validation> */
/* [not required parameters] */
/* html: 
   <span
     validatorType="required|email|date|passwordCompare|minLength|method"
     controlToValidate="inputControlId"
     errorMessage="..."
     [validateOnLoad="true"]
     [validateOnType="true"]
     [validateOnBlur="true"]
     [display="dynamic|static"]
     [compareWith="anotherPasswordControlId"]
     [minLengthValue="decimalNumber"]
     [style="(display:none|visibility:hidden);"]
    >[*]</span>
/* usage: 
 $(document).ready(function() { $('#FormID').FormValidate([{ showSummary: true|false, validateOnLoad: true|false, errorMessageHeader: null|'anyheader' }]); }); */
/*********************/

jq$.iFormValidate =
  {
    build: function (user_options)
    {
      var defaults =
    {
      showSummary: true,
      validateOnLoad: false,
      errorMessageHeader: null
    };

      return jq$(this).each(
        function ()
        {
          var options = jq$.extend(defaults, user_options);
          var $validators = jq$(this).find('span').filter(function () { var validator = jq$(this).attr("validatorType"); return validator != null; });
          var $suppressValidationControls = jq$(this).find('input').filter(function () { var causesValidation = jq$(this).attr("causesValidation"); return causesValidation == 'false'; });

          jq$(this).submit(function ()
            {
                var isValid = jq$.iFormValidate.validateForm($validators, options.showSummary, options.errorMessageHeader);
                return isValid;
            });

          jq$.iFormValidate.setValidators($validators);
          jq$.iFormValidate.createValidatorsCollection($validators, $suppressValidationControls);

          if (options.validateOnLoad)
          {
            jq$.iFormValidate.validateForm($validators, false);
          }
          else
          {
            var $onLoadValidators = $validators.filter(function () { var validator = jq$(this).attr('validateOnLoad'); return (validator != null && validator == 'true'); });

            if ($onLoadValidators != null && $onLoadValidators.length > 0)
            {
              jq$.iFormValidate.validateForm($onLoadValidators, false);
            }
          }
        });
    },

    suppressValidation: false,

    validatorCollection: { },

    createValidatorsCollection: function ($validators, $suppressValidationControls)
    {
      $validators.each(putIntoCollection);
      $suppressValidationControls.each(suppressValidation);

      function putIntoCollection ()
      {
        var id = jq$(this).attr('controlToValidate');

        if (id != null && id.length > 0)
        {
          if (jq$.iFormValidate.validatorCollection[id] == null || jq$.iFormValidate.validatorCollection[id] == 'undefined')
          {
            jq$.iFormValidate.validatorCollection[id] = jq$([]);
          }

          jq$.iFormValidate.validatorCollection[id].push($(this));
        }
      }

      function suppressValidation ()
      {
        jq$(this).click(function () { jq$.iFormValidate.suppressValidation = true; });
      }
    },

    setValidators: function ($validators)
    {
      var alreadySet = [];

      $validators.each(setDefaultAttributes);
      $validators.each(setValidator);

      function setDefaultAttributes ()
      {
        var type = jq$(this).attr('validatorType');

        if (type == 'required')
        {
          if (jq$(this).attr('validateOnType') != 'false')
          {
            jq$(this).attr('validateOnType', 'true');
          }
        }

        if (type == 'minLength' || type == 'email' || type == 'passwordCompare')
        {
          if (jq$(this).attr('validateOnBlur') != 'false')
          {
            jq$(this).attr('validateOnBlur', 'true');
          }
        }
      }

      function setValidator ()
      {
        var validatorType = jq$(this).attr('validatorType');
        var id = jq$(this).attr('controlToValidate');
        var testErrorMessage = jq$(this).attr('errorMessage');

        if ((validatorType != 'method') && (id == null || id == 'undefined' || id.length == 0))
        {
          throw ('Undefined controlToValidate attribute. ValidatorType: ' + validatorType);
        }

        if (testErrorMessage == null || testErrorMessage == 'undefined' || testErrorMessage.length == 0)
        {
          throw ('Undefined errorMessage attribute. ValidatorType: ' + validatorType);
        }

        if (alreadySet[id] == null && (validatorType != 'method'))
        {
          alreadySet[id] = { };
          var $control = jq$('#' + id);

          $control.keyup(function () { jq$.iFormValidate.validateControl(this, 'validateOnType'); });
          $control.blur(function () { jq$.iFormValidate.validateControl(this, 'validateOnBlur'); });

          $control.filter("select").change(function () { jq$.iFormValidate.validateControl(this); });
        }
      }
    },

    validateControl: function (inputObject, validationEventName)
    {
      var $validators = jq$.iFormValidate.validatorCollection[inputObject.id];

      if (validationEventName)
      {
        $validators = $validators.filter(function () { var attribute = jq$(this).attr(validationEventName); return attribute != null && attribute == 'true'; });
      }

      if ($validators != null && $validators.length > 0)
      {
        jq$.iFormValidate.validateForm($validators, false);
      }
    },

    validateForm: function ($validators, showSummaryAlert, errorMessageHeader)
    {
      if (jq$.iFormValidate.suppressValidation)
      {
        return true;
      }
  
      var isValid = false;
      var errorMessage = '';

      $validators.each(jq$.iFormValidate.validate);
  
      var stopValidations = $validators.filter(function () { return $(this).attr('shouldStopValidation') != null; });
  
      if (stopValidations && stopValidations.length > 0){
        return false;
      }
  
      var $errors = $validators.filter(function () { return $(this).attr('invalid') != null; });

      if ($errors.length > 0)
      {
        if (showSummaryAlert)
        {
          if (errorMessageHeader != null)
          {
            errorMessage += errorMessageHeader + '\n\n';
          }
          $errors.each(collectErrors);
          alert(errorMessage);
          var $errorControl = jq$('#' + $errors.first().attr('controlToValidate'));
          if ($errorControl != null) { $errorControl.trigger('focus'); }
        }

        isValid = false;
      }
      else
      {
        isValid = true;
      }

      function collectErrors ()
      {
        var message = jq$(this).attr('errorMessage');

        if (message != null && message.length > 0)
        {
          errorMessage += '- ' + message + '\n';
        }
      }

      return isValid;
    },

    validate: function ()
    {
      var validatorType = jq$(this).attr('validatorType');
  
      var $controlToValidate = null;

      if (validatorType != 'method') {
        $controlToValidate = jq$('#' + $(this).attr('controlToValidate'));
      }
      
      var error = null;

      switch (validatorType)
      {
      case 'passwordCompare':
        {
          error = new jq$.iFormValidate.validator.passwordCompare(jq$(this), $controlToValidate).validate();
          break;
        }
      case 'email':
        {
          error = new jq$.iFormValidate.validator.email(jq$(this), $controlToValidate).validate();
          break;
        }
      case 'minLength':
        {
          error = new jq$.iFormValidate.validator.minLength(jq$(this), $controlToValidate).validate();
          break;
        }
      case 'required':
        {
          error = new jq$.iFormValidate.validator.required(jq$(this), $controlToValidate).validate();
          break;
        }
      case 'method':
        {
          validationResult = new jq$.iFormValidate.validator.method(jq$(this)).validate();
   
          error = validationResult.error;
  
          if (validationResult.shouldStopValidation)
            jq$(this).attr('shouldStopValidation', 'true');
          else
            jq$(this).removeAttr('shouldStopValidation');

          break;
        }
      case 'date':
        {
          error = new jq$.iFormValidate.validator.date(jq$(this), $controlToValidate).validate();
          break;
        }
      default:
        throw ('Validator type not supported: ' + validatorType);
      }
  
      if (error != null && error.length > 0)
      {
        jq$(this).attr('invalid', 'true');
        if (validatorType != 'method') { 
            setErrorStyle(jq$(this));
        }
      }
      else
      {
        jq$(this).removeAttr('invalid');
        if (validatorType != 'method') { 
            setNormalStyle(jq$(this));
        }
      }
  
      function setErrorStyle ($validator)
      {
        var displayType = $validator.attr('display');

        switch (displayType)
        {
        case 'dynamic':
          {
            $validator.css('display', 'block');
          }
        default:
          $validator.css('visibility', 'visible');
          break;

        }
      }

      function setNormalStyle ($validator)
      {
        var displayType = $validator.attr('display');

        switch (displayType)
        {
        case 'dynamic':
          {
            $validator.css('display', 'none');
          }
        default:
          $validator.css('visibility', 'hidden');
          break;

        }
      }

    },

    validator:
      {
        /* <validators> */

        passwordCompare: function ($validator, $controlToValidate)
        {
          var pThis = this;
          var val = $controlToValidate.val();
          var $compareWithControl = jq$('#' + $validator.attr('compareWith'));
          var compareWithValue = $compareWithControl.val();

          pThis.validate = validate;

          function init ()
          {
            if ($compareWithControl == null)
            {
              throw ('Invalid compareWith attribute');
            }
            if (compareWithValue == null || compareWithValue == 'undefined')
            {
              throw ('Invalid compareWith attribute');
            }
          }

          function validate ()
          {
            if (val != null && compareWithValue != null && val != 'undefined' && compareWithValue != 'undefined' && val === compareWithValue)
            {
              return '';
            }

            return $validator.attr('errorMessage');
          }

          init();
        },

        minLength: function ($validator, $controlToValidate)
        {
          var pThis = this;
          var val = $controlToValidate.val();
          var minLengthValue = parseInt($validator.attr('minLengthValue'), 10);

          pThis.validate = validate;

          function init ()
          {
            if (isNaN(minLengthValue) || minLengthValue < 0)
            {
              throw ('Invalid minLengthValue');
            }
          }

          function validate ()
          {
            if (val == null || val.length == 0 || val.length >= minLengthValue)
            {
              return '';
            }

            return $validator.attr('errorMessage');
          }

          init();
        },

        email: function ($validator, $controlToValidate)
        {
          var pThis = this;
          var Regex = /^\s*[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\s*$/ ;
          var val = $controlToValidate.val();

          pThis.validate = validate;

          function validate ()
          {
            if (val == null || val.length == 0 || Regex.test(val))
            {
              return '';
            }

            return $validator.attr('errorMessage');
          }
        },

        date: function ($validator, $controlToValidate)
        {
          var pThis = this;
          var Regex = /^([\d]|1[0,1,2]|0[1-9])(\-|\/|\.)([0-9]|[0,1,2][0-9]|3[0,1])(\-|\/|\.)\d{4}$/ ;
          var val = $controlToValidate.val();

          pThis.validate = validate;

          function validate ()
          {
            if (Regex.test(val))
            {
              return '';
            }

            return $validator.attr('errorMessage');
          }
        },

        required: function ($validator, $controlToValidate)
        {
          var pThis = this;
          var val = $controlToValidate.val();

          pThis.validate = validate;

          function validate ()
          {
            if (val != null && val != 'undefined' && val.length > 0)
            {
              return '';
            }

            return $validator.attr('errorMessage');
          }
        },

        method: function ($validator)
        {
          var pThis = this;

        pThis.validate = validate;

          function validate ()
          {
            var validationResult = { result: true, shouldStopValidation: false };
            $validator.trigger("wavalidate", [validationResult] );

            if (validationResult.result)
            {
                return {error: '', shouldStopValidation: validationResult.shouldStopValidation };
            }

            return {error: $validator.attr('errorMessage'), shouldStopValidation: validationResult.shouldStopValidation };
          }
        }

        /* <validators> */
      }
  };

jq$.fn.FormValidate = jq$.iFormValidate.build;

/* </form validation> */
