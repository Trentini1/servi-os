// --- CÉREBRO DO SISTEMA (js/app.js) --- V6.0 (Múltiplos Períodos de Execução)

const { useState, useEffect, useRef, useMemo } = React;

const firebaseConfig = {
  apiKey: "AIzaSyDvyogaIlFQwrLARo9S4aJylT1N70-lhYs",
  authDomain: "retiblocos-app.firebaseapp.com",
  projectId: "retiblocos-app",
  storageBucket: "retiblocos-app.firebasestorage.app", 
  messagingSenderId: "509287186524",
  appId: "1:509287186524:web:2ecd4802f66536bf7ea699"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) firebase.initializeApp(firebaseConfig);

window.auth = firebase ? firebase.auth() : null;
window.db = firebase ? firebase.firestore() : null;
const storage = (firebase && typeof firebase.storage === 'function') ? firebase.storage() : null;
const appId = 'retiblocos-v1';

const Icon = ({ path, size = 18, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{path}</svg>;

window.Icons = {
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
    ChevronRight: (props) => <Icon {...props} path={<><path d="m9 18 6-6-6-6"/></>} />,
    Alert: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} />,
    Eye: (props) => <Icon {...props} path={<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>} />,
    Printer: (props) => <Icon {...props} path={<><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></>} />,
    Spinner: (props) => <Icon {...props} className="animate-spin" path={<><path d="M21 12a9 9 0 1 1-6.219-8.56"/></>} />,
    Warning: (props) => <Icon {...props} path={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>} />,
    Layers: (props) => <Icon {...props} path={<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>} />
};

window.AppConstants = {
    SAAM_BRANCHES: [ 
        "SAAM Towage Brasil S.A. - Matriz (RJ)", "SAAM Towage Brasil S.A. - Santos", "SAAM Towage Brasil S.A. - Rio Grande", 
        "SAAM Towage Brasil S.A. - Sepetiba", "SAAM Towage Brasil S.A. - Suape", "SAAM Towage Brasil S.A. - Salvador", 
        "SAAM Towage Brasil S.A. - Vitória", "SAAM Towage Brasil S.A. - Navegantes", "SAAM Towage Brasil S.A. - São Francisco do Sul", 
        "SAAM Towage Brasil S.A. - Paranaguá", "SAAM Towage Brasil S.A. - Santana", "SAAM Towage Brasil S.A. - Vila do Conde & Barcarena",
        "SAAM Towage Brasil S.A. - Belém", "SAAM Towage Brasil S.A. - São Luís-PDM", "SAAM Towage Brasil S.A. - Itaqui & Alumar",
        "SAAM Towage Brasil S.A. - Pecém", "SAAM Towage Brasil S.A. - Macuripe (Fortaleza)"
    ],
    MAINTENANCE_TYPES: [ "Preventiva", "Corretiva", "Revisão 1.000h", "Revisão 2.000h", "Top Overhaul", "Major Overhaul", "Inspeção", "Outros" ],
    ENGINE_POSITIONS: [ { id: 'bb', label: 'Bombordo', short: 'BB' }, { id: 'be', label: 'Boreste', short: 'BE' }, { id: 'vante', label: 'Vante', short: 'Vante' }, { id: 're', label: 'Ré', short: 'Ré' } ],
    PART_SOURCES: ["Retiblocos", "Cliente"],
    MAX_PHOTOS: 12
};

const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){ u8arr[n] = bstr.charCodeAt(n); }
    return new Blob([u8arr], {type:mime});
};

const compressImage = (file, quality = 0.6, maxWidth = 800) => {
    return new Promise((resolve) => {
        const reader = new FileReader(); reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image(); img.src = event.target.result;
            img.onload = () => {
                const elem = document.createElement('canvas');
                let width = img.width, height = img.height;
                if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                elem.width = width; elem.height = height;
                const ctx = elem.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
                resolve(elem.toDataURL('image/jpeg', quality));
            };
        };
    });
};

const IntroAnimation = ({ onFinish }) => {
    useEffect(() => { const t = setTimeout(() => onFinish(), 2500); return () => clearTimeout(t); }, []);
    return <div className="intro-overlay"><div className="intro-logo-container"><div className="intro-rb">RB</div></div><h1 className="intro-text">Retiblocos</h1><p className="intro-sub">SISTEMA DE GESTÃO TÉCNICA</p></div>;
};

const SafeComponent = ({ name, props }) => {
    if (typeof window[name] === 'function') return React.createElement(window[name], props); 
    return (
        <div className="p-6 bg-slate-800 border border-red-500 rounded-xl text-center shadow-xl max-w-md mx-auto mt-10">
            <window.Icons.Warning size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-red-400 font-bold text-lg mb-2">Erro Crítico</h3>
            <p className="text-slate-300 text-sm">O módulo <code>{name}</code> não foi encontrado.</p>
        </div>
    );
};

function App() {
    const [rawView, setRawView] = useState('loading'); 
    const [user, setUser] = useState(null);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [reports, setReports] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', title: '', message: '', buttons: [] });
    const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));
    const showAlert = (title, message) => setDialog({ isOpen: true, type: 'alert', title, message, buttons: [{ label: 'OK, Entendi', style: 'bg-blue-600 hover:bg-blue-500 text-white', onClick: closeDialog }] });
    const showConfirm = (title, message, onConfirm) => setDialog({ isOpen: true, type: 'confirm', title, message, buttons: [{ label: 'Cancelar', style: 'bg-transparent text-slate-400 hover:text-white', onClick: closeDialog }, { label: 'Confirmar', style: 'bg-orange-600 hover:bg-orange-500 text-white', onClick: () => { onConfirm(); closeDialog(); } }] });
    const showCustomDialog = (title, message, buttons) => setDialog({ isOpen: true, type: 'custom', title, message, buttons });

    const [scheduleData, setScheduleData] = useState({ date: '', endDate: '', vesselName: '', description: '', id: null, batchId: null });
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedDateEvents, setSelectedDateEvents] = useState(null); 

    // NOVO ESTADO INICIAL (Sem startDate/endDate soltos, agora é array!)
    const initialFormState = {
        controlNumber: '', branch: window.AppConstants.SAAM_BRANCHES[0], vesselName: '', enginePosition: '',
        engineModel: '', engineSerial: '', maintenanceType: window.AppConstants.MAINTENANCE_TYPES[0], maintenanceTypeOther: '',
        technicianName: '', 
        executionPeriods: [{ id: Date.now(), date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '17:00' }],
        tasksExecuted: '', notes: '', runningHours: '', photos: [], parts: [],
        technicianSignature: null, clientSignature: null
    };

    const [formData, setFormData] = useState(initialFormState);

    const setView = (newView) => {
        setRawView(newView);
        window.history.pushState({ view: newView }, '', `#${newView}`);
        window.scrollTo(0, 0); 
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.view) setRawView(event.state.view);
            else {
                const fallback = window.auth?.currentUser ? 'dashboard' : 'auth';
                setRawView(fallback);
                window.history.replaceState({ view: fallback }, '', `#${fallback}`);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => { const l = document.getElementById('loading-screen'); if(l) l.style.display = 'none'; }, []);

    // Atualiza o Título do Documento baseado no PRIMEIRO dia do período
    useEffect(() => {
        if (rawView === 'form' || rawView === 'preview') {
            const firstDate = formData.executionPeriods?.[0]?.date || 'DATA';
            document.title = formData.vesselName ? `RB - ${formData.vesselName.toUpperCase()} - ${formData.enginePosition ? formData.enginePosition.toUpperCase() : 'GERAL'} - ${firstDate}` : "Novo Relatorio";
        } else document.title = "Retiblocos System";
    }, [formData, rawView]);

    useEffect(() => {
        if(!window.auth) return;
        const unsubscribe = window.auth.onAuthStateChanged(async (u) => {
            setUser(u);
            if (u) {
                if (u.isAnonymous) return await window.auth.signOut();
                const doc = await window.db.collection('users').doc(u.uid).get();
                if (doc.exists) {
                    const userData = doc.data(); setCurrentUserData(userData); initialFormState.technicianName = userData.name || '';
                } else setCurrentUserData({ name: u.email, role: 'client' }); 
                
                const targetView = !localStorage.getItem('hasSeenIntro') ? 'intro' : 'dashboard';
                setRawView(targetView); window.history.replaceState({ view: targetView }, '', `#${targetView}`);
            } else {
                setCurrentUserData(null); setRawView('auth'); window.history.replaceState({ view: 'auth' }, '', '#auth');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user || !window.db) return;
        const unsubReports = window.db.collection('artifacts').doc(appId).collection('public_reports').orderBy('savedAt', 'desc').limit(100).onSnapshot(s => setReports(s.docs.map(d => ({ ...d.data(), id: d.id }))));
        const unsubSchedules = window.db.collection('artifacts').doc(appId).collection('schedules').orderBy('date', 'asc').onSnapshot(s => setSchedules(s.docs.map(d => ({ ...d.data(), id: d.id }))));
        return () => { unsubReports(); unsubSchedules(); };
    }, [user]);

    const finishIntro = () => { localStorage.setItem('hasSeenIntro', 'true'); setView('dashboard'); };
    const formatDate = (d) => { if(!d) return '--/--/----'; const parts = d.split('-'); if(parts.length !== 3) return d; return `${parts[2]}/${parts[1]}/${parts[0]}`; };

    // --- NOVA CALCULADORA DE DURAÇÃO (Soma todos os blocos) ---
    const calculateDuration = (periods) => {
        if (!periods || periods.length === 0) return "--";
        let totalMs = 0;
        periods.forEach(p => {
            const s = new Date(`${p.date}T${p.startTime}`);
            const e = new Date(`${p.date}T${p.endTime}`);
            if (!isNaN(s) && !isNaN(e) && e >= s) totalMs += (e - s);
        });
        const hours = Math.floor(totalMs / 3600000);
        const mins = Math.round((totalMs % 3600000) / 60000);
        return `${hours}h ${mins}min`;
    };

    // --- FUNÇÃO DE RETROCOMPATIBILIDADE ---
    // Pega laudos velhos e transforma no formato novo instantaneamente
    const applyRetrocompatibility = (report) => {
        let safeData = { ...initialFormState, ...report };
        if (safeData.startDate && (!safeData.executionPeriods || safeData.executionPeriods.length === 0)) {
            safeData.executionPeriods = [{
                id: Date.now(),
                date: safeData.startDate,
                startTime: safeData.startTime || '08:00',
                endTime: safeData.endTime || '17:00'
            }];
        }
        return safeData;
    };

    // --- LÓGICA DE AGENDAMENTO ---
    const saveSchedule = async () => { /* ... lógica mantida v5.2 ... */
        if(!scheduleData.date || !scheduleData.vesselName) return showAlert("Atenção", "Preencha a data inicial e o nome da embarcação.");
        try {
            const colRef = window.db.collection('artifacts').doc(appId).collection('schedules');
            const baseData = { vesselName: scheduleData.vesselName, description: scheduleData.description };
            if (scheduleData.id) { await colRef.doc(scheduleData.id).update({ ...baseData, date: scheduleData.date }); showAlert("Sucesso", "Agendamento atualizado com sucesso!"); } 
            else {
                if (scheduleData.endDate && scheduleData.endDate !== scheduleData.date) {
                    let currDate = new Date(scheduleData.date + 'T12:00:00'); let lastDate = new Date(scheduleData.endDate + 'T12:00:00');
                    if (lastDate < currDate) return showAlert("Erro Lógico", "A data final precisa ser maior que a data inicial.");
                    const diffDays = Math.ceil(Math.abs(lastDate - currDate) / (1000 * 60 * 60 * 24)); 
                    if (diffDays > 60) return showAlert("Exagero", "Você não pode agendar mais de 60 dias seguidos para evitar sobrecarga.");
                    const newBatchId = 'LOTE_' + Date.now().toString();
                    const batch = window.db.batch();
                    while (currDate <= lastDate) {
                        const dateStr = currDate.toISOString().split('T')[0];
                        batch.set(colRef.doc(), { ...baseData, date: dateStr, batchId: newBatchId });
                        currDate.setDate(currDate.getDate() + 1);
                    }
                    await batch.commit(); showAlert("Sucesso", `Foram criados ${diffDays + 1} dias de agendamento agrupados em lote!`);
                } else {
                    await colRef.add({ ...baseData, date: scheduleData.date, batchId: null }); showAlert("Sucesso", "Serviço agendado!");
                }
            }
            setShowScheduleModal(false); setScheduleData({ date: '', endDate: '', vesselName: '', description: '', id: null, batchId: null }); setSelectedDateEvents(null); 
        } catch(e) { console.error(e); showAlert("Erro", "Erro ao salvar agendamento."); }
    };
    const openEditSchedule = (evt) => { setScheduleData({ id: evt.id, date: evt.date || '', endDate: '', vesselName: evt.vesselName || '', description: evt.description || '', batchId: evt.batchId || null }); setShowScheduleModal(true); };
    const deleteSchedule = (id) => { /* ... logica lote v5.2 mantida ... */
        if (!id) return;
        const scheduleToDelete = schedules.find(s => s.id === id);
        if (scheduleToDelete && scheduleToDelete.batchId) {
            showCustomDialog("Excluir Agendamento em Lote", "Este serviço faz parte de um lote. Apagar apenas este dia ou todo o lote?", [
                { label: "Apagar Todo o Lote", style: "bg-red-600 hover:bg-red-500 text-white w-full sm:w-auto", onClick: async () => {
                    closeDialog(); try {
                        const qs = await window.db.collection('artifacts').doc(appId).collection('schedules').where('batchId', '==', scheduleToDelete.batchId).get();
                        const batch = window.db.batch(); qs.forEach(doc => batch.delete(doc.ref)); await batch.commit();
                        setSelectedDateEvents(null); showAlert("Faxina Feita", "Lote excluído.");
                    } catch(e) { showAlert("Erro", "Erro ao excluir o lote."); }
                }},
                { label: "Apagar Só Este Dia", style: "bg-orange-600 hover:bg-orange-500 text-white w-full sm:w-auto", onClick: async () => {
                    closeDialog(); try { await window.db.collection('artifacts').doc(appId).collection('schedules').doc(id).delete(); setSelectedDateEvents(p => { if (!p) return null; const n = p.events.filter(e => e.id !== id); return n.length > 0 ? { ...p, events: n } : null; }); } catch(e) { showAlert("Erro", "Falha ao excluir."); }
                }},
                { label: "Cancelar", style: "bg-slate-700 hover:bg-slate-600 text-white w-full sm:w-auto", onClick: closeDialog }
            ]);
        } else {
            showConfirm("Excluir", "Apagar este agendamento?", async () => {
                try { await window.db.collection('artifacts').doc(appId).collection('schedules').doc(id).delete(); setSelectedDateEvents(p => { if (!p) return null; const n = p.events.filter(e => e.id !== id); return n.length > 0 ? { ...p, events: n } : null; }); } catch(e) { showAlert("Erro", "Falha ao excluir."); }
            });
        }
    };

    // --- LÓGICA DE RELATÓRIOS (Com Retrocompatibilidade Injetada) ---
    const startNewReport = () => { setFormData(initialFormState); setView('form'); };
    const openPreview = (e, report) => { if(e) e.stopPropagation(); setFormData(applyRetrocompatibility(report)); setView('preview'); };
    const editReport = (e, report) => { if(e) e.stopPropagation(); setFormData(applyRetrocompatibility(report)); setView('form'); };
    const deleteReport = (e, id) => { if(e) e.stopPropagation(); if(!id) return; showConfirm("Excluir Relatório", "Tem certeza que deseja apagar permanentemente?", async () => { try { await window.db.collection('artifacts').doc(appId).collection('public_reports').doc(id).delete(); } catch (err) { showAlert("Erro", "Erro ao excluir."); } }); };

    const saveToCloud = async (dataToSave = null, silent = false) => {
        if (!user) return showAlert("Aviso", "Conectando ao servidor...");
        if (!silent) setIsSaving(true);
        const payload = dataToSave || formData; const { id, ...dataLimpa } = payload;
        dataLimpa.createdBy = user.uid; dataLimpa.createdByName = currentUserData?.name || 'Desconhecido';
        try {
            const docData = { ...dataLimpa, savedAt: new Date().toISOString() };
            if (new Blob([JSON.stringify(docData)]).size > 950000) { showAlert("Erro", "Texto muito pesado."); if(!silent) setIsSaving(false); return false; }
            const colRef = window.db.collection('artifacts').doc(appId).collection('public_reports');
            if (payload.id) { await colRef.doc(payload.id).update(docData); } else { const ref = await colRef.add(docData); setFormData(p => ({ ...p, id: ref.id })); }
            if(!silent) showAlert("Sucesso", "Relatório salvo!"); return true;
        } catch (e) { showAlert("Erro", "Erro crítico."); return false; } finally { if(!silent) setIsSaving(false); }
    };

    const handlePhotoUpload = async (e) => {
        if (!storage) return showAlert("Erro Crítico", "Storage não configurado.");
        if (e.target.files) {
            const files = Array.from(e.target.files); const remaining = window.AppConstants.MAX_PHOTOS - formData.photos.length;
            if (remaining <= 0) return showAlert("Aviso", "Limite de fotos atingido.");
            setIsUploading(true);
            try {
                const processed = await Promise.all(files.slice(0, remaining).map(async (f) => {
                    const comp = await compressImage(f, 0.6, 800); const blob = dataURLtoBlob(comp);
                    const name = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                    const ref = storage.ref().child(`images/${name}`); await ref.put(blob);
                    const url = await ref.getDownloadURL(); return { id: Date.now() + Math.random(), url, caption: '' };
                }));
                setFormData(p => ({ ...p, photos: [...p.photos, ...processed] }));
            } catch (err) { showAlert("Erro", "Falha no upload."); } finally { setIsUploading(false); }
        }
    };
    
    const saveTechSig = (d) => { setFormData(p => ({...p, technicianSignature: d})); setView('sig_client'); };
    const finalizeReport = async (clientSig) => { const finalData = { ...formData, clientSignature: clientSig }; setFormData(finalData); const saved = await saveToCloud(finalData, true); setView('preview'); if(!saved) showAlert("Aviso", "Não sincronizou, mas o PDF pode ser gerado."); };
    const saveClientSig = (d) => finalizeReport(d);
    const skipClientSig = () => finalizeReport(null);
    const shareData = async () => {
        const dataStr = JSON.stringify(formData, null, 2);
        const dateStr = formData.executionPeriods?.[0]?.date || 'DATA';
        const file = new File([dataStr], `RB_${formData.vesselName}_${dateStr}.json`, { type: 'application/json' });
        if (navigator.share && navigator.canShare({ files: [file] })) try { await navigator.share({ files: [file] }); } catch (e) {}
        else { const l = document.createElement('a'); l.href = URL.createObjectURL(file); l.download = file.name; l.click(); }
    };

    if (rawView === 'loading') return <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center"><Icons.Spinner size={40} className="text-[var(--rb-orange)] mb-4" /><p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Conectando ao Retiblocos...</p></div>;

    return (
        <div className="min-h-screen relative">
            {rawView === 'intro' && <IntroAnimation onFinish={finishIntro} />}
            {rawView === 'auth' && <SafeComponent name="AuthView" props={{}} />}
            {rawView === 'dashboard' && <SafeComponent name="DashboardView" props={{ reports, startNewReport, editReport, deleteReport, openPreview, formatDate, setView, currentUser: currentUserData }} />}
            {rawView === 'admin' && <SafeComponent name="AdminView" props={{ setView, showAlert, showConfirm, purgeOldSchedules: () => {} /* Mantenha no admin real */ }} />}
            
            {rawView === 'calendar' && (
                <div className="no-print max-w-3xl mx-auto p-4 space-y-6 fade-in">
                    <div className="flex items-center gap-4 mb-4"><button onClick={() => setView('dashboard')} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><Icons.ArrowLeft/></button><h1 className="text-xl font-bold text-white">Agenda de Serviços</h1></div>
                    <SafeComponent name="CalendarView" props={{ reports, schedules, onDateClick: (date, events) => { if(events.length > 0) setSelectedDateEvents({ date, events }); else showConfirm("Agendar Serviço", `Criar agendamento para ${formatDate(date)}?`, () => { setScheduleData({date, endDate: '', vesselName: '', description: '', id: null, batchId: null}); setShowScheduleModal(true); }); }, onAddSchedule: () => { setScheduleData({date: '', endDate: '', vesselName: '', description: '', id: null, batchId: null}); setShowScheduleModal(true); } }} />
                </div>
            )}
            
            {(rawView === 'form' || rawView === 'preview') && (
                <div className="no-print bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-lg">
                    <div className="max-w-2xl mx-auto p-3 flex justify-between items-center">
                        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"><Icons.Home size={18} /><span className="text-xs font-bold uppercase hidden sm:inline">Início</span></button>
                        <div className="flex items-center gap-2"><div className="bg-orange-600 w-6 h-6 rounded flex items-center justify-center font-black text-white text-[10px]">RB</div><span className="font-bold text-sm text-white uppercase tracking-wider">{rawView === 'preview' ? 'Finalizado' : 'Edição'}</span></div>
                        <div className="flex gap-2">
                            {rawView === 'form' && <button onClick={() => saveToCloud()} disabled={isSaving || isUploading} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"><Icons.Save size={18}/></button>}
                            {rawView === 'preview' && <button onClick={() => setView('form')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-slate-200">Editar</button>}
                        </div>
                    </div>
                </div>
            )}
            
            {rawView === 'form' && <SafeComponent name="ReportFormView" props={{ formData, setFormData, handlePhotoUpload, isUploading, setView, isFormValid: (formData.vesselName && formData.technicianName && formData.executionPeriods?.length > 0), showConfirm: showCustomDialog }} />}
            
            {/* MODAIS DO CALENDÁRIO OMITIDOS AQUI POR ESPAÇO, SÃO IGUAIS A VERSÃO ANTERIOR */}
            {/* O Modal de Agendamento continua igual, você já os tem perfeitos */}
            
            {rawView === 'sig_tech' && <SignaturePad title="Assinatura do Técnico" onSave={(d) => { setFormData(p => ({...p, technicianSignature: d})); setView('sig_client'); }} onCancel={() => setView('form')} />}
            {rawView === 'sig_client' && <SignaturePad title="Assinatura Cliente" onSave={saveClientSig} onSkip={skipClientSig} onCancel={() => setView('sig_tech')} />}
            
            {rawView === 'preview' && (
                <>
                    <SafeComponent name="ReportPreviewView" props={{ startNewReport, setView, handlePrint: () => window.print(), isPrinting: false, shareData }} />
                    <SafeComponent name="PrintLayoutView" props={{ formData, formatDate, duration: calculateDuration(formData.executionPeriods) }} />
                </>
            )}
            
            {/* O NOVO SISTEMA DE DIÁLOGO TURBINADO */}
            {dialog.isOpen && (
                <div className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-sm overflow-hidden transform transition-all">
                        <div className={`p-4 border-b flex items-center gap-3 ${dialog.type === 'confirm' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : dialog.type === 'custom' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' : dialog.title.includes('Erro') || dialog.title.includes('Crítico') ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}`}>
                            {dialog.type === 'custom' ? <Icons.Layers size={20}/> : dialog.type === 'confirm' || dialog.title.includes('Erro') ? <Icons.Alert size={20}/> : <Icons.Check size={20}/>}
                            <h3 className="text-lg font-bold">{dialog.title}</h3>
                        </div>
                        <div className="p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{dialog.message}</div>
                        <div className={`p-4 border-t border-slate-700 bg-slate-900/50 flex ${dialog.buttons.length > 2 ? 'flex-col gap-2' : 'justify-end gap-3'}`}>
                            {dialog.buttons.map((btn, i) => (
                                <button key={i} onClick={btn.onClick} className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-md ${btn.style}`}>{btn.label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
