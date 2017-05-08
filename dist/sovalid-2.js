"use strict";

/**
 This utils are created by Leclerc Kevin (leclerc.kevin@gmail.com)
 You work in 2 steps for create a validation.
 You use the ruleMaker for create rules.
 You use the sovalid for create a validator on the fly.
 You can use the created rules with another validator that use the rule object

 Separate both let you create dynamic validator with set of rules.
 the sovalid object is not important to keep.

 If you keep the sovalid Object, you keep all configurations you done.
 */
(function (window) {
    var common = (function () {
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
        function getBool(val) {
            if (val === undefined) {
                return false;
            }

            var num = +val;
            return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
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
            if (!prop || !common.isString(prop) || !prop.trim().length > 0) {
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

        return {
            isObject: isObject,
            isPlainObject: isPlainObject,
            getBool: getBool,
            isString: isString,
            isFunction: isFunction,
            get: get
        };
    })();

    var sovalid = function () {
        var _rules = {},
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
                validate: validate,
                validateProps: validateProps,
                validateParts: validateParts,
                addRule: addRule,
                ar: addRule,
                addRules: addRules,
                ars: addRules,
                deleteRule: deleteRule,
                dr: deleteRule,
                addValidationRule: addValidationRule,
                avr: addValidationRule,
                addValidationPart: addValidationPart,
                avp: addValidationPart,
                operand: OPERAND,
                op: OPERAND,
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
         * Add directly your property rule
         * @param   {Object} propRules [[Description]]
         * @returns {Object} functions usable on validator object
         */
        function addRule(propRules) {
            if (propRules && !Array.isArray(propRules) && propRules.name) {
                _rules[propRules.name] = propRules;
            }

            return _dsl;
        }

        /**
         *
         * @param propRulesArray
         * @returns {{validate: validate, validateProps: validateProps, validateParts: validateParts, addRule: addRule, ar: addRule, deleteRule: deleteRule, dr: deleteRule, addValidationRule: addValidationRule, avr: addValidationRule, addValidationPart: addValidationPart, avp: addValidationPart, operand: {greaterThan: number, gt: number, greaterThanOrEqual: number, gte: number, lowerThan: number, lt: number, lowerThanOrEqual: number, lte: number, equal: number, eq: number, strictlyEqual: number, seq: number, different: number, dif: number, strictlyDifferent: number, sdif: number}, op: {greaterThan: number, gt: number, greaterThanOrEqual: number, gte: number, lowerThan: number, lt: number, lowerThanOrEqual: number, lte: number, equal: number, eq: number, strictlyEqual: number, seq: number, different: number, dif: number, strictlyDifferent: number, sdif: number}, validationPartExist: validationPartExist, debug: debug}}
         */
        function addRules(propRulesArray) {

            if (propRulesArray && Array.isArray(propRulesArray)) {
                propRulesArray.forEach(function addEach(propRules) {
                    addRule(propRules);
                });
            }

            return _dsl;
        }

        /**
         * Delete a property rule
         * @param name
         * @returns {{validate: validate, validateProps: validateProps, validateParts: validateParts, addRule: addRule, ar: addRule, addRules: addRules, ars: addRules, deleteRule: deleteRule, dr: deleteRule, addValidationRule: addValidationRule, avr: addValidationRule, addValidationPart: addValidationPart, avp: addValidationPart, operand: {greaterThan: number, gt: number, greaterThanOrEqual: number, gte: number, lowerThan: number, lt: number, lowerThanOrEqual: number, lte: number, equal: number, eq: number, strictlyEqual: number, seq: number, different: number, dif: number, strictlyDifferent: number, sdif: number}, op: {greaterThan: number, gt: number, greaterThanOrEqual: number, gte: number, lowerThan: number, lt: number, lowerThanOrEqual: number, lte: number, equal: number, eq: number, strictlyEqual: number, seq: number, different: number, dif: number, strictlyDifferent: number, sdif: number}, validationPartExist: validationPartExist, debug: debug}}
         */
        function deleteRule(name) {
            delete _rules[name];

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
         * Execute validations defined for a property
         * @param _obj the object to test
         * @param   {Object} rule         [[Description]]
         * @param   {Object} currentValue [[Description]]
         * @param steps
         * @returns {Object} [[Description]]
         */
        function applyRule(_obj, rule, currentValue, steps) {
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
                    isFunctionRes = common.isFunction(rule.passiveDepends[i].value);

                    if ((isFunctionRes && rule.passiveDepends[i].value.call(this, common.get(_obj, rule.passiveDepends[i].prop))) ||
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
                    isFunctionRes = common.isFunction(rule.activeDepends[i].value);

                    if ((isFunctionRes && !rule.activeDepends[i].value.call(this, common.get(_obj, rule.activeDepends[i].prop))) ||
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
                } else return !(type !== 'number' && type !== 'boolean' && (!currentValue || (common.isString(currentValue) && currentValue.trim() === '')));
            }

            /**
             * @param   {object}  depend [[Description]]
             * @returns {boolean} [[Description]]
             */
            function executeCondition(depend) {
                var currentValue = common.get(_obj, depend.prop);

                if (typeof depend.value === 'number' && (currentValue === '' || currentValue === undefined || currentValue === null)) {
                    return false;
                } else if (typeof depend.value === 'boolean') {
                    currentValue = common.getBool(currentValue);
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

                            if (common.isFunction(rule.validationRules[keyPropRule].params.value)) {
                                validationResult = fn.call(this, currentValue, rule.validationRules[keyPropRule].params.value.call(this));
                            } else {
                                validationResult = fn.call(this, currentValue, rule.validationRules[keyPropRule].params);
                            }

                            if (common.isObject(validationResult)) {
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
         * @param _obj the object to test
         * @param {Array}    errors
         * @param {Object}   rule     object containing validation to do
         * @param {Array} steps Can be undefined if is not a validation part
         */
        function executeRule(_obj, errors, rule, steps) {
            if (rule) {
                var currentValue = common.get(_obj, rule.prop);

                var applyRuleObj = applyRule(_obj, rule, currentValue, steps);

                if (applyRuleObj.validationResult === false) {
                    errors.push({
                        prop: rule.prop,
                        value: currentValue,
                        error: applyRuleObj.error,
                        params: (applyRuleObj.params && applyRuleObj.params.value ? applyRuleObj.params.value : applyRuleObj.params)
                    });
                }
            }
        }

        /**
         * Execute the validation
         * @param _obj the object to test
         * @param {Array} errors
         * @param {Array} steps
         * @param {Array}    props    properties names Can be undefined if is not a validation part
         */
        function executeValidate(_obj, errors, steps, props, categories) {
            if (props) {
                for (var i = 0; i < props.length; i++) {
                    if (isContainsCategory(categories, _rules[props[i]].categories)) {
                        executeRule(_obj, errors, _rules[props[i]], steps);
                    }
                }
            } else {
                for (var prop in _rules) {
                    if (isContainsCategory(categories, _rules[prop].categories)) {
                        executeRule(_obj, errors, _rules[prop], steps);
                    }
                }
            }
        }

        function isContainsCategory(wantCats, ruleCats) {
            if (!wantCats || wantCats.length === 0) {
                return true;
            }

            if (ruleCats && ruleCats.length > 0) {
                for (var idx in wantCats) {
                    if (ruleCats.indexOf(wantCats[idx]) !== -1) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * validate all rules
         * @param   {boolean} justBool   is the validate return the resultat (boolean) or an object of errors
         * @param   {[[Type]]} _obj       the object to test
         * @param   {Array}    steps      steps to validate
         * @param   {[[Type]]} categories [[Description]]
         * @returns {Array}    array containing errors
         */
        function validate(justBool, _obj, steps, categories) {

            var errors = [];

            if (_obj) {
                executeValidate(_obj, errors, steps, undefined, categories);
            }

            if (justBool) {
                return (errors.length === 0);
            }
            
            return errors;
        }

        /**
         * Validate with an array of property names
         * @param   {boolean} justBool   is the validate return the resultat (boolean) or an object of errors
         * @param _obj the object to test
         * @param   {Array} props properties to validate
         * @param   {Array} steps steps to validate
         * @returns {Array} array containing errors
         */
        function validateProps(justBool, _obj, props, steps, categories) {

            var errors = [];

            if (_obj && props) {
                executeValidate(_obj, errors, steps, props, categories);
            }

            if (justBool) {
                return (errors.length === 0);
            }
            
            return errors;
        }

        /**
         * Validate with define parts
         * @param   {boolean} justBool   is the validate return the resultat (boolean) or an object of errors
         * @param _obj the object to test
         * @param   {Array} parts parts to validate
         * @param   {Array} steps steps to validate
         * @returns {Array} array containing errors
         */
        function validateParts(justBool, _obj, parts, steps, categories) {

            var errors = [];

            if (_obj && parts) {
                for (var i = 0; i < parts.length; i++) {
                    executeValidate(_obj, errors, steps, _validationParts[parts[i]]['props'], categories);
                }
            }

            if (justBool) {
                return (errors.length === 0);
            }
            
            return errors;
        }

        return _dsl;
    };

    /**
     * Help to the making of rules for a prop
     * @param name
     * @param   {String} prop     [[Description]]
     * @returns {object} functions usable on rulemaker object
     */
    var ruleMaker = (function () {
        var _propRules;
        var _nextIsNew = true;
        var _dslRule = {
            required: required,
            r: required,
            next: next,
            end: end,
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
            reset: reset,
            resetWorld: resetWorld,
            addCategories: addCategories,
            deleteCategories: deleteCategories
        };
        var creationOperationDsl = {
            newRule: newRule,
            modifyRule: modifyRule,
            resetWorld: resetWorld,
            startFrom: startFrom
        };
        var _propRulesArray;

        function startFrom(propRulesArray) {
            if (propRulesArray) {
                _propRulesArray = propRulesArray;

                _nextIsNew = false;
            }

            return creationOperationDsl;
        }

        /**
         *
         * @param name
         * @param prop
         * @returns {{required: required, r: required, make: make, addValidation: addValidation, av: addValidation, deleteValidation: deleteValidation, dv: deleteValidation, addActiveDepends: addActiveDepends, aad: addActiveDepends, addPassiveDepends: addPassiveDepends, apd: addPassiveDepends, global: global, g: global, reset: reset}}
         */
        function newRule(name, prop) {
            initPropRules();

            _propRules.name = name;
            _propRules.prop = prop;

            return _dslRule;
        }

        /**
         *
         * @param propRule
         * @returns {{required: required, r: required, next: next, end: end, addValidation: addValidation, av: addValidation, deleteValidation: deleteValidation, dv: deleteValidation, addActiveDepends: addActiveDepends, aad: addActiveDepends, addPassiveDepends: addPassiveDepends, apd: addPassiveDepends, global: global, g: global, reset: reset, resetWorld: resetWorld}}
         */
        function modifyRule(propRule) {
            if (propRule) {
                _propRules = propRule;

                return _dslRule;
            } else {
                return creationOperationDsl;
            }
        }

        function next() {
            if (_nextIsNew || !_propRulesArray) {
                _nextIsNew = false;
                _propRulesArray = [];
            }

            _propRulesArray.push(_propRules);

            return creationOperationDsl;
        }

        /**
         *
         */
        function initPropRules() {
            _propRules = {
                required: false,
                global: false,
                validationRules: {},
                activeDepends: [],
                passiveDepends: [],
                categories: []
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

        function resetWorld() {
            initPropRules();

            _nextIsNew = true;
            _propRulesArray = undefined;

            return creationOperationDsl;
        }

        /**
         * [[Description]]
         * @param   {String} vname [[Description]]
         * @param   {Object} value [[Description]]
         * @param steps
         * @returns {object} functions usable on rulemaker object
         */
        function addValidation(vname, value, steps) {
            if (common.isObject(value) && common.isPlainObject(value)) {
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

        function addCategories(categories) {
            if (categories) {
                _propRules.categories.push(categories);
            }

            return _dslRule;
        }

        function deleteCategories(categories) {
            if (categories) {
                for (var idx in categories) {
                    _propRules.categories.splice($.inArray(categories[idx], _propRules.categories), 1);
                }
            }

            return _dslRule;
        }

        /**
         * terminate the construction of rule(s) and return the array or object
         * @returns {*}
         */
        function end() {
            if (_propRulesArray) {
                _propRulesArray.push(_propRules);
                _nextIsNew = true;

                return _propRulesArray;
            } else {
                return _propRules;
            }
        }

        return creationOperationDsl;
    })();

    window.sovalid = sovalid;
    window.ruleMaker = ruleMaker;
    window.sovalidCommons = common;
})(window);
