$(function(){

	/*on load*/
	var get_word = getWord();
	$('.text-container').html(get_word);

});


function getWord(){

	var word = ['C','H','A','I','R'];
	console.log(word);
	var html = '';

	$.each(word, function( index, value ) {
		html += '<input class="letters letters_'+index+'" type="text" value="'+value+'">';
	});

	return html;
}