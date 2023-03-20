(function (window, WA, undefined)
{
    'use strict';

    if (!window.WaBasicWizard)
    {
        window.WaBasicWizard = BasicWizard;
    }

    function BasicWizard(userOptions)
    {
        if(!userOptions || !userOptions.element) return;

        var defaults = {
                selected: 0, // Initial selected step, 0 = first step
                stepsBarContainer: 'ul', // Selector for steps container
                stepsElements: '> * > .step', // Selector fot certain steps
                pagesContainer: '.pagesContainer', // Selector for page container
                pagesElements: '*', // Selector for content pages
                backButtonSupport: true, // Enable the back button support
                useURLhash: true, // Enable selection of the step based on url hash
                showStepURLhash: true, // Show url hash based on step
                anchorSettings: {
                    anchorClickable: true, // Enable/Disable anchor navigation
                    enableAllAnchors: false, // Activates all anchors clickable all times
                    markDoneStep: true, // Add done css
                    markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
                    removeDoneStepOnNavigateBack: false, // While navigate back done step after active step will be cleared
                    enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
                },
                disabledSteps: [] // Array Steps disabled
            };

        var self         = this,
            options      = $.extend(true, {}, defaults, userOptions), // Extend options
            main         = jq$(options.element), // Main container element
            nav          = main.children(options.stepsBarContainer), // Navigation bar element
            steps        = jq$(options.stepsElements, nav), // Step anchor elements
            container    = main.find(options.pagesContainer), // Content container
            pages        = container.children(options.pagesElements), // Content pages
            currentIndex = null; // Active step index

        // Call initial method
        init();

        function init()
        {
            // Set the elements
            setElements();
            // Assign plugin events
            // setEvents();

            var idx = options.selected;

            // Get selected step from the url
            idx = getSelectedStepFromUrl(idx);

            // Mark previous steps of the active step as done
            if (idx > 0 && options.anchorSettings.markDoneStep && options.anchorSettings.markAllPreviousStepsAsDone) {
                steps.eq(idx).parent().prevAll().addClass('done');
            }

            // Show the initial step
            showStep(idx);
        }

        function getSelectedStepFromUrl(idx)
        {
            if (!options.useURLhash)
            {
                return idx;
            }

            var hash = window.location.hash;

            if ( !hash || hash.length == 0 )
            {
                return idx;
            }

            var elm = jq$('.step[href*="' + hash + '"]', nav);

            if (elm.length)
            {
                var id = steps.index(elm);
                idx = id >= 0 ? id : idx;
            }

            return idx;
        }

        function setElements()
        {
            // Set the main element
            main.addClass('basicWizward_main');
            // Set anchor elements
            nav.addClass('bw_nav bw_navTabs bw_stepAnchor'); // nav-justified  nav-pills
            // Make the anchor clickable
            if (options.anchorSettings.enableAllAnchors !== false && options.anchorSettings.anchorClickable !== false)
            {
                steps.parent().addClass('clickable');
            }
            // Set content container
            container.addClass('bw_container bw_tabContent');
            // Set content pages
            pages.addClass('bw_stepContent');

            // Disabled steps
            if (options.disabledSteps && options.disabledSteps.length > 0) {
                jq$.each(options.disabledSteps, function (i, n) {
                    steps.eq(n).parent().addClass('disabled');
                });
            }

            return true;
        }

        function setEvents()
        {
            // Anchor click event
            jq$(steps).on('click', function (e) {
                e.preventDefault();
                if (options.anchorSettings.anchorClickable === false) {
                    return true;
                }
                var idx = steps.index(this);
                if (options.anchorSettings.enableAnchorOnDoneStep === false && steps.eq(idx).parent().hasClass('done')) {
                    return true;
                }

                if (idx !== currentIndex) {
                    if (options.anchorSettings.enableAllAnchors !== false && options.anchorSettings.anchorClickable !== false) {
                        showStep(idx);
                    } else {
                        if (steps.eq(idx).parent().hasClass('done')) {
                            showStep(idx);
                        }
                    }
                }
            });

            // Back/forward browser button event
            if (options.backButtonSupport) {
                jq$(window).on('hashchange', function (e) {
                    if (!options.useURLhash) {
                        return true;
                    }
                    if (window.location.hash) {
                        var elm = jq$('.step[href*="' + window.location.hash + '"]', nav);
                        if (elm && elm.length > 0) {
                            e.preventDefault();
                            showStep(steps.index(elm));
                        }
                    }
                });
            }

            return true;
        }

        function showNext()
        {
            var si = currentIndex + 1;
            // Find the next not disabled step
            for (var i = si; i < steps.length; i++) {
                if (!steps.eq(i).parent().hasClass('disabled')) {
                    si = i;
                    break;
                }
            }

            if (steps.length <= si)
            {
                return false;
            }

            showStep(si);

            return true;
        }

        function showPrevious()
        {
            var si = currentIndex - 1;
            // Find the previous not disabled step
            for (var i = si; i >= 0; i--) {
                if (!steps.eq(i).parent().hasClass('disabled')) {
                    si = i;
                    break;
                }
            }
            if (0 > si)
            {
                return false;
            }

            showStep(si);

            return true;
        }

        function showStep(idx)
        {
            // If step not found, skip
            if (!steps.eq(idx)) {
                return false;
            }
            // If current step is requested again, skip
            if (idx == currentIndex) {
                return false;
            }
            // Load step content
            loadStepContent(idx);

            return true;
        }

        function loadStepContent(idx)
        {
            // Get current step elements
            var curTab = steps.eq(currentIndex);
            // Get the direction of step navigation
            var stepDirection = '';
            var elm = steps.eq(idx);

            if (currentIndex !== null && currentIndex !== idx) {
                stepDirection = currentIndex < idx ? 'forward' : 'backward';
            }

            // Trigger 'leaveStep' event
            if (currentIndex !== null && triggerEvent('leaveStep', [curTab, currentIndex, stepDirection]) === false) {
                return false;
            }

            // Show step
            transitPage(idx);

            return true;
        }

        function transitPage(idx)
        {
            // Get current step elements
            var curTab = steps.eq(currentIndex);
            var curPage = curTab.length > 0 ? jq$(curTab.attr('href'), main) : null;
            // Get step to show elements
            var selTab = steps.eq(idx);
            var selPage = selTab.length > 0 ? jq$(selTab.attr('href'), main) : null;
            // Get the direction of step navigation
            var stepDirection = '';
            if (currentIndex !== null && currentIndex !== idx) {
                stepDirection = currentIndex < idx ? 'forward' : 'backward';
            }

            var stepPosition = 'middle';
            if (idx === 0) {
                stepPosition = 'first';
            } else if (idx === steps.length - 1) {
                stepPosition = 'final';
            }

            if (curPage && curPage.length > 0) {
                curPage.hide();
            }
            selPage.show();

            // Change the url hash to new step
            setURLHash(selTab.attr('href'));
            // Update controls
            setAnchor(idx);
            // Update the current index
            currentIndex = idx;

            // Trigger 'showStep' event
            triggerEvent('showStep', [selTab, currentIndex, stepDirection, stepPosition]);

            return true;
        }

        function setAnchor(idx)
        {
            // Current step anchor > Remove other classes and add done class
            steps.eq(currentIndex).parent().removeClass('active loading');
            if (options.anchorSettings.markDoneStep !== false && currentIndex !== null) {
                steps.eq(currentIndex).parent().addClass('done');
                if (options.anchorSettings.removeDoneStepOnNavigateBack !== false) {
                    steps.eq(idx).parent().nextAll().removeClass('done');
                }
            }

            // Next step anchor > Remove other classes and add active class
            steps.eq(idx).parent().removeClass('done loading').addClass('active');

            return true;
        }

        // HELPER FUNCTIONS

        function triggerEvent(name, params)
        {
            // Trigger an event
            var e = jq$.Event(name);
            main.trigger(e, params);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return e.result;
        }

        function setURLHash(hash)
        {
            if (options.showStepURLhash && window.location.hash !== hash) {
                window.location.hash = hash;
            }
        }

        // PUBLIC FUNCTIONS
        self.next = next;
        self.prev = prev;
        self.getStep = getStep;
        self.reset = reset;
        self.showModalStep = showModalStep;
        self.hideModalStep = hideModalStep;

        function next()
        {
            showNext();
        }

        function prev()
        {
            showPrevious();
        }

        function getStep()
        {
            return +currentIndex;
        }

        function reset()
        {
            // Trigger 'beginReset' event
            if (triggerEvent('beginReset') === false)
            {
                return false;
            }

            // Reset all elements and classes
            pages.hide();
            currentIndex = null;
            setURLHash(steps.eq(options.selected).attr('href'));
            steps.removeClass();
            steps.parents().removeClass();
            steps.data('has-content', false);
            init();

            // Trigger 'endReset' event
            triggerEvent('endReset');
        }

        function showModalStep(name)
        {
            // hide all pages
            pages.hide();
            steps.hide();
            jq$(name, main).show();
        }

        function hideModalStep(name)
        {
            reset();
        }
    }
})(window, window.WA);