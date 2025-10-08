/**
 * Google Apps Script لاستقبال بيانات استبيان تصميم الشعار ورفع الملفات إلى Drive
 * يجب تفعيل Google Drive API و Google Sheets API
 */

// إعدادات المشروع
const CONFIG = {
  SHEET_ID: '1dH4YKk5Qk8Rc7A3ZIP6QOsDqIgoUrcCZQrvYKZNyZws',  // معرف جوجل شيت
  MAIN_FOLDER_ID: '1R_0cXX-I-VWrDvFFJXu9Y2TWOk5q1zS_',  // معرف المجلد الرئيسي
  EMAIL: 'jad.jwd10@gmail.com'  // البريد الإلكتروني للإشعارات
};

function doPost(e) {
  try {
    console.log('بدء معالجة الطلب...');
    console.log('محتوى الطلب:', e);
    
    // التحقق من وجود الطلب
    if (!e) {
      console.log('لا يوجد طلب - إنشاء بيانات تجريبية');
      return handleTestRequest();
    }
    
    // الحصول على البيانات
    let postData = {};
    
    // طرق مختلفة لقراءة البيانات
    if (e.postData && e.postData.contents) {
      console.log('قراءة البيانات من postData.contents');
      try {
        const params = new URLSearchParams(e.postData.contents);
        const dataParam = params.get('data');
        if (dataParam) {
          postData = JSON.parse(dataParam);
        } else {
          postData = JSON.parse(e.postData.contents);
        }
      } catch (parseError) {
        console.log('فشل في تحليل البيانات، محاولة طريقة أخرى...');
        postData = { error: 'فشل في تحليل البيانات' };
      }
    } else if (e.parameter && e.parameter.data) {
      console.log('قراءة البيانات من parameter.data');
      postData = JSON.parse(e.parameter.data);
    } else if (e.parameters && e.parameters.data && e.parameters.data[0]) {
      console.log('قراءة البيانات من parameters.data');
      postData = JSON.parse(e.parameters.data[0]);
    } else {
      console.log('لا توجد بيانات - إنشاء طلب تجريبي');
      return handleTestRequest();
    }

    console.log('البيانات المستقبلة:', postData);

    // التحقق من وجود الاسم الرباعي
    if (!postData.fullName) {
      console.log('لا يوجد اسم رباعي - إضافة اسم تجريبي');
      postData.fullName = 'مستخدم تجريبي - ' + new Date().toLocaleString('ar-SA');
    }

    // إنشاء مجلد للمستخدم
    let userFolderUrl;
    try {
      userFolderUrl = createUserFolder(postData.fullName);
    } catch (folderError) {
      console.error('فشل في إنشاء المجلد:', folderError);
      // استخدام المجلد الرئيسي كبديل
      userFolderUrl = `https://drive.google.com/drive/folders/${CONFIG.MAIN_FOLDER_ID}`;
    }
    
    // إضافة رابط المجلد إلى البيانات
    postData.userFolderUrl = userFolderUrl;

    // حفظ البيانات في الجوجل شيت
    saveToSheet(postData);

    // إرسال إشعار بالبريد الإلكتروني
    sendEmailNotification(postData);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'تم حفظ البيانات وإنشاء المجلد بنجاح',
        userFolderUrl: userFolderUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('خطأ في المعالجة:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString(),
        details: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * التعامل مع الطلبات التجريبية
 */
function handleTestRequest() {
  try {
    const testData = {
      fullName: 'اختبار المستخدم - ' + new Date().toLocaleString('ar-SA'),
      phoneNumber: '0501234567',
      brandName: 'اختبار البراند',
      businessType: 'اختبار النشاط',
      timestamp: new Date().toLocaleString('ar-SA')
    };
    
    console.log('معالجة طلب تجريبي:', testData);
    
    // إنشاء مجلد تجريبي
    const userFolderUrl = createUserFolder(testData.fullName);
    testData.userFolderUrl = userFolderUrl;
    
    // حفظ البيانات التجريبية
    saveToSheet(testData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'تم إنشاء طلب تجريبي بنجاح',
        userFolderUrl: userFolderUrl,
        testMode: true
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('خطأ في الطلب التجريبي:', error);
    throw error;
  }
}

/**
 * رفع الملفات إلى مجلد المستخدم
 */
function uploadFilesToFolder(files, folderUrl) {
  try {
    // استخراج معرف المجلد من الرابط
    const folderId = folderUrl.split('/folders/')[1].split('?')[0];
    const userFolder = DriveApp.getFolderById(folderId);
    
    const uploadResults = {};
    
    Object.keys(files).forEach(fileName => {
      try {
        const fileBlob = files[fileName];
        
        // إنشاء اسم ملف فريد
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const cleanFileName = `${timestamp}_${fileName}`;
        
        // رفع الملف
        const uploadedFile = userFolder.createFile(fileBlob.setName(cleanFileName));
        
        // جعل الملف قابل للمشاهدة
        uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        uploadResults[fileName] = {
          name: cleanFileName,
          url: uploadedFile.getUrl(),
          id: uploadedFile.getId()
        };
        
        console.log('تم رفع الملف:', cleanFileName);
        
      } catch (fileError) {
        console.error('خطأ في رفع الملف:', fileName, fileError);
        uploadResults[fileName] = {
          error: fileError.toString()
        };
      }
    });
    
    console.log('نتائج رفع الملفات:', uploadResults);
    return uploadResults;
    
  } catch (error) {
    console.error('خطأ في رفع الملفات:', error);
    return { error: error.toString() };
  }
}

/**
 * إنشاء مجلد للمستخدم في Google Drive
 */
function createUserFolder(fullName) {
  try {
    const mainFolder = DriveApp.getFolderById(CONFIG.MAIN_FOLDER_ID);
    
    // تنظيف اسم المجلد (إزالة المسافات الزائدة والرموز الخاصة)
    const cleanFolderName = fullName.trim().replace(/[^\u0600-\u06FF\u0750-\u077F\w\s]/g, '');
    
    // إضافة التاريخ لتجنب التكرار
    const timestamp = new Date().toLocaleDateString('ar-SA').replace(/\//g, '-');
    const uniqueFolderName = `${cleanFolderName} - ${timestamp}`;
    
    // إنشاء مجلد جديد
    const userFolder = mainFolder.createFolder(uniqueFolderName);
    console.log('تم إنشاء مجلد جديد:', uniqueFolderName);
    
    // محاولة جعل المجلد قابل للمشاركة مع معالجة الأخطاء
    try {
      userFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
      console.log('تم تعيين صلاحيات المشاركة بنجاح');
    } catch (sharingError) {
      console.log('تحذير: لم يتم تعيين صلاحيات المشاركة:', sharingError);
      // المتابعة حتى لو فشلت المشاركة
    }
    
    // إرجاع رابط المجلد
    return userFolder.getUrl();
    
  } catch (error) {
    console.error('خطأ في إنشاء المجلد:', error);
    
    // إرجاع رابط المجلد الرئيسي كبديل
    console.log('استخدام المجلد الرئيسي كبديل');
    return `https://drive.google.com/drive/folders/${CONFIG.MAIN_FOLDER_ID}`;
  }
}

/**
 * حفظ البيانات في Google Sheets
 */
function saveToSheet(data) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    
    // الحصول على العناوين من الصف الأول
    let headers = [];
    if (sheet.getLastRow() === 0) {
      // إنشاء العناوين إذا كان الشيت فارغاً
      headers = [
        'Timestamp', 'FullName', 'PhoneNumber', 'BrandName', 'HasExistingLogo', 
        'ExistingLogoChanges', 'BusinessType', 'BusinessDescription', 'TargetAudience',
        'LogoType', 'PrimaryColors', 'SecondaryColors', 'AvoidColors', 
        'LogoStyle', 'LogoUsage', 'AdditionalNotes', 'UserFolderUrl', 'UploadedFiles'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    
    // إنشاء صف جديد من البيانات
    const rowData = [];
    
    // ترتيب البيانات حسب العناوين
    headers.forEach((header, index) => {
      switch (header.toLowerCase()) {
        case 'timestamp':
          rowData[index] = new Date();
          break;
        case 'fullname':
          rowData[index] = data.fullName || '';
          break;
        case 'phonenumber':
          rowData[index] = data.phoneNumber || '';
          break;
        case 'brandname':
          rowData[index] = data.brandName || '';
          break;
        case 'hasexistinglogo':
          rowData[index] = data.hasExistingLogo || '';
          break;
        case 'existinglogochanges':
          rowData[index] = data.existingLogoChanges || '';
          break;
        case 'businesstype':
          rowData[index] = data.businessType || '';
          break;
        case 'businessdescription':
          rowData[index] = data.businessDescription || '';
          break;
        case 'targetaudience':
          rowData[index] = data.targetAudience || '';
          break;
        case 'logotype':
          rowData[index] = data.logoType || '';
          break;
        case 'primarycolors':
          rowData[index] = data.primaryColors || '';
          break;
        case 'secondarycolors':
          rowData[index] = data.secondaryColors || '';
          break;
        case 'avoidcolors':
          rowData[index] = data.avoidColors || '';
          break;
        case 'logostyle':
          rowData[index] = data.logoStyle || '';
          break;
        case 'logousage':
          rowData[index] = data.logoUsage || '';
          break;
        case 'additionalnotes':
          rowData[index] = data.additionalNotes || '';
          break;
        case 'userfolderurl':
          rowData[index] = data.userFolderUrl || '';
          break;
        case 'uploadedfiles':
          rowData[index] = data.uploadedFiles ? JSON.stringify(data.uploadedFiles) : '';
          break;
        case 'googledrivellink':
          rowData[index] = data.googleDriveLink || '';
          break;
        default:
          rowData[index] = data[header] || '';
      }
    });
    
    // إضافة الصف الجديد
    sheet.appendRow(rowData);
    
    console.log('تم حفظ البيانات في الجوجل شيت بنجاح');
    
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    throw new Error('فشل في حفظ البيانات: ' + error.toString());
  }
}

/**
 * إرسال إشعار بالبريد الإلكتروني
 */
function sendEmailNotification(data) {
  try {
    const subject = `استبيان شعار جديد - ${data.fullName}`;
    
    const body = `
تم استقبال استبيان شعار جديد:

الاسم الرباعي: ${data.fullName}
رقم الجوال: ${data.phoneNumber}
اسم المشروع: ${data.brandName}
نوع النشاط: ${data.businessType}

رابط مجلد المستخدم: ${data.userFolderUrl}

تاريخ الإرسال: ${new Date().toLocaleString('ar-SA')}

يرجى مراجعة البيانات الكاملة في الجوجل شيت.
    `;
    
    MailApp.sendEmail({
      to: CONFIG.EMAIL,
      subject: subject,
      body: body
    });
    
    console.log('تم إرسال إشعار البريد الإلكتروني');
    
  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error);
    // لا نوقف العملية في حالة فشل البريد الإلكتروني
  }
}

/**
 * اختبار بسيط للنظام
 */
function simpleTest() {
  try {
    console.log('اختبار بسيط للنظام...');
    
    // اختبار إنشاء مجلد
    const testFolder = createUserFolder('اختبار بسيط');
    console.log('تم إنشاء مجلد الاختبار:', testFolder);
    
    // اختبار البيانات التجريبية
    const testData = {
      fullName: 'اختبار بسيط',
      phoneNumber: '0501234567',
      brandName: 'اختبار',
      userFolderUrl: testFolder
    };
    
    // اختبار حفظ البيانات
    saveToSheet(testData);
    console.log('تم حفظ البيانات التجريبية بنجاح');
    
    return {
      status: 'success',
      message: 'الاختبار نجح',
      folderUrl: testFolder
    };
    
  } catch (error) {
    console.error('فشل الاختبار:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * اختبار الدالة - يمكن تشغيلها مباشرة
 */
function testFunction() {
  try {
    console.log('بدء اختبار النظام...');
    
    const testData = {
      fullName: 'اختبار المستخدم',
      phoneNumber: '0501234567',
      brandName: 'اختبار البراند',
      businessType: 'اختبار النشاط'
    };
    
    console.log('بيانات الاختبار:', testData);
    
    // اختبار إنشاء المجلد
    const folderUrl = createUserFolder(testData.fullName);
    console.log('رابط المجلد المنشأ:', folderUrl);
    
    // اختبار حفظ البيانات
    testData.userFolderUrl = folderUrl;
    saveToSheet(testData);
    
    console.log('تم اختبار النظام بنجاح!');
    return folderUrl;
    
  } catch (error) {
    console.error('خطأ في الاختبار:', error);
    throw error;
  }
}

/**
 * اختبار doPost مباشرة
 */
function testDoPost() {
  try {
    console.log('اختبار doPost...');
    
    // محاكاة طلب POST
    const mockEvent = {
      postData: {
        contents: 'data=' + encodeURIComponent(JSON.stringify({
          fullName: 'اختبار doPost',
          phoneNumber: '0501234567',
          brandName: 'اختبار البراند'
        }))
      }
    };
    
    const result = doPost(mockEvent);
    console.log('نتيجة doPost:', result.getContent());
    
    return result;
    
  } catch (error) {
    console.error('خطأ في اختبار doPost:', error);
    throw error;
  }
}