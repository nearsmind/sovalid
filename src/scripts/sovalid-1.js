"use strict";

/**
 This utils are created by Leclerc Kevin (leclerc.kevin@gmail.com)
 */
(function (window) {
    function validator(obj) {
        var _obj = obj,
            _rules = {},
            _functions,
            _validationParts = {},
            OPERAND = {
                greaterThan: 1,
                gt: 1,
                greaterThanOrEqual: 2,
                gte: 2,
                lowerThan: 3,
                lt: 3,
                lowerThanOrEqual: 4,
                lte: 4,
                equal: 5,
                eq: 5,
                strictlyEqual: 6,
                seq: 6,
                different: 7,
                dif: 7,
                strictlyDifferent: 8,
                sdif: 8
            },
            _dsl = {
                rulemaker: ruleMaker,
                validate: validate,
                validateProps: validateProps,
                validateParts: validateParts,
                addRule: addRule,
                ar: addRule,
                deleteRule: deleteRule,
                dr: deleteRule,
                addValidationRule: addValidationRule,
                avr: addValidationRule,
                addValidationPart: addValidationPart,
                avp: addValidationPart,
                operand: OPERAND,
                op: OPERAND,
                replaceObject: replaceObject,
                validationPartExist: validationPartExist,
                debug: debug
            };

        /**
         * Display all data of the object
         */
        function debug() {
            console.log(':::RULES:::');
            console.log(_rules);
            console.log(':::FUNCTIONS:::');
            console.log(_functions);
            console.log(':::VALIDATION PARTS:::');
            console.log(_validationParts);
        }

        /**
         * @param    item object to test
         * @returns {boolean} result of test
         */
        function isObject(item) {
            return (typeof item === "object" && !Array.isArray(item) && item !== null);
        }

        /**
         * Test if an object is a true object, not window or anything else
         * @param    item object to test
         * @returns {boolean} result of test
         */
        function isPlainObject(item) {
            return (item != null && Object.prototype.toString.call(item) === "[object Object]");
        }

        /**
         *
         * @param val
         * @returns {boolean}
         */
        function getBool(val){
            if (val === undefined) {
                return false;
            }

            var num = +val;
            return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
        }

        /**
         * @param    item object to test
         * @returns {boolean} result of test
         */
        function isString(item) {
            return (typeof item === "string");
        }

        /**
         * @param    item object to test
         * @returns {boolean} result of test
         */
        function isFunction(item) {
            return (typeof item === "function");
        }

        /**
         * get value of a property
         * @param   {object} o            the object containing the property
         * @param   {string}   prop         the property value to return
         * @param    defaultValue [[Description]]
         * @returns  Object value
         */
        function get(o, prop, defaultValue) {
            if (!prop || !isString(prop) || !prop.trim().length > 0) {
                return undefined;
            }

            var props = prop.split('.');
            var lastObj = o;

            if (props && props.length > 1) {
                //run into the object to got the value of prop
                for (var key in props) {
                    lastObj = lastObj[props[key]];
                }
            } else {
                lastObj = o[props[0]];
            }

            if (!lastObj && defaultValue) {
                return defaultValue;
            }

            return lastObj;
        }

        /**
         * Add directly your property rule
         * @param   {String} prop      [[Description]]
         * @param   {Object} propRules [[Description]]
         * @returns {Object} functions usable on validator object
         */
        function addRule(prop, propRules) {
            if (prop && propRules) {
                _rules[prop] = propRules;
            }

            return _dsl;
        }

        /**
         * Delete a property rule
         * @param   {String} prop [[Description]]
         * @returns {Object} functions usable on validator object
         */
        function deleteRule(prop) {
            delete _rules[prop];

            return _dsl;
        }

        /**
         * Define your own validation rule
         * @param   {String} vname   [[Description]]
         * @param   {Function} fn      [[Description]]
         * @returns {Object} functions usable on validator object
         */
        function addValidationRule(vname, fn) {
            if (vname && fn) {
                _functions[vname] = fn;
            }

            return _dsl;
        }

        /**
         * Define a validation part with an array of property name
         * @param   {String} pname [[Description]]
         * @param   {Object} props [[Description]]
         * @returns {Object} functions usable on validator object
         */
        function addValidationPart(pname, props) {
            if (pname && props) {
                _validationParts[pname] = {
                    props: props
                };
            }

            return _dsl;
        }

        /**
         * [[Description]]
         * @param   {String} pname [[Description]]
         * @returns {Object} [[Description]]
         */
        function validationPartExist(pname) {
            return (_validationParts[pname] ? true : false);
        }

        /**
         * You can easily replace the base object with a new one.
         * @param   {Object} newObj [[Description]]
         * @returns {Object} functions usable on validator object
         */
        function replaceObject(newObj) {
            _obj = newObj;

            return _dsl;
        }

        /**
         * Define basic rules
         */
        (function initRules() {
            _functions = {};

            _functions['min'] = function minRule(currentValue, params) {
                return (currentValue >= params.value);
            };

            _functions['max'] = function maxRule(currentValue, params) {
                return (currentValue <= params.value);
            };

            _functions['minLength'] = function minLengthRule(currentValue, params) {
                return (currentValue.length >= params.value);
            };

            _functions['maxLength'] = function maxLengthRule(currentValue, params) {
                return (currentValue.length <= params.value);
            };
        })();

        /**
         * Help to the making of rules for a prop
         * @param   {String} prop     [[Description]]
         * @returns {object} functions usable on rulemaker object
         */
        function ruleMaker(prop) {
            var _propRules;
            var _dslRule = {
                required: required,
                r: required,
                make: make,
                addValidation: addValidation,
                av: addValidation,
                deleteValidation: deleteValidation,
                dv: deleteValidation,
                addActiveDepends: addActiveDepends,
                aad: addActiveDepends,
                addPassiveDepends: addPassiveDepends,
                apd: addPassiveDepends,
                global: global,
                g: global,
                reset: reset
            };

            (function init() {
                if (_rules[prop]) {
                    _propRules = _rules[prop];
                } else {
                    initPropRules();
                }
            })();

            function initPropRules() {
                _propRules = {
                    required: false,
                    global: false,
                    validationRules: {},
                    activeDepends: [],
                    passiveDepends: []
                };
            }

            /**
             * [[Description]]
             * @returns {object} functions usable on rulemaker object
             */
            function reset() {
                initPropRules();

                return _dslRule;
            }

            /**
             * [[Description]]
             * @param   {String} vname [[Description]]
             * @param   {Object} value [[Description]]
             * @param steps
             * @returns {object} functions usable on rulemaker object
             */
            function addValidation(vname, value, steps) {
                if (isObject(value) && isPlainObject(value)) {
                    _propRules.validationRules[vname] = {
                        fn: vname,
                        params: value,
                        steps: steps
                    };
                } else {
                    _propRules.validationRules[vname] = {
                        fn: vname,
                        params: {
                            value: value
                        },
                        steps: steps
                    };
                }

                return _dslRule;
            }

            /**
             * [[Description]]
             * @param   {String} vname [[Description]]
             * @returns {object} functions usable on rulemaker object
             */
            function deleteValidation(vname) {
                delete _propRules.validationRules[vname];

                return _dslRule;
            }

            /**
             * define if a rule concerns a specific property or if the rule is global
             * @param   {Boolean} value [[Description]]
             * @returns {object} functions usable on rulemaker object
             */
            function global(value) {
                _propRules.global = value;

                return _dslRule;
            }

            /**
             * define if a value is required
             * @param   {Boolean} value [[Description]]
             * @param steps
             * @returns {object} functions usable on rulemaker object
             */
            function required(value, steps) {
                _propRules.required = value;
                _propRules.requiredSteps = steps;

                return _dslRule;
            }

            /**
             * define active depends. If a property contains such value, execute validations
             * @param   {String} prop         [[Description]]
             * @param   {Object} waitingValue [[Description]]
             * @param operand
             * @returns {object} functions usable on rulemaker object
             */
            function addActiveDepends(prop, waitingValue, operand) {
                _propRules.activeDepends.push({
                    prop: prop,
                    value: waitingValue,
                    operand: operand
                });

                return _dslRule;
            }

            /**
             * define passivate depends that said if a prop must be test
             * @param   {string} prop         [[Description]]
             * @param    waitingValue [[Description]]
             * @param   {boolean} mustBeValid  [[Description]]
             * @param   {String} operand      [[Description]]
             * @returns {object} functions usable on rulemaker object
             */
            function addPassiveDepends(prop, waitingValue, mustBeValid, operand) {
                _propRules.passiveDepends.push({
                    prop: prop,
                    value: waitingValue,
                    mustBeValid: mustBeValid,
                    operand: operand
                });

                return _dslRule;
            }

            /**
             * Add the property rule to the rules array
             * @param   {String} pname [[Description]]
             * @returns {Object} functions usable on validator object
             */
            function make(pname) {
                if (pname && _validationParts[pname]) {
                    _validationParts[pname]['props'].push(prop);
                }

                _rules[prop] = _propRules;

                return _dsl;
            }

            return _dslRule;
        }

        /**
         * Execute validations defined for a property
         * @param   {Object} rule         [[Description]]
         * @param   {Object} currentValue [[Description]]
         * @param steps
         * @returns {Object} [[Description]]
         */
        function applyRule(rule, currentValue, steps) {
            var validationResult = true;
            var error = undefined;
            var params = undefined;
            var isForceValidation = false;

            /**
             * Check if depends are satisfied and the requirement of a value
             */
            (function doPreValidation() {
                var isFunctionRes;
                var i;
                var isContainsValue = checkIfContainsValue(currentValue);

                //check the passive depends rules. If a rule is true, the value become required
                for (i = 0; i < rule.passiveDepends.length; i++) {
                    isFunctionRes = isFunction(rule.passiveDepends[i].value);

                    if ((isFunctionRes && rule.passiveDepends[i].value.call(this, get(_obj, rule.passiveDepends[i].prop))) ||
                        (!isFunctionRes && executeCondition(rule.passiveDepends[i]))) {

                        //if the depends is true, force the validation
                        isForceValidation = true;
                    } else if (rule.passiveDepends[i].mustBeValid) {
                        //if the passive depends is not true, the validation must not be done
                        validationResult = true;

                        return;
                    }
                }

                //if the value is required by passive depends and the value is null
                if (isForceValidation && !isContainsValue) {
                    error = 'required';
                    validationResult = false;

                    return;
                }

                //check the normal depends rules.
                for (i = 0; i < rule.activeDepends.length; i++) {
                    isFunctionRes = isFunction(rule.activeDepends[i].value);

                    if ((isFunctionRes && !rule.activeDepends[i].value.call(this, get(_obj, rule.activeDepends[i].prop))) ||
                        (!isFunctionRes && !executeCondition(rule.activeDepends[i]))) {

                        //if the depends is not true, bypass the validation
                        validationResult = true;

                        return;
                    }
                }

                if (rule.global) { //checks for not specific property
                    doValidation();
                } else if (rule.required) { //if a value is required
                    if (isContainsSteps(steps, rule.requiredSteps) && !isContainsValue) {
                        error = 'required';
                        validationResult = false;
                    } else {
                        doValidation();
                    }

                } else {
                    if (isContainsValue) {
                        doValidation();
                    } else {
                        validationResult = true;
                    }
                }
            })();

            /**
             * @returns {boolean}  [[Description]]
             * @param currentValue
             */
            function checkIfContainsValue(currentValue) {
                var type = typeof currentValue;

                //test if the value is a boolean and is define with valid values (true/false)
                if (type === 'boolean' && (currentValue === null || currentValue === undefined)) {

                    return false;

                    //else test if the value is not a number/boolean and if the value is define or if the value is a string with only space
                } else return !(type !== 'number' && type !== 'boolean' && (!currentValue || (isString(currentValue) && currentValue.trim() === '')));
            }

            /**
             * @param   {object}  depend [[Description]]
             * @returns {boolean} [[Description]]
             */
            function executeCondition(depend) {
                var currentValue = get(_obj, depend.prop);

                if (typeof depend.value === 'number' && (currentValue === '' || currentValue === undefined || currentValue === null)) {
                    return false;
                } else if (typeof depend.value === 'boolean') {
                    currentValue = getBool(currentValue);
                }

                switch (depend.operand) {
                    case OPERAND.greaterThan:
                        return (currentValue > depend.value);
                    case OPERAND.greaterThanOrEqual:
                        return (currentValue >= depend.value);
                    case OPERAND.lowerThan:
                        return (currentValue < depend.value);
                    case OPERAND.lowerThanOrEqual:
                        return (currentValue <= depend.value);
                    case OPERAND.equal:
                        return (currentValue == depend.value);
                    case OPERAND.strictlyEqual:
                        return (currentValue === depend.value);
                    case OPERAND.different:
                        return (currentValue != depend.value);
                    case OPERAND.strictlyDifferent:
                    default:
                        return (currentValue !== depend.value);
                }
            }

            /**
             * Execute the validation rule
             */
            function doValidation() {
                //If the step required is not in the checked steps and the value is undefined, so don't validate it
                if (!rule.global && (currentValue === undefined || currentValue === null)) {
                    return;
                }

                for (var keyPropRule in rule.validationRules) {
                    if (rule.validationRules.hasOwnProperty(keyPropRule)) {
                        if (isContainsSteps(steps, rule.validationRules[keyPropRule].steps)) {
                            var fn = _functions[rule.validationRules[keyPropRule].fn];

                            if (isFunction(rule.validationRules[keyPropRule].params.value)) {
                                validationResult = fn.call(this, currentValue, rule.validationRules[keyPropRule].params.value.call(this));
                            } else {
                                validationResult = fn.call(this, currentValue, rule.validationRules[keyPropRule].params);
                            }

                            if (isObject(validationResult)) {
                                if (!validationResult.result) {
                                    if (validationResult.error) {
                                        error = validationResult.error;
                                    } else {
                                        error = keyPropRule;
                                    }

                                    params = rule.validationRules[keyPropRule].params;

                                    validationResult = validationResult.result;

                                    return;
                                }

                                validationResult = true;
                            } else if (!validationResult) {
                                error = keyPropRule;
                                params = rule.validationRules[keyPropRule].params;

                                return;
                            }
                        }
                    }
                }
            }

            /**
             * @param   {Array} wantSteps steps to validate
             * @param   {Array} ruleSteps steps define on a rule
             * @returns {boolean}  execute the rule or not
             */
            function isContainsSteps(wantSteps, ruleSteps) {
                if (!wantSteps || wantSteps.length === 0) {
                    return true;
                }

                if (ruleSteps && ruleSteps.length > 0) {
                    for (var idx in wantSteps) {
                        if (ruleSteps.indexOf(wantSteps[idx]) !== -1) {
                            return true;
                        }
                    }
                }

                return false;
            }

            return {
                validationResult: validationResult,
                error: error,
                params: params
            };
        }

        /**
         * Execute the rule
         * @param {Array}    errors
         * @param {Object}   rule     object containing validation to do
         * @param {String}   prop     property to validate
         * @param {Array} steps Can be undefined if is not a validation part
         */
        function executeRule(errors, rule, prop, steps) {
            if (rule) {
                var currentValue = get(_obj, prop);

                var applyRuleObj = applyRule(rule, currentValue, steps);

                if (applyRuleObj.validationResult === false) {
                    errors.push({
                        prop: prop,
                        value: currentValue,
                        error: applyRuleObj.error
                    });
                }
            }
        }

        /**
         * Execute the validation
         * @param {Array} errors
         * @param {Array} steps
         * @param {Array}    props    properties names Can be undefined if is not a validation part
         */
        function executeValidate(errors, steps, props) {
            if (props) {
                for (var i = 0; i < props.length; i++) {
                    executeRule(errors, _rules[props[i]], props[i], steps);
                }
            } else {
                for (var prop in _rules) {
                    executeRule(errors, _rules[prop], prop, steps);
                }
            }
        }

        /**
         * validate all rules
         * @param   {Array} steps steps to validate
         * @returns {Array} array containing errors
         */
        function validate(steps) {

            var errors = [];

            executeValidate(errors, steps);

            return errors;
        }

        /**
         * Validate with an array of property names
         * @param   {Array} props properties to validate
         * @param   {Array} steps steps to validate
         * @returns {Array} array containing errors
         */
        function validateProps(props, steps) {

            var errors = [];

            if (props) {
                executeValidate(errors, steps, props);
            }

            return errors;
        }

        /**
         * Validate with define parts
         * @param   {Array} parts parts to validate
         * @param   {Array} steps steps to validate
         * @returns {Array} array containing errors
         */
        function validateParts(parts, steps) {

            var errors = [];

            if (parts) {
                for (var i = 0; i < parts.length; i++) {
                    executeValidate(errors, steps, _validationParts[parts[i]]['props']);
                }
            }

            return errors;
        }

        return _dsl;
    }

    window.sovalid = validator;

})(window);
