// Page language comes from <html lang>. Texts shown to the visitor are translated here;
// everything sent to the sheet (department, grade) stays Turkish.
const LANG = document.documentElement.lang === 'en' ? 'en' : 'tr';
const MSG = {
    tr: {
        noResults: 'Sonuç bulunamadı',
        connError: 'Bağlantı hatası oluştu, lütfen daha sonra tekrar deneyin.',
        emailRequired: 'E-posta adresi zorunludur.',
        emailInvalid: 'Geçerli bir e-posta adresi giriniz.',
        firstName: 'İsim en az 2 karakter olmalıdır.',
        lastName: 'Soyisim en az 2 karakter olmalıdır.',
        studentNo: 'Öğrenci numarası tam 9 haneli olmalıdır.',
        phone: 'Telefon numarası tam 10 haneli olmalıdır.',
        department: 'Lütfen listeden geçerli bir bölüm seçiniz.',
        classYear: 'Lütfen sınıfınızı seçiniz.'
    },
    en: {
        noResults: 'No results found',
        connError: 'A connection error occurred, please try again later.',
        emailRequired: 'Email address is required.',
        emailInvalid: 'Please enter a valid email address.',
        firstName: 'First name must be at least 2 characters.',
        lastName: 'Last name must be at least 2 characters.',
        studentNo: 'Student number must be exactly 9 digits.',
        phone: 'Phone number must be exactly 10 digits.',
        department: 'Please choose a valid department from the list.',
        classYear: 'Please select your year.'
    }
}[LANG];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationForm');
    const studentNoInput = document.getElementById('studentNo');
    const phoneInput = document.getElementById('phone');
    const departmentInput = document.getElementById('departmentInput');
    const departmentList = document.getElementById('departmentList');
    let selectedDepartment = '';

    const classYearInput = document.getElementById('classYearInput');
    const classYearList = document.getElementById('classYearList');
    let selectedClassYear = '';

    classYearInput.addEventListener('click', () => {
        classYearList.classList.toggle('show');
    });

    const classYearItems = classYearList.querySelectorAll('.dropdown-item');
    classYearItems.forEach(item => {
        item.addEventListener('click', () => {
            classYearInput.value = item.textContent;
            selectedClassYear = item.dataset.value || item.textContent;
            classYearList.classList.remove('show');
            validateField(classYearInput);
        });
    });

    // Student Number Validation (only 9 digits)
    studentNoInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-numeric
        if (val.length > 9) val = val.slice(0, 9);
        e.target.value = val;
        validateField(e.target);
    });

    // Phone Number Formatting (5XX XXX XX XX)
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-numeric
        if (val.length > 10) val = val.slice(0, 10);
        
        // Format visually
        let formatted = '';
        if (val.length > 0) formatted += val.substring(0, 3);
        if (val.length > 3) formatted += ' ' + val.substring(3, 6);
        if (val.length > 6) formatted += ' ' + val.substring(6, 8);
        if (val.length > 8) formatted += ' ' + val.substring(8, 10);
        
        e.target.value = formatted;
        validateField(e.target);
    });

    // Department Autocomplete
    function renderDepartments(filter = '') {
        departmentList.innerHTML = '';
        const filtered = departments.filter(d => d.toLowerCase().includes(filter.toLowerCase()));
        
        if (filtered.length === 0) {
            departmentList.innerHTML = '<div class="dropdown-item" style="color:#aaa; cursor:default">' + MSG.noResults + '</div>';
        } else {
            filtered.forEach(dept => {
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.textContent = dept;
                div.addEventListener('click', () => {
                    departmentInput.value = dept;
                    selectedDepartment = dept;
                    departmentList.classList.remove('show');
                    validateField(departmentInput);
                });
                departmentList.appendChild(div);
            });
        }
    }

    departmentInput.addEventListener('focus', () => {
        renderDepartments(departmentInput.value !== selectedDepartment ? departmentInput.value : '');
        departmentList.classList.add('show');
    });

    departmentInput.addEventListener('input', (e) => {
        selectedDepartment = '';
        renderDepartments(e.target.value);
        departmentList.classList.add('show');
        validateField(e.target);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#departmentSelect')) {
            departmentList.classList.remove('show');
            if (departmentInput.value !== selectedDepartment) {
                if (departments.includes(departmentInput.value)) {
                    selectedDepartment = departmentInput.value;
                } else {
                    validateField(departmentInput);
                }
            }
        }
        if (classYearList && !e.target.closest('#classYearSelect')) {
            classYearList.classList.remove('show');
        }
    });

    // Real-time validation for other fields
    const fieldsToValidate = ['email', 'firstName', 'lastName', 'classYearInput'];
    fieldsToValidate.forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => validateField(e.target));
        document.getElementById(id).addEventListener('change', (e) => validateField(e.target));
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = [
            document.getElementById('email'),
            document.getElementById('firstName'),
            document.getElementById('lastName'),
            document.getElementById('studentNo'),
            document.getElementById('phone'),
            document.getElementById('departmentInput'),
            document.getElementById('classYearInput')
        ];

        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (isValid) {
            const btn = document.getElementById('submitBtn');
            btn.classList.add('loading');
            
            const scriptURL = 'https://script.google.com/macros/s/AKfycbz2Sg5hJaB2WBAyrSF6IFp9q3KgT08ggoBfPjAlxZfwmkitWJYbO-mjKjCsctMMSdHHyQ/exec';
            
            const formData = new URLSearchParams();
            const fName = document.getElementById('firstName').value.trim();
            const lName = document.getElementById('lastName').value.trim();
            formData.append('email', document.getElementById('email').value.trim());
            formData.append('firstName', fName);
            formData.append('lastName', lName);
            formData.append('studentNo', document.getElementById('studentNo').value.trim());
            formData.append('phone', document.getElementById('phone').value.trim());
            formData.append('department', selectedDepartment);
            formData.append('grade', selectedClassYear);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    btn.classList.remove('loading');
                    document.getElementById('successModal').classList.add('show');
                    form.reset();
                    selectedDepartment = '';
                    selectedClassYear = '';
                    document.getElementById('departmentInput').value = '';
                    document.getElementById('classYearInput').value = '';
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    btn.classList.remove('loading');
                    alert(MSG.connError);
                });
        }
    });
});

function validateField(field) {
    let baseId = field.id;
    if (baseId === 'departmentInput') baseId = 'department';
    if (baseId === 'classYearInput') baseId = 'classYear';
    const errorElement = document.getElementById(`${baseId}Error`);
    let isValid = true;
    let errorMsg = '';

    if (field.id === 'email') {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
            isValid = false; errorMsg = MSG.emailRequired;
        } else if (!regex.test(field.value)) {
            isValid = false; errorMsg = MSG.emailInvalid;
        }
    } else if (field.id === 'firstName') {
        if (field.value.trim().length < 2) {
            isValid = false; errorMsg = MSG.firstName;
        }
    } else if (field.id === 'lastName') {
        if (field.value.trim().length < 2) {
            isValid = false; errorMsg = MSG.lastName;
        }
    } else if (field.id === 'studentNo') {
        if (field.value.length !== 9) {
            isValid = false; errorMsg = MSG.studentNo;
        }
    } else if (field.id === 'phone') {
        const digits = field.value.replace(/\s/g, '');
        if (digits.length !== 10) {
            isValid = false; errorMsg = MSG.phone;
        }
    } else if (field.id === 'departmentInput') {
        if (!departments.includes(field.value)) {
            isValid = false; errorMsg = MSG.department;
        }
    } else if (field.id === 'classYearInput') {
        if (!field.value) {
            isValid = false; errorMsg = MSG.classYear;
        }
    }

    if (!isValid) {
        field.classList.add('error-state');
        if (errorElement) {
            errorElement.textContent = errorMsg;
            errorElement.classList.add('visible');
        }
    } else {
        field.classList.remove('error-state');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    }

    return isValid;
}

window.closeModal = function() {
    document.getElementById('successModal').classList.remove('show');
}
