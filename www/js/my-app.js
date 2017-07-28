// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var collection_of_words = [

    {
        "word": [ 'T','A','B','L','E'],
        "hint": "the star of the feast"
    },

    {
        "word" : ['C','H','A','I','R'],
        "hint": "sit down and talk for a while"
    },

    {
        "word" : ['D','O','O','R'],
        "hint" : "wherever you may lead"
    },

    {
        "word" : ['W','I','N','D','O','W'],
        "hint" : "open your eyes and see"
    },

    {
        "word" : ['C','L','O','C', 'K'],
        "hint" : "tool for a unstoppable force"
    }
];



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

    /*load new word*/
    var item = collection_of_words[Math.floor(Math.random()*collection_of_words.length)];
    var get_word = getWord(item.word);
    $('.text-container').html(get_word);
    $('.hint-container').html("Hint: "+item.hint);
    
    /*keyboard event*/
    $$('.keyboard a').on('click', function(){
        var elem = this;
        inputLetter(elem);
    });

});



/***********************************custom function***********************************/

/*reset app*/
function reset(){
    /*reset image*/
    $('.banner-img').attr("src","img/life/life_0.gif");
    $('.banner-img').attr('alt', 0);

    /*load new word*/
    var item = collection_of_words[Math.floor(Math.random()*collection_of_words.length)];
    var get_word = getWord(item.word);
    $('.text-container').html(get_word);
    $('.hint-container').html("Hint: "+item.hint);
    
}


/*get word and display*/
function getWord(word){
    var html = '';
    $.each(word, function( index, value ) {
        html += '<input class="letters letters_'+index+'" type="text" alt="'+value+'">';
    });
    return html;
}

/*get word and display*/
function inputLetter(elem){
    var letter = $(elem).html();
    var input_elem = $('.text-container input');

    $.each(input_elem, function(index, item) {
        if($(item).val() === ''){
            $(item).val(letter);
            letterChecker($(item));
            wordChecker(index,input_elem);
            return false;
        }
    });
}

/*letter checker*/
function letterChecker(input_elem){

    var correct_letter = input_elem.attr('alt');
    var user_input_letter = input_elem.val();

    if(correct_letter != user_input_letter){

        var current_image_index = $('.banner-img').attr('alt');
        var display_image_index = parseInt(current_image_index) + 1;
        var limit = 6;

        if(display_image_index >= limit){
            myApp.alert('<img class="result" src="img/life/loser.gif" />', 'Loser!', reset());
            return false;
        }

        $('.banner-img').attr("src","img/life/life_"+display_image_index+".gif");
        $('.banner-img').attr('alt', display_image_index);

        input_elem.css('background','red');
        input_elem.css('color','white');
        input_elem.delay( 800 ).val('');
    }else{
        input_elem.css('background','white');
        input_elem.css('color','black');
    }

}

/*word checker*/
function wordChecker(index,input_elem){

    var correct_word = input_elem.map(function() {
            return $(this).attr('alt');
    }).get();

    var correct_word_lenght = correct_word.length;

    if(correct_word_lenght == (index+1)){

        var user_input_word = input_elem.map(function() {
            return $(this).val();
        }).get();

        var correct_word = correct_word.join("");
        var user_input_word = user_input_word.join("");

        if(correct_word === user_input_word){
            myApp.alert('<img class="result" src="img/life/winner.gif" />', 'Winner!', reset());
        }else{
            myApp.alert('<img class="result" src="img/life/loser.gif" />', 'Loser!', reset());
        }

    }

    
}

/**/


