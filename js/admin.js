// --- MÓDULO DE ADMINISTRAÇÃO MASTER (js/admin.js) ---

const { useState, useEffect, useMemo } = React;

window.AdminView = ({ setView, showAlert, showConfirm, purgeOldSchedules, reports }) => {
    const Icons = window.Icons;
    const db = window.db;

    // Estado das Abas
    const [activeTab, setActiveTab] = useState('users'); // 'users' ou 'billing'

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados do Fechamento (Billing)
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // 'YYYY-MM'
    const [hourlyRates, setHourlyRates] = useState({}); // Taxa R$/hora por técnico

    useEffect(() => {
        const unsub = db.collection('users').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, error => {
            console.error(error);
            showAlert("Erro", "Sem permissão para ler usuários ou falha na conexão.");
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const changeRole = (userId, newRole) => {
        showConfirm("Alterar Acesso", `Tem certeza que deseja mudar a permissão deste usuário para ${newRole.toUpperCase()}?`, async () => {
            try {
                await db.collection('users').doc(userId).update({ role: newRole });
                showAlert("Sucesso", "Permissão atualizada.");
            } catch (err) {
                showAlert("Erro", "Falha ao atualizar permissão.");
            }
        });
    };

    // --- LÓGICA MATEMÁTICA DE FECHAMENTO ---
    const calculateTotalDecimalHours = (periods) => {
        if (!periods) return 0;
        let ms = 0;
        periods.forEach(p => {
            const s = new Date(`${p.date}T${p.startTime}`);
            const e = new Date(`${p.date}T${p.endTime}`);
            if (!isNaN(s) && !isNaN(e) && e >= s) ms += (e - s);
        });
        return ms / 3600000; // Retorna em horas decimais para poder multiplicar por R$
    };

    const formatDecimalHours = (decimal) => {
        const hours = Math.floor(decimal);
        const mins = Math.round((decimal - hours) * 60);
        return `${hours}h ${mins}min`;
    };

    const billingData = useMemo(() => {
        if (!reports || reports.length === 0) return [];
        
        // Agrupa por técnico
        const techMap = {};

        reports.forEach(report => {
            // Se for laudo velho, usa startDate. Se for novo, usa a primeira data do período.
            const mainDate = report.executionPeriods?.[0]?.date || report.startDate;
            
            // Verifica se a data do laudo cai no mês selecionado
            if (mainDate && mainDate.startsWith(selectedMonth)) {
                const techName = report.technicianName || report.createdByName || 'Desconhecido';
                
                if (!techMap[techName]) {
                    techMap[techName] = { name: techName, totalDecimalHours: 0, reportCount: 0 };
                }
                
                // Calcula as horas daquele laudo
                let laudoHours = 0;
                if (report.executionPeriods) {
                    laudoHours = calculateTotalDecimalHours(report.executionPeriods);
                } else if (report.startDate) {
                    // Fallback para laudo muito velho
                    const fakePeriod = [{date: report.startDate, startTime: report.startTime || '08:00', endTime: report.endTime || '17:00'}];
                    laudoHours = calculateTotalDecimalHours(fakePeriod);
                }

                techMap[techName].totalDecimalHours += laudoHours;
                techMap[techName].reportCount += 1;
            }
        });

        return Object.values(techMap).sort((a, b) => b.totalDecimalHours - a.totalDecimalHours);
    }, [reports, selectedMonth]);

    const updateRate = (techName, rate) => {
        setHourlyRates(prev => ({ ...prev, [techName]: Number(rate) }));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6 fade-in pb-20">
            {/* CABEÇALHO */}
            <div className="no-print flex items-center gap-4 py-4 border-b border-slate-800">
                <button onClick={() => setView('dashboard')} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"><Icons.ArrowLeft size={20}/></button>
                <div>
                    <h1 className="text-xl font-black text-white uppercase tracking-tight">Painel do Gestor</h1>
                    <p className="text-slate-400 text-xs">Controle total do sistema</p>
                </div>
            </div>

            {/* SELETOR DE ABAS */}
            <div className="no-print flex bg-slate-800 p-1 rounded-xl border border-slate-700 w-full sm:w-fit mx-auto">
                <button 
                    onClick={() => setActiveTab('users')} 
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Acessos
                </button>
                <button 
                    onClick={() => setActiveTab('billing')} 
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'billing' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <Icons.Money size={16}/> Fechamento
                </button>
            </div>

            {/* CONTEÚDO: ABA ACESSOS */}
            {activeTab === 'users' && (
                <div className="no-print space-y-6 fade-in">
                    {/* MANUTENÇÃO DE DADOS */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-2 text-orange-400">
                            <Icons.Warning size={18}/>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Manutenção de Banco</h3>
                        </div>
                        <div className="p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
                            <p className="text-slate-400 text-xs flex-1">
                                Limpe agendamentos antigos para manter o calendário organizado. Essa ação afeta apenas o calendário, os laudos não serão apagados.
                            </p>
                            <button onClick={purgeOldSchedules} className="w-full sm:w-auto px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                                <Icons.Trash size={16}/> Limpar Passado
                            </button>
                        </div>
                    </div>

                    {/* LISTA DE USUÁRIOS */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Usuários do Sistema</h3>
                            <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">{users.length} Registros</span>
                        </div>
                        
                        <div className="divide-y divide-slate-700/50">
                            {loading ? (
                                <div className="p-8 flex justify-center text-slate-500"><Icons.Spinner size={32}/></div>
                            ) : users.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">Nenhum usuário.</div>
                            ) : (
                                users.map(u => (
                                    <div key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shadow-inner shrink-0
                                                ${u.role === 'master' ? 'bg-purple-600' : u.role === 'tech' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                                                {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-white truncate">{u.name}</h4>
                                                <p className="text-xs text-slate-400 font-mono truncate">{u.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 w-full sm:w-auto shrink-0 overflow-x-auto">
                                            <button onClick={() => changeRole(u.id, 'client')} className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${u.role === 'client' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Cliente</button>
                                            <button onClick={() => changeRole(u.id, 'tech')} className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${u.role === 'tech' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Técnico</button>
                                            <button onClick={() => changeRole(u.id, 'master')} className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${u.role === 'master' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Master</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CONTEÚDO: ABA FECHAMENTO FINANCEIRO */}
            {activeTab === 'billing' && (
                <div className="space-y-6 fade-in print-container">
                    
                    {/* Controles de Tela (Ocultos no PDF) */}
                    <div className="no-print bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 items-end justify-between">
                        <div className="w-full sm:w-auto">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Mês de Referência</label>
                            <input 
                                type="month" 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white focus:border-green-500 outline-none transition-colors"
                            />
                        </div>
                        <button onClick={() => window.print()} className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 transition-all">
                            <Icons.Printer size={18}/> Imprimir PDF
                        </button>
                    </div>

                    {/* A PLANILHA QUE SERÁ IMPRESSA */}
                    <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-900 border-t-8 border-green-600 print-only-override">
                        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Retiblocos</h1>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Gestão de Equipe Técnica</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-bold text-green-700">FECHAMENTO</h2>
                                <p className="text-sm text-slate-600 font-mono mt-1">{selectedMonth.split('-').reverse().join('/')}</p>
                            </div>
                        </div>

                        {billingData.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 font-medium">
                                Nenhum laudo registrado neste mês de referência.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-800 text-slate-800 text-xs uppercase tracking-wider">
                                            <th className="py-3 px-2 font-black">Técnico</th>
                                            <th className="py-3 px-2 font-black text-center">Nº de Laudos</th>
                                            <th className="py-3 px-2 font-black text-center">Horas Trabalhadas</th>
                                            <th className="py-3 px-2 font-black text-center no-print">Valor Hora (R$)</th>
                                            <th className="py-3 px-2 font-black text-right">Pagamento Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {billingData.map(data => {
                                            const rate = hourlyRates[data.name] || 0;
                                            const payout = data.totalDecimalHours * rate;
                                            return (
                                                <tr key={data.name} className="hover:bg-slate-50">
                                                    <td className="py-4 px-2 font-bold text-slate-800">{data.name}</td>
                                                    <td className="py-4 px-2 text-center text-slate-600">{data.reportCount}</td>
                                                    <td className="py-4 px-2 text-center font-mono font-bold text-blue-700">
                                                        {formatDecimalHours(data.totalDecimalHours)}
                                                    </td>
                                                    <td className="py-4 px-2 text-center no-print w-32">
                                                        <div className="flex items-center justify-center gap-1 border border-slate-300 rounded p-1">
                                                            <span className="text-slate-400 text-xs font-bold ml-1">R$</span>
                                                            <input 
                                                                type="number" 
                                                                placeholder="0,00"
                                                                value={rate || ''}
                                                                onChange={(e) => updateRate(data.name, e.target.value)}
                                                                className="w-16 bg-transparent text-center font-bold text-slate-800 outline-none"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-right font-black text-green-700 text-lg tracking-tight">
                                                        {payout.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-800 bg-slate-50">
                                            <td className="py-4 px-2 font-black uppercase text-xs">Total Geral</td>
                                            <td className="py-4 px-2 text-center font-bold">{billingData.reduce((acc, curr) => acc + curr.reportCount, 0)}</td>
                                            <td className="py-4 px-2 text-center font-bold font-mono">
                                                {formatDecimalHours(billingData.reduce((acc, curr) => acc + curr.totalDecimalHours, 0))}
                                            </td>
                                            <td className="no-print"></td>
                                            <td className="py-4 px-2 text-right font-black text-slate-800 text-xl">
                                                {billingData.reduce((acc, curr) => acc + (curr.totalDecimalHours * (hourlyRates[curr.name] || 0)), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        <div className="mt-12 text-center text-[10px] text-slate-400 font-mono border-t border-slate-200 pt-4">
                            Relatório emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')} <br/>
                            Sistema de Gestão Técnica - Retiblocos
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body { background: white !important; }
                    .print-only-override { box-shadow: none !important; border-top: none !important; padding: 0 !important; }
                }
            `}} />
        </div>
    );
};
