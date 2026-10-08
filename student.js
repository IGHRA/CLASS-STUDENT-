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
async function checkFeedback() {

    const name =
        document.getElementById("feedbackName").value.trim();

    const className =
        document.getElementById("feedbackClass").value.trim();

    const result =
        document.getElementById("feedbackResult");


    if (!name || !className) {

        result.style.display = "block";

        result.style.background = "#fee2e2";

        result.style.color = "#991b1b";

        result.innerHTML =
            "⚠️ المرجو إدخال الاسم والقسم.";

        return;
    }


    result.style.display = "block";

    result.style.background = "#f8fafc";

    result.style.color = "#222";

    result.innerHTML =
        "⏳ جارٍ البحث عن ملاحظتك...";


    try {

        const response = await fetch(
            SCRIPT_URL + "?t=" + Date.now()
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );
        }


        const data = await response.json();


        if (!data.success) {

            throw new Error(
                "تعذر الحصول على البيانات"
            );
        }


        const matches =
            data.submissions.filter(function(item) {

                return (
                    String(item.name || "")
                        .trim()
                        .toLowerCase()
                    ===
                    name.toLowerCase()

                    &&

                    String(item.className || "")
                        .trim()
                        .toLowerCase()
                    ===
                    className.toLowerCase()
                );

            });


        if (matches.length === 0) {

            result.style.background = "#fee2e2";

            result.style.color = "#991b1b";

            result.innerHTML =
                "❌ لم نجد تعبيرًا بهذا الاسم والقسم.";

            return;
        }


        const withFeedback =
            matches.find(function(item) {

                return (
                    item.feedback &&
                    String(item.feedback).trim() !== ""
                );

            });


        if (!withFeedback) {

            result.style.background = "#fff7ed";

            result.style.color = "#9a3412";

            result.innerHTML =
                "⏳ لم يكتب الأستاذ ملاحظة لهذا التعبير بعد.";

            return;
        }


        result.style.background = "#dcfce7";

        result.style.color = "#166534";


        result.innerHTML = `

            <strong>👨‍🏫 ملاحظة الأستاذ:</strong>

            <div style="
                margin-top:10px;
                white-space:pre-wrap;
            ">
                ${escapeHTML(withFeedback.feedback)}
            </div>

        `;


    } catch (error) {

        console.error(error);

        result.style.background = "#fee2e2";

        result.style.color = "#991b1b";

        result.innerHTML =
            "❌ حدث خطأ أثناء البحث عن الملاحظة.";

    }

}