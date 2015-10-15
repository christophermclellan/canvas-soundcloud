SC.initialize({
  client_id: 'f2b80dd976425e26b3af0288bb5de221'
});

$(document).ready(function() {

	// Dynamically set the src attribute of the audio element to the Soundcloud audio stream

	var client_id = 'f2b80dd976425e26b3af0288bb5de221';
  
	SC.get('/resolve', { url: 'https://soundcloud.com/frenchexpress/perseus-seychelles' }, function(sound) {
		var streamUrl = sound.stream_url + '?client_id=' + client_id;
		$('#player').attr("src", streamUrl);
	});

	//Grab audio player
	var audio = document.getElementById("player");

	//Set up Web Audio API
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	//Create an analyser node on the audio context. Analyser node provides real-time frequency
	//and time domain analysis
	
	var analyser = audioCtx.createAnalyser();

	//define the buffer size used to perform the analysis
	analyser.fftSize = 256;

	// frequencyBinCount is set automatically to fftsize/2, this equates to the
	// number of data values available to play with for the visualisation, in this case 128
	var bufferLength = analyser.frequencyBinCount;

	// call Uint8Array with bufferLength as its argument, this is how many data
	// points we collect for the visualisation
	var dataArray = new Uint8Array(bufferLength);

	// Create a new MediaElementAudioSourceNode from the audio player on the page,
	// so we can manipulate the data
	var source = audioCtx.createMediaElementSource(audio);

	//connect the output source of the html5 audio player to the analyser node so we can gather the data
	source.connect(analyser);

	//connect the source to the to the output destination, i.e. the users speakers
	analyser.connect(audioCtx.destination);

	// Set up canvas elements and store width and height as variables
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var canvas_width = canvas.width;
	var canvas_height = canvas.height;

	//When the doc is ready...
	$( document ).ready(function() {

		//Declare this variable that will be used for the rAF function, don't know why
		//this has to be declared globally
		
		var drawVisual;

		//Draw is where we handle all the animations on the canvas
		function draw() {

			//Instantiates recursive rAF call
			drawVisual = requestAnimationFrame(draw);
			
			//getByteFrequencyData method of analyser node copies the current frequency data
			//from the music that is being played, into the dataArray array passed in as an argument, 
			//the dataArray can now be used as the data source for sound info
			analyser.getByteFrequencyData(dataArray);

			//Fill the rectangle with a black background
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillRect(0, 0, canvas_width, canvas_height);

			//Set a standard bar width for all bars, 2.5 is arbitary value used to set width
			var barWidth = (canvas_width / bufferLength) * 2.5;

			//Create barHeight and x variables
			var barHeight;
			var x = 0;

			for(var i = 0; i < dataArray.length; i++) {

				//Set barHeight to the current index of the dataArray
				barHeight = dataArray[i];

				//Relate fill style to barHeight value, it will always be slightly red, 
				//but will get redder depending on size of barHeight
				ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';

				//Fill the canvas with the rectangle
				ctx.fillRect(x,canvas_height-barHeight/2,barWidth,barHeight/2);

				//increment the position of the next bar being drawn by 1px place
				//on the canvas for every iteration of the loop
				x += barWidth + 1;	
			}
		}

		//Call the request animation frame function
		draw();

	});

});




