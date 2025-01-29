document.addEventListener("DOMContentLoaded", function () {
  // Get form element
  const form = document.getElementById("cvForm");

  // Handle form submission
  form.addEventListener("submit", function (event) {
    // Prevent default form submission to check validation first
    event.preventDefault();

    // Validate the form
    if (form.checkValidity() === false) {
      // Add Bootstrap invalid class to show error messages
      form.classList.add("was-validated");
    } else {
      // Proceed with form submission if valid (for now, just alert)
      alert("Form submitted successfully!");
      // Optionally, you can submit the form via AJAX or reset it
      form.reset();
      form.classList.remove("was-validated");
    }
  });

  // Apply custom validation to dynamically loaded fields
  (function () {
    const selectElements = document.querySelectorAll("select");
    selectElements.forEach(function (select) {
      select.addEventListener("change", function () {
        if (this.value) {
          this.classList.remove("is-invalid");
        } else {
          this.classList.add("is-invalid");
        }
      });
    });
  })();
});
