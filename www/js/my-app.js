// Initialize app
var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

    var set_category = sessionStorage.getItem('set_category');
    $('#category').val(set_category);
    $('.title-container').html(set_category + 'S');


    /*load new word*/
    var collection_of_words = getCategory();
    var item = collection_of_words[Math.floor(Math.random()*collection_of_words.length)];

    var get_word = getWord(item.word);
    $('.text-container').html(get_word);
    $('.hint-container').html("Hint: "+item.hint);

    var get_keyboard = getKeyboard(item.word);
    $('.keyboard').html(get_keyboard);
    //$(".keyboard .buttons-row a").shuffle();
    
    /*keyboard event*/
    $$('.keyboard a').on('click', function(){
        var elem = this;
        inputLetter(elem);
    });

    /*stopwatch start*/
    stopwatch.start();

});

$$('.item-title').on('click', function() {
    var category = $(this).attr('alt');
    sessionStorage.removeItem('set_category');
    sessionStorage.setItem('set_category', category);
    location.reload();
});
/***********************************custom function***********************************/

/**/
function getCategory(){

    var category = $('#category').val();

    switch(category){
        case "FOOD":
        return_data = foods;
        break;

        case "THING":
        return_data = things;
        break;

        case "ANIMAL":
        return_data = animals;
        break;

        default:
        return_data = animals;
        break;
    }

    $('#category').val(category);
    return return_data;
}

/*reset app*/
function reset(){
    /*reset image*/
    $('.banner-img').attr("src","img/life/life_0.gif");
    $('.banner-img').attr('alt', 0);

    /*load new word*/
    var collection_of_words = getCategory();
    var item = collection_of_words[Math.floor(Math.random()*collection_of_words.length)];
    var get_word = getWord(item.word);
    $('.text-container').html(get_word);
    $('.hint-container').html("Hint: "+item.hint);

    var get_keyboard = getKeyboard(item.word);
    $('.keyboard').html(get_keyboard);
    //$(".keyboard .buttons-row").shuffle();

    /*keyboard event*/
    $$('.keyboard a').on('click', function(){
        var elem = this;
        inputLetter(elem);
    });

    item_to_answer = item_to_answer - 1;
    var limit_checker = timeChecker();
     
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
            //wordChecker(index,input_elem);
            return false;
        }
    });
}

function getKeyboard(word_item){

    /*randomize array*/
    var word_item_shuffled = getShuffledArray(word_item);
    var html = '';
    html += '<p class="buttons-row">';
    $.each(word_item_shuffled, function( i, val ) {
        html += '<a href="#" class="btn-hang button button-raised button-fill color-blue">'+val+'</a>'
        if((i+1) % 4 == 0){
            html += '</p><p class="buttons-row">';
        }
    });
    html += '</p>';
    return html;
   
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

        var input_elem = $('.text-container input');
        var complete_text = hasEmptyValueChecker(input_elem);

        if(complete_text){
            wordChecker(input_elem)
        }
        
    }

}

/*word checker*/
function wordChecker(input_elem){

    var correct_word = input_elem.map(function() {
            return $(this).attr('alt');
    }).get();

    var user_input_word = input_elem.map(function() {
            return $(this).val();
        }).get();

    var correct_word = correct_word.join("");
    var user_input_word = user_input_word.join("");

    if(correct_word === user_input_word){
        myApp.alert('<img class="result" src="img/life/winner.gif" />', 'Correct!', function () {
            stopwatch.lap();
            reset();
        });
    }else{
        myApp.alert('<img class="result" src="img/life/loser.gif" />', 'Failed!', function () {
            reset();

         });
    }

}

function timeChecker(){
    var reach_limit = false;
    if(item_to_answer <= 0){
        reach_limit = true;
        var correct_answers = $('.results li').length;
        var time_spent = $('.timer-container').html();

        var html = '';
        html += 'Your Score : ' + correct_answers + ' / ' + ITEM_COUNT + '<br />';
        html += 'Time spent : ' + time_spent;

        myApp.alert( html , 'Thanks for playing!', function () {
            location.reload();
            return;
        });
    }
    return reach_limit;
}

function hasEmptyValueChecker(elem){
    var dataValid = true;
    elem.each(function(){
        if ($(this).val() == ''){
            dataValid = false;
        }
    });

    return dataValid;
}

function getShuffledArray (arr){
    let newArr = arr.slice();
    for (var i = newArr.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]]=[newArr[rand], newArr[i]];
    }
    return newArr;
}


/*timer object*/
function Timer(fn, t) {
    var timerObj = setInterval(fn, t);

    this.stop = function() {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    }

    // start timer using current settings (if it's not already running)
    this.start = function() {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    }

    // start with new interval, stop current interval
    this.reset = function(newT) {
        t = newT;
        return this.stop().start();
    }
}


