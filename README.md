# sovalid
sovalid is a library for doing validation on javascript object. The library depends of nothing.<br>
It take only 5k in minified version. Just include it & work.<br><br>
How to use it ?<br><br>

First things to do is create an instance :<br>
<pre>
<code class="language-javascript">
var validator = sovalid(object_to_test);
</code>
</pre>
<p>

add Validation Rule</span> you can add new validation functions simply :<br>
<pre>
<code class="language-javascript">
validator.avr('nameYouWant', function);
</code>
</pre>

add Validation Part</span> You can create validation part :<br>
<pre>
<code  class="language-javascript">
validator.avp('part name', []);
</code>
</pre>
or
<pre>
<code  class="language-javascript">
validator.avp('employee_extra', ['property1', 'property2']);
</code>
</pre>

You can define your validation rule</span> By ruleMaker :<br>
<pre>
<code  class="language-javascript">
validator.rulemaker('property').required(true).av('minLength', 3).make('part name or nothing')
</code>
</pre> 
By json object :
<pre>
<code  class="language-javascript">
validator.addRule('property', {
                                required: false,
                                global: false,
                                validationRules: {},
                                activeDepends: [],
                                passiveDepends: []
                               });
</code>
</pre>
You can validate </span> by part :<br>
<pre>
<code  class="language-javascript">
validator.validateParts(['part name']);
</code>
</pre> 
by props array :
<pre>
<code  class="language-javascript">
validator.validateProps(['property1', 'property2']);
</code>
</pre> 
all validation you define :
<pre>
<code  class="language-javascript">
validator.validate();
</code>
</pre>
For more detail, you can use debug function on the validator or read the code.<br><br>
For example, take a simple object person that contains my informations :<br>
<pre>
<code class="language-json">
var objToTest = {
    person: {
        firstname: 'Kevin',
        lastname: 'Leclerc',
        age: 31
    }
};
</code>
</pre>
We want a simple validation like that :<br>
<pre>
<code class="language-javascript">
var sov = sovalid(objToTest);
sov.rulemaker('person.firstname').r(true).av('minLength', 8).make('a');
sov.rulemaker('person.lastname').r(true).av('maxLength', 6).make('b');
</code>
</pre>
We can apply the test with different way :<br>
<pre>
<code class="language-javascript">
sov.validate();
sov.validateParts(['a', 'b']);
sov.validateProps(['person.firstname', 'person.lastname']);
</code>
</pre>
If we don't need a variable but a simple fast test, we can do that :<br>
<pre>
<code class="language-javascript">
sovalid(objToTest)
.rulemaker('person.firstname').r(true).av('minLength', 8).make()
.rulemaker('person.lastname').r(true).av('maxLength', 6).make()
.validate();
</code>
</pre>
This is fast and easy !
