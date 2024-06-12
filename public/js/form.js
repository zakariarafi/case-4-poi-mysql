function submitForm(event) {
  event.preventDefault(); // Prevent the default form submission

  // Create a FormData object
  var formData = new FormData(event.target);

  // Send the form data using fetch
  fetch("create_poi.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
      if (data.success) {
        alert("Form submitted successfully.");
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
