const artyom = new Artyom();

var $startListening = $('.start-listen');
var stopped;
if ($startListening.text() == 'Disable Listening')
{stopped = false;
}
else {
stopped = true;
}

$startListening.click(function(){
if (stopped == true){
stopped = false;
$startListening.text('Disable Listening');
    artyom.initialize({
        lang:"en-GB",
        continuous:true,
        debug:true,
        listen:true
});
}
else{
stopped = true;
$startListening.text('Enable Listening');
artyom.fatality();
}
});
function command(com){
var jqxhr = $.get( "/commands?value="+com, function() {
  alert( "success" );
})
  .done(function() {
   artyom.say("successfully executed "+com);
  })
  .fail(function() {
    alert( "execution of "+com+ " failed");
  })
return jqxhr
}

var $input = $('.js-text');
function submitInput() {
        var inputData = {
          'text': $input.val()
        }

        // Display the user's input on the web page
        createRow(inputData.text);

        var $submit = $.ajax({
          type: 'GET',
          url: "commands?value="+$input.val(),
          data: JSON.stringify(inputData),
          contentType: 'application/json'
        });

        $submit.done(function(statement) {
            console.log(statement);
            createRow(statement.value);
            artyom.say(statement.value);
            $input.val('');
            $chatlog[0].scrollTop = $chatlog[0].scrollHeight;
        });

        $submit.fail(function() {
          // TODO: Handle errors
        });
      }
artyom.addCommands([
{
smart:true,
indexes:["*"],
action:function(i,wildcard){
$input.val(wildcard);
submitInput();

}
}
])

      var $chatlog = $('.js-chat-log');

      var $sayButton = $('.js-say');

      function createRow(text) {
        var $row = $('<li class="list-group-item"></li>');
        $row.text(text);
        $chatlog.append($row);
      }



      $sayButton.click(function() {
        submitInput();
      });

      $input.keydown(function(event) {
        // Submit the input when the enter button is pressed
        if (event.keyCode == 13) {
          submitInput();
        }
      });
