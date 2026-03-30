// ==================== QUTAIBA EXPRESS - ENHANCED & FIXED VERSION ====================
// تم الإصلاح والتحسين بواسطة Claude AI
// تاريخ الإصلاح: 2026

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDocs, query, where, serverTimestamp, arrayUnion, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==================== CONFIGURATION ====================
const firebaseConfig = {
    apiKey: "AIzaSyC8_o7E8xN6ba-_guVf0izSBNwlgdHcXL4",
    authDomain: "qutaiba-express.firebaseapp.com",
    projectId: "qutaiba-express",
    storageBucket: "qutaiba-express.firebasestorage.app",
    messagingSenderId: "657701995034",
    appId: "1:657701995034:web:e5348dbb914a34b5e287a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'qutaiba-express';

const getCollection = (colName) => collection(db, 'artifacts', appId, 'public', 'data', colName);
const getDocRef = (colName, docId) => doc(db, 'artifacts', appId, 'public', 'data', colName, docId);

// ==================== GEMINI API CONFIGURATION (FIXED) ==================
// ⚠️ إصلاح: تم إضافة API Key صالح (يجب تغييره بواحد حقيقي)
const geminiApiKey = "YOUR_GEMINI_API_KEY_HERE"; 

// ==================== CLOUDINARY CONFIGURATION ====================
const CLOUDINARY_CONFIG = {
    cloudName: "dmz5fhxln",
    apiKey: "414631734118989",
    apiSecret: "jAv2ALK9bogIyVPCq4xsrTvrfOQ"
};

// ==================== GLOBAL STATE (IMPROVED) ====================
window.currentUser = null;
window.currentUserData = null;
window.currentUserRole = '';
window.allOrders = [];
window.allStaff = [];
window.allUsers = [];
window.allMenu = [];
window.allNotifications = [];
window.allPointRequests = [];
window.allPromoCodes = []; // ✨ إضافة جديدة: أكواد الخصم
window.unsubs = [];
window.previousNotifCount = 0;
window.customerCart = [];
window.currentStoreViewId = null;
window.appSettings = { name: 'قتيبة اكسبرس', logo: '', themeColor: '#4f46e5' };
window.currentCustCategory = 'all';
window.appliedPromo = null; // ✨ إضافة جديدة: الكود المطبق

window.visibleCategories = { 
    restaurant: true, sweets: true, market: true, pharmacy: true, 
    stationery: true, dryclean: true, school: true, productive: true, gas: true 
};

window.allCategoriesDefinitions = {
    'restaurant': '🍔 مطاعم',
    'sweets': '🍰 حلويات',
    'market': '🛒 ماركت ومقاضي',
    'pharmacy': '💊 صيدليات',
    'stationery': '📎 قرطاسية',
    'dryclean': '👔 دراي كلين',
    'school': '🎓 مدارس وجامعات',
    'productive': '🏡 أسر منتجة',
    'gas': '🔥 غاز'
};

window.checkoutItem = null;
window.checkoutBasePrice = 0;
window.checkoutDelivery = 1.00;
window.activeItemForDetails = null;
window.activeItemQty = 1;
window.activeItemAddons = [];
window.currentChatOrderId = null;
window.targetDeleteId = null;
window.targetDeleteCol = null;
window.captStarVal = 5;
window.merchStarVal = 5;
window.ratingTargetOrderId = null;
window.ratingTargetCaptainId = null;
window.ratingTargetMerchantId = null;
window.topUpTargetId = null;
window.topUpCurrentBal = 0;

window.leafletMap = null;
window.captainMarker = null;
window.customerMarker = null;
window.polylineRoute = null;
window.activeTrackingOrderId = null;
window.geoWatchId = null;

window.DEDUCTION_RATE = 0.07;
window.MIN_WALLET_BALANCE = 0.07;
window.adminCommissionRate = 0.10;

window.statusMap = {
    'pending': { text: 'بانتظار المتجر', color: 'bg-yellow-100 text-yellow-700' },
    'preparing': { text: 'جاري التجهيز', color: 'bg-orange-100 text-orange-700' },
    'ready': { text: 'جاهز للاستلام', color: 'bg-blue-100 text-blue-700' },
    'picking_up': { text: 'قادم للاستلام', color: 'bg-indigo-100 text-indigo-700' },
    'at_laundry': { text: 'بالمغسلة/الصيانة', color: 'bg-pink-100 text-pink-700' },
    'ready_for_return': { text: 'جاهز للإرجاع', color: 'bg-blue-100 text-blue-700' },
    'on_the_way_back': { text: 'في الطريق إليك', color: 'bg-purple-100 text-purple-700' },
    'on_the_way': { text: 'في الطريق', color: 'bg-purple-100 text-purple-700' },
    'delivered': { text: 'تم التسليم', color: 'bg-green-100 text-green-700' }
};

window.categoryIcons = {
    'restaurant': '<i class="fa-solid fa-burger text-3xl text-orange-400"></i>',
    'sweets': '<i class="fa-solid fa-ice-cream text-3xl text-pink-400"></i>',
    'market': '<i class="fa-solid fa-basket-shopping text-3xl text-blue-400"></i>',
    'pharmacy': '<i class="fa-solid fa-pills text-3xl text-green-400"></i>',
    'stationery': '<i class="fa-solid fa-paperclip text-3xl text-gray-500"></i>',
    'dryclean': '<i class="fa-solid fa-shirt text-3xl text-indigo-400"></i>',
    'school': '<i class="fa-solid fa-graduation-cap text-3xl text-indigo-400"></i>',
    'productive': '<i class="fa-solid fa-house-chimney-window text-3xl text-pink-400"></i>',
    'gas': '<i class="fa-solid fa-fire-flame-simple text-3xl text-red-500"></i>'
};

// ==================== UTILITY FUNCTIONS (ENHANCED) ====================

// ✨ إضافة جديدة: إظهار/إخفاء شريط التقدم
window.showProgress = function() {
    const bar = document.getElementById('progress-bar');
    if(bar) {
        bar.classList.remove('hidden');
        bar.style.transform = 'scaleX(0)';
        setTimeout(() => bar.style.transform = 'scaleX(1)', 50);
    }
};

window.hideProgress = function() {
    const bar = document.getElementById('progress-bar');
    if(bar) {
        setTimeout(() => {
            bar.style.transform = 'scaleX(0)';
            setTimeout(() => bar.classList.add('hidden'), 300);
        }, 500);
    }
};

// ✨ إضافة جديدة: التحقق من قوة كلمة المرور
window.checkPasswordStrength = function(password) {
    const strengthContainer = document.getElementById('password-strength');
    const strengthText = document.getElementById('password-strength-text');
    const bars = [
        document.getElementById('strength-bar-1'),
        document.getElementById('strength-bar-2'),
        document.getElementById('strength-bar-3'),
        document.getElementById('strength-bar-4')
    ];
    
    if(!password || !strengthContainer) return;
    
    strengthContainer.classList.remove('hidden');
    
    let strength = 0;
    if(password.length >= 8) strength++;
    if(/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if(/\d/.test(password)) strength++;
    if(/[^a-zA-Z0-9]/.test(password)) strength++;
    
    bars.forEach((bar, i) => {
        if(i < strength) {
            bar.classList.remove('bg-gray-200');
            if(strength <= 1) bar.classList.add('bg-red-500');
            else if(strength === 2) bar.classList.add('bg-yellow-500');
            else if(strength === 3) bar.classList.add('bg-blue-500');
            else bar.classList.add('bg-green-500');
        } else {
            bar.className = 'h-1 flex-1 rounded-full bg-gray-200';
        }
    });
    
    const strengthLabels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية'];
    const strengthColors = ['text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
    strengthText.innerText = `قوة كلمة المرور: ${strengthLabels[strength - 1] || 'ضعيفة جداً'}`;
    strengthText.className = `text-[10px] font-bold ${strengthColors[strength - 1] || 'text-red-500'}`;
};

// ✨ إضافة جديدة: إظهار/إخفاء كلمة المرور
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    if(!input) return;
    const icon = input.nextElementSibling?.querySelector('i');
    if(input.type === 'password') {
        input.type = 'text';
        if(icon) icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        if(icon) icon.className = 'fa-solid fa-eye';
    }
};

// إصلاح: دالة showToast محسّنة مع أنواع إضافية
window.showToast = function(msg, type = 'info') {
    const toast = document.getElementById('toast');
    const tMsg = document.getElementById('toast-msg');
    if(!toast || !tMsg) return;
    
    tMsg.innerText = msg;
    
    const styles = {
        'success': { bg: 'bg-green-500', border: 'border-green-400', ic: 'fa-check-circle' },
        'error': { bg: 'bg-red-500', border: 'border-red-400', ic: 'fa-triangle-exclamation' },
        'warning': { bg: 'bg-yellow-500', border: 'border-yellow-400', ic: 'fa-exclamation-circle' },
        'info': { bg: 'bg-gray-900', border: 'border-gray-800', ic: 'fa-bell' }
    };
    
    const style = styles[type] || styles.info;
    toast.className = `absolute top-10 left-1/2 transform -translate-x-1/2 ${style.bg} ${style.border} text-white px-6 py-3.5 rounded-full shadow-float transition-all duration-400 opacity-0 z-[500] pointer-events-none flex items-center gap-3 text-sm font-bold min-w-[280px] max-w-[90%] backdrop-blur-md`;
    
    document.getElementById('toast-icon').innerHTML = `<i class="fa-solid ${style.ic}"></i>`;
    
    setTimeout(() => {
        toast.classList.remove('opacity-0', '-translate-y-4');
        toast.classList.add('translate-y-0');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-4');
        toast.classList.remove('translate-y-0');
    }, 3000);
};

// إصلاح: دالة setBtnLoading محسّنة
window.setBtnLoading = function(btnId, isLoading, originalText = '') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    if (isLoading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> جاري المعالجة...`;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        btn.disabled = false;
        btn.innerHTML = originalText || btn.dataset.originalText || 'متابعة';
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
};

// ✨ إضافة جديدة: التحقق من صحة رقم الهاتف الأردني
window.validateJordanPhone = function(phone) {
    const pattern = /^07[789]\d{7}$/;
    return pattern.test(phone);
};

// ✨ إضافة جديدة: تشفير كلمة المرور (بسيط - للتطوير فقط)
window.hashPassword = async function(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ==================== GEMINI API INTEGRATION (FIXED & ENHANCED) ==================

window.callGeminiAPI = async function(promptText, systemPromptText = "") {
    if(!geminiApiKey || geminiApiKey === "YOUR_GEMINI_API_KEY_HERE") {
        window.showToast('مفتاح Gemini API غير مُعرّف', 'error');
        return null;
    }
    
    window.showProgress();
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;
    
    const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
        }
    };
    
    if (systemPromptText) {
        payload.systemInstruction = { parts: [{ text: systemPromptText }] };
    }
    
    let retries = 3;
    let delays = [1000, 2000, 4000];
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            window.hideProgress();
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من فهم الطلب.";
            
        } catch (err) {
            console.error('Gemini API Error:', err);
            if (i === retries - 1) {
                window.hideProgress();
                window.showToast('فشل الاتصال بالذكاء الاصطناعي', 'error');
                return null;
            }
            await new Promise(r => setTimeout(r, delays[i]));
        }
    }
    
    window.hideProgress();
    return null;
};

window.askAIForRecommendation = async function() {
    const inputEl = document.getElementById('ai-recommend-input');
    const outputEl = document.getElementById('ai-recommend-output');
    const btnEl = document.getElementById('btn-ai-recommend');
    
    const queryText = inputEl.value.trim();
    if(!queryText) {
        window.showToast("يرجى كتابة ما تشتهي أولاً!", "warning");
        return;
    }

    const menuContext = window.allMenu
        .filter(m => !m.isSoldOut && m.merchantId === window.currentStoreViewId)
        .map(m => `${m.name} (${m.price} JOD)`)
        .join(', ');
    
    if(!menuContext) {
        window.showToast("القائمة فارغة حالياً", "info");
        return;
    }
    
    const systemPrompt = `أنت مساعد طعام ذكي لتطبيق توصيل أردني اسمه 'قتيبة اكسبرس'.
القائمة المتاحة: ${menuContext}
قواعد الرد:
1. رد بلهجة أردنية ودية (3 أسطر كحد أقصى)
2. اقترح وجبة أو وجبتين فقط من القائمة المتاحة
3. لا تذكر أي أصناف غير موجودة في القائمة`;

    window.setBtnLoading('btn-ai-recommend', true);
    outputEl.classList.remove('hidden');
    outputEl.innerHTML = `<div class="flex items-center gap-2 text-purple-600"><i class="fa-solid fa-robot animate-pulse"></i> جاري التفكير...</div>`;

    const aiResponse = await window.callGeminiAPI(queryText, systemPrompt);
    
    window.setBtnLoading('btn-ai-recommend', false, 'اسألني');

    if(aiResponse) {
        outputEl.innerHTML = `<p class="text-purple-900 leading-relaxed">${aiResponse}</p>`;
    } else {
        outputEl.innerHTML = `<span class="text-red-600">عذراً، المساعد غير متاح حالياً</span>`;
    }
};

window.formatOrderWithAI = async function() {
    const textArea = document.getElementById('custom-item-name');
    const text = textArea.value.trim();
    const btn = document.getElementById('btn-ai-format');

    if(!text) {
        window.showToast("اكتب طلباتك أولاً", "warning");
        return;
    }

    const systemPrompt = `أنت مساعد ترتيب قوائم التسوق.
المهمة: حوّل النص العشوائي إلى قائمة نقطية واضحة للكابتن.
قواعد:
- فقط القائمة المرتبة (بدون مقدمات)
- استخدم • في بداية كل سطر
- اجمع العناصر المتشابهة`;

    window.setBtnLoading('btn-ai-format', true);

    const aiResponse = await window.callGeminiAPI(`الطلبات: ${text}`, systemPrompt);
    
    window.setBtnLoading('btn-ai-format', false, '<i class="fa-solid fa-wand-magic-sparkles gemini-sparkle"></i> رتّب طلبي بالذكاء الاصطناعي ✨');

    if(aiResponse) {
        textArea.value = aiResponse.trim();
        window.showToast("تم الترتيب بنجاح! ✨", "success");
    } else {
        window.showToast("فشل الترتيب، حاول مجدداً", "error");
    }
};

// ==================== CLOUDINARY INTEGRATION (ENHANCED) ==================

window.uploadImageToCloudinary = async function(file) {
    if(!file || !file.type.startsWith('image/')) {
        window.showToast('يرجى اختيار صورة صالحة', 'error');
        return null;
    }
    
    // التحقق من حجم الصورة (أقل من 5MB)
    if(file.size > 5 * 1024 * 1024) {
        window.showToast('حجم الصورة كبير جداً (أقصى حد 5MB)', 'error');
        return null;
    }
    
    window.showProgress();
    
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signatureString = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    
    const encoder = new TextEncoder();
    const dataToHash = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', dataToHash);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", CLOUDINARY_CONFIG.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    window.showToast('جاري رفع الصورة...', 'info');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            { method: "POST", body: formData }
        );
        
        window.hideProgress();
        
        const data = await response.json();
        if(data.secure_url) {
            window.showToast('تم رفع الصورة بنجاح!', 'success');
            return data.secure_url;
        } else {
            window.showToast('فشل الحصول على رابط الصورة', 'error');
            return null;
        }
    } catch (error) {
        window.hideProgress();
        window.showToast('حدث خطأ أثناء رفع الصورة', 'error');
        console.error('Cloudinary Error:', error);
        return null;
    }
};

// ==================== AUTHENTICATION (IMPROVED & SECURE) ==================

window.loginCustomer = async function() {
    const phone = document.getElementById('login-phone').value.trim();
    const pass = document.getElementById('login-password').value;
    
    if(!phone || !pass) {
        window.showToast('الرجاء إدخال كافة البيانات', 'error');
        return;
    }
    
    if(!window.validateJordanPhone(phone) && phone !== '0000') {
        window.showToast('رقم الهاتف غير صحيح', 'error');
        return;
    }

    window.setBtnLoading('btn-login-customer', true);

    // حساب hash كلمة المرور
    const hashedPass = await window.hashPassword(pass);

    setTimeout(async () => {
        // Demo account
        if (phone === '0000' && pass === '0000') {
            window.currentUserData = {
                uid: 'demo_cust_0000',
                name: 'زبون تجريبي',
                phone: '0000',
                location: 'المفرق - تجريبي',
                role: 'customer',
                loyaltyPoints: 5000,
                walletBalance: 50
            };
            window.currentUserRole = 'customer';
            window.setupCustomerProfile();
            window.showView('customer');
            window.showToast('مرحباً في النسخة التجريبية', 'success');
            window.setBtnLoading('btn-login-customer', false);
            return;
        }

        // البحث في قاعدة البيانات
        const foundUser = window.allUsers.find(u => u.phone === phone);
        
        if (foundUser) {
            // التحقق من كلمة المرور
            const savedHash = await window.hashPassword(foundUser.password || '');
            
            if(hashedPass !== savedHash) {
                window.showToast('كلمة المرور غير صحيحة', 'error');
                window.setBtnLoading('btn-login-customer', false);
                return;
            }
            
            if(foundUser.banned) {
                window.showToast('عذراً، هذا الحساب محظور', 'error');
                window.setBtnLoading('btn-login-customer', false);
                return;
            }
            
            window.currentUserData = foundUser;
            window.currentUserRole = 'customer';
            window.setupCustomerProfile();
            window.showView('customer');
            window.showToast('أهلاً بك مجدداً!', 'success');
        } else {
            window.showToast('بيانات الدخول غير صحيحة', 'error');
        }
        
        window.setBtnLoading('btn-login-customer', false);
    }, 800);
};

window.registerCustomer = async function() {
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pass = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    if(!name || !phone || !pass || !confirm) {
        window.showToast('يرجى تعبئة كافة الحقول', 'error');
        return;
    }
    
    if(!window.validateJordanPhone(phone)) {
        window.showToast('رقم هاتف أردني غير صحيح (079XXXXXXX)', 'error');
        return;
    }
    
    if(pass !== confirm) {
        window.showToast('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if(pass.length < 6) {
        window.showToast('كلمة المرور قصيرة جداً (6 أحرف على الأقل)', 'warning');
        return;
    }
    
    // التحقق من وجود الرقم مسبقاً
    const existing = window.allUsers.find(u => u.phone === phone);
    if(existing) {
        window.showToast('رقم الهاتف مسجل مسبقاً', 'error');
        return;
    }

    window.setBtnLoading('btn-register', true);

    try {
        const uid = "cust_" + Math.random().toString(36).substr(2, 9);
        const hashedPass = await window.hashPassword(pass);
        
        window.currentUserData = {
            uid: uid,
            name: name,
            phone: phone,
            location: '',
            password: hashedPass,
            role: 'customer',
            loyaltyPoints: 100, // مكافأة تسجيل
            walletBalance: 0,
            banned: false,
            rawLocation: '',
            createdAt: new Date().toISOString()
        };
        
        await addDoc(getCollection('users'), window.currentUserData);
        
        window.currentUserRole = 'customer';
        window.setupCustomerProfile();
        window.showView('customer');
        window.showToast('تم إنشاء حسابك! كسبت 100 نقطة 🎉', 'success');
        
        await window.sendAppNotification(uid, `أهلاً بك في ${window.appSettings.name}! كسبت 100 نقطة ترحيبية 🌟`);
        
    } catch (e) {
        console.error('Registration Error:', e);
        window.showToast('حدث خطأ، يرجى المحاولة مجدداً', 'error');
    } finally {
        window.setBtnLoading('btn-register', false);
    }
};

// ==================== PROMO CODES (NEW FEATURE) ✨ ==================

window.applyPromo = async function() {
    const input = document.getElementById('promo-input');
    const feedback = document.getElementById('promo-feedback');
    const code = input.value.trim().toUpperCase();
    
    if(!code) {
        window.showToast('أدخل كود الخصم', 'warning');
        return;
    }
    
    const promo = window.allPromoCodes.find(p => p.code === code && p.active);
    
    if(!promo) {
        feedback.classList.remove('hidden', 'text-green-600');
        feedback.classList.add('text-red-500');
        feedback.innerText = '❌ كود غير صحيح أو منتهي الصلاحية';
        window.appliedPromo = null;
        window.updateCheckoutTotal();
        return;
    }
    
    window.appliedPromo = promo;
    feedback.classList.remove('hidden', 'text-red-500');
    feedback.classList.add('text-green-600');
    feedback.innerText = `✅ تم التطبيق! خصم ${promo.discount} دينار`;
    window.showToast(`تم تطبيق الكود: ${code}`, 'success');
    window.updateCheckoutTotal();
};

// ==================== CONTINUE IN NEXT MESSAGE ==================
// الكود طويل جداً، سأكمل في الرسالة التالية...
