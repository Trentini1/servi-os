// --- MÓDULO DE AUTENTICAÇÃO (js/auth.js) ---

const { useState } = React;

window.AuthView = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const Icons = window.Icons;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Fazer Login
                await window.auth.signInWithEmailAndPassword(email, password);
            } else {
                // Registrar Novo Usuário
                if (!name.trim()) throw new Error("O nome é obrigatório.");
                
                const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Salva os dados extras no banco de dados. 
                // Todo mundo que se cadastra entra como 'client' (só leitura) por padrão.
                // O Master (você) altera isso depois por segurança.
                await window.db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: 'client', // 'master', 'tech', ou 'client'
                    createdAt: new Date().toISOString()
                });
            }
        } catch (err) {
            console.error(err);
            // Tradução burra de erros comuns do Firebase
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') setError('E-mail ou senha incorretos.');
            else if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está cadastrado.');
            else if (err.code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.');
            else setError(err.message || 'Erro ao autenticar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Elementos visuais de fundo */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--rb-orange)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--rb-blue)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-lg shadow-orange-900/50 mb-4">RB</div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{isLogin ? 'Acesso ao Sistema' : 'Criar Conta'}</h2>
                    <p className="text-slate-400 text-sm mt-1">Retiblocos Gestão Técnica</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                        <Icons.Alert size={16}/> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nome Completo</label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-[var(--rb-orange)] outline-none transition-colors"
                                placeholder="Ex: Erick Silva"
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">E-mail</label>
                        <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-[var(--rb-orange)] outline-none transition-colors"
                            placeholder="seu@email.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Senha</label>
                        <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-[var(--rb-orange)] outline-none transition-colors"
                            placeholder="••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-[var(--rb-orange)] hover:bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-orange-900/30 disabled:opacity-50"
                    >
                        {loading ? <Icons.Spinner size={20} /> : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        {isLogin ? 'Não tem conta? Cadastre-se aqui' : 'Já tem conta? Faça login'}
                    </button>
                </div>
            </div>
        </div>
    );
};
