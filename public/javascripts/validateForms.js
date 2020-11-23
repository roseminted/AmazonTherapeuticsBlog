// JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';

    // assist with displaying files names when uploading images
    bsCustomFileInput.init()

    // Find all <form> tags on the webpage that have the class needs-validation
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated');
            }, false);
        })
})()