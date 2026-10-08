const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzy4oltdBqvENNgHv9mNrduTSlm25GKb_H4TFbTiHorQqTEQ2Q9M-E_fzJZ_uVnSJ6I/exec";

const form = document.getElementById("writingForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    const data = {

        name: document.getElementById("name").value,

        className: document.getElementById("class").value,

        type: document.getElementById("type").value,

        title: document.getElementById("title").value,

        message: document.getElementById("message").value

    };

    try {

        await fetch(SCRIPT_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type": "text/plain"
            },

            body: JSON.stringify(data)

        });

        successMessage.style.display = "block";

        form.reset();

    } catch (error) {

        errorMessage.style.display = "block";

        console.error(error);

    }

});

