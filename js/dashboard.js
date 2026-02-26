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
        <div className="no-print max-w-3xl mx-auto p-4 space-y-6 fade-in pb-20">
            {/* CABEÇALHO */}
            <div className="flex justify-between items-center py-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Painel de Controle</h1>
                    <p className="text-slate-400 text-sm">Bem-vindo ao sistema Retiblocos</p>
                </div>
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-orange-900/50">RB</div>
            </div>
            
            {/* BOTÃO PRINCIPAL */}
            <button onClick={startNewReport} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white p-6 rounded-2xl shadow-xl shadow-orange-900/20 flex items-center justify-between group transition-all transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><Icons.Pen size={28}/></div>
                    <div className="text-left">
                        <h2 className="font-black text-xl uppercase tracking-wide">Criar Novo Relatório</h2>
                        <p className="text-orange-100 text-sm font-medium">Preencher OS, peças, horímetro e fotos</p>
                    </div>
                </div>
                <Icons.ArrowLeft className="rotate-180 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" size={24}/>
            </button>

            {/* BOTÕES SECUNDÁRIOS */}
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setView('calendar')} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all text-left group shadow-lg">
                    <div className="bg-blue-500/10 p-2.5 rounded-xl w-fit mb-3 text-blue-400 group-hover:text-blue-300 transition-colors"><Icons.Calendar size={22}/></div>
                    <h3 className="font-bold text-white text-base">Agenda</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Programação de serviços</p>
                </button>
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-lg">
                    <div className="bg-green-500/10 p-2.5 rounded-xl w-fit mb-3 text-green-400"><Icons.Check size={22}/></div>
                    <h3 className="font-bold text-white text-base">Status</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{reports.length} Relatórios finalizados</p>
                </div>
            </div>

            {/* HISTÓRICO / PESQUISA */}
            <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                    <div>
                        <h3 className="text-slate-300 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                            <Icons.Box size={14}/> Histórico de Laudos
                        </h3>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Icons.Search className="absolute left-3 top-3 text-slate-500" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Buscar barco ou OS..." 
                            className="bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-orange-500 outline-none w-full shadow-inner placeholder:text-slate-600 transition-colors" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* LISTA REPOSICIONADA E "TOP" */}
                <div className="grid gap-4">
                    {filteredReports.length === 0 && (
                        <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                            Nenhum relatório encontrado.
                        </div>
                    )}

                    {filteredReports.map(rep => {
                        const isSigned = !!rep.technicianSignature;
                        return (
                            <div key={rep.id} onClick={(e) => editReport(e, rep)} className="bg-slate-800 p-1 rounded-2xl border border-slate-700 hover:border-slate-500 cursor-pointer group shadow-lg transition-all relative overflow-hidden">
                                
                                {/* Status Banner (Topo absoluto) */}
                                <div className={`h-1.5 w-full absolute top-0 left-0 ${isSigned ? 'bg-green-500' : 'bg-orange-500'}`}></div>

                                <div className="p-4 pt-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            {/* Etiqueta de Número de OS */}
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] bg-slate-900 text-orange-500 font-mono font-bold px-2 py-0.5 rounded border border-orange-500/20 tracking-wider">
                                                    OS: {rep.controlNumber || 'S/N'}
                                                </span>
                                                {isSigned ? (
                                                    <span className="text-[10px] text-green-400 font-bold uppercase flex items-center gap-1"><Icons.Check size={10}/> Finalizado</span>
                                                ) : (
                                                    <span className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1 animate-pulse"><Icons.Alert size={10}/> Pendente</span>
                                                )}
                                            </div>

                                            {/* Nome do Barco e Posição do Motor */}
                                            <div className="flex items-center flex-wrap gap-2">
                                                <h4 className="font-black text-white text-lg uppercase tracking-tight leading-none">
                                                    {rep.vesselName || 'SEM NOME'}
                                                </h4>
                                                {rep.enginePosition && (
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border 
                                                        ${rep.enginePosition.toUpperCase() === 'BOMBORDO' || rep.enginePosition.toUpperCase() === 'BB' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                                                        rep.enginePosition.toUpperCase() === 'BORESTE' || rep.enginePosition.toUpperCase() === 'BE' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}
                                                    >
                                                        {rep.enginePosition}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Painel de Informações Técnicas */}
                                    <div className="bg-slate-900/60 rounded-xl p-3 grid grid-cols-2 gap-2 border border-slate-700/50 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                            <div className="text-slate-500"><Icons.Box size={14}/></div>
                                            <span className="truncate font-medium">{rep.engineModel || 'Motor N/I'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                            <div className="text-slate-500"><Icons.Clock size={14}/></div>
                                            <span className="font-mono">{formatDate(rep.startDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-300 col-span-2 pt-1 border-t border-slate-700/30 mt-1">
                                            <div className="text-slate-500"><Icons.Pen size={14}/></div>
                                            <span className="truncate">{rep.maintenanceType || 'Serviço não especificado'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Botões de Ação */}
                                    <div className="flex gap-2">
                                        {isSigned && (
                                            <button 
                                                onClick={(e) => openPreview(e, rep)} 
                                                className="flex-1 py-2 bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-purple-500/20 hover:border-purple-600"
                                            >
                                                <Icons.Printer size={14}/> <span>Gerar PDF</span>
                                            </button>
                                        )}
                                        
                                        <button 
                                            onClick={(e) => editReport(e, rep)} 
                                            className="flex-1 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-blue-500/20 hover:border-blue-600"
                                        >
                                            <Icons.Pen size={14}/> <span>{isSigned ? 'Visualizar' : 'Continuar Edição'}</span>
                                        </button>
                                        
                                        <button 
                                            onClick={(e) => deleteReport(e, rep.id)} 
                                            className="w-12 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center transition-colors border border-red-500/20 hover:border-red-600"
                                            title="Excluir Relatório"
                                        >
                                            <Icons.Trash size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
