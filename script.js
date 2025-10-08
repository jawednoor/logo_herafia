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

    // Professional Custom Color Picker System
    let currentColorPicker = null;
    let selectedColors = [];
    let maxColors = 2;

    // Initialize color picker data
    const colorPickerData = {
        primaryColors: ['#1f71b7', '#0d4a73'],
        secondaryColors: ['#f58220', '#ff9f4a'],
        avoidColors: ['#ff0000']
    };

    // Color name mapping function - Enhanced for women 23-40
    function hexToColorName(hex) {
        const colorNames = {
            // ألوان شائعة ومحبوبة
            '#ff69b4': 'وردي جميل', '#ffb6c1': 'وردي فاتح', '#ffc0cb': 'زهري ناعم', '#ff1493': 'وردي غامق',
            '#dc143c': 'أحمر جميل', '#ff6347': 'أحمر طماطم', '#ff4500': 'برتقالي محمر', '#ffa500': 'برتقالي ذهبي',
            '#ffd700': 'ذهبي لامع', '#ffff00': 'أصفر مشرق', '#adff2f': 'أخضر ليموني', '#32cd32': 'أخضر طبيعي',
            '#00ced1': 'تركوازي', '#00bfff': 'أزرق سماوي', '#1e90ff': 'أزرق مائي', '#9370db': 'بنفسجي جميل',
            '#8a2be2': 'بنفسجي غامق', '#dda0dd': 'برقوقي فاتح',

            // ألوان الموضة والترند
            '#e6e6fa': 'لافندر فاتح', '#f0e68c': 'كاكي فاتح', '#98fb98': 'أخضر نعناع',
            '#afeeee': 'أزرق باستيل', '#f5deb3': 'قمحي فاتح', '#ffe4e1': 'وردي مغبر', '#fff8dc': 'كريمي ناعم',
            '#f0f8ff': 'أزرق فاتح جداً', '#f5f5dc': 'بيج ناعم', '#ffefd5': 'خوخي فاتح', '#ffe4b5': 'موكا فاتح',
            '#ffdab9': 'خوخي دافئ', '#eee8aa': 'ذهبي باهت', '#f0fff0': 'أخضر ثلجي', '#f8f8ff': 'أبيض شبحي',
            '#fdf5e6': 'كريم قديم', '#fffaf0': 'أبيض زهري',

            // ألوان الجمال والأناقة
            '#b22222': 'أحمر كلاسيكي', '#a0522d': 'بني سادل', '#8b4513': 'بني شوكولاتة', '#d2691e': 'برتقالي شوكولاتة',
            '#cd853f': 'بني بيرو', '#deb887': 'بني قمحي', '#f4a460': 'بني رملي', '#da70d6': 'أوركيد',
            '#ba55d3': 'أوركيد متوسط', '#9932cc': 'أوركيد غامق', '#8b008b': 'ماجنتا غامق', '#800080': 'بنفسجي كلاسيكي',
            '#4b0082': 'نيلي غامق', '#483d8b': 'أزرق أردوازي', '#6495ed': 'أزرق كورن فلاور', '#4169e1': 'أزرق ملكي',
            '#0000cd': 'أزرق متوسط', '#191970': 'أزرق منتصف الليل',

            // الألوان المحايدة والكلاسيكية
            '#000000': 'أسود كلاسيكي', '#2f2f2f': 'رمادي داكن', '#696969': 'رمادي قاتم', '#808080': 'رمادي متوسط',
            '#a9a9a9': 'رمادي فاتح', '#c0c0c0': 'فضي لامع', '#d3d3d3': 'رمادي فاتح جداً', '#dcdcdc': 'رمادي غيبوبة',
            '#f5f5f5': 'أبيض دخاني', '#ffffff': 'أبيض نقي', '#fffafa': 'أبيض ثلجي', '#f0f0f0': 'رمادي فاتح جداً',

            // ألوان احترافية للأعمال
            '#1f71b7': 'أزرق احترافي', '#0d4a73': 'أزرق بحري', '#f58220': 'برتقالي دافئ', '#ff9f4a': 'برتقالي مشرق',
            '#2e7d32': 'أخضر احترافي', '#388e3c': 'أخضر طبيعي', '#c62828': 'أحمر احترافي', '#d32f2f': 'أحمر قوي',
            '#6a1b9a': 'بنفسجي احترافي', '#7b1fa2': 'بنفسجي عميق', '#f57c00': 'برتقالي غامق', '#ff6f00': 'برتقالي عنبر',
            '#5d4037': 'بني احترافي', '#6d4c41': 'بني دافئ', '#37474f': 'رمادي أزرق', '#455a64': 'رمادي أزرق فاتح',
            '#283593': 'نيلي قوي', '#303f9f': 'نيلي عميق',

            // ألوان طبيعية وهادئة
            '#228b22': 'أخضر غابات', '#006400': 'أخضر داكن', '#8fbc8f': 'أخضر بحري فاتح', '#20b2aa': 'أخضر بحري فاتح',
            '#48d1cc': 'تركوازي متوسط', '#40e0d0': 'تركوازي مشرق', '#5f9ea0': 'أزرق كاديت',
            '#4682b4': 'أزرق فولاذي', '#b0c4de': 'أزرق فولاذي فاتح', '#87ceeb': 'أزرق سماوي', '#87cefa': 'أزرق سماوي فاتح',
            '#add8e6': 'أزرق فاتح', '#e0ffff': 'سماوي فاتح', '#f0ffff': 'أزرق أليس', '#f5fffa': 'كريم نعناع',
            '#fafad2': 'ذهبي فاتح',

            // ألوان إضافية
            '#ff0000': 'أحمر', '#00ff00': 'أخضر', '#0000ff': 'أزرق', '#9400d3': 'بنفسجي',
            '#00ffff': 'سماوي', '#ffcccb': 'أحمر باستيل', '#fffacd': 'أصفر باستيل'
        };
        
        const lowerHex = hex.toLowerCase();
        if (colorNames[lowerHex]) {
            return colorNames[lowerHex];
        }
        
        // التحليل التلقائي للألوان مع دقة أكبر
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // تحليل أكثر دقة للألوان
        if (r > 200 && g < 150 && b > 150) return 'وردي';
        if (r > 200 && g < 100 && b < 100) return 'أحمر';
        if (r > 200 && g > 150 && b < 100) return 'برتقالي';
        if (r > 200 && g > 200 && b < 150) return 'أصفر';
        if (r < 150 && g > 200 && b < 150) return 'أخضر';
        if (r < 100 && g > 150 && b > 200) return 'سماوي';
        if (r < 150 && g < 150 && b > 200) return 'أزرق';
        if (r > 150 && g < 150 && b > 200) return 'بنفسجي';
        if (r > 150 && g > 150 && b > 150) return 'فاتح';
        if (r < 100 && g < 100 && b < 100) return 'داكن';
        
        return 'لون مخصص';
    }

    // Initialize custom color pickers
    function initializeCustomColorPickers() {
        const colorPickerGroups = document.querySelectorAll('.custom-color-picker-group');
        
        colorPickerGroups.forEach(group => {
            const target = group.dataset.target;
            const openBtn = group.querySelector('.open-color-picker-btn');
            const textInput = group.querySelector(`#${target}`);
            
            // Set max colors
            maxColors = group.dataset.max ? parseInt(group.dataset.max) : 2;
            
            // Update display
            updateColorDisplay(target);
            
            // Open color picker
            openBtn.addEventListener('click', () => {
                openColorPicker(target);
            });
        });
    }

    // Update color display
    function updateColorDisplay(target) {
        const group = document.querySelector(`[data-target="${target}"]`);
        const selectedColorBoxes = group.querySelectorAll('.selected-color-box');
        const textInput = document.getElementById(target);
        const colors = colorPickerData[target] || [];
        
        // Update color boxes
        selectedColorBoxes.forEach((box, index) => {
            if (colors[index]) {
                box.style.backgroundColor = colors[index];
                box.style.border = `3px solid ${colors[index]}`;
            }
        });
        
        // Update text input
        if (colors.length > 0) {
            const colorNames = colors.map(color => {
                const name = hexToColorName(color);
                return `${name} (${color})`;
            });
            textInput.value = colorNames.join(' + ');
        }
    }

    // Open color picker modal
    function openColorPicker(target) {
        currentColorPicker = target;
        selectedColors = [...(colorPickerData[target] || [])];
        maxColors = document.querySelector(`[data-target="${target}"]`).dataset.max ? 
                   parseInt(document.querySelector(`[data-target="${target}"]`).dataset.max) : 2;
        
        const modal = document.getElementById('colorPickerModal');
        modal.classList.add('active');
        
        updateModalDisplay();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close color picker modal
    function closeColorPicker() {
        const modal = document.getElementById('colorPickerModal');
        modal.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        currentColorPicker = null;
        selectedColors = [];
    }

    // Update modal display
    function updateModalDisplay() {
        const colorItems = document.querySelectorAll('.color-item');
        const previewColors = document.querySelector('.preview-colors');
        
        // Update color item selections
        colorItems.forEach(item => {
            const color = item.dataset.color;
            if (selectedColors.includes(color)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Update preview
        previewColors.innerHTML = '';
        selectedColors.forEach(color => {
            const previewColor = document.createElement('div');
            previewColor.className = 'preview-color';
            previewColor.style.backgroundColor = color;
            previewColors.appendChild(previewColor);
        });
    }

    // Handle color selection
    function handleColorSelection(color) {
        const index = selectedColors.indexOf(color);
        
        if (index > -1) {
            // Remove color
            selectedColors.splice(index, 1);
        } else {
            // Add color
            if (selectedColors.length < maxColors) {
                selectedColors.push(color);
            } else {
                // Replace last color
                selectedColors[maxColors - 1] = color;
            }
        }
        
        updateModalDisplay();
    }

    // Confirm color selection
    function confirmColorSelection() {
        if (currentColorPicker && selectedColors.length > 0) {
            colorPickerData[currentColorPicker] = [...selectedColors];
            updateColorDisplay(currentColorPicker);
        }
        closeColorPicker();
    }

    // Initialize color picker events
    function initializeColorPickerEvents() {
        const modal = document.getElementById('colorPickerModal');
        const closeBtn = document.querySelector('.close-color-picker');
        const cancelBtn = document.getElementById('cancelColorPicker');
        const confirmBtn = document.getElementById('confirmColorPicker');
        const colorItems = document.querySelectorAll('.color-item');
        
        // Close events
        closeBtn.addEventListener('click', closeColorPicker);
        cancelBtn.addEventListener('click', closeColorPicker);
        
        // Confirm event
        confirmBtn.addEventListener('click', confirmColorSelection);
        
        // Color selection events
        colorItems.forEach(item => {
            const color = item.dataset.color;
            const name = item.dataset.name;
            
            // Set background color
            item.style.backgroundColor = color;
            item.title = name;
            
            // Click event
            item.addEventListener('click', () => {
                handleColorSelection(color);
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeColorPicker();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeColorPicker();
            }
        });
    }

    // Initialize everything
    initializeCustomColorPickers();
    initializeColorPickerEvents();

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

        // Add custom color picker data
        Object.keys(colorPickerData).forEach(key => {
            const colors = colorPickerData[key];
            if (colors && colors.length > 0) {
                const colorNames = colors.map(color => {
                    const name = hexToColorName(color);
                    return `${name} (${color})`;
                });
                data[key] = colorNames.join(' + ');
            }
        });

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