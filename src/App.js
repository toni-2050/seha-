import React, { useState, useEffect, useContext, createContext } from 'react';

// =======================================================================
// 1. نظام إدارة المصادقة (Authentication Context)
// =======================================================================
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        // استرجاع حالة المستخدم من localStorage عند التحميل
        const savedUser = localStorage.getItem('sehaPlusUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const login = (role) => {
        const mockUser = {
            name: role === 'patient' ? 'محمد قاسم' : 'د. أحمد خالد',
            role: role,
            avatar: role === 'patient' 
                ? 'https://randomuser.me/api/portraits/men/32.jpg' 
                : 'https://randomuser.me/api/portraits/men/41.jpg'
        };
        setCurrentUser(mockUser);
        // حفظ حالة المستخدم في localStorage
        localStorage.setItem('sehaPlusUser', JSON.stringify(mockUser));
    };
    
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('sehaPlusUser');
    };
    
    const value = { currentUser, login, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// =======================================================================
// 2. المكونات المساعدة والواجهات الثابتة (Helpers & Layouts)
// =======================================================================
const Icon = ({ name, className, children }) => (
    children ? <div className={className}>{children}</div> : 
    <i data-feather={name} className={className}></i>
);

const AppLayout = ({ children, navigate, userRole, activeLink }) => {
    const { currentUser, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const patientLinks = [
        { label: 'لوحة التحكم', icon: 'home', page: 'patient-dashboard' },
        { label: 'الأطباء', icon: 'users', page: 'doctors-list' },
        { label: 'المواعيد', icon: 'calendar', page: 'appointments' },
        { label: 'الملف الطبي', icon: 'file-text', page: 'medical-records' },
        { label: 'الإعدادات', icon: 'settings', page: 'patient-settings' },
    ];
    
    const doctorLinks = [
        { label: 'محطة العمل', icon: 'home', page: 'doctor-dashboard' },
        { label: 'الاستشارات', icon: 'inbox', page: 'doctor-consultations' },
        { label: 'المرضى', icon: 'users', page: 'doctor-patients' },
        { label: 'الجدول', icon: 'calendar', page: 'doctor-schedule' },
        { label: 'الملف المهني', icon: 'settings', page: 'doctor-settings' },
    ];

    const navLinks = userRole === 'patient' ? patientLinks : doctorLinks;

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800" dir="rtl">
            {/* شريط جانبي للجوال */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
                     onClick={() => setMobileMenuOpen(false)}>
                </div>
            )}
            
            <aside className={`fixed md:relative z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                              md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col w-64 sidebar`}>
                <div className="flex items-center justify-between h-20 px-6 shrink-0 bg-white">
                    <div className="logo-container">
                        <span className="logo-text">صحة</span>
                        <span className="logo-plus">+</span>
                    </div>
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <Icon name="x" className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                
                <div className="px-4 py-6 flex items-center border-b border-gray-100">
                    <img src={currentUser?.avatar} alt="صورة المستخدم" className="w-12 h-12 rounded-full object-cover" />
                    <div className="mr-3">
                        <h4 className="font-bold">{currentUser?.name}</h4>
                        <p className="text-sm text-gray-500">{currentUser?.role === 'patient' ? 'مريض' : 'طبيب'}</p>
                    </div>
                </div>
                
                <nav className="flex-1 px-2 py-4 overflow-y-auto">
                    {navLinks.map(link => (
                        <button 
                            key={link.page} 
                            onClick={() => {
                                navigate(link.page);
                                setMobileMenuOpen(false);
                            }} 
                            className={`sidebar-link w-full text-right ${activeLink === link.page ? 'active' : ''}`}
                        >
                            <Icon name={link.icon} className="w-5 h-5" />
                            <span>{link.label}</span>
                        </button>
                    ))}
                </nav>
                
                <div className="px-2 py-4 border-t border-gray-100">
                    <button onClick={logout} className="sidebar-link w-full text-right !text-red-600 hover:!bg-red-50">
                        <Icon name="log-out" className="w-5 h-5" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* شريط العنوان العلوي */}
                <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                        <Icon name="menu" className="w-6 h-6 text-gray-600" />
                    </button>
                    
                    <div className="flex items-center space-x-4">
                        <button className="relative">
                            <Icon name="bell" className="w-6 h-6 text-gray-600" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                        </button>
                        
                        <div className="flex items-center">
                            <img src={currentUser?.avatar} alt="صورة المستخدم" className="w-10 h-10 rounded-full object-cover" />
                            <span className="mr-2 hidden sm:block">{currentUser?.name}</span>
                        </div>
                    </div>
                </header>
                
                {/* المحتوى الرئيسي */}
                {children}
            </div>
        </div>
    );
};

// =======================================================================
// 3. مكونات الصفحات (Page Components)
// =======================================================================

const LandingPage = ({ navigate }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="logo-container">
                    <span className="logo-text">صحة</span>
                    <span className="logo-plus">+</span>
                </div>
                <button 
                    onClick={() => navigate('auth')} 
                    className="btn-primary hidden md:flex items-center text-base py-2 px-5"
                >
                    <Icon name="user-plus" className="w-4 h-4 ml-1" />
                    <span>ابدأ الآن</span>
                </button>
            </nav>
        </header>
        
        <section className="hero-section bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <div className="container mx-auto px-4 pt-24 pb-32 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-black leading-tight animate-fade-in">
                    صحتك بلمسة واحدة
                </h1>
                <p className="mt-6 text-xl max-w-3xl mx-auto opacity-90">
                    منصة "صحة بلس" هي رفيقك الصحي الذكي في عدن، تواصل مع أفضل الأطباء واستشِر من أي مكان وفي أي وقت.
                </p>
                <div className="mt-10">
                    <button 
                        onClick={() => navigate('auth')} 
                        className="btn-primary text-lg py-3 px-8 shadow-lg transform hover:-translate-y-1 transition-transform"
                    >
                        ابدأ رحلتك الصحية الآن
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
        </section>
        
        <section className="py-20 container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-gray-800">لماذا تختار صحة بلس؟</h2>
                <p className="mt-4 text-gray-600">
                    نوفر لك حلولاً صحية متكاملة تلبي جميع احتياجاتك الطبية بسهولة وأمان
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: 'clock', title: 'استشارات فورية', desc: 'تواصل مباشر مع أطباء متخصصين في دقائق' },
                    { icon: 'calendar', title: 'حجز مواعيد أونلاين', desc: 'حدد موعدك مع الطبيب المناسب بسهولة' },
                    { icon: 'file-text', title: 'ملف طبي إلكتروني', desc: 'احتفظ بسجلك الطبي آمن ومتاح دائماً' }
                ].map((feature, idx) => (
                    <div key={idx} className="feature-card p-6 rounded-2xl bg-white shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <Icon name={feature.icon} className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                        <p className="mt-2 text-gray-600">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
        
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="logo-container mb-6 md:mb-0">
                        <span className="logo-text">صحة</span>
                        <span className="logo-plus">+</span>
                    </div>
                    
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-blue-300 transition-colors">عن المنصة</a>
                        <a href="#" className="hover:text-blue-300 transition-colors">الأسئلة الشائعة</a>
                        <a href="#" className="hover:text-blue-300 transition-colors">اتصل بنا</a>
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>© 2023 صحة بلس. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    </div>
);

const AuthPage = ({ navigate }) => {
    const { login } = useAuth();
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        specialty: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleLogin = (e) => { 
        e.preventDefault(); 
        login(role); 
        navigate(role === 'patient' ? 'patient-dashboard' : 'doctor-dashboard');
    };
    
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="logo-container mb-8 text-center">
                        <span className="logo-text">صحة</span>
                        <span className="logo-plus">+</span>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-800">أنشئ حسابك الآن</h2>
                        <p className="mt-2 text-gray-600">انضم إلى مجتمع صحة بلس وابدأ رحلتك الصحية</p>
                    </div>
                    
                    <div className="flex border rounded-lg overflow-hidden mb-6">
                        <button 
                            className={`flex-1 py-3 px-4 text-center font-medium ${role === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                            onClick={() => setRole('patient')}
                        >
                            مريض
                        </button>
                        <button 
                            className={`flex-1 py-3 px-4 text-center font-medium ${role === 'doctor' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                            onClick={() => setRole('doctor')}
                        >
                            طبيب
                        </button>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                            <input 
                                type="text" 
                                name="fullName"
                                className="form-input w-full"
                                placeholder="أدخل اسمك الكامل"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                name="email"
                                className="form-input w-full"
                                placeholder="example@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                            <input 
                                type="tel" 
                                name="phone"
                                className="form-input w-full"
                                placeholder="05XXXXXXXX"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        {role === 'doctor' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">التخصص</label>
                                <input 
                                    type="text" 
                                    name="specialty"
                                    className="form-input w-full"
                                    placeholder="التخصص الطبي"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                            <input 
                                type="password" 
                                name="password"
                                className="form-input w-full"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="btn-auth w-full text-lg py-3"
                            >
                                إنشاء الحساب
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center text-sm mt-8">
                        <p className="text-gray-600">لديك حساب بالفعل؟ 
                            <button 
                                onClick={() => navigate('auth')} 
                                className="font-semibold text-blue-600 hover:text-blue-800 ml-1"
                            >
                                سجل دخولك
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-500 to-green-500 items-center justify-center p-12">
                <div className="max-w-lg text-white text-center">
                    <img 
                        src="https://raw.githubusercontent.com/CreateAriya/public-assets/main/images/seha-plus-auth-illustration.png" 
                        className="w-full max-w-xs mx-auto mb-10"
                        alt="رسم توضيحي" 
                    />
                    <h2 className="text-4xl font-black leading-tight mb-4">رعاية صحية تثق بها، بين يديك.</h2>
                    <p className="text-lg opacity-90">
                        انضم إلى آلاف المستخدمين الذين يثقون بمنصة صحة بلس للرعاية الصحية الذكية
                    </p>
                </div>
            </div>
        </div>
    );
};

const PatientDashboard = ({ navigate }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <AppLayout navigate={navigate} userRole="patient" activeLink="patient-dashboard">
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="container mx-auto max-w-full">
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">أهلاً بعودتك، {currentUser?.name}!</h2>
                        <p className="text-gray-500">نتمنى لك يومًا سعيدًا وصحة دائمة.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="dashboard-card bg-gradient-to-r from-blue-100 to-blue-50">
                            <Icon name="activity" className="w-8 h-8 text-blue-500" />
                            <h3 className="text-xl font-bold mt-4">حالتك الصحية</h3>
                            <p className="text-gray-600 mt-2">آخر تحديث: 5 أيام مضت</p>
                            <button className="btn-card mt-4">عرض التقرير</button>
                        </div>
                        
                        <div className="dashboard-card bg-gradient-to-r from-green-100 to-green-50">
                            <Icon name="calendar" className="w-8 h-8 text-green-500" />
                            <h3 className="text-xl font-bold mt-4">مواعيدك القادمة</h3>
                            <p className="text-gray-600 mt-2">لديك موعد غداً مع د. أحمد</p>
                            <button className="btn-card mt-4">إدارة المواعيد</button>
                        </div>
                        
                        <div className="dashboard-card bg-gradient-to-r from-purple-100 to-purple-50">
                            <Icon name="file-text" className="w-8 h-8 text-purple-500" />
                            <h3 className="text-xl font-bold mt-4">الملف الطبي</h3>
                            <p className="text-gray-600 mt-2">آخر تحديث: 12 مارس 2023</p>
                            <button className="btn-card mt-4">عرض الملف</button>
                        </div>
                    </div>
                    
                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">استشاراتك النشطة</h3>
                            <button 
                                onClick={() => navigate('doctors-list')} 
                                className="btn-primary flex items-center"
                            >
                                <Icon name="plus" className="w-4 h-4 ml-1" />
                                <span>استشارة جديدة</span>
                            </button>
                        </div>
                        
                        <div className="card p-5 flex items-center justify-between">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <img 
                                    src="https://randomuser.me/api/portraits/men/41.jpg" 
                                    className="w-16 h-16 rounded-full border-2 border-blue-200" 
                                    alt="صورة الطبيب" 
                                />
                                <div>
                                    <h4 className="font-bold text-gray-800">استشارة مع د. أحمد خالد</h4>
                                    <p className="text-sm text-gray-500 mt-1">طب باطني - استشارة متابعة</p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm font-medium text-green-600">متصل الآن</span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-secondary !py-3 !px-5 flex items-center">
                                <span>متابعة المحادثة</span>
                                <Icon name="arrow-left" className="w-4 h-4 mr-2" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">مركز خدمات صحة بلس</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: 'search', title: 'بحث عن طبيب', desc: 'ابحث عن طبيب متخصص' },
                                { icon: 'clipboard', title: 'الوصفات الطبية', desc: 'إدارة وصرف الوصفات' },
                                { icon: 'clock', title: 'المواعيد', desc: 'جدولة مواعيدك الطبية' },
                                { icon: 'heart', title: 'المتابعة الصحية', desc: 'تتبع حالتك الصحية' },
                                { icon: 'dollar-sign', title: 'الدفع الإلكتروني', desc: 'دفع فواتيرك بسهولة' },
                                { icon: 'help-circle', title: 'الدعم الفني', desc: 'مساعدة ودعم فني' }
                            ].map((service, idx) => (
                                <div 
                                    key={idx} 
                                    className="service-card p-5 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                                        <Icon name={service.icon} className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800">{service.title}</h4>
                                    <p className="text-gray-600 mt-2">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
};

// Missing DoctorDashboard component - let's add it
const DoctorDashboard = ({ navigate }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <AppLayout navigate={navigate} userRole="doctor" activeLink="doctor-dashboard">
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="container mx-auto max-w-full">
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">أهلاً بعودتك، {currentUser?.name}!</h2>
                        <p className="text-gray-500">محطة عملك الطبية جاهزة لخدمة المرضى.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        <div className="dashboard-card bg-gradient-to-r from-blue-100 to-blue-50">
                            <Icon name="users" className="w-8 h-8 text-blue-500" />
                            <h3 className="text-xl font-bold mt-4">المرضى اليوم</h3>
                            <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
                            <p className="text-gray-600 text-sm">+2 من الأمس</p>
                        </div>
                        
                        <div className="dashboard-card bg-gradient-to-r from-green-100 to-green-50">
                            <Icon name="clock" className="w-8 h-8 text-green-500" />
                            <h3 className="text-xl font-bold mt-4">المواعيد المعلقة</h3>
                            <p className="text-2xl font-bold text-green-600 mt-2">3</p>
                            <p className="text-gray-600 text-sm">تحتاج موافقة</p>
                        </div>
                        
                        <div className="dashboard-card bg-gradient-to-r from-purple-100 to-purple-50">
                            <Icon name="inbox" className="w-8 h-8 text-purple-500" />
                            <h3 className="text-xl font-bold mt-4">الاستشارات</h3>
                            <p className="text-2xl font-bold text-purple-600 mt-2">8</p>
                            <p className="text-gray-600 text-sm">في الانتظار</p>
                        </div>
                        
                        <div className="dashboard-card bg-gradient-to-r from-yellow-100 to-yellow-50">
                            <Icon name="star" className="w-8 h-8 text-yellow-500" />
                            <h3 className="text-xl font-bold mt-4">التقييم</h3>
                            <p className="text-2xl font-bold text-yellow-600 mt-2">4.8</p>
                            <p className="text-gray-600 text-sm">من 5 نجوم</p>
                        </div>
                    </div>
                    
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">الاستشارات العاجلة</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'فاطمة أحمد', issue: 'ألم في الصدر', time: '5 دقائق', priority: 'high' },
                                { name: 'محمد علي', issue: 'صداع شديد', time: '15 دقيقة', priority: 'medium' },
                                { name: 'سارة محمود', issue: 'استشارة دوائية', time: '30 دقيقة', priority: 'low' }
                            ].map((consultation, idx) => (
                                <div key={idx} className="card p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className={`w-3 h-3 rounded-full ${
                                            consultation.priority === 'high' ? 'bg-red-500' :
                                            consultation.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}></div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{consultation.name}</h4>
                                            <p className="text-sm text-gray-500">{consultation.issue}</p>
                                            <p className="text-xs text-gray-400">منذ {consultation.time}</p>
                                        </div>
                                    </div>
                                    <button className="btn-primary">رد الآن</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
};

// =======================================================================
// 4. المكون الرئيسي للتطبيق (The Main App Component)
// =======================================================================
const AppContent = () => {
    const { currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState('landing');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (currentUser) {
            setCurrentPage(currentUser.role + '-dashboard');
        } else {
            setCurrentPage('landing');
        }
        
        // محاكاة تحميل البيانات
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [currentUser]);

    useEffect(() => {
        // تهيئة Feather Icons
        const timer = setTimeout(() => {
            if (window.feather) {
                window.feather.replace();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [currentPage]);

    const navigate = (page) => {
        setLoading(true);
        setTimeout(() => {
            setCurrentPage(page);
            setLoading(false);
        }, 300);
    };

    const renderPage = () => {
        if (loading) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="flex flex-col items-center">
                        <div className="logo-container animate-pulse">
                            <span className="logo-text">صحة</span>
                            <span className="logo-plus">+</span>
                        </div>
                        <p className="mt-4 text-gray-600">جاري التحميل...</p>
                    </div>
                </div>
            );
        }
        
        if (!currentUser) {
            return currentPage === 'auth' ? 
                <AuthPage navigate={navigate} /> : 
                <LandingPage navigate={navigate} />;
        }
        
        switch (currentPage) {
            case 'patient-dashboard': return <PatientDashboard navigate={navigate} />;
            case 'doctor-dashboard': return <DoctorDashboard navigate={navigate} />;
            default: return <PatientDashboard navigate={navigate} />;
        }
    };
    
    return renderPage();
}

export default function App() {
    return (
        <AuthProvider>
            <style jsx global>{`
                :root {
                    --primary-blue: #2196F3;
                    --primary-green: #4CAF50;
                    --accent-teal: #00BCD4;
                    --background-light: #F8F9FA;
                    --text-dark: #212529;
                    --text-gray: #4A5568;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                body {
                    font-family: 'Tajawal', 'Segoe UI', sans-serif;
                    background-color: var(--background-light);
                    color: var(--text-dark);
                    line-height: 1.6;
                }
                
                .logo-container {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                .logo-text {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--primary-blue);
                }
                
                .logo-plus {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.75rem;
                    height: 1.75rem;
                    background-color: var(--primary-green);
                    color: white;
                    font-size: 1.25rem;
                    font-weight: bold;
                    border-radius: 9999px;
                    padding-bottom: 2px;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    border-radius: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%);
                    color: white;
                    box-shadow: 0 4px 6px rgba(33, 150, 243, 0.3);
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 10px rgba(33, 150, 243, 0.4);
                }
                
                .btn-auth {
                    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%);
                    color: white;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    font-weight: 600;
                }
                
                .btn-secondary {
                    background-color: #E3F2FD;
                    color: var(--primary-blue);
                    border-radius: 0.75rem;
                }
                
                .btn-secondary:hover {
                    background-color: #BBDEFB;
                }
                
                .btn-card {
                    background-color: white;
                    color: var(--primary-blue);
                    border-radius: 0.75rem;
                    padding: 0.5rem 1rem;
                    font-weight: 600;
                    font-size: 0.875rem;
                    border: 1px solid #E3F2FD;
                    transition: all 0.2s;
                }
                
                .btn-card:hover {
                    background-color: #E3F2FD;
                }
                
                .sidebar {
                    background-color: white;
                    box-shadow: -10px 0px 30px -15px rgba(0,0,0,0.05);
                    z-index: 40;
                }
                
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1.25rem;
                    margin: 0.25rem 0;
                    border-radius: 0.75rem;
                    color: var(--text-gray);
                    transition: all 0.2s;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: right;
                }
                
                .sidebar-link:hover {
                    background-color: #E3F2FD;
                    color: var(--primary-blue);
                }
                
                .sidebar-link.active {
                    background: var(--primary-blue);
                    color: white;
                    box-shadow: 0 5px 15px -5px rgba(33, 150, 243, 0.5);
                }
                
                .sidebar-link svg {
                    margin-left: 0.75rem;
                }
                
                .form-input {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #E2E8F0;
                    border-radius: 0.75rem;
                    background-color: #FDFEFE;
                    transition: all 0.2s;
                    font-size: 1rem;
                    font-family: inherit;
                }
                
                .form-input:focus {
                    background-color: white;
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
                    outline: none;
                }
                
                .card {
                    background-color: white;
                    border-radius: 1.25rem;
                    box-shadow: 0 10px 40px -15px rgba(0,0,0,0.05);
                    border: 1px solid #F1F5F9;
                }
                
                .dashboard-card {
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                }
                
                .dashboard-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                
                .service-card {
                    transition: all 0.3s ease;
                }
                
                .service-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }
                
                .feature-card {
                    transition: all 0.3s ease;
                }
                
                .feature-card:hover {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                
                .animate-fade-in {
                    animation: fadeIn 1s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @media (max-width: 768px) {
                    .sidebar {
                        width: 16rem;
                    }
                    
                    .logo-text {
                        font-size: 1.5rem;
                    }
                    
                    .logo-plus {
                        width: 1.5rem;
                        height: 1.5rem;
                        font-size: 1rem;
                    }
                }
            `}</style>
            
            <AppContent />
        </AuthProvider>
    );
}