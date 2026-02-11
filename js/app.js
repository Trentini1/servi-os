import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const { useState, useEffect, useRef } = React;

// --- CONFIGURAÇÃO DO FIREBASE (SUA CONTA) ---
const firebaseConfig = {
  apiKey: "AIzaSyDvyogaIlFQwrLARo9S4aJylT1N70-lhYs",
  authDomain: "retiblocos-app.firebaseapp.com",
  projectId: "retiblocos-app",
  storageBucket: "retiblocos-app.firebasestorage.app",
  messagingSenderId: "509287186524",
  appId: "1:509287186524:web:2ecd4802f66536bf7ea699"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ID do App para isolamento de dados (opcional, uso padrão aqui)
const appId = 'retiblocos-v1';

// --- ÍCONES SVG (Lucide Clone para React) ---
const Icon = ({ path, size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {path}
    </svg>
);

const Icons = {
    Save: (props) => <Icon {...props} path={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />,
    Upload: (props) => <Icon {...props} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>} />,
    Trash: (props) => <Icon {...props} path={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} />,
    Plus: (props) => <Icon {...props} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
    Check: (props) => <Icon {...props} path={<><polyline points="20 6 9 17 4 12"/></>} />,
    Refresh: (props) => <Icon {...props} path={<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>} />,
    Pen: (props) => <Icon {...props} path={<><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>} />,
    Share: (props) => <Icon {...props} path={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>} />,
    Skip: (props) => <Icon {...props} path={<><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></>} />,
    Box: (props) => <Icon {...props} path={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>} />,
    Cloud: (props) => <Icon {...props} path={<><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></>} />,
    List: (props) => <Icon {...props} path={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>} />,
    Close: (props) => <Icon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />
};

// --- DADOS ESTÁTICOS ---
const SAAM_BRANCHES = [
    "SAAM Towage Brasil S.A. - Matriz (RJ)", "SAAM Towage Brasil S.A. - Santos",
    "SAAM Towage Brasil S.A. - Rio Grande", "SAAM Towage Brasil S.A. - Sepetiba",
    "SAAM Towage Brasil S.A. - Suape", "SAAM Towage Brasil S.A. - São Luís",
    "SAAM Towage Brasil S.A. - Salvador", "SAAM Towage Brasil S.A. - Vitória",
    "SAAM Towage Brasil S.A. - Navegantes", "SAAM Towage Brasil S.A. - São Francisco do Sul",
    "SAAM Towage Brasil S.A. - Paranaguá"
];

const MAINTENANCE_TYPES = [
    "Preventiva", "Corretiva", "Revisão 1.000h", 
    "Revisão 2.000h", "Top Overhaul", "Major Overhaul", "Inspeção", "Outros"
];

const ENGINE_POSITIONS = [
    { id: 'bb', label: 'Bombordo', short: 'BB' }, { id: 'be', label: 'Boreste', short: 'BE' },
    { id: 'vante', label: 'Vante', short: 'Vante' }, { id: 're', label: 'Ré', short: 'Ré' }
];

const PART_SOURCES = ["Retiblocos", "Cliente"];

// --- COMPONENTE: ASSINATURA ---
const SignaturePad = ({ title, onSave, onCancel, onSkip }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        // Trava a tela para desenhar sem scroll
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden'; 

        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * ratio;
            canvas.height = rect.height * ratio;
            
            const ctx = canvas.getContext('2d');
            ctx.scale(ratio, ratio);
            ctx.strokeStyle = '#000000'; 
            ctx.lineWidth = 3; 
            ctx.lineJoin = 'round'; 
            ctx.lineCap = 'round';
        }, 300);

        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e) => {
        if (e.cancelable) e.preventDefault();
        const { x, y } = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (e.cancelable) e.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (e.cancelable) e.preventDefault();
        setIsDrawing(false);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
                <div className="bg-slate-100 p-4 border-b flex justify-between items-center shrink-0">
                    <h3 className="text-slate-800 font-bold text-lg">{title}</h3>
                    <button onClick={clear} className="text-slate-500 hover:text-red-500 p-2"><Icons.Refresh /></button>
                </div>
                <div className="flex-1 bg-white relative w-full overflow-hidden cursor-crosshair touch-none">
                    <canvas 
                        ref={canvasRef}
                        className="w-full h-full block touch-none"
                        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                    />
                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none text-slate-200 text-3xl font-black opacity-20 uppercase select-none">
                        Assine Aqui
                    </div>
                </div>
                <div className="bg-slate-50 p-4 border-t flex gap-3 shrink-0">
                    <button onClick={onCancel} className="flex-1 py-3 font-semibold text-slate-500 hover:bg-slate-200 rounded-lg">Voltar</button>
                    {onSkip && (
                        <button onClick={onSkip} className="flex-1 py-3 font-semibold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1">
                            <Icons.Skip size={16}/> Pular
                        </button>
                    )}
                    <button onClick={() => onSave(canvasRef.current.toDataURL())} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
function App() {
    const [view, setView] = useState('form');
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Estado inicial do formulário
    const initialFormState = {
        controlNumber: '', 
        branch: SAAM_BRANCHES[0], 
        vesselName: '', 
        enginePosition: '',
        engineModel: '', 
        engineSerial: '', 
        maintenanceType: MAINTENANCE_TYPES[0], 
        maintenanceTypeOther: '',
        technicianName: '', 
        startDate: new Date().toISOString().split('T')[0], 
        startTime: '08:00',
        endDate: new Date().toISOString().split('T')[0], 
        endTime: '17:00',
        tasksExecuted: '', 
        notes: '', 
        runningHours: '', 
        photos: [], 
        parts: [], 
        technicianSignature: null, 
        clientSignature: null
    };

    const [formData, setFormData] = useState(initialFormState);
    const [newPart, setNewPart] = useState({ name: '', qty: '1', source: 'Retiblocos' });

    // Remove loading screen quando o React monta
    useEffect(() => {
        const loader = document.getElementById('loading-screen');
        if(loader) loader.style.display = 'none';
    }, []);

    // FIREBASE AUTH
    useEffect(() => {
        signInAnonymously(auth).catch(console.error);
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    // FIREBASE LISTENER (Busca relatórios salvos)
    useEffect(() => {
        if (!user) return;
        // Query simples ordenada por data
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'reports'), orderBy('savedAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(list);
        }, (error) => {
            console.error("Erro ao buscar relatórios:", error);
        });
        return () => unsubscribe();
    }, [user]);

    // SALVAR NA NUVEM
    const saveToCloud = async () => {
        if (!user) return alert("Aguarde a conexão com o servidor...");
        setIsSaving(true);
        try {
            const docData = { ...formData, savedAt: new Date().toISOString() };
            
            // Verifica tamanho aproximado (Firestore aceita max 1MB)
            const jsonSize = new Blob([JSON.stringify(docData)]).size;
            if (jsonSize > 900000) {
                alert("O relatório está muito grande (muitas fotos). Tente reduzir a quantidade de fotos para salvar na nuvem.");
                setIsSaving(false);
                return;
            }

            if (formData.id) {
                await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reports', formData.id), docData);
                alert("Atualizado com sucesso!");
            } else {
                const ref = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reports'), docData);
                setFormData(prev => ({ ...prev, id: ref.id }));
                alert("Salvo com sucesso!");
            }
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar. Verifique sua conexão.");
        } finally {
            setIsSaving(false);
        }
    };

    const loadReport = (report) => {
        setFormData(report);
        setShowSidebar(false);
        setView('form');
    };

    const deleteReport = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Apagar este relatório da nuvem?")) return;
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reports', id));
        } catch (e) { alert("Erro ao apagar."); }
    };

    // Atualiza título da página
    useEffect(() => {
        if (formData.vesselName && formData.startDate) {
            const cleanVessel = formData.vesselName.replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase();
            document.title = `${cleanVessel} - ${formData.enginePosition || 'NA'} - ${formData.startDate}`;
        } else {
            document.title = "Relatório Técnico - Retiblocos";
        }
    }, [formData.vesselName, formData.startDate, formData.enginePosition]);

    // --- HANDLERS (FOTOS, PEÇAS, ASSINATURAS) ---
    const handlePhotoUpload = (e) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                // Resize image before saving to avoid Firestore limits logic could go here
                // For now, simple base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        photos: [...prev.photos, { id: Date.now() + Math.random(), url: reader.result, caption: '' }]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const addPart = () => { if (!newPart.name) return; setFormData(prev => ({ ...prev, parts: [...prev.parts, { ...newPart, id: Date.now() }] })); setNewPart({ name: '', qty: '1', source: 'Retiblocos' }); };
    const removePart = (id) => setFormData(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== id) }));
    const removePhoto = (id) => setFormData(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));
    const updateCaption = (id, text) => setFormData(prev => ({ ...prev, photos: prev.photos.map(p => p.id === id ? { ...p, caption: text } : p) }));
    const calculateDuration = () => {
        const start = new Date(`${formData.startDate}T${formData.startTime}`); const end = new Date(`${formData.endDate}T${formData.endTime}`);
        const diffMs = end - start; if (diffMs < 0) return "--";
        const diffHrs = Math.floor(diffMs / 3600000); const diffMins = Math.round(((diffMs % 3600000) / 60000));
        return diffMins === 0 ? `${diffHrs}h` : `${diffHrs}h ${diffMins}min`;
    };
    const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR');
    const isFormValid = () => formData.vesselName && formData.technicianName;

    // --- RENDER ---
    return (
        <div className="min-h-screen">
            {/* ... (O restante do JSX é identico ao anterior, mas agora dentro do arquivo separado) ... */}
            
            {/* HEADER */}
            <div className="no-print bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-lg">
                <div className="max-w-2xl mx-auto p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('form')}>
                        <div className="bg-orange-600 w-8 h-8 rounded flex items-center justify-center font-black text-white text-xs">RB</div>
                        <span className="font-bold text-sm text-white uppercase tracking-wider hidden sm:block">App</span>
                    </div>
                    <div className="flex gap-2">
                        {view === 'form' && (
                            <>
                                <button onClick={() => setShowSidebar(true)} className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 flex items-center gap-2">
                                    <Icons.List size={18} />
                                    <span className="text-xs font-bold hidden sm:inline">Relatórios</span>
                                </button>
                                <button onClick={saveToCloud} disabled={isSaving} className={`p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 ${isSaving ? 'opacity-50' : ''}`}>
                                    {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Icons.Cloud size={18} />}
                                    <span className="text-xs font-bold hidden sm:inline">Salvar</span>
                                </button>
                            </>
                        )}
                        {view === 'preview' && <button onClick={() => setView('form')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-slate-200">Editar</button>}
                    </div>
                </div>
            </div>

            {/* SIDEBAR */}
            <div className={`no-print fixed inset-0 z-50 transition-opacity duration-300 ${showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSidebar(false)}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 flex flex-col ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                        <h3 className="font-bold text-white flex items-center gap-2"><Icons.Cloud size={20} className="text-blue-500"/> Nuvem</h3>
                        <button onClick={() => setShowSidebar(false)} className="text-slate-400 hover:text-white"><Icons.Close/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {reports.length === 0 ? <p className="text-slate-500 text-center text-sm mt-10">Vazio.</p> : reports.map(rep => (
                            <div key={rep.id} onClick={() => loadReport(rep)} className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-orange-500 cursor-pointer group">
                                <div className="flex justify-between">
                                    <h4 className="font-bold text-white text-sm uppercase">{rep.vesselName}</h4>
                                    <button onClick={(e) => deleteReport(e, rep.id)} className="text-slate-600 hover:text-red-500"><Icons.Trash size={14}/></button>
                                </div>
                                <p className="text-xs text-slate-400">{rep.enginePosition} • {new Date(rep.startDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-700 bg-slate-800">
                        <button onClick={() => { setFormData(initialFormState); setShowSidebar(false); }} className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"><Icons.Plus size={16}/> Novo</button>
                    </div>
                </div>
            </div>

            {/* FORMULÁRIO */}
            {view === 'form' && (
                <div className="no-print max-w-2xl mx-auto p-4 space-y-8 fade-in pb-32">
                    {/* ... (Seções do formulário: Info, Intervenção, Textos, Peças, Fotos) ... */}
                    {/* Vou resumir aqui, mas o código completo mantém a estrutura do React anterior */}
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2">Informações</h3>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 text-orange-400 font-bold uppercase" placeholder="Nº Controle (EX: 1442)" value={formData.controlNumber} onChange={e => setFormData({...formData, controlNumber: e.target.value})} />
                        
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
                            {SAAM_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>

                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 uppercase font-bold" placeholder="Embarcação" value={formData.vesselName} onChange={e => setFormData({...formData, vesselName: e.target.value})} />
                            <input list="models" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" placeholder="Modelo Motor" value={formData.engineModel} onChange={e => setFormData({...formData, engineModel: e.target.value})} />
                            <datalist id="models"><option value="Caterpillar C32"/><option value="Caterpillar 3512"/><option value="Deutz 620"/><option value="MTU 4000"/><option value="C4.4"/></datalist>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 uppercase" placeholder="Série" value={formData.engineSerial} onChange={e => setFormData({...formData, engineSerial: e.target.value})} />
                            <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" placeholder="Horímetro" value={formData.runningHours} onChange={e => setFormData({...formData, runningHours: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {ENGINE_POSITIONS.map(p => (
                                <button key={p.id} onClick={() => setFormData({...formData, enginePosition: p.label})} className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${formData.enginePosition === p.label ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{p.short}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2">Detalhes</h3>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500" value={formData.maintenanceType} onChange={e => setFormData({...formData, maintenanceType: e.target.value})}>
                            {MAINTENANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {formData.maintenanceType === 'Outros' && (
                            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-orange-500 mt-2" placeholder="Especifique..." value={formData.maintenanceTypeOther} onChange={e => setFormData({...formData, maintenanceTypeOther: e.target.value})} />
                        )}
                        
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
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2">Fotos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {formData.photos.map(photo => (
                                <div key={photo.id} className="relative group bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                    <img src={photo.url} className="w-full h-32 object-cover" />
                                    <button onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white"><Icons.Trash size={14}/></button>
                                    <input type="text" placeholder="Legenda..." className="w-full bg-slate-900 text-[10px] p-2 text-slate-300 outline-none border-t border-slate-700" value={photo.caption} onChange={e => updateCaption(photo.id, e.target.value)} />
                                </div>
                            ))}
                            <label className="h-32 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 hover:border-orange-500 text-slate-500 hover:text-orange-500 transition-all">
                                <Icons.Plus size={24} /><span className="text-xs mt-2 font-bold">Add Foto</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
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

            {/* ASSINATURAS */}
            {view === 'sig_tech' && <SignaturePad title="Assinatura do Técnico" onSave={(d) => { setFormData(p => ({...p, technicianSignature: d})); setView('sig_client'); }} onCancel={() => setView('form')} />}
            {view === 'sig_client' && <SignaturePad title="Assinatura Cliente" onSave={(d) => { setFormData(p => ({...p, clientSignature: d})); setView('preview'); }} onSkip={() => { setFormData(p => ({...p, clientSignature: null})); setView('preview'); }} onCancel={() => setView('sig_tech')} />}

            {/* PREVIEW TELA FINAL */}
            {view === 'preview' && (
                <div className="no-print p-6 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-sm mx-auto space-y-6 fade-in">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 mb-2"><Icons.Check size={40} className="text-white"/></div>
                    <div><h2 className="text-2xl font-bold text-white mb-1">Pronto!</h2><p className="text-slate-400 text-sm">O que deseja fazer?</p></div>
                    <div className="w-full space-y-3">
                        <button onClick={() => window.print()} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 border-b-4 border-slate-300 active:border-0 active:translate-y-1"><Icons.Save size={20}/> Baixar PDF</button>
                        <button onClick={saveToCloud} disabled={isSaving} className={`w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold py-4 rounded-xl border border-slate-700 flex items-center justify-center gap-3 border-b-4 border-slate-900 active:border-0 active:translate-y-1 ${isSaving ? 'opacity-50' : ''}`}>
                            {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <Icons.Cloud size={20} />} Atualizar Nuvem
                        </button>
                    </div>
                    <button onClick={() => setView('form')} className="text-slate-500 text-sm hover:text-white underline">Voltar</button>
                </div>
            )}

            {/* LAYOUT DE IMPRESSÃO (PDF) */}
            <div className="print-only print-container bg-white text-slate-900 relative">
                <div className="flex justify-between items-start border-b-4 border-orange-500 pb-2 mb-4">
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-logo retiblocos-logo uppercase leading-none mt-1">RETIBLOCOS</h1>
                        <div className="retiblocos-sub text-xs tracking-[0.2em] px-1 py-0.5 mt-1 rounded-sm w-fit uppercase">Retífica de Peças e Motores</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nº Controle</div>
                        <div className="text-xl font-bold uppercase text-orange-600 leading-tight font-mono">{formData.controlNumber || '0000'}</div>
                        <div className="mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cliente</div>
                        <div className="text-sm font-bold uppercase text-slate-800 leading-tight">{formData.branch.split(' - ')[0]}</div>
                    </div>
                </div>

                <div className="flex bg-slate-100 rounded border-l-4 border-orange-600 mb-4 p-2 items-center justify-between">
                    <div><span className="text-[9px] uppercase font-bold text-slate-500 block">Tipo de Serviço</span><span className="font-bold text-slate-900 text-sm">{formData.maintenanceType === 'Outros' ? (formData.maintenanceTypeOther || 'Outros') : formData.maintenanceType}</span></div>
                    <div className="text-right"><span className="text-[9px] uppercase font-bold text-slate-500 block">Período</span><div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-800"><span>{formatDate(formData.startDate)} {formData.startTime}</span><span className="text-orange-400">➜</span><span>{formatDate(formData.endDate)} {formData.endTime}</span></div><div className="text-[9px] font-bold text-orange-600 mt-0.5">Duração: {calculateDuration()}</div></div>
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
                    {formData.notes && <div><h3 className="font-bold text-slate-900 uppercase border-l-4 border-blue-400 pl-2 py-0.5 mb-1 text-[11px] bg-blue-50">2. Observações</h3><p className="text-justify text-[11px] leading-snug whitespace-pre-wrap italic text-slate-600 pl-3">{formData.notes}</p></div>}
                </div>

                {formData.parts.length > 0 && (
                    <div className="mt-4 break-inside-avoid">
                        <h3 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2 text-[10px]">Peças e Materiais</h3>
                        <table className="w-full text-[10px] border border-slate-200 rounded overflow-hidden">
                            <thead className="bg-slate-800 text-white"><tr><th className="p-1 w-10 text-center">QTD</th><th className="p-1 text-left">DESCRIÇÃO</th><th className="p-1 text-right w-24">FONTE</th></tr></thead>
                            <tbody>{formData.parts.map((p, i) => (<tr key={i} className={i%2===0?'bg-white':'bg-slate-50'}><td className="p-1 border-b text-center font-bold">{p.qty}</td><td className="p-1 border-b font-bold text-slate-700">{p.name}</td><td className="p-1 border-b text-right"><span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${p.source==='Retiblocos'?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>{p.source}</span></td></tr>))}</tbody>
                        </table>
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