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


function calculate_statement(statement){
var args = { type:"GET", url:"/calculate?value="+statement};
$.ajax({
            type: 'GET',
            url: "/calculate?value="+statement,
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                console.log(data);
                artyom.say(data.result);
            }
        });
return $.ajax(args);
}

function command_eslc(statement){
$.ajax({
            type: 'GET',
            url: "/eslccommand?value="+statement,
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                console.log(data);
                artyom.say(data.result);
            }
        });
return $.ajax(args);
}



artyom.addCommands([{
indexes:["hi Robo","hello","Sid","Mona"],
action:function(i){
if(i>=0){
artyom.say("Hi! How can i help you")
}
}
},
{
indexes:["Robo start Energy Storage Local Controller"],
action:function(){
 var x= $.ajax(args);
 console.log(x)
artyom.say(x)
}
},
{
smart:true,
indexes:["What is *"],
action:function(i,wildcard){
var str=wildcard.replace(/\s/g,'');
calculate_statement(encodeURIComponent(wildcard));

}
},
{
smart:true,
indexes:["Robo *"],
action:function(i,wildcard){
var str=wildcard.replace(/\s/g,'');
command_eslc(encodeURIComponent(wildcard));
}
}

])


var chatterbotUrl = '{% url "chatterbot:chatterbot" %}';
      var csrftoken = Cookies.get('csrftoken');

      function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
      }

      $.ajaxSetup({
        beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        }
      });

      var $chatlog = $('.js-chat-log');
      var $input = $('.js-text');
      var $sayButton = $('.js-say');

      function createRow(text) {
        var $row = $('<li class="list-group-item"></li>');

        $row.text(text);
        $chatlog.append($row);
      }

      function submitInput() {
        var inputData = {
          'text': $input.val()
        }

        // Display the user's input on the web page
        createRow(inputData.text);

        var $submit = $.ajax({
          type: 'POST',
          url: chatterbotUrl,
          data: JSON.stringify(inputData),
          contentType: 'application/json'
        });

        $submit.done(function(statement) {
            createRow(statement.text);

            // Clear the input field
            $input.val('');

            // Scroll to the bottom of the chat interface
            $chatlog[0].scrollTop = $chatlog[0].scrollHeight;
        });

        $submit.fail(function() {
          // TODO: Handle errors
        });
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