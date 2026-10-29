// Project pitch form. Page language comes from <html lang>; texts shown to the visitor are translated here.
// Pitches go to the `project_pitches` table (supabase/migrations/0004_project_pitches.sql); SUPABASE_URL and
// SUPABASE_KEY come from /basvuru/supabase.js, shared with the application form.
const LANG = document.documentElement.lang === 'en' ? 'en' : 'tr';
const DESCRIPTION_MIN = 30;
const DESCRIPTION_MAX = 4000;

const MSG = {
    tr: {
        connError: 'Bağlantı hatası oluştu, lütfen daha sonra tekrar deneyin.',
        tooMany: 'Şu anda çok fazla öneri geliyor, lütfen birkaç dakika sonra tekrar deneyin.',
        title: 'Proje başlığı en az 3 karakter olmalıdır.',
        description: `Açıklama en az ${DESCRIPTION_MIN} karakter olmalıdır.`,
        name: 'Ad soyad en az 2 karakter olmalıdır.',
        emailRequired: 'E-posta adresi zorunludur.',
        emailInvalid: 'Geçerli bir e-posta adresi giriniz.',
        studentNo: 'Öğrenci numarası tam 9 haneli olmalıdır (ya da boş bırakın).',
        consent: 'Devam etmek için aydınlatma metnini onaylamalısınız.'
    },
    en: {
        connError: 'A connection error occurred, please try again later.',
        tooMany: 'We are getting a lot of pitches right now, please try again in a few minutes.',
        title: 'The project title must be at least 3 characters.',
        description: `The description must be at least ${DESCRIPTION_MIN} characters.`,
        name: 'Your name must be at least 2 characters.',
        emailRequired: 'Email address is required.',
        emailInvalid: 'Please enter a valid email address.',
        studentNo: 'Student number must be exactly 9 digits (or leave it empty).',
        consent: 'Please confirm you have read the privacy notice.'
    }
}[LANG];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pitchForm');
    const description = document.getElementById('description');
    const descriptionCount = document.getElementById('descriptionCount');
    const studentNoInput = document.getElementById('studentNo');
    const fields = ['title', 'description', 'name', 'email', 'studentNo', 'consent'].map(id => document.getElementById(id));

    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);

    const updateCount = () => {
        descriptionCount.textContent = `${description.value.trim().length} / ${DESCRIPTION_MAX}`;
    };
    description.addEventListener('input', updateCount);

    // Student number: digits only, at most 9
    studentNoInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
    });

    // Errors show once a field has been left (or on submit), then update as you type
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => field.classList.contains('error-state') && validateField(field));
        field.addEventListener('change', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const invalid = fields.filter(field => !validateField(field));
        if (invalid.length > 0) {
            invalid[0].focus();
            invalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const btn = document.getElementById('submitBtn');
        btn.classList.add('loading');

        const done = () => {
            btn.classList.remove('loading');
            document.getElementById('successModal').classList.add('show');
            form.reset();
            updateCount();
        };

        // Hidden field only bots fill in: act as if it worked, send nothing.
        if (document.getElementById('website').value) {
            done();
            return;
        }

        const pitch = {
            title: document.getElementById('title').value.trim(),
            description: description.value.trim(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            student_no: studentNoInput.value || null,
            lang: LANG,
            consent: document.getElementById('consent').checked
        };

        fetch(`${SUPABASE_URL}/rest/v1/project_pitches`, {
            method: 'POST',
            headers: {
                apikey: SUPABASE_KEY,
                'Content-Type': 'application/json',
                Prefer: 'return=minimal'
            },
            body: JSON.stringify(pitch)
        })
            .then(response => {
                if (response.ok) return done();
                return response.text().then(body => {
                    console.error('Pitch not saved', response.status, body);
                    btn.classList.remove('loading');
                    alert(response.status === 429 ? MSG.tooMany : MSG.connError);
                });
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.classList.remove('loading');
                alert(MSG.connError);
            });
    });
});

function validateField(field) {
    const value = field.type === 'checkbox' ? '' : field.value.trim();
    let errorMsg = '';

    if (field.id === 'title') {
        if (value.length < 3) errorMsg = MSG.title;
    } else if (field.id === 'description') {
        if (value.length < DESCRIPTION_MIN) errorMsg = MSG.description;
    } else if (field.id === 'name') {
        if (value.length < 2) errorMsg = MSG.name;
    } else if (field.id === 'email') {
        if (!value) errorMsg = MSG.emailRequired;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = MSG.emailInvalid;
    } else if (field.id === 'studentNo') {
        if (value && !/^\d{9}$/.test(value)) errorMsg = MSG.studentNo;
    } else if (field.id === 'consent') {
        if (!field.checked) errorMsg = MSG.consent;
    }

    const errorElement = document.getElementById(`${field.id}Error`);
    field.classList.toggle('error-state', !!errorMsg);
    if (errorElement) {
        errorElement.textContent = errorMsg;
        errorElement.classList.toggle('visible', !!errorMsg);
    }
    return !errorMsg;
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}
