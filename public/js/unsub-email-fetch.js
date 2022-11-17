

var token = new URLSearchParams(window.location.search).get(
    'email'
  );

  console.log(token)

  const data = { token: token }

fetch('http://localhost:5000/email-updates-cancel', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
