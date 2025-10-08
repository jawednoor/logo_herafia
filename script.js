// Form functionality and validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('logoSurveyForm');
    const hasExistingLogoRadios = document.querySelectorAll('input[name="hasExistingLogo"]');
    const existingLogoDetails = document.getElementById('existingLogoDetails');
    const logoUpload = document.getElementById('logoUpload');

    // Enhanced selection styling for radio buttons and checkboxes
    function updateSelectionStyling() {
        // Handle radio buttons
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(radio => {
            const label = radio.closest('.radio-label');
            if (radio.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });

        // Handle checkboxes
        const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
        checkboxInputs.forEach(checkbox => {
            const label = checkbox.closest('.checkbox-label');
            if (checkbox.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    // Add event listeners for all radio buttons and checkboxes
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    allInputs.forEach(input => {
        input.addEventListener('change', updateSelectionStyling);
    });

    // Initial styling update
    updateSelectionStyling();

    // Color picker functionality
    function hexToColorName(hex) {
        const colorNames = {
            '#ff0000': 'أحمر',
            '#ff4500': 'أحمر برتقالي',
            '#ffa500': 'برتقالي',
            '#ffff00': 'أصفر',
            '#9acd32': 'أصفر مخضر',
            '#00ff00': 'أخضر',
            '#00ffff': 'سماوي',
            '#0000ff': 'أزرق',
            '#4b0082': 'نيلي',
            '#9400d3': 'بنفسجي',
            '#ff1493': 'وردي',
            '#ff69b4': 'وردي فاتح',
            '#ffc0cb': 'زهري',
            '#ffffff': 'أبيض',
            '#000000': 'أسود',
            '#808080': 'رمادي',
            '#c0c0c0': 'فضي',
            '#800000': 'أحمر داكن',
            '#808000': 'زيتوني',
            '#008000': 'أخضر داكن',
            '#800080': 'بنفسجي داكن',
            '#008080': 'أزرق مخضر',
            '#000080': 'أزرق داكن',
            '#a52a2a': 'بني',
            '#daa520': 'ذهبي',
            '#dc143c': 'أحمر قرمزي',
            '#b22222': 'أحمر طوبي',
            '#228b22': 'أخضر غابات',
            '#32cd32': 'أخضر ليموني',
            '#4169e1': 'أزرق ملكي',
            '#6495ed': 'أزرق كورن فلاور',
            '#7b68ee': 'بنفسجي متوسط',
            '#ba55d3': 'أوركيد متوسط',
            '#1f71b7': 'أزرق احترافي',
            '#f58220': 'برتقالي دافئ'
        };
        
        // تحويل الهيكس إلى أسماء
        const lowerHex = hex.toLowerCase();
        if (colorNames[lowerHex]) {
            return colorNames[lowerHex];
        }
        
        // إذا لم يجد اللون بالضبط، يحاول إيجاد أقرب لون
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        if (r > 200 && g < 100 && b < 100) return 'أحمر';
        if (r > 200 && g > 100 && b < 100) return 'برتقالي';
        if (r > 200 && g > 200 && b < 100) return 'أصفر';
        if (r < 100 && g > 200 && b < 100) return 'أخضر';
        if (r < 100 && g < 100 && b > 200) return 'أزرق';
        if (r > 100 && g < 100 && b > 200) return 'بنفسجي';
        if (r > 200 && g < 100 && b > 200) return 'وردي';
        if (r < 100 && g > 100 && b > 200) return 'سماوي';
        
        return hex; // إرجاع الكود إذا لم يجد اسم
    }

    // ربط منتقي الألوان بحقول النص
    const colorPickers = [
        { picker1: 'primaryColorsColor1', picker2: 'primaryColorsColor2', text: 'primaryColors' },
        { picker1: 'secondaryColorsColor1', picker2: 'secondaryColorsColor2', text: 'secondaryColors' },
        { picker: 'avoidColorsColor', text: 'avoidColors' }
    ];

    colorPickers.forEach((config) => {
        if (config.picker1 && config.picker2) {
            // للألوان التي تحتاج لونين
            const colorInput1 = document.getElementById(config.picker1);
            const colorInput2 = document.getElementById(config.picker2);
            const textInput = document.getElementById(config.text);
            
            if (colorInput1 && colorInput2 && textInput) {
                function updateTwoColors() {
                    const colorName1 = hexToColorName(colorInput1.value);
                    const colorName2 = hexToColorName(colorInput2.value);
                    textInput.value = `${colorName1} (${colorInput1.value}) + ${colorName2} (${colorInput2.value})`;
                }
                
                colorInput1.addEventListener('input', updateTwoColors);
                colorInput2.addEventListener('input', updateTwoColors);
                
                // تعيين القيم الافتراضية
                updateTwoColors();
            }
        } else if (config.picker) {
            // للألوان التي تحتاج لون واحد
            const colorInput = document.getElementById(config.picker);
            const textInput = document.getElementById(config.text);
            
            if (colorInput && textInput) {
                colorInput.addEventListener('input', function() {
                    const colorName = hexToColorName(this.value);
                    textInput.value = colorName + ' (' + this.value + ')';
                });
                
                const initialColorName = hexToColorName(colorInput.value);
                textInput.value = initialColorName + ' (' + colorInput.value + ')';
            }
        }
    });

    // Show/hide existing logo details based on radio selection with safety checks
    if (hasExistingLogoRadios && hasExistingLogoRadios.length > 0) {
        hasExistingLogoRadios.forEach(radio => {
            if (radio) {
                radio.addEventListener('change', function() {
                    if (this.value === 'yes') {
                        if (existingLogoDetails) {
                            existingLogoDetails.style.display = 'block';
                            existingLogoDetails.classList.add('fade-in');
                        }
                        if (logoUpload) {
                            logoUpload.style.display = 'block';
                            logoUpload.classList.add('fade-in');
                        }
                        // جعل رفع الملف مطلوباً عند اختيار "نعم"
                        const existingLogoFileInput = document.getElementById('existingLogoFile');
                        if (existingLogoFileInput) {
                            existingLogoFileInput.setAttribute('required', 'required');
                        }
                    } else {
                        if (existingLogoDetails) {
                            existingLogoDetails.style.display = 'none';
                        }
                        if (logoUpload) {
                            logoUpload.style.display = 'none';
                        }
                        const existingLogoChangesInput = document.getElementById('existingLogoChanges');
                        const existingLogoFileInput = document.getElementById('existingLogoFile');
                        
                        if (existingLogoChangesInput) {
                            existingLogoChangesInput.value = '';
                        }
                        if (existingLogoFileInput) {
                            existingLogoFileInput.value = '';
                            existingLogoFileInput.removeAttribute('required');
                        }
                    }
                });
            }
        });
    }

    // File upload validation للشعارات الثلاثة
    const logoExample1Input = document.getElementById('logoExample1');
    const logoExample2Input = document.getElementById('logoExample2');
    const logoExample3Input = document.getElementById('logoExample3');
    
    // التحقق من صحة الملفات المرفوعة
    function validateFileUpload(input) {
        if (input && input.files.length > 0) {
            const file = input.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (file.size > maxSize) {
                alert('حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5MB');
                input.value = '';
                return false;
            }
            
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, GIF) أو ملف PDF');
                input.value = '';
                return false;
            }
            
            console.log('تم اختيار ملف صحيح:', file.name);
            return true;
        }
        return true;
    }
    
    // إضافة مستمعين للأحداث
    if (logoExample1Input) {
        logoExample1Input.addEventListener('change', function() {
            validateFileUpload(this);
        });
    }
    
    if (logoExample2Input) {
        logoExample2Input.addEventListener('change', function() {
            validateFileUpload(this);
        });
    }
    
    if (logoExample3Input) {
        logoExample3Input.addEventListener('change', function() {
            validateFileUpload(this);
        });
    }

    // Existing logo file validation
    const existingLogoFileInput = document.getElementById('existingLogoFile');
    existingLogoFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (file.size > maxSize) {
                alert('حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5MB');
                this.value = '';
                return;
            }
            
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, GIF) أو ملف PDF');
                this.value = '';
                return;
            }
            
            console.log('تم اختيار ملف صحيح:', file.name);
        }
    });

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // إنشاء المجلد أولاً ثم إرسال النموذج
            createUserFolderAndSubmit();
        }
    });

    // إنشاء مجلد المستخدم وإرسال النموذج
    async function createUserFolderAndSubmit() {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;

            // جمع بيانات النموذج
            const formResult = collectFormData();
            
            // إرسال البيانات إلى Google Sheets وإنشاء المجلد
            const response = await sendToGoogleSheetsWithFolder(formResult.data);
            
            // إظهار رسالة النجاح مع رابط المجلد
            showSuccessMessageWithFolder(response.userFolderUrl);
            
        } catch (error) {
            console.error('خطأ في الإرسال:', error);
            showErrorMessage('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // جمع بيانات النموذج مع الملفات
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        const files = {};
        
        // Convert FormData to regular object and separate files
        for (let [key, value] of formData.entries()) {
            if (value instanceof File && value.size > 0) {
                // This is a file
                files[key] = value;
                data[key + '_fileName'] = value.name;
            } else {
                // This is regular form data
                if (data[key]) {
                    // Handle multiple values (checkboxes)
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
        }

        // Convert arrays to comma-separated strings for Google Sheets
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                data[key] = data[key].join(', ');
            }
        });

        // تحويل القيم الإنجليزية إلى العربية قبل الإرسال
        const convertedData = convertValuesToArabic(data);

        // Add timestamp
        convertedData.timestamp = new Date().toLocaleString('ar-SA');
        
        return { data: convertedData, files: files };
    }

    // تحويل القيم الإنجليزية إلى النصوص العربية المعروضة
    function convertValuesToArabic(data) {
        // خريطة تحويل الفئات المستهدفة
        const targetAudienceMap = {
            'housewives': 'ربات البيوت',
            'mothers': 'الأمهات',
            'cooking-lovers': 'محبي الطبخ المنزلي',
            'handcraft-lovers': 'عشاق الحرف اليدوية',
            'occasions': 'المناسبات والأفراح',
            'brides': 'العرائس',
            'families': 'العائلات',
            'children': 'الأطفال',
            'youth': 'الشباب',
            'elderly': 'كبار السن',
            'working-women': 'المرأة العاملة',
            'students': 'الطلاب والطالبات',
            'teachers': 'المعلمات',
            'healthy-lifestyle': 'محبي الأكل الصحي',
            'fitness-lovers': 'محبي الرياضة واللياقة',
            'beauty-lovers': 'محبي التجميل والعناية',
            'home-decorators': 'محبي الديكور المنزلي',
            'gift-seekers': 'باحثين عن الهدايا',
            'entrepreneurs': 'رائدات الأعمال',
            'general-public': 'عامة الناس'
        };

        // خريطة تحويل أنواع الشعارات
        const logoTypeMap = {
            'text': 'الشعار النصي',
            'symbol': 'الشعار الرمزي',
            'combination': 'مزيج نص ورمز',
            'abbreviated': 'الشعار الحرفي'
        };

        // خريطة تحويل طابع الشعار
        const logoStyleMap = {
            'luxury': 'فاخر',
            'minimal': 'بسيط / Minimal',
            'modern': 'عصري',
            'classic': 'كلاسيكي',
            'youthful': 'شبابي',
            'formal': 'رسمي',
            'playful': 'مرح'
        };

        // خريطة تحويل استخدامات الشعار
        const logoUsageMap = {
            'social-media': 'على السوشيال ميديا',
            'website': 'على الموقع الإلكتروني',
            'business-cards': 'على بطاقات العمل والفواتير',
            'storefront': 'على واجهة المتجر أو اللوحات',
            'products': 'على المنتجات أو التغليف',
            'promotional': 'على المواد الدعائية والإعلانية'
        };

        // خريطة تحويل الشعار السابق
        const hasExistingLogoMap = {
            'yes': 'نعم',
            'no': 'لا'
        };

        // تطبيق التحويلات
        if (data.targetAudience) {
            // تحويل القيم المفصولة بفاصلة إلى مصفوفة ثم تحويل كل قيمة
            const audienceValues = data.targetAudience.split(', ');
            const convertedAudience = audienceValues.map(value => targetAudienceMap[value.trim()] || value.trim());
            data.targetAudience = convertedAudience.join(', ');
        }

        if (data.logoType) {
            const logoTypeValues = data.logoType.split(', ');
            const convertedLogoType = logoTypeValues.map(value => logoTypeMap[value.trim()] || value.trim());
            data.logoType = convertedLogoType.join(', ');
        }

        if (data.logoStyle) {
            data.logoStyle = logoStyleMap[data.logoStyle] || data.logoStyle;
        }

        if (data.logoUsage) {
            const logoUsageValues = data.logoUsage.split(', ');
            const convertedLogoUsage = logoUsageValues.map(value => logoUsageMap[value.trim()] || value.trim());
            data.logoUsage = convertedLogoUsage.join(', ');
        }

        if (data.hasExistingLogo) {
            data.hasExistingLogo = hasExistingLogoMap[data.hasExistingLogo] || data.hasExistingLogo;
        }

        return data;
    }

    // Function to send data to Google Sheets and create folder
    async function sendToGoogleSheetsWithFolder(data) {
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYQP-PE_kDln2R44qF-9mh6rtoS5GznkT8NrWreUNVhQ1m44Hb84h3RI4P9heJk1RmqQ/exec';
        
        try {
            console.log('إرسال البيانات وإنشاء المجلد:', data);
            
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            console.log('رد الخادم:', response);
            
            if (response.ok || response.status === 0) {
                console.log('تم إرسال البيانات وإنشاء المجلد بنجاح');
                
                // محاولة قراءة الرد للحصول على رابط المجلد
                try {
                    const responseText = await response.text();
                    const responseData = JSON.parse(responseText);
                    return responseData;
                } catch (parseError) {
                    console.log('تم الإرسال بنجاح ولكن لم يتم قراءة الرد');
                    return { 
                        status: 'success', 
                        userFolderUrl: 'https://drive.google.com/drive/folders/1R_0cXX-I-VWrDvFFJXu9Y2TWOk5q1zS_'
                    };
                }
            } else {
                throw new Error(`خطأ في الخادم: ${response.status}`);
            }
            
        } catch (error) {
            console.error('خطأ في الإرسال:', error);
            
            // محاولة ثانية
            try {
                const response2 = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `data=${encodeURIComponent(JSON.stringify(data))}`
                });
                
                return { 
                    status: 'success', 
                    userFolderUrl: 'https://drive.google.com/drive/folders/1R_0cXX-I-VWrDvFFJXu9Y2TWOk5q1zS_'
                };
                
            } catch (error2) {
                throw error;
            }
        }
    }

    // Function to send data only to Google Sheets
    async function sendToGoogleSheetsSimple(data) {
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYQP-PE_kDln2R44qF-9mh6rtoS5GznkT8NrWreUNVhQ1m44Hb84h3RI4P9heJk1RmqQ/exec';
        
        try {
            console.log('إرسال البيانات إلى Google Sheets:', data);
            
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            console.log('رد الخادم:', response);
            
            if (response.ok || response.status === 0) {
                console.log('تم إرسال البيانات بنجاح');
                return Promise.resolve({ status: 'success' });
            } else {
                throw new Error(`خطأ في الخادم: ${response.status}`);
            }
            
        } catch (error) {
            console.error('خطأ في الإرسال:', error);
            
            // محاولة ثانية
            try {
                const response2 = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `data=${encodeURIComponent(JSON.stringify(data))}`
                });
                
                return Promise.resolve({ status: 'success' });
                
            } catch (error2) {
                throw error;
            }
        }
    }

    // Function to send data and files to Google Sheets and Drive
    async function sendToGoogleSheetsWithFiles(data, files) {
        // رابط Google Apps Script Web App الخاص بك
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYQP-PE_kDln2R44qF-9mh6rtoS5GznkT8NrWreUNVhQ1m44Hb84h3RI4P9heJk1RmqQ/exec';
        
        try {
            console.log('إرسال البيانات والملفات إلى Google:', { data, files });
            
            // إنشاء FormData للإرسال
            const formData = new FormData();
            
            // إضافة البيانات النصية
            formData.append('data', JSON.stringify(data));
            
            // إضافة الملفات
            Object.keys(files).forEach(key => {
                formData.append(key, files[key]);
            });
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            console.log('رد الخادم:', response);
            
            // تحقق من نجاح الطلب
            if (response.ok || response.status === 0) {
                console.log('تم إرسال البيانات والملفات بنجاح');
                return Promise.resolve({ status: 'success' });
            } else {
                console.error('خطأ في الرد:', response.status, response.statusText);
                throw new Error(`خطأ في الخادم: ${response.status}`);
            }
            
        } catch (error) {
            console.error('خطأ في الإرسال:', error);
            
            // محاولة ثانية باستخدام طريقة مختلفة (للبيانات فقط)
            try {
                console.log('محاولة إرسال ثانية للبيانات النصية فقط...');
                
                const response2 = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `data=${encodeURIComponent(JSON.stringify(data))}`
                });
                
                console.log('المحاولة الثانية نجحت (البيانات النصية فقط)');
                return Promise.resolve({ status: 'success', note: 'تم حفظ البيانات، يرجى رفع الملفات يدوياً' });
                
            } catch (error2) {
                console.error('فشلت المحاولة الثانية أيضاً:', error2);
                throw error;
            }
        }
    }

    // Real-time validation with safety checks
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        }
    });

    // Checkbox and radio validation with safety checks
    const requiredGroups = ['logoType', 'logoUsage', 'targetAudience'];
    requiredGroups.forEach(groupName => {
        const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
        if (checkboxes.length > 0) {
            checkboxes.forEach(checkbox => {
                if (checkbox) {
                    checkbox.addEventListener('change', function() {
                        validateCheckboxGroup(groupName);
                    });
                }
            });
        }
    });

    function validateField(field) {
        const errorMessage = field.parentNode.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        field.classList.remove('error');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'هذا الحقل مطلوب');
            return false;
        }
        
        return true;
    }

    function validateCheckboxGroup(groupName) {
        const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
        const checked = Array.from(checkboxes).some(cb => cb.checked);
        const container = checkboxes[0].closest('.form-group');
        const errorMessage = container.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        if (!checked && groupName === 'logoType') {
            showGroupError(container, 'يرجى اختيار نوع واحد على الأقل');
            return false;
        }
        
        if (!checked && groupName === 'logoUsage') {
            showGroupError(container, 'يرجى اختيار استخدام واحد على الأقل');
            return false;
        }
        
        if (!checked && groupName === 'targetAudience') {
            showGroupError(container, 'يرجى اختيار فئة مستهدفة واحدة على الأقل');
            return false;
        }
        
        return true;
    }

    function validateForm() {
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        // Validate required text inputs and textareas
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate required radio groups
        const requiredRadioGroups = ['hasExistingLogo', 'logoStyle'];
        requiredRadioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            const checked = Array.from(radios).some(radio => radio.checked);
            
            if (!checked) {
                const container = radios[0].closest('.form-group');
                showGroupError(container, 'يرجى اختيار إجابة');
                isValid = false;
            }
        });
        
        // Validate required checkbox groups
        if (!validateCheckboxGroup('logoType')) {
            isValid = false;
        }
        
        if (!validateCheckboxGroup('logoUsage')) {
            isValid = false;
        }
        
        if (!validateCheckboxGroup('targetAudience')) {
            isValid = false;
        }
        
        // Scroll to first error if validation fails
        if (!isValid) {
            const firstError = document.querySelector('.error, .error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('span');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function showGroupError(container, message) {
        const errorDiv = document.createElement('span');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        
        const successHTML = `
            <strong>تم إرسال الاستبيان بنجاح!</strong><br>
            شكراً لك على تعبئة الاستبيان. سنقوم بمراجعة المعلومات والتواصل معك قريباً لبدء تصميم الشعار.<br><br>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong style="color: #2e7d32;">📁 لرفع الشعارات المرجعية:</strong><br>
                <span style="color: #2e7d32;">يرجى رفع الشعارات الثلاثة في هذا الرابط:</span><br>
                <a href="https://drive.google.com/drive/folders/1R_0cXX-I-VWrDvFFJXu9Y2TWOk5q1zS_" 
                   target="_blank" 
                   style="color: #1976d2; text-decoration: underline; font-weight: bold;">
                   🔗 مجلد Google Drive لرفع الشعارات
                </a><br>
                <small style="color: #666;">قم بإنشاء مجلد فرعي باسمك ورفع الملفات فيه</small>
            </div>
        `;
        
        successDiv.innerHTML = successHTML;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide form after showing success message
        setTimeout(() => {
            form.style.display = 'none';
        }, 1000);
    }

    function showSuccessMessageWithFolder(folderUrl) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        
        const fullName = document.getElementById('fullName').value;
        
        const successHTML = `
            <strong>🎉 تم إرسال الاستبيان بنجاح!</strong><br>
            شكراً لك <strong>${fullName}</strong> على تعبئة الاستبيان. سنقوم بمراجعة المعلومات والتواصل معك قريباً لبدء تصميم الشعار.<br><br>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 12px; margin-top: 20px; border: 2px solid #4caf50;">
                <h3 style="color: #2e7d32; margin: 0 0 15px 0;">📁 مجلدك الخاص لرفع الشعارات</h3>
                <p style="color: #2e7d32; margin: 10px 0;">تم إنشاء مجلد خاص بك باسم: <strong>${fullName}</strong></p>
                  <p style="color: #1976d2; margin: 0 0 10px 0; font-weight: bold;">
                        أرسل لنا 3 شعارات لأي براند أو علامة تجارية أعجبتك لنفهم ذوقك في التصميم
                    </p>
                <a href="${folderUrl || 'https://drive.google.com/drive/folders/1R_0cXX-I-VWrDvFFJXu9Y2TWOk5q1zS_'}" 
                   target="_blank" 
                   style="display: inline-block; background: #4caf50; color: white; padding: 12px 24px; 
                          border-radius: 8px; text-decoration: none; font-weight: bold; margin: 10px 0;">
                   🔗 افتح مجلدك في Google Drive
                </a>
                
                <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <h4 style="color: #1976d2; margin: 0 0 10px 0;">📋 تعليمات رفع الشعارات:</h4>
                    <ol style="color: #333; margin: 0; padding-right: 20px;">
                        <li>اضغط على الرابط أعلاه لفتح مجلدك</li>
                        <li>ارفع الشعارات الثلاثة التي أعجبتك</li>
                        <li>تأكد من أن أسماء الملفات واضحة (مثل: شعار1.jpg، شعار2.png)</li>
                    </ol>
                    <p style="color: #666; margin: 10px 0 0 0; font-size: 0.9rem;">
                        💡 يمكنك رفع الملفات الآن أو لاحقاً - المجلد سيبقى متاحاً لك
                    </p>
                </div>
            </div>
        `;
        
        successDiv.innerHTML = successHTML;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide form after showing success message
        setTimeout(() => {
            form.style.display = 'none';
        }, 1000);
    }

    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-main';
        errorDiv.innerHTML = `
            <strong>خطأ في الإرسال!</strong><br>
            ${message}
        `;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Reset form functionality with safety checks
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('هل أنت متأكد من أنك تريد مسح جميع البيانات؟')) {
                if (form) {
                    form.reset();
                }
                
                // Hide conditional fields with safety checks
                if (existingLogoDetails) {
                    existingLogoDetails.style.display = 'none';
                }
                if (logoUpload) {
                    logoUpload.style.display = 'none';
                }
                
                // Clear all error messages and styles
                document.querySelectorAll('.error-message').forEach(msg => {
                    if (msg) msg.remove();
                });
                document.querySelectorAll('.error').forEach(field => {
                    if (field) field.classList.remove('error');
                });
                
                // Hide success message if visible
                const successMessage = document.querySelector('.success-message');
                if (successMessage) {
                    successMessage.remove();
                    if (form) {
                        form.style.display = 'block';
                    }
                }
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Smooth scrolling for better UX
    function smoothScrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Auto-save to localStorage (optional feature)
    function autoSave() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // تجنب حفظ بيانات الملفات
            if (!(value instanceof File)) {
                data[key] = value;
            }
        }
        
        localStorage.setItem('logoSurveyDraft', JSON.stringify(data));
    }

    // Load saved data on page load (optional feature)
    function loadSavedData() {
        const savedData = localStorage.getItem('logoSurveyDraft');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                for (let [key, value] of Object.entries(data)) {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'radio' || field.type === 'checkbox') {
                            const specificField = form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (specificField) {
                                specificField.checked = true;
                            }
                        } else if (field.type !== 'file') {
                            // تجنب تعيين قيم لحقول الملفات
                            field.value = value;
                        }
                    }
                }
                
                // Trigger change events to show conditional fields
                const hasExistingLogo = form.querySelector('input[name="hasExistingLogo"]:checked');
                if (hasExistingLogo) {
                    hasExistingLogo.dispatchEvent(new Event('change'));
                }
            } catch (e) {
                console.log('Error loading saved data:', e);
            }
        }
    }

    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);

    // Load saved data on page load
    loadSavedData();
});