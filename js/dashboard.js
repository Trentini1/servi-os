// --- LÓGICA DO DASHBOARD (js/dashboard.js) ---

const { useState } = React;

window.DashboardView = ({ 
    reports, startNewReport, editReport, deleteReport, openPreview, formatDate, setView 
}) => {
    const Icons = window.Icons;
    
    // Estado da pesquisa isolado apenas para o Dashboard
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReports = reports.filter(r => 
        (r.vesselName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (r.controlNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="no-print max-w-3xl mx-auto p-4 space-y-6 fade-in">
            <div className="flex justify-between items-center py-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Painel de Controle</h1>
                    <p className="text-slate-400 text-sm">Bem-vindo ao sistema Retiblocos</p>
                </div>
                <div className="bg-orange-600 w-10 h-10 rounded-lg flex items-center justify-center font-black text-white">RB</div>
            </div>
            
            <button onClick={startNewReport} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between group transition-all transform hover:scale-[1.01]">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl"><Icons.Pen size={24}/></div>
                    <div className="text-left">
                        <h2 className="font-bold text-lg">Criar Novo Relatório</h2>
                        <p className="text-orange-100 text-xs">Preencher OS, peças e fotos</p>
                    </div>
                </div>
                <Icons.ArrowLeft className="rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"/>
            </button>

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
                <div className="flex justify-between items-center">
                    <h3 className="text-slate-300 font-bold uppercase text-xs tracking-wider">Histórico Recente</h3>
                    <div className="relative">
                        <Icons.Search className="absolute left-3 top-2.5 text-slate-500" size={14}/>
                        <input type="text" placeholder="Buscar..." className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-orange-500 outline-none w-40" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                </div>
                <div className="grid gap-3">
                    {filteredReports.map(rep => {
                        const isSigned = !!rep.technicianSignature;
                        return (
                            <div key={rep.id} onClick={(e) => editReport(e, rep)} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-orange-500/50 cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border flex items-center gap-1 ${isSigned ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                                        {isSigned ? <Icons.Check size={10}/> : <Icons.Alert size={10}/>}
                                        {isSigned ? 'Assinado' : 'Pendente'}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-2 pr-20">
                                    <div>
                                        <h4 className="font-bold text-white text-base uppercase">{rep.vesselName || 'SEM NOME'}</h4>
                                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase tracking-wider">{rep.controlNumber || 'S/N'}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 border-t border-slate-700/50 pt-3">
                                    <span className="flex items-center gap-1"><Icons.Clock size={12}/> {formatDate(rep.startDate)}</span>
                                    <span>•</span>
                                    <span>{rep.maintenanceType}</span>
                                </div>
                                
                                <div className="flex gap-2 mt-3">
                                    {isSigned && (
                                        <button onClick={(e) => openPreview(e, rep)} className="flex-1 py-1.5 bg-purple-600/10 text-purple-400 rounded-lg hover:bg-purple-600/20 text-xs font-bold flex items-center justify-center gap-1">
                                            <Icons.Printer size={14}/> PDF
                                        </button>
                                    )}
                                    <button onClick={(e) => editReport(e, rep)} className="flex-1 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 text-xs font-bold flex items-center justify-center gap-1">
                                        <Icons.Pen size={12}/> {isSigned ? 'Ver' : 'Editar'}
                                    </button>
                                    <button onClick={(e) => deleteReport(e, rep.id)} className="w-10 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600/20 flex items-center justify-center">
                                        <Icons.Trash size={14}/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
