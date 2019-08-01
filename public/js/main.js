function ensureOneCheck(checkBoxName, messageId, submitId) {

	const checkBoxes = document.getElementsByName(checkBoxName);

	let checkCount = 0;
	for (let i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked)
			checkCount++;
	}
	if (checkCount === 0) {
		document.getElementById(messageId).style.display = 'block';
		document.getElementById(submitId).disabled = true;
		return false;
	} else {
		document.getElementById(messageId).style.display = 'none';
		document.getElementById(submitId).disabled = false;
		return true;
	}

}

function CheckQuantity(Quantity,showit,showit2){
	console.log(Quantity);
	console.log(showit)
	console.log(showit2)
	const max = document.getElementById(Quantity).max;
	const min = document.getElementById(Quantity).min;
	const amount = document.getElementById(Quantity).value;
	console.log(amount)
	console.log(max)
	if(max==0){
		document.getElementById(showit).style.display='block';
		console.log(showit)


	}else if(max<amount || min>amount){
		console.log(showit2)
		document.getElementById(showit2).style.display='block';

	}else{
		document.getElementById(showit).style.display='none';
		document.getElementById(showit2).style.display='none';

	}


}




function getOMdbMovie() {
	const title = document.getElementById('title').value;
	const poster = document.getElementById('poster');
	const omdbErr = document.getElementById('OMdbErr');
	const posterURL = document.getElementById('posterURL');
	const starring = document.getElementById('starring');
	const story = document.getElementById('story');
	const datepicker = document.getElementById('datepicker');
	fetch('https://www.omdbapi.com/?t=' + title + '&apikey=cc7c623f')
		.then((res) => {
			return res.json();
		}).then((data) => {
			if (data.Response === 'False') {
				poster.src = '/img/no-image.jpg';
				omdbErr.style.display = 'inline';
			} else {
				omdbErr.style.display = 'none';
				poster.src = data.Poster;
				starring.value = data.Actors;
				posterURL.value = data.Poster; // hidden input field to submit
				story.value = data.Plot;
				datepicker.value = moment(new
					Date(data.Released)).format('DD/MM/YYYY');
			}
		}).catch(error => { omdbErr.innerHTML = error; })
}


$('#posterUpload').on('change', function () {
	let image = $("#posterUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('posterUpload', image);
	$.ajax({
		url: '/item/upload',
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		'success': (data) => {
			$('#poster').attr('src', data.file);
			$('#posterURL').attr('value', data.file);// sets posterURL hidden field
			if (data.err) {
				$('#posterErr').show();
				$('#posterErr').text(data.err.message);
			} else {
				$('#posterErr').hide();
			}
		}
	});
});



var socket = io.connect('http://localhost:5000');

//Query DOM
var message = document.getElementById('message');
handle = document.getElementById('handle'),
btn = document.getElementById('send'),
output = document.getElementById('output'),
feedback = document.getElementById('feedback')


//Emit Events

btn.addEventListener('click',function(){
    socket.emit('chat',{
        message: message.value,
        handle: handle.value
	});

});

message.addEventListener('keypress',function(){
	socket.emit('typing',handle.value);
});

//listen for events

socket.on('chat',function(data){

	feedback.innerHTML ="";
    output.innerHTML += '<p><strong>'+ data.handle + ':</strong> '+ data.message+'</p>';
});

socket.on('typing',function(data){
	feedback.innerHTML = '<p><em>'+ data + ' is typing a message...</em></p>'
});