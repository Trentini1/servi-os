// --- MÓDULO DE RELATÓRIOS (js/report.js) ---

const { useState } = React;

// 1. TELA DO FORMULÁRIO
window.ReportFormView = ({ 
    formData, setFormData, handlePhotoUpload, isUploading, setView, isFormValid, showConfirm 
}) => {
    const Icons = window.Icons;
    const { SAAM_BRANCHES, MAINTENANCE_TYPES, ENGINE_POSITIONS, PART_SOURCES, MAX_PHOTOS } = window.AppConstants;

    const [newPart, setNewPart] = useState({ name: '', qty: '1', source: 'Retiblocos' });

    const addPart = () => { 
        if (!newPart.name) return; 
        setFormData(prev => ({ ...prev, parts: [...prev.parts, { ...newPart, id: Date.now() }] })); 
        setNewPart({ name: '', qty: '1', source: 'Retiblocos' }); 
    };
    
    const removePart = (id) => setFormData(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== id) }));
    const removePhoto = (id) => setFormData(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));
    const updateCaption = (id, text) => setFormData(prev => ({ ...prev, photos: prev.photos.map(p => p.id === id ? { ...p, caption: text } : p) }));

    return (
        <div className="no-print max-w-2xl mx-auto p-4 space-y-8 fade-in pb-32">
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
                <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-slate-700 pb-2 flex items-center gap-2">
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
                    {isUploading ? (<div className="h-32 border-2 border-dashed border-orange-500/50 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-orange-500 animate-pulse"><Icons.Spinner size={24}/><span className="text-xs mt-2 font-bold uppercase">Enviando...</span></div>) : (<label className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${formData.photos.length >= MAX_PHOTOS ? 'border-slate-700 text-slate-600 cursor-not-allowed' : 'border-slate-700 hover:bg-slate-800 hover:border-orange-500 text-slate-500 hover:text-orange-500'}`}><Icons.Plus size={24} /><span className="text-xs mt-2 font-bold">Add Foto</span><input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={formData.photos.length >= MAX_PHOTOS}/></label>)}
                </div>
            </div>
            
            {/* Barra de Ações (Fica presa embaixo) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700 z-40">
                <div className="max-w-2xl mx-auto">
                    {formData.technicianSignature ? (
                        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-green-500">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"><Icons.Check/></div><div><p className="text-green-400 font-bold text-sm uppercase">Relatório Assinado</p><p className="text-[10px] text-slate-400">Técnico confirmou.</p></div></div>
                            <button onClick={() => showConfirm("Remover Assinatura", "Deseja remover a assinatura e desbloquear a edição do relatório?", () => setFormData({...formData, technicianSignature: null}))} className="text-red-400 hover:text-red-300 text-xs font-bold underline px-2">Remover/Corrigir</button>
                        </div>
                    ) : (
                        <button disabled={!isFormValid || isUploading} onClick={() => setView('sig_tech')} className={`w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 text-lg transition-all ${isFormValid && !isUploading ? 'bg-orange-600 text-white hover:bg-orange-500 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>{isUploading ? <><Icons.Spinner/> Aguarde...</> : <><Icons.Pen size={20} /> Assinar e Finalizar</>}</button>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. TELA DE SUCESSO / PREVIEW
window.ReportPreviewView = ({ startNewReport, setView, handlePrint, isPrinting, shareData }) => {
    const Icons = window.Icons;
    return (
        <div className="no-print p-6 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-sm mx-auto space-y-6 fade-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 mb-2"><Icons.Check size={40} className="text-white"/></div>
            <div><h2 className="text-2xl font-bold text-white mb-1">Pronto para Imprimir</h2><p className="text-slate-400 text-sm">Clique abaixo para gerar o PDF.</p></div>
            <div className="w-full space-y-3">
                <button onClick={handlePrint} disabled={isPrinting} className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 border-b-4 active:border-0 active:translate-y-1 transition-all ${isPrinting ? 'bg-purple-600 text-white border-purple-800 cursor-wait' : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'}`}>{isPrinting ? <><Icons.Spinner size={20}/> ⌛ Preparando...</> : <><Icons.Printer size={20}/> Gerar PDF / Imprimir</>}</button>
                <button onClick={shareData} className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold py-4 rounded-xl border border-slate-700 flex items-center justify-center gap-3"><Icons.Share size={20} /> Backup de Dados (JSON)</button>
            </div>
            <div className="flex gap-4 w-full pt-4"><button onClick={startNewReport} className="flex-1 py-3 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg">Novo Relatório</button><button onClick={() => setView('dashboard')} className="flex-1 py-3 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg">Ir ao Início</button></div>
        </div>
    );
};

// 3. LAYOUT DE IMPRESSÃO (O PDF REAL)
window.PrintLayoutView = ({ formData, formatDate, duration }) => {
    return (
        <div className="print-only print-container bg-white text-slate-900 relative">
            <div className="flex justify-between items-start border-b-4 border-orange-500 pb-2 mb-4">
                <div className="flex flex-col"><h1 className="text-5xl font-logo retiblocos-logo uppercase leading-none mt-1">RETIBLOCOS</h1><div className="retiblocos-sub text-xs tracking-[0.2em] px-1 py-0.5 mt-1 rounded-sm w-fit uppercase">Retífica de Peças e Motores</div></div>
                <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nº Controle</div><div className="text-xl font-bold uppercase text-orange-600 leading-tight font-mono">{formData.controlNumber || '0000'}</div>
                    <div className="mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cliente</div><div className="text-sm font-bold uppercase text-slate-800 leading-tight">{formData.branch ? formData.branch.split(' - ')[0] : ''}</div>
                </div>
            </div>
            <div className="flex bg-slate-100 rounded border-l-4 border-orange-600 mb-4 p-2 items-center justify-between">
                <div><span className="text-[9px] uppercase font-bold text-slate-500 block">Tipo de Serviço</span><span className="font-bold text-slate-900 text-sm">{formData.maintenanceType === 'Outros' ? (formData.maintenanceTypeOther || 'Outros') : formData.maintenanceType}</span></div>
                <div className="text-right"><span className="text-[9px] uppercase font-bold text-slate-500 block">Período de Execução</span><div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-800"><span>{formatDate(formData.startDate)} {formData.startTime}</span><span className="text-orange-400">➜</span><span>{formatDate(formData.endDate)} {formData.endTime}</span></div><div className="text-[9px] font-bold text-orange-600 mt-0.5">Duração: {duration}</div></div>
            </div>
            <div className="mb-4 grid grid-cols-4 gap-2 text-[10px]">
                <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Embarcação</span><span className="block font-bold text-slate-900 uppercase">{formData.vesselName}</span></div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Motor</span><span className="block font-bold text-slate-900 uppercase">{formData.engineModel}</span></div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Posição</span><span className="block font-bold text-slate-900 uppercase">{formData.enginePosition}</span></div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50/50"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Horímetro</span><span className="block font-bold text-slate-900 font-mono">{formData.runningHours} H</span></div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50/50 col-span-4"><span className="block font-bold text-slate-400 uppercase mb-0.5 text-[8px]">Série</span><span className="block font-bold text-slate-900 font-mono uppercase">{formData.engineSerial || 'N/A'}</span></div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-slate-900 uppercase border-l-4 border-orange-500 pl-2 py-0.5 mb-1 text-[11px] bg-orange-50">1. Serviços Executados</h3>
                    <div className="text-left text-[11px] leading-snug whitespace-pre-wrap text-slate-900 pl-2 pr-6 sm:pr-8 box-border" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>{formData.tasksExecuted}</div>
                </div>
                {formData.notes && (
                    <div>
                        <h3 className="font-bold text-slate-900 uppercase border-l-4 border-blue-400 pl-2 py-0.5 mb-1 text-[11px] bg-blue-50">2. Observações</h3>
                        <p className="text-left text-[11px] leading-snug whitespace-pre-wrap italic text-slate-700 pl-2 pr-6 sm:pr-8 box-border" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>{formData.notes}</p>
                    </div>
                )}
            </div>

            {formData.parts.length > 0 && (
                <div className="mt-4 break-inside-avoid">
                    <h3 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2 text-[10px]">Relação de Peças e Materiais</h3>
                    <table className="w-full text-[10px] border border-slate-200 rounded overflow-hidden"><thead className="bg-slate-800 text-white"><tr><th className="p-1 w-10 text-center">QTD</th><th className="p-1 text-left">DESCRIÇÃO</th><th className="p-1 text-right w-24">FONTE</th></tr></thead><tbody>{formData.parts.map((p, i) => (<tr key={i} className={i%2===0?'bg-white':'bg-slate-50'}><td className="p-1 border-b text-center font-bold text-slate-900">{p.qty}</td><td className="p-1 border-b font-bold text-slate-700">{p.name}</td><td className="p-1 border-b text-right"><span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${p.source==='Retiblocos'?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>{p.source}</span></td></tr>))}</tbody></table>
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
                <div className="text-[8px] text-slate-300 uppercase text-center mt-6 font-mono">Retiblocos Retífica de Motores - Documento Digital - {formatDate(new Date().toISOString().split('T')[0])}</div>
            </div>
        </div>
    );
};
