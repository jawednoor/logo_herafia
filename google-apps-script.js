/**
 * Google Apps Script للتعامل مع بيانات استبيان تصميم الشعار
 * هذا الكود يجب إضافته في Google Apps Script (script.google.com)
 */

// معرف Google Sheet الذي ستحفظ فيه البيانات
const SHEET_ID = '1dH4YKk5Qk8Rc7A3ZIP6QOsDqIgoUrcCZQrvYKZNyZws';
const SHEET_NAME = 'استبيان تصميم الشعار';

/**
 * دالة للتعامل مع طلبات POST من النموذج
 */
function doPost(e) {
  try {
    console.log('تم استلام طلب POST');
    
    let data;
    
    // طرق مختلفة لقراءة البيانات
    if (e && e.postData && e.postData.contents) {
      console.log('قراءة البيانات من postData.contents');
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      console.log('قراءة البيانات من parameter.data');
      data = JSON.parse(e.parameter.data);
    } else if (e && e.parameters && e.parameters.data) {
      console.log('قراءة البيانات من parameters.data');
      data = JSON.parse(e.parameters.data[0]);
    } else {
      console.log('إنشاء بيانات افتراضية للاختبار');
      data = {
        timestamp: new Date().toLocaleString('ar-SA'),
        brandName: 'طلب تم استلامه - ' + new Date().toLocaleString('ar-SA'),
        hasExistingLogo: 'غير محدد',
        businessType: 'طلب من النموذج',
        businessDescription: 'تم استلام طلب جديد من النموذج',
        targetAudience: 'عام',
        logoType: 'مختلط',
        primaryColors: 'غير محدد',
        logoStyle: 'عصري',
        logoUsage: 'متعدد',
        additionalNotes: 'تم إنشاء هذا السجل تلقائياً عند استلام طلب من النموذج'
      };
    }
    
    console.log('البيانات المستلمة:', data);
    
    // حفظ البيانات في Google Sheets
    const result = saveToSheet(data);
    console.log('تم حفظ البيانات بنجاح:', result);
    
    // إرسال رد ناجح
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'تم حفظ البيانات بنجاح',
        data: result
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('خطأ في معالجة الطلب:', error);
    console.error('تفاصيل الخطأ:', error.toString());
    
    // إرسال رد بالخطأ
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'حدث خطأ في حفظ البيانات: ' + error.message,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * دالة للتعامل مع طلبات GET (للاختبار)
 */
function doGet(e) {
  try {
    console.log('تم استلام طلب GET');
    
    // إنشاء بيانات تجريبية للاختبار
    const testData = {
      timestamp: new Date().toLocaleString('ar-SA'),
      brandName: 'اختبار الاتصال',
      hasExistingLogo: 'لا',
      businessType: 'اختبار',
      businessDescription: 'اختبار الاتصال مع Google Sheets',
      targetAudience: 'اختبار',
      logoType: 'نصي',
      primaryColors: 'أزرق',
      logoStyle: 'عصري',
      logoUsage: 'موقع إلكتروني',
      additionalNotes: 'هذا اختبار للتأكد من عمل الاتصال'
    };
    
    // حفظ البيانات التجريبية
    const result = saveToSheet(testData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Google Apps Script يعمل بشكل صحيح - تم إدراج بيانات تجريبية',
        timestamp: new Date().toISOString(),
        result: result
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('خطأ في اختبار GET:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'خطأ في اختبار الاتصال: ' + error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * دالة لحفظ البيانات في Google Sheets
 */
function saveToSheet(data) {
  try {
    console.log('محاولة فتح الجدول بالمعرف:', SHEET_ID);
    
    // فتح الجدول
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    console.log('تم فتح الجدول بنجاح:', spreadsheet.getName());
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // إنشاء الشيت إذا لم يكن موجوداً
    if (!sheet) {
      console.log('الشيت غير موجود، سيتم إنشاؤه');
      sheet = createNewSheet(spreadsheet);
    } else {
      console.log('تم العثور على الشيت:', sheet.getName());
    }
    
    // تحضير البيانات للإدراج
    const rowData = [
      data.timestamp || new Date().toLocaleString('ar-SA'),
      data.brandName || '',
      data.hasExistingLogo || '',
      data.existingLogoChanges || '',
      data.businessType || '',
      data.businessDescription || '',
      data.targetAudience || '',
      data.logoType || '',
      data.inspirationLogos || '',
      data.primaryColors || '',
      data.secondaryColors || '',
      data.avoidColors || '',
      data.logoStyle || '',
      data.logoUsage || '',
      data.additionalNotes || ''
    ];
    
    console.log('البيانات المحضرة للإدراج:', rowData);
    
    // إضافة الصف الجديد
    sheet.appendRow(rowData);
    const newRowNumber = sheet.getLastRow();
    console.log('تم إدراج الصف رقم:', newRowNumber);
    
    // إرسال إشعار بريد إلكتروني (اختياري)
    try {
      sendEmailNotification(data);
    } catch (emailError) {
      console.error('خطأ في إرسال الإشعار:', emailError);
      // لا نريد أن يفشل حفظ البيانات بسبب خطأ في الإيميل
    }
    
    return {
      rowNumber: newRowNumber,
      timestamp: data.timestamp,
      sheetName: sheet.getName()
    };
    
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    console.error('تفاصيل الخطأ:', error.toString());
    throw error;
  }
}

/**
 * دالة لإنشاء شيت جديد مع العناوين
 */
function createNewSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(SHEET_NAME);
  
  // إضافة عناوين الأعمدة
  const headers = [
    'الوقت والتاريخ',
    'الاسم التجاري',
    'يوجد شعار سابق؟',
    'التغييرات المطلوبة',
    'نوع النشاط',
    'وصف النشاط',
    'الفئة المستهدفة',
    'نوع الشعار',
    'شعارات ملهمة',
    'الألوان الأساسية',
    'الألوان الثانوية',
    'الألوان المرفوضة',
    'طابع الشعار',
    'الاستخدامات',
    'ملاحظات إضافية'
  ];
  
  // إدراج العناوين في الصف الأول
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // تنسيق العناوين
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // تعديل عرض الأعمدة
  sheet.autoResizeColumns(1, headers.length);
  
  return sheet;
}

/**
 * دالة لإرسال إشعار بريد إلكتروني عند استلام استبيان جديد
 */
function sendEmailNotification(data) {
  try {
    // عنوان البريد الإلكتروني الذي سيستلم الإشعار
    const EMAIL_ADDRESS = 'JAD.JWD10@GMAIL.COM'; // غيّر هذا إلى بريدك الإلكتروني
    
    if (EMAIL_ADDRESS === 'your-email@gmail.com') {
      console.log('لم يتم تعيين عنوان بريد إلكتروني للإشعارات');
      return;
    }
    
    const subject = `استبيان جديد لتصميم شعار - ${data.brandName}`;
    
    const body = `
تم استلام استبيان جديد لتصميم شعار:

📋 المعلومات العامة:
- الاسم التجاري: ${data.brandName}
- يوجد شعار سابق: ${data.hasExistingLogo === 'yes' ? 'نعم' : 'لا'}

🏢 النشاط التجاري:
- نوع النشاط: ${data.businessType}
- الفئة المستهدفة: ${data.targetAudience}

🎨 تفاصيل التصميم:
- نوع الشعار: ${data.logoType}
- الطابع المطلوب: ${data.logoStyle}
- الألوان المفضلة: ${data.primaryColors}

📍 الاستخدامات:
${data.logoUsage}

⏰ وقت الاستلام: ${data.timestamp}

يرجى مراجعة Google Sheets للاطلاع على التفاصيل الكاملة.
    `;
    
    MailApp.sendEmail(EMAIL_ADDRESS, subject, body);
    
  } catch (error) {
    console.error('خطأ في إرسال الإشعار:', error);
  }
}

/**
 * دالة لاختبار الاتصال
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Google Apps Script يعمل بشكل صحيح',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * دالة مساعدة لإنشاء Google Sheet جديد إذا لم يكن موجوداً
 */
function createNewSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('استبيانات تصميم الشعار');
  const sheet = createNewSheet(spreadsheet);
  
  console.log('تم إنشاء Google Sheet جديد:');
  console.log('معرف الملف:', spreadsheet.getId());
  console.log('رابط الملف:', spreadsheet.getUrl());
  
  return spreadsheet;
}