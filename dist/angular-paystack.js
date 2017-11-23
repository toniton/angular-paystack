/*! angular-paystack 0.1.0 2016-19-12
 *  AngularJS directives for Paystack Payment Gateway
 *  git: https://github.com/toniton/angular-paystack.git
 */

(function (window, angular, undefined) {
    'use strict';
    /*
     !
     The MIT License

     Copyright (c) 2010-2013 Google, Inc. http://angularjs.org

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the 'Software'), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in
     all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     THE SOFTWARE.

     angular-paystack
     https://github.com/toniton/angular-paystack.git

     @authors
     Toniton - https://ng.linkedin.com/in/toni-akinjiola-42ba7a94
     */

    (function () {
        angular.module('paystack.providers', []);
        angular.module('paystack', ['paystack.providers']);
    }).call(this);

    (function () {
        var options = {
            transport: 'https',
            preventLoad: false,
            key: ''
        };
        angular.module('paystack.providers').factory('paystackScriptLoader', [
            '$q', function ($q) {
                var getScriptUrl, includeScript, isPaystackLoaded, scriptId;
                scriptId = void 0;
                getScriptUrl = function (options) {
                    if (options.transport === 'auto') {
                        return '//js.paystack.co/v1/inline.js';
                    } else {
                        return options.transport + '://js.paystack.co/v1/inline.js';
                    }
                };
                includeScript = function (options) {
                    var omitOptions, script, scriptElem;
                    if (scriptId) {
                        scriptElem = document.getElementById(scriptId);
                        scriptElem.parentNode.removeChild(scriptElem);
                    }
                    script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = getScriptUrl(options);
                    return document.body.appendChild(script);
                };
                isPaystackLoaded = function () {
                    return angular.isDefined(window.PaystackPop) && angular.isDefined(window.PaystackPop.setup);
                };
                return {
                    load: function (options) {
                        var deferred;
                        deferred = $q.defer();
                        if (isPaystackLoaded()) {
                            deferred.resolve(window.PaystackPop);
                            return deferred.promise;
                        }
                        if (window.navigator.connection && window.Connection && window.navigator.connection.type === window.Connection.NONE && !options.preventLoad) {
                            document.addEventListener('online', function () {
                                if (!isPaystackLoaded()) {
                                    return includeScript(options);
                                }
                            });
                        } else if (!options.preventLoad) {
                            includeScript(options);
                        }
                        return deferred.promise;
                    }
                };
            }
        ]).provider('$paystack', function () {
            this.configure = function (_options) {
                angular.extend(options, _options);
            };
            this.$get = [
                'paystackScriptLoader', (function (_this) {
                    return function (loader) {
                        return loader.load(options);
                    };
                })(this)
            ];
            return this;
        });

        angular.module('paystack').directive('paystackPayButton', [
            '$paystack', function (paystackApi) {
                return {
                    restrict: 'EMA',
                    template: function (elem, attrs) {
                        if(attrs.text){
                            return '<button class="paystack-pay-button {{class}}">'+attrs.text+'</button>';
                        }
                        return '<button class="paystack-pay-button {{class}}">Make Payment</button>';
                    },
                    replace: true,
                    scope: {
                        class: '@',
                        email: '=',
                        amount: '=',
                        reference: '=',
                        beforepopup: '=?',
                        callback: '=?',
                        metadata: '=?',
                        close: '=?',
                        currency: '=?',
                        plan: '=?',
                        quantity: '=?',
                        subaccount: '=?',
                        transaction_charge: '=?',
                        bearer: '=?'
                    },
                    link: function (scope, element, attrs) {
                        scope.text = attrs.text || "Make Payment";
                        return paystackApi.then((function (_this) {
                            angular.element(element).click(function () {
                                var beforePopUp = (scope.beforepopup !== 'undefined') ? scope.beforepopup() : true;
                                var handler = PaystackPop.setup({
                                    key: options.key,
                                    email: scope.email,
                                    amount: scope.amount,
                                    ref: scope.reference,
                                    metadata: scope.metadata,
                                    callback: function (response) {
                                        scope.callback(response);
                                    },
                                    onClose: function () {
                                        scope.close();
                                    },
                                    currency: scope.currency,
                                    plan: scope.plan,
                                    quantity: scope.quantity,
                                    subaccount: scope.subaccount,
                                    transaction_charge: scope.transaction_charge,
                                    bearer: scope.bearer
                                });

                                if (beforePopUp) {
	                                handler.openIframe();
                                }
                            });
                        })(this));
                    }
                };
            }
        ]);

    }).call(this);

})(window, angular);