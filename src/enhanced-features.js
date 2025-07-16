// تحسينات إضافية للمنصة الصحية

// نظام الإشعارات المحسن
const showNotification = (type, message, duration = 5000) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-in ${
        type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
        type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
        'bg-blue-50 border-blue-200 text-blue-800'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-lg font-bold">${
                type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'
            }</span>
            <p class="text-sm font-medium flex-1">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="text-xl leading-none hover:opacity-70">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, duration);
};

// التحقق من صحة البيانات
const validateForm = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = data[field];
        
        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = `${rule.label} مطلوب`;
            return;
        }
        
        if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[field] = 'البريد الإلكتروني غير صحيح';
            return;
        }
        
        if (rule.phone && value && !/^(\+967|00967|967|0)?[7][0-9]{8}$/.test(value)) {
            errors[field] = 'رقم الهاتف غير صحيح';
            return;
        }
        
        if (rule.minLength && value && value.length < rule.minLength) {
            errors[field] = `${rule.label} يجب أن يكون ${rule.minLength} أحرف على الأقل`;
            return;
        }
    });
    
    return errors;
};

// تنسيق التاريخ والوقت
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatPrice = (price) => {
    return `$${price}`;
};

// تصدير الوظائف
window.EnhancedFeatures = {
    showNotification,
    validateForm,
    formatDate,
    formatPrice
};

