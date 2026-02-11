// --- CÉREBRO DO SISTEMA (js/app.js) ---

const { useState, useEffect, useRef, useMemo } = React;

// 1. CONFIGURAÇÃO FIREBASE (MODO COMPATIBILIDADE)
const firebaseConfig = {
  apiKey: "AIzaSyDvyogaIlFQwrLARo9S4aJylT1N70-lhYs",
  authDomain: "retiblocos-app.firebaseapp.com",
  projectId: "retiblocos-app",
  storageBucket: "retiblocos-app.firebasestorage.app",
  messagingSenderId: "509287186524",
  appId: "1:509287186524:web:2ecd4802f66536bf7ea699"
};

// Inicializa globalmente
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase ? firebase.auth() : null;
const db = firebase ? firebase.firestore() : null;
const appId = 'retiblocos-v1';

// 2. ÍCONES (SVG)
const Icon = ({ path, size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{path}</svg>
);

const Icons = {
    ArrowLeft: (props) => <Icon {...props} path={<><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></>} />,
    Save: (props) => <Icon {...props} path={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />,
    Trash: (props) => <Icon {...props} path={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} />,
    Plus: (props) => <Icon {...props} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
    Check: (props) => <Icon {...props} path={<><polyline points="20 6 9 17 4 12"/></>} />,
    Refresh: (props) => <Icon {...props} path={<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>} />,
    Pen: (props) => <Icon {...props} path={<><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>} />,
    Share: (props) => <Icon {...props} path={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>} />,
    Skip: (props) => <Icon {...props} path={<><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></>} />,
    Box: (props) => <Icon {...props} path={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>} />,
    Cloud: (props) => <Icon {...props} path={<><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></>} />,
    Search: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
    Home: (props) => <Icon {...props} path={<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
    Clock: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />,
    Calendar: (props) => <Icon {...props} path={<><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>} />,
    ChevronLeft: (props) => <Icon {...props} path={<><path d="m15 18-6-6 6-6"/></>} />,
    ChevronRight: (props) => <Icon {...props} path={<><path d="m9 18 6-6-6-6"/></>} />
};

// 3. DADOS ESTÁTICOS
const SAAM_BRANCHES = [ "SAAM Towage Brasil S.A. - Matriz (RJ)", "SAAM Towage Brasil S.A. - Santos", "SAAM Towage Brasil S.A. - Rio Grande", "SAAM Towage Brasil S.A. - Sepetiba", "SAAM Towage Brasil S.A. - Suape", "SAAM Towage Brasil S.A. - São Luís", "SAAM Towage Brasil S.A. - Salvador", "SAAM Towage Brasil S.A. - Vitória", "SAAM Towage Brasil S.A. - Navegantes", "SAAM Towage Brasil S.A. - São Francisco do Sul", "SAAM Towage Brasil S.A. - Paranaguá" ];
const MAINTENANCE_TYPES = [ "Preventiva", "Corretiva", "Revisão 1.000h", "Revisão 2.000h", "Top Overhaul", "Major Overhaul", "Inspeção", "Outros" ];
const ENGINE_POSITIONS = [ { id: 'bb', label: 'Bombordo', short: 'BB' }, { id: 'be', label: 'Boreste', short: 'BE' }, { id: 'vante', label: 'Vante', short: 'Vante' }, { id: 're', label: 'Ré', short: 'Ré' } ];
const PART_SOURCES = ["Retiblocos", "Cliente"];
const MAX_PHOTOS = 6;

// 4. UTILITÁRIOS
const compressImage = (file, quality = 0.5, maxWidth = 600) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const elem = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                elem.width = width; elem.height = height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(elem.toDataURL('image/jpeg', quality));
            };
        };
    });
};

// --- COMPONENTE: INTRODUÇÃO (Animação) ---
const IntroAnimation = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2500); // 2.5s de duração da animação
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="intro-overlay">
            <div className="intro-logo-container">
                <div className="intro-rb">RB</div>
            </div>
            <h1 className="intro-text">Retiblocos</h1>
            <p className="intro-sub">SISTEMA DE GESTÃO TÉCNICA</p>
        </div>
    );
};

// --- COMPONENTE: ASSINATURA ---
const SignaturePad = ({ title, onSave, onCancel, onSkip }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        window.scrollTo(0, 0); document.body.style.overflow = 'hidden'; 
        const timer = setTimeout(() => {
            const canvas = canvasRef.current; if (!canvas) return;
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
            const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio);
            ctx.strokeStyle = '#000000'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        }, 300);
        return () => { document.body.style.overflow = 'auto'; clearTimeout(timer); };
    }, []);
    const getPos = (e) => { const r = canvasRef.current.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
    const start = (e) => { if(e.cancelable) e.preventDefault(); const {x,y} = getPos(e); const ctx = canvasRef.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(x, y); };
    const move = (e) => { if(e.cancelable) e.preventDefault(); const {x,y} = getPos(e); const ctx = canvasRef.current.getContext('2d'); ctx.lineTo(x, y); ctx.stroke(); };
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
                <div className="bg-slate-100 p-4 border-b flex justify-between items-center shrink-0">
                    <h3 className="text-slate-800 font-bold text-lg">{title}</h3>
                    <button onClick={() => {const c=canvasRef.current;c.getContext('2d').clearRect(0,0,c.width,c.height);c.getContext('2d').beginPath();}} className="text-slate-500 hover:text-red-500 p-2"><Icons.Refresh /></button>
                </div>
                <div className="flex-1 bg-white relative w-full overflow-hidden cursor-crosshair touch-none">
                    <canvas ref={canvasRef} className="w-full h-full block touch-none" onMouseDown={start} onMouseMove={move} onTouchStart={start} onTouchMove={move} />
                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none text-slate-200 text-3xl font-black opacity-20 uppercase select-none">Assine Aqui</div>
                </div>
                <div className="bg-slate-50 p-4 border-t flex gap-3 shrink-0">
                    <button onClick={onCancel} className="flex-1 py-3 font-semibold text-slate-500 hover:bg-slate-200 rounded-lg">Voltar</button>
                    {onSkip && <button onClick={onSkip} className="flex-1 py-3 font-semibold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1"><Icons.Skip size={16}/> Pular</button>}
                    <button onClick={() => onSave(canvasRef.current.toDataURL())} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: CALENDÁRIO OTIMIZADO ---
const CalendarView = ({ reports, schedules, onDateClick, onAddSchedule }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Mescla Relatórios (Verde) e Agendamentos (Laranja)
    const events = useMemo(() => {
        const all = [];
        // Relatórios (Já feitos)
        reports.forEach(r => {
            if(r.startDate) all.push({ 
                date: r.startDate, 
                title: r.vesselName, 
                time: `${r.startTime || '08:00'} - ${r.endTime || '18:00'}`,
                type: 'report', 
                id: r.id 
            });
        });
        // Agendamentos (Futuros)
        schedules.forEach(s => {
            if(s.date) all.push({ 
                date: s.date, 
                title: s.vesselName, 
                time: 'Previsão',
                type: 'schedule', 
                id: s.id, 
                ...s 
            });
        });
        return all;
    }, [reports, schedules]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(<div key={`empty-${i}`} className="calendar-day bg-slate-800/30"></div>);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            
            days.push(
                <div key={day} onClick={() => onDateClick(dateStr, dayEvents)} className="calendar-day cursor-pointer hover:bg-slate-700 transition-colors">
                    <span className={`absolute top-1 right-1 text-xs font-bold ${dayEvents.length > 0 ? 'text-white' : 'text-slate-500'}`}>{day}</span>
                    <div className="flex flex-col gap-1 mt-5">
                        {dayEvents.map((ev, idx) => (
                            <div key={idx} className={`text-[8px] px-1 py-0.5 rounded truncate font-bold border-l-2 ${ev.type === 'report' ? 'bg-green-900/40 text-green-200 border-green-500' : 'bg-orange-900/40 text-orange-200 border-orange-500'}`}>
                                <div className="leading-none">{ev.time}</div>
                                <div className="truncate">{ev.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300"><Icons.ChevronLeft/></button>
                <h2 className="text-lg font-bold text-white capitalize">{monthName}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300"><Icons.ChevronRight/></button>
            </div>
            
            <div className="calendar-grid">
                {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d} className="text-center py-2 bg-slate-800 text-[10px] uppercase text-slate-400 font-bold">{d}</div>)}
                {renderDays()}
            </div>
            
            <div className="flex gap-4 text-xs text-slate-400 justify-center pt-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Relatórios Feitos</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Agendamentos</span>
            </div>

            <button onClick={onAddSchedule} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-slate-600">
                <Icons.Plus size={16}/> Agendar Serviço Futuro
            </button>
        </div>
    );
};

// --- APP PRINCIPAL ---
function App() {
    const [view, setView] = useState('intro'); // Inicia na Intro
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Estado para Agendamento
    const [scheduleData, setScheduleData] = useState({ date: '', vesselName: '', description: '' });
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Estado do Formulário
    const initialFormState = {
        controlNumber: '', branch: SAAM_BRANCHES[0], vesselName: '', enginePosition: '',
        engineModel: '', engineSerial: '', maintenanceType: MAINTENANCE_TYPES[0], maintenanceTypeOther: '',
        technicianName: '', startDate: new Date().toISOString().split('T')[0], startTime: '08:00',
        endDate: new Date().toISOString().split('T')[0], endTime: '17:00',
        tasksExecuted: '', notes: '', runningHours: '', photos: [], parts: [],
        technicianSignature: null, clientSignature: null
    };

    const [formData, setFormData] = useState(initialFormState);
    const [newPart, setNewPart] = useState({ name: '', qty: '1', source: 'Retiblocos' });

    // Remove loading do HTML quando o React monta
    useEffect(() => { const l = document.getElementById('loading-screen'); if(l) l.style.display = 'none'; }, []);

    // Lógica da Intro (Só primeira vez)
    useEffect(() => {
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (hasSeenIntro) {
            setView('dashboard');
        }
        // Se não viu, o estado inicial já é 'intro', então renderiza a animação
    }, []);

    // AUTH
    useEffect(() => {
        if(!auth) return;
        auth.signInAnonymously().catch(console.error);
        return auth.onAuthStateChanged(u => setUser(u));
    }, []);

    // CARREGAR DADOS
    useEffect(() => {
        if (!user || !db) return;
        
        // Relatórios (Passado)
        const unsubReports = db.collection('artifacts').doc(appId).collection('public_reports')
            .orderBy('savedAt', 'desc').limit(50)
            .onSnapshot(s => setReports(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        
        // Agendamentos (Futuro)
        const unsubSchedules = db.collection('artifacts').doc(appId).collection('schedules')
            .orderBy('date', 'asc')
            .onSnapshot(s => setSchedules(s.docs.map(d => ({ id: d.id, ...d.data() }))));

        return () => { unsubReports(); unsubSchedules(); };
    }, [user]);

    // --- AÇÕES DO SISTEMA ---
    
    // Finalizar Intro
    const finishIntro = () => {
        localStorage.setItem('hasSeenIntro', 'true');
        setView('dashboard');
    };

    // Agendamentos
    const saveSchedule = async () => {
        if(!scheduleData.date || !scheduleData.vesselName) return alert("Preencha data e embarcação");
        try {
            await db.collection('artifacts').doc(appId).collection('schedules').add(scheduleData);
            setShowScheduleModal(false);
            setScheduleData({ date: '', vesselName: '', description: '' });
            alert("Agendado com sucesso!");
        } catch(e) { alert("Erro ao agendar."); }
    };

    const deleteSchedule = async (id) => {
        if(!confirm("Excluir agendamento?")) return;
        await db.collection('artifacts').doc(appId).collection('schedules').doc(id).delete();
    };

    // Relatórios
    const startNewReport = () => { setFormData(initialFormState); setView('form'); };
    const editReport = (e, report) => { e.stopPropagation(); setFormData(report); setView('form'); };
    const deleteReport = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Excluir este relatório?")) return;
        try { await db.collection('artifacts').doc(appId).collection('public_reports').doc(id).delete(); } catch (e) { alert("Erro ao excluir."); }
    };

    // Salvar Nuvem
    const saveToCloud = async (dataToSave = null, silent = false) => {
        if (!user) return alert("Conectando...");
        if (!silent) setIsSaving(true);
        const payload = dataToSave || formData;
        try {
            const docData = { ...payload, savedAt: new Date().toISOString() };
            // Verificação de tamanho
            const jsonSize = new Blob([JSON.stringify(docData)]).size;
            if (jsonSize > 950000) { 
                alert(`ERRO: Relatório muito pesado (${(jsonSize/1024).toFixed(0)}KB). Limite 1MB.`); 
                if(!silent) setIsSaving(false); return false; 
            }
            
            const colRef = db.collection('artifacts').doc(appId).collection('public_reports');
            if (payload.id) {
                await colRef.doc(payload.id).update(docData);
            } else {
                const ref = await colRef.add(docData);
                setFormData(prev => ({ ...prev, id: ref.id }));
            }
            if(!silent) alert("Salvo com sucesso!");
            return true;
        } catch (e) { console.error(e); alert("Erro ao salvar."); return false; } 
        finally { if(!silent) setIsSaving(false); }
    };

    // Handlers
    const handlePhotoUpload = async (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const remainingSlots = MAX_PHOTOS - formData.photos.length;
            if (remainingSlots <= 0) return alert(`Limite de ${MAX_PHOTOS} fotos atingido!`);
            
            const filesToProcess = files.slice(0, remainingSlots);
            const processedPhotos = await Promise.all(filesToProcess.map(async (file) => {
                const compressedUrl = await compressImage(file, 0.5, 600);
                return { id: Date.now() + Math.random(), url: compressedUrl, caption: '' };
            }));
            setFormData(prev => ({ ...prev, photos: [...prev.photos, ...processedPhotos] }));
        }
    };

    const addPart = () => { if (!newPart.name) return; setFormData(prev => ({ ...prev, parts: [...prev.parts, { ...newPart, id: Date.now() }] })); setNewPart({ name: '', qty: '1', source: 'Retiblocos' }); };
    const removePart = (id) => setFormData(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== id) }));
    const removePhoto = (id) => setFormData(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));
    const updateCaption = (id, text) => setFormData(prev => ({ ...prev, photos: prev.photos.map(p => p.id === id ? { ...p, caption: text } : p) }));
    const saveTechSig = (d) => { setFormData(p => ({...p, technicianSignature: d})); setView('sig_client'); };
    
    // Auto-Save ao finalizar
    const finalizeReport = async (clientSig) => {
        const finalData = { ...formData, clientSignature: clientSig };
        const jsonSize = new Blob([JSON.stringify(finalData)]).size;
        if (jsonSize > 950000) return alert(`Muito pesado (${(jsonSize/1024).toFixed(0)}KB). Remova fotos.`);
        setFormData(finalData);
        const saved = await saveToCloud(finalData, true);
        setView('preview');
        if(!saved) alert("Aviso: Não foi possível sincronizar na nuvem, mas o PDF pode ser gerado.");
    };

    const saveClientSig = (d) => finalizeReport(d);
    const skipClientSig = () => finalizeReport(null);
    const isFormValid = () => formData.vesselName && formData.technicianName;
    const calculateDuration = () => {
        const s = new Date(`${formData.startDate}T${formData.startTime}`), e = new Date(`${formData.endDate}T${formData.endTime}`);
        const d = e - s; if(d < 0) return "--";
        return `${Math.floor(d/3600000)}h ${Math.round((d%3600000)/60000)}min`;
    };
    const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR');
    
    const shareData = async () => {
        const dataStr = JSON.stringify(formData, null, 2);
        const fileName = `RB_${formData.vesselName}.json`;
        const file = new File([dataStr], fileName, { type: 'application/json' });
        if (navigator.share && navigator.canShare({ files: [file] })) try { await navigator.share({ files: [file] }); } catch (e) {}
        else { const l = document.createElement('a'); l.href = URL.createObjectURL(file); l.download = fileName; l.click(); }
    };

    useEffect(() => {
        if (view === 'form' && formData.vesselName) document.title = `${formData.vesselName} - ${formData.startDate}`;
        else document.title = "Retiblocos System";
    }, [formData, view]);

    const filteredReports = reports.filter(r => 
        (r.vesselName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (r.controlNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER ---
    return (
        <div className="min-h-screen">
            
            {/* VISTA 0: INTRODUÇÃO */}
            {view === 'intro' && <IntroAnimation onFinish={finishIntro} />}

            {/* VISTA 1: DASHBOARD */}
            {view === 'dashboard' && (
                <div className="no-print max-w-3xl mx-auto p-4 space-y-6 fade-in">
                    <div className="flex justify-between items-center py-4">
                        <div><h1 className="text-2xl font-black text-white uppercase tracking-tight">Painel de Controle</h1><p className="text-slate-400 text-sm">Bem-vindo ao sistema Retiblocos</p></div>
                        <div className="bg-orange-600 w-10 h-10 rounded-lg flex items-center justify-center font-black text-white">RB</div>
                    </div>
                    
                    <button onClick={startNewReport} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between group transition-all transform hover:scale-[1.01]">
                        <div className="flex items-center gap-4"><div className="bg-white/20 p-3 rounded-xl"><Icons.Pen size={24}/></div><div className="text-left"><h2 className="font-bold text-lg">Criar Novo Relatório</h2><p className="text-orange-100 text-xs">Preencher OS, peças e fotos</p></div></div>
                        <Icons.ArrowLeft className="rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"/>
                    </button>

                    {/* Botões de Acesso Rápido */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setView('calendar')} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-orange-500 transition-all text-left group">
                            <div className="bg-blue-900/50 p-2 rounded-lg w-fit mb-2 text-blue-400 group-hover:text-white transition-colors"><Icons.Calendar size={20}/></div>
                            <h3 className="font-bold text-white text-sm">Calendário</h3>
                            <p className="text-xs text-slate-400">Ver agenda e histórico</p>
                        </button>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <div className="bg-green-900/50 p-2 rounded-lg w-fit mb-2 text-green-400"><Icons.Check size={20}/></div>
                            <h3 className="font-bold text-white text-sm">Status</h3>
                            <p className="text-xs text-slate-400">{reports.length} Relatórios feitos</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center"><h3 className="text-slate-300 font-bold uppercase text-xs tracking-wider">Histórico Recente</h3><div className="relative"><Icons.Search className="absolute left-3 top-2.5 text-slate-500" size={14}/><input type="text" placeholder="Buscar..." className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-orange-500 outline-none w-40" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div></div>
                        <div className="grid gap-3">
                            {filteredReports.map(rep => (
                                <div key={rep.id} onClick={(e) => editReport(e, rep)} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-orange-500/50 cursor-pointer group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-white text-base uppercase">{rep.vesselName || 'SEM NOME'}</h4><span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase tracking-wider">{rep.controlNumber || 'S/N'}</span></div><div className="flex gap-2"><button onClick={(e) => editReport(e, rep)} className="p-2 bg-blue-600/10 text-blue-400 rounded-lg"><Icons.Pen size={16}/></button><button onClick={(e) => deleteReport(e, rep.id)} className="p-2 bg-red-600/10 text-red-400 rounded-lg"><Icons.Trash size={16}/></button></div></div>
                                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 border-t border-slate-700/50 pt-3"><span className="flex items-center gap-1"><Icons.Clock size={12}/> {new Date(rep.startDate).toLocaleDateString('pt-BR')}</span><span>•</span><span>{rep.maintenanceType}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* VISTA 2: CALENDÁRIO */}
            {view === 'calendar' && (
                <div className="no-print max-w-3xl mx-auto p-4 space-y-6 fade-in">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => setView('dashboard')} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><Icons.ArrowLeft/></button>
                        <h1 className="text-xl font-bold text-white">Agenda de Serviços</h1>
                    </div>
                    
                    <CalendarView 
                        reports={reports} 
                        schedules={schedules} 
                        onDateClick={(date, events) => {
                            if(events.length > 0) alert(`Eventos em ${new Date(date).toLocaleDateString('pt-BR')}:\n\n` + events.map(e => `${e.type === 'report' ? '✅ Realizado:' : '📅 Previsto:'} ${e.title} (${e.time})`).join('\n'));
                            else if(confirm(`Agendar serviço para ${new Date(date).toLocaleDateString('pt-BR')}?`)) {
                                setScheduleData({...scheduleData, date}); setShowScheduleModal(true);
                            }
                        }} 
                        onAddSchedule={() => setShowScheduleModal(true)} 
                    />
                </div>
            )}

            {/* HEADER FORM/PREVIEW (Só aparece nessas telas) */}
            {(view === 'form' || view === 'preview') && (
                <div className="no-print bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-lg">
                    <div className="max-w-2xl mx-auto p-3 flex justify-between items-center">
                        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"><Icons.Home size={18} /><span className="text-xs font-bold uppercase hidden sm:inline">Início</span></button>
                        <div className="flex items-center gap-2"><div className="bg-orange-600 w-6 h-6 rounded flex items-center justify-center font-black text-white text-[10px]">RB</div><span className="font-bold text-sm text-white uppercase tracking-wider">{view === 'preview' ? 'Finalizado' : 'Edição'}</span></div>
                        <div className="flex gap-2">
                            {view === 'form' && <button onClick={() => saveToCloud()} disabled={isSaving} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"><Icons.Save size={18}/></button>}
                            {view === 'preview' && <button onClick={() => setView('form')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-slate-200">Editar</button>}
                        </div>
                    </div>
                </div>
            )}

            {/* FORMULÁRIO */}
            {view === 'form' && (
                <div className="no-print max-w-2xl mx-auto p-4 space-y-8 fade-in pb-32">
                    {/* ... SEÇÕES DO FORMULÁRIO (Mantidas Iguais) ... */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2">Informações</h3>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 text-orange-400 font-bold uppercase" placeholder="Nº Controle (EX: 1442)" value={formData.controlNumber} onChange={e => setFormData({...formData, controlNumber: e.target.value})} />
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>{SAAM_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}</select>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 uppercase font-bold" placeholder="Embarcação" value={formData.vesselName} onChange={e => setFormData({...formData, vesselName: e.target.value})} />
                            <input list="models" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" placeholder="Modelo Motor" value={formData.engineModel} onChange={e => setFormData({...formData, engineModel: e.target.value})} />
                            <datalist id="models"><option value="Caterpillar C32"/><option value="Caterpillar 3512"/><option value="Deutz 620"/><option value="MTU 4000"/><option value="C4.4"/></datalist>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 uppercase" placeholder="Série" value={formData.engineSerial} onChange={e => setFormData({...formData, engineSerial: e.target.value})} />
                            <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" placeholder="Horímetro" value={formData.runningHours} onChange={e => setFormData({...formData, runningHours: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 gap-2">{ENGINE_POSITIONS.map(p => (<button key={p.id} onClick={() => setFormData({...formData, enginePosition: p.label})} className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${formData.enginePosition === p.label ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{p.short}</button>))}</div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2">Detalhes</h3>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" value={formData.maintenanceType} onChange={e => setFormData({...formData, maintenanceType: e.target.value})}>{MAINTENANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                        {formData.maintenanceType === 'Outros' && <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 mt-2" placeholder="Especifique..." value={formData.maintenanceTypeOther} onChange={e => setFormData({...formData, maintenanceTypeOther: e.target.value})} />}
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 grid grid-cols-2 gap-4">
                            <div><label className="text-[10px] text-slate-400 font-bold uppercase">Início</label><input type="date" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-xs text-slate-200" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /><input type="time" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-xs text-slate-200" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
                            <div><label className="text-[10px] text-slate-400 font-bold uppercase">Fim</label><input type="date" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-xs text-slate-200" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /><input type="time" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-xs text-slate-200" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
                        </div>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" placeholder="Nome do Técnico" value={formData.technicianName} onChange={e => setFormData({...formData, technicianName: e.target.value})} />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs text-green-400 font-bold uppercase">1. Execução (Realizado)</label>
                        <textarea rows={6} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-green-500" placeholder="Descreva o serviço..." value={formData.tasksExecuted} onChange={e => setFormData({...formData, tasksExecuted: e.target.value})} />
                        <label className="text-xs text-blue-400 font-bold uppercase">2. Observações</label>
                        <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-blue-500" placeholder="Pendências..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2 flex items-center gap-2"><Icons.Box size={16}/> Peças</h3>
                        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-3">
                            <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-200" placeholder="Nome da Peça" value={newPart.name} onChange={e => setNewPart({...newPart, name: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="text" className="w-20 bg-slate-900 border border-slate-600 rounded p-2 text-sm text-center text-slate-200" placeholder="Qtd" value={newPart.qty} onChange={e => setNewPart({...newPart, qty: e.target.value})} />
                                <select className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-200" value={newPart.source} onChange={e => setNewPart({...newPart, source: e.target.value})}>{PART_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                                <button onClick={addPart} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 px-4"><Icons.Plus /></button>
                            </div>
                        </div>
                        {formData.parts.length > 0 && <div className="space-y-2">{formData.parts.map(part => (<div key={part.id} className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-slate-700/50"><div className="flex-1"><span className="font-bold text-sm text-slate-200">{part.qty}x {part.name}</span><span className={`block text-[10px] font-bold uppercase ${part.source === 'Retiblocos' ? 'text-orange-400' : 'text-blue-400'}`}>{part.source}</span></div><button onClick={() => removePart(part.id)} className="text-slate-500 hover:text-red-500 p-2"><Icons.Trash size={16}/></button></div>))}</div>}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2 flex justify-between items-center">
                            <span>Fotos</span>
                            <span className={`text-xs px-2 py-1 rounded ${formData.photos.length >= MAX_PHOTOS ? 'bg-red-900 text-red-200' : 'bg-slate-700 text-slate-300'}`}>{formData.photos.length}/{MAX_PHOTOS}</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {formData.photos.map(photo => (
                                <div key={photo.id} className="relative group bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                    <img src={photo.url} className="w-full h-32 object-cover" />
                                    <button onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white"><Icons.Trash size={14}/></button>
                                    <input type="text" placeholder="Legenda..." className="w-full bg-slate-900 text-[10px] p-2 text-slate-300 outline-none border-t border-slate-700" value={photo.caption} onChange={e => updateCaption(photo.id, e.target.value)} />
                                </div>
                            ))}
                            <label className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${formData.photos.length >= MAX_PHOTOS ? 'border-slate-700 text-slate-600 cursor-not-allowed' : 'border-slate-700 hover:bg-slate-800 hover:border-orange-500 text-slate-500 hover:text-orange-500'}`}>
                                <Icons.Plus size={24} /><span className="text-xs mt-2 font-bold">Add Foto</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={formData.photos.length >= MAX_PHOTOS}/>
                            </label>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700 z-40">
                        <div className="max-w-2xl mx-auto">
                            <button disabled={!isFormValid()} onClick={() => setView('sig_tech')} className={`w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 text-lg transition-all ${isFormValid() ? 'bg-orange-600 text-white hover:bg-orange-500 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                                <Icons.Pen size={20} /> Assinar e Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL AGENDAMENTO */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-sm border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4">Novo Agendamento</h3>
                        <div className="space-y-3">
                            <input type="date" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-white" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} />
                            <input type="text" placeholder="Embarcação" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-white uppercase" value={scheduleData.vesselName} onChange={e => setScheduleData({...scheduleData, vesselName: e.target.value})} />
                            <input type="text" placeholder="Descrição" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-white" value={scheduleData.description} onChange={e => setScheduleData({...scheduleData, description: e.target.value})} />
                        </div>
                        <div className="flex gap-3 mt-6"><button onClick={() => setShowScheduleModal(false)} className="flex-1 py-2 text-slate-400">Cancelar</button><button onClick={saveSchedule} className="flex-1 py-2 bg-orange-600 text-white rounded font-bold">Agendar</button></div>
                    </div>
                </div>
            )}

            {/* ASSINATURAS */}
            {view === 'sig_tech' && <SignaturePad title="Assinatura do Técnico" onSave={saveTechSig} onCancel={() => setView('form')} />}
            {view === 'sig_client' && <SignaturePad title="Assinatura Cliente" onSave={saveClientSig} onSkip={skipClientSig} onCancel={() => setView('sig_tech')} />}

            {/* PREVIEW FINAL */}
            {view === 'preview' && (
                <div className="no-print p-6 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-sm mx-auto space-y-6 fade-in">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 mb-2"><Icons.Check size={40} className="text-white"/></div>
                    <div><h2 className="text-2xl font-bold text-white mb-1">Salvo e Sincronizado!</h2><p className="text-slate-400 text-sm">O relatório já está na nuvem.</p></div>
                    <div className="w-full space-y-3">
                        <button onClick={() => window.print()} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 border-b-4 border-slate-300 active:border-0 active:translate-y-1"><Icons.Save size={20}/> Baixar PDF</button>
                        <button onClick={shareData} className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold py-4 rounded-xl border border-slate-700 flex items-center justify-center gap-3"><Icons.Share size={20} /> Compartilhar Dados</button>
                    </div>
                    <div className="flex gap-4 w-full pt-4">
                        <button onClick={startNewReport} className="flex-1 py-3 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg">Novo Relatório</button>
                        <button onClick={() => setView('dashboard')} className="flex-1 py-3 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg">Ir ao Início</button>
                    </div>
                </div>
            )}

            {/* LAYOUT DE IMPRESSÃO (PDF) - Oculto na tela normal */}
            <div className="print-only print-container bg-white text-slate-900 relative">
                <div className="flex justify-between items-start border-b-4 border-orange-500 pb-2 mb-4">
                    <div className="flex flex-col"><h1 className="text-5xl font-logo retiblocos-logo uppercase leading-none mt-1">RETIBLOCOS</h1><div className="retiblocos-sub text-xs tracking-[0.2em] px-1 py-0.5 mt-1 rounded-sm w-fit uppercase">Retífica de Peças e Motores</div></div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nº Controle</div><div className="text-xl font-bold uppercase text-orange-600 leading-tight font-mono">{formData.controlNumber || '0000'}</div>
                        <div className="mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cliente</div><div className="text-sm font-bold uppercase text-slate-800 leading-tight">{formData.branch.split(' - ')[0]}</div>
                    </div>
                </div>

                <div className="flex bg-slate-100 rounded border-l-4 border-orange-600 mb-4 p-2 items-center justify-between">
                    <div><span className="text-[9px] uppercase font-bold text-slate-500 block">Tipo de Serviço</span><span className="font-bold text-slate-900 text-sm">{formData.maintenanceType === 'Outros' ? (formData.maintenanceTypeOther || 'Outros') : formData.maintenanceType}</span></div>
                    <div className="text-right"><span className="text-[9px] uppercase font-bold text-slate-500 block">Período de Execução</span><div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-800"><span>{formatDate(formData.startDate)} {formData.startTime}</span><span className="text-orange-400">➜</span><span>{formatDate(formData.endDate)} {formData.endTime}</span></div><div className="text-[9px] font-bold text-orange-600 mt-0.5">Duração: {calculateDuration()}</div></div>
                </div>

                <div className="mb-4 grid grid-cols-4 gap-2 text-[10px]">
                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Embarcação</span><span className="block font-bold text-slate-900 uppercase">{formData.vesselName}</span></div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Motor</span><span className="block font-bold text-slate-900 uppercase">{formData.engineModel}</span></div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Posição</span><span className="block font-bold text-slate-900 uppercase">{formData.enginePosition}</span></div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Horímetro</span><span className="block font-bold text-slate-900 font-mono">{formData.runningHours} H</span></div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50 col-span-4"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Série</span><span className="block font-bold text-slate-900 font-mono uppercase">{formData.engineSerial || 'N/A'}</span></div>
                </div>

                <div className="space-y-4">
                    <div><h3 className="font-bold text-slate-900 uppercase border-l-4 border-orange-500 pl-2 py-0.5 mb-1 text-[11px] bg-orange-50">1. Serviços Executados</h3><div className="text-justify text-[11px] leading-snug whitespace-pre-wrap text-slate-800 pl-3">{formData.tasksExecuted}</div></div>
                    {formData.notes && (<div><h3 className="font-bold text-slate-900 uppercase border-l-4 border-blue-400 pl-2 py-0.5 mb-1 text-[11px] bg-blue-50">2. Observações</h3><p className="text-justify text-[11px] leading-snug whitespace-pre-wrap italic text-slate-600 pl-3">{formData.notes}</p></div>)}
                </div>

                {formData.parts.length > 0 && (
                    <div className="mt-4 break-inside-avoid">
                        <h3 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2 text-[10px]">Relação de Peças e Materiais</h3>
                        <table className="w-full text-[10px] border border-slate-200 rounded overflow-hidden"><thead className="bg-slate-800 text-white"><tr><th className="p-1 w-10 text-center">QTD</th><th className="p-1 text-left">DESCRIÇÃO</th><th className="p-1 text-right w-24">FONTE</th></tr></thead><tbody>{formData.parts.map((p, i) => (<tr key={i} className={i%2===0?'bg-white':'bg-slate-50'}><td className="p-1 border-b text-center font-bold">{p.qty}</td><td className="p-1 border-b font-bold text-slate-700">{p.name}</td><td className="p-1 border-b text-right"><span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${p.source==='Retiblocos'?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>{p.source}</span></td></tr>))}</tbody></table>
                    </div>
                )}

                {formData.photos.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Registro Fotográfico</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {formData.photos.map(p => (<div key={p.id} className="break-inside-avoid border border-slate-200 bg-white p-1 rounded shadow-sm"><div className="h-40 flex items-center justify-center overflow-hidden bg-slate-50 rounded mb-1"><img src={p.url} className="max-h-full max-w-full object-contain"/></div>{p.caption && <p className="text-[9px] font-bold text-slate-700 text-center uppercase leading-tight">{p.caption}</p>}</div>))}
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-4 border-t-2 border-slate-800 break-inside-avoid">
                    <div className="grid grid-cols-2 gap-10">
                        <div className="text-center">{formData.technicianSignature ? <img src={formData.technicianSignature} className="h-10 mx-auto mb-1 object-contain"/> : <div className="h-10"/>}<div className="border-t border-slate-400 pt-1"><p className="font-bold text-[10px] uppercase text-slate-900">{formData.technicianName}</p><p className="text-[8px] uppercase font-bold text-orange-600 tracking-wider">Técnico Retiblocos</p></div></div>
                        <div className="text-center">{formData.clientSignature ? <img src={formData.clientSignature} className="h-10 mx-auto mb-1 object-contain"/> : <div className="h-10"/>}<div className="border-t border-slate-400 pt-1"><p className="font-bold text-[10px] uppercase text-slate-900">Aprovação Cliente</p><p className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Chefe de Máquinas / Cmte</p></div></div>
                    </div>
                    <div className="text-[8px] text-slate-300 uppercase text-center mt-6 font-mono">Retiblocos Retífica de Motores - Documento Digital - {new Date().toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
