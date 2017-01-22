var socket = io(window.location.origin); 

socket.on('connect', function(){

  console.log('I have made a persistent two-way connection to the server!');


})
