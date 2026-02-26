// --- MÓDULO DE ADMINISTRAÇÃO MASTER (js/admin.js) ---

const { useState, useEffect } = React;

window.AdminView = ({ setView, showAlert, showConfirm, purgeOldSchedules }) => {
    const Icons = window.Icons;
    const db = window.db;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca todos os usuários cadastrados
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

    return (
        <div className="no-print max-w-3xl mx-auto p-4 space-y-6 fade-in pb-20">
            <div className="flex items-center gap-4 py-4 border-b border-slate-800">
                <button onClick={() => setView('dashboard')} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"><Icons.ArrowLeft size={20}/></button>
                <div>
                    <h1 className="text-xl font-black text-white uppercase tracking-tight">Gestão de Acessos</h1>
                    <p className="text-slate-400 text-xs">Apenas perfil Master</p>
                </div>
            </div>

            {/* SEÇÃO: MANUTENÇÃO DE DADOS (NOVO) */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl mb-6">
                <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-2 text-orange-400">
                    <Icons.Warning size={18}/>
                    <h3 className="text-sm font-bold uppercase tracking-wider">Manutenção de Dados</h3>
                </div>
                <div className="p-5">
                    <p className="text-slate-400 text-xs mb-4">
                        O histórico não pesa no sistema, mas se quiser limpar o calendário, você pode apagar permanentemente todos os agendamentos que já passaram da data de hoje. Cuidado, essa ação não tem volta.
                    </p>
                    <button 
                        onClick={purgeOldSchedules}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        <Icons.Trash size={16}/> Limpar Agendamentos Vencidos
                    </button>
                </div>
            </div>

            {/* SEÇÃO: USUÁRIOS */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Usuários do Sistema</h3>
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">{users.length} Registros</span>
                </div>
                
                <div className="divide-y divide-slate-700/50">
                    {loading ? (
                        <div className="p-8 flex justify-center text-slate-500"><Icons.Spinner size={32}/></div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</div>
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
                                    <button 
                                        onClick={() => changeRole(u.id, 'client')}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${u.role === 'client' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                    >Cliente</button>
                                    <button 
                                        onClick={() => changeRole(u.id, 'tech')}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${u.role === 'tech' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                    >Técnico</button>
                                    <button 
                                        onClick={() => changeRole(u.id, 'master')}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${u.role === 'master' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                    >Master</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
