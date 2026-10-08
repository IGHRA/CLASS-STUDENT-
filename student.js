const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzy4oltdBqvENNgHv9mNrduTSlm25GKb_H4TFbTiHorQqTEQ2Q9M-E_fzJZ_uVnSJ6I/exec";


const form = document.getElementById("writingForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");


// ================================
// إرسال التعبير
// ================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    successMessage.style.display = "none";
    errorMessage.style.display = "none";


    // إنشاء رمز سري خاص بالتلميذ
    const studentCode =
        crypto.randomUUID()
        .replace(/-/g, "")
        .substring(0, 8)
        .toUpperCase();


    const data = {

        name: document.getElementById("name").value,

        className: document.getElementById("class").value,

        type: document.getElementById("type").value,

        title: document.getElementById("title").value,

        message: document.getElementById("message").value,

        studentCode: studentCode

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


        successMessage.innerHTML = `

            ✅ تم إرسال تعبيرك بنجاح!

            <br><br>

            🔐 <strong>رمزك الخاص:</strong>

            <br>

            <span style="
                display:inline-block;
                margin-top:10px;
                padding:10px 18px;
                background:#fff;
                border-radius:8px;
                font-size:22px;
                letter-spacing:3px;
                font-weight:bold;
            ">
                ${studentCode}
            </span>

            <br><br>

            ⚠️ احتفظ بهذا الرمز، لأنه ضروري للاطلاع على ملاحظة الأستاذ.

        `;


        form.reset();


    } catch (error) {

        errorMessage.style.display = "block";

        console.error(error);

    }

});


// ================================
// عرض ملاحظة الأستاذ بواسطة الرمز
// ================================

function checkFeedback() {

    const code =
        document
            .getElementById("feedbackCode")
            .value
            .trim()
            .toUpperCase();


    const result =
        document.getElementById("feedbackResult");


    result.style.display = "block";


    if (!code) {

        result.style.background = "#fee2e2";
        result.style.color = "#991b1b";

        result.innerHTML =
            "❌ المرجو إدخال الرمز السري.";

        return;

    }


    result.style.background = "#f3f4f6";
    result.style.color = "#333";

    result.innerHTML =
        "⏳ جارٍ البحث عن ملاحظتك...";


    // إنشاء اسم مؤقت للدالة
    const callbackName =
        "feedbackCallback_" + Date.now();


    // إنشاء دالة تستقبل النتيجة من Google Apps Script
    window[callbackName] = function(data) {

        try {

            if (!data || !data.success) {

                result.style.background = "#fee2e2";
                result.style.color = "#991b1b";

                result.innerHTML =
                    "❌ حدث خطأ أثناء البحث عن الملاحظة.";

                return;

            }


            if (!data.found) {

                result.style.background = "#fff7ed";
                result.style.color = "#9a3412";

                result.innerHTML =
                    "❌ الرمز غير موجود أو غير صحيح.";

                return;

            }


            if (!data.feedback ||
                String(data.feedback).trim() === "") {

                result.style.background = "#eff6ff";
                result.style.color = "#1e40af";

                result.innerHTML =
                    "ℹ️ لم يضع الأستاذ ملاحظة لهذا التعبير بعد.";

                return;

            }


            result.style.background = "#f0fdf4";
            result.style.color = "#166534";


            result.innerHTML = `

                <strong>👨‍🏫 ملاحظة الأستاذ:</strong>

                <div style="
                    margin-top:10px;
                    white-space:pre-wrap;
                ">
                    ${escapeHTML(data.feedback)}
                </div>

            `;


        } finally {

            // حذف الدالة المؤقتة
            delete window[callbackName];

            // حذف عنصر script المؤقت
            const script =
                document.getElementById(callbackName);

            if (script) {
                script.remove();
            }

        }

    };


    // إنشاء طلب JSONP
    const script =
        document.createElement("script");


    script.id = callbackName;


    script.src =
        SCRIPT_URL +
        "?action=feedback" +
        "&code=" +
        encodeURIComponent(code) +
        "&callback=" +
        callbackName;


    script.onerror = function() {

        result.style.background = "#fee2e2";
        result.style.color = "#991b1b";

        result.innerHTML =
            "❌ حدث خطأ أثناء الاتصال بالخادم.";

        delete window[callbackName];

        script.remove();

    };


    document.body.appendChild(script);

}


// ================================
// حماية النص من HTML
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}
