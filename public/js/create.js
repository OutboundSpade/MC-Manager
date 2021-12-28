// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // document.getElementById("s-name-iput").validity.valid = true;

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

async function isValidDomain(e) {
  let fullUrl = e.value + "." + parentDomain;
  if (
    /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/gm.test(fullUrl) &&
    e.value.length < 63 &&
    fullUrl.length < 255 &&
    !(await (await fetch(`/api/servers/recordExists/${fullUrl}`)).json())
      .isValid
  ) {
    e.setCustomValidity("");
    return true;
  }
  e.setCustomValidity("err");
}

async function isValidVersion(e) {
  let v = e.value;
  let patern = /^([0-9])+(\.[0-9]+){1,}$/g;
  // console.log(patern.test(v));
  if (patern.test(v)) {
    // console.log("good!");
    e.setCustomValidity("");
    return true;
  }
  e.setCustomValidity("err");
}
