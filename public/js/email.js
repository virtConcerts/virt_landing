const email = "contact@virtconcerts.com";
navigator.clipboard.writeText(email).then(function() {
  console.log('Async: Copying to clipboard was successful!');
}, function(err) {
  console.error('Async: Could not copy text: ', err);
});