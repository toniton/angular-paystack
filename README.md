# angular-paystack
This is an angular library for implementing paystack payment gateway
### Get Started
This library would help you add paystack payment gateway to your angular projects in no time. All you need to do is ...
### Install

##### Bower
```
Bower install angular-paystack
```

##### Npm
```
npm install angular-paystack
```

### Usage
```html
<!-- The text attribute can also take custom html, but does not compile directives yet-->
<!-- The beforepopup attribute is not required. But, if it's added then it must return true for the payment dialog to open-->
<paystack-pay-button
        class="yellow"
        text="<small><b>Pay</b> Me Now!</small>"
        email="$scope.email"
        amount="$scope.amount"
        reference="$scope.reference"
        beforepopup="$scope.beforePopUp"
        metadata="$scope.metadata"
        callback="$scope.callback"
        close="$scope.close">
</paystack-pay-button>
```

```javascript
var app = angular.module("MyApp", ['paystack']);

//Set the Api Public Key!
app.config(['$paystackProvider', function ($paystackProvider) {
    $paystackProvider.configure({
        key: 'pk_test_########################################'
    });
}]);

app.controller("FooController", function ($scope) {
    //Unique transaction reference or order number
    $scope.reference = "####-####-####-####";
    
    //The customer's email address.
    $scope.email = "johndoe@example.com";
    
    //Amount you want to bill the customer in kobo for NGN
    $scope.amount = "100000"; //equals N1000
    
    //Metadata is optional
    $scope.metadata = {
        custom_fields: [
            {
                display_name: "Phone Number",
                variable_name: "phone",
                value: "+234##########"
            }
        ]
    };

    //Javascript function that is called before payment dialog is opened
    $scope.beforePopUp = function () {
        console.log("Now we can perform some task before opening the payment dialog");
        return true;
    };
    
    //Javascript function that is called when the payment is successful
    $scope.callback = function (response) {
        console.log(response);
    };
    
    //Javascript function that is called if the customer closes the payment window
    $scope.close = function () {
        console.log("Payment closed");
    };
});
```
Please checkout [Paystack Documentation](https://developers.paystack.co/docs/paystack-inline) for other available options you can add to the directive

## Deployment
Remember to change the key when deploying on a live system

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Some commit message'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request :D
6. Your name shows up in credits

## Credits
* **Akinjiola Toni** *Toniton* [sails-hook-datatable](https://github.com/toniton/sails-hook-datatable)

* **Kevin Constantine** *K-Constantine* [kitchen](https://github.com/K-Constantine/Kitchen)


## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

