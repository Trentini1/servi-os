// --- LÓGICA DO CALENDÁRIO (js/calendar.js) ---

const { useState, useMemo } = React;

window.CalendarView = ({ reports, schedules, onDateClick, onAddSchedule }) => {
    const Icons = window.Icons; 

    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState('all'); // 'all', 'reports', 'schedules'
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 1. Processa todos os eventos (Lidando com Arrays de Datas dos Laudos Novos e Velhos)
    const allEvents = useMemo(() => {
        const events = [];
        
        if (filter === 'all' || filter === 'reports') {
            reports.forEach(r => {
                if (r.executionPeriods && r.executionPeriods.length > 0) {
                    r.executionPeriods.forEach((period, pIndex) => {
                        events.push({
                            date: period.date,
                            title: r.vesselName || 'S/N',
                            time: `${period.startTime} - ${period.endTime}`,
                            type: 'report',
                            id: `${r.id}-${pIndex}`, 
                            data: r
                        });
                    });
                } 
                else if (r.startDate) {
                    events.push({ 
                        date: r.startDate, 
                        title: r.vesselName || 'S/N', 
                        time: r.startTime || '--:--',
                        type: 'report', 
                        id: r.id,
                        data: r
                    });
                }
            });
        }
        
        if (filter === 'all' || filter === 'schedules') {
            schedules.forEach(s => {
                if (s.date) {
                    events.push({ 
                        date: s.date, 
                        title: s.vesselName || 'S/N', 
                        time: 'Previsto',
                        type: 'schedule', 
                        id: s.id, 
                        ...s 
                    });
                }
            });
        }
        
        // Ordena por data
        return events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [reports, schedules, filter]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // Pega só os eventos que caem no mês atual (para o resumo e lista)
    const currentMonthEvents = useMemo(() => {
        const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        return allEvents.filter(e => e.date.startsWith(monthPrefix));
    }, [allEvents, year, month]);

    const reportsCount = currentMonthEvents.filter(e => e.type === 'report').length;
    const schedulesCount = currentMonthEvents.filter(e => e.type === 'schedule').length;

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // --- RENDERIZAÇÃO DO GRID DO CALENDÁRIO ---
    const renderDays = () => {
        const days = [];
        const totalCells = 42; // 6 linhas de 7 dias

        for (let i = 0; i < totalCells; i++) {
            if (i < firstDayOfMonth) {
                // Dias do mês anterior
                const prevDay = daysInPrevMonth - firstDayOfMonth + i + 1;
                days.push(
                    <div key={`prev-${i}`} className="min-h-[90px] sm:min-h-[110px] bg-slate-800/20 p-2 border-r border-b border-slate-700/30 flex flex-col opacity-30 pointer-events-none">
                        <span className="text-[11px] font-bold text-slate-500 self-end">{prevDay}</span>
                    </div>
                );
            } 
            else if (i >= firstDayOfMonth && i < firstDayOfMonth + daysInMonth) {
                // Dias do mês atual
                const day = i - firstDayOfMonth + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = allEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === todayStr;

                days.push(
                    <div 
                        key={`current-${day}`} 
                        onClick={() => onDateClick(dateStr, dayEvents)} 
                        className={`min-h-[90px] sm:min-h-[110px] cursor-pointer p-1.5 sm:p-2 border-r border-b border-slate-700/50 hover:bg-slate-700/40 transition-all flex flex-col relative group overflow-hidden
                            ${isToday ? 'bg-slate-800 ring-1 ring-inset ring-orange-500 shadow-[inset_0_0_15px_rgba(234,88,12,0.15)]' : 'bg-slate-800/60'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-1.5 w-full">
                            {/* Indicador de Lote/Qtd (Mobile) */}
                            <div className="flex gap-1">
                                {dayEvents.length > 2 && (
                                    <span className="text-[8px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-sm font-bold">
                                        +{dayEvents.length - 2}
                                    </span>
                                )}
                            </div>
                            
                            {/* Número do Dia */}
                            <span className={`text-[11px] sm:text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shrink-0
                                ${isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/50' : 
                                  dayEvents.length > 0 ? 'text-slate-100 bg-slate-700/50' : 'text-slate-500 group-hover:text-slate-300'}`
                            }>
                                {day}
                            </span>
                        </div>

                        {/* Pílulas de Eventos */}
                        <div className="flex flex-col gap-1 w-full flex-1 overflow-hidden">
                            {dayEvents.slice(0, 2).map((ev, idx) => (
                                <div 
                                    key={idx} 
                                    className={`px-1.5 py-1 rounded text-[9px] sm:text-[10px] font-bold truncate border-l-2 flex items-center shadow-sm
                                        ${ev.type === 'report' ? 'bg-green-500/10 text-green-400 border-green-500' : 'bg-orange-500/10 text-orange-400 border-orange-500'}
                                    `}
                                    title={ev.title}
                                >
                                    <span className="truncate uppercase">{ev.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } 
            else {
                // Dias do próximo mês
                const nextDay = i - (firstDayOfMonth + daysInMonth) + 1;
                days.push(
                    <div key={`next-${i}`} className="min-h-[90px] sm:min-h-[110px] bg-slate-800/20 p-2 border-r border-b border-slate-700/30 flex flex-col opacity-30 pointer-events-none">
                        <span className="text-[11px] font-bold text-slate-500 self-end">{nextDay}</span>
                    </div>
                );
            }
        }
        return days;
    };

    return (
        <div className="space-y-6 fade-in pb-20">
            
            {/* MINI DASHBOARD DO MÊS */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Agendados</p>
                        <p className="text-2xl font-black text-orange-500 leading-none">{schedulesCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Icons.Clock size={20}/>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Laudos Salvos</p>
                        <p className="text-2xl font-black text-green-500 leading-none">{reportsCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <Icons.Check size={20}/>
                    </div>
                </div>
            </div>

            {/* BARRA DE NAVEGAÇÃO DO CALENDÁRIO */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 border-b border-slate-700 bg-slate-900/60">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <button onClick={prevMonth} className="p-2.5 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 rounded-xl text-slate-300 transition-colors border border-slate-700 shadow-sm"><Icons.ChevronLeft size={20}/></button>
                        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 capitalize w-48 text-center">{monthName}</h2>
                        <button onClick={nextMonth} className="p-2.5 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 rounded-xl text-slate-300 transition-colors border border-slate-700 shadow-sm"><Icons.ChevronRight size={20}/></button>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={goToToday} className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors uppercase tracking-wider shadow-sm">
                            Ir para Hoje
                        </button>
                        <button onClick={onAddSchedule} className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-900/30 transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
                            <Icons.Plus size={14}/> Novo
                        </button>
                    </div>
                </div>

                {/* FILTROS */}
                <div className="flex gap-2 p-3 bg-slate-800 overflow-x-auto hide-scrollbar border-b border-slate-700">
                    <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filter === 'all' ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>Visualizar Tudo</button>
                    <button onClick={() => setFilter('schedules')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${filter === 'schedules' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Icons.Clock size={12}/> Apenas Agendados</button>
                    <button onClick={() => setFilter('reports')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${filter === 'reports' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Icons.Check size={12}/> Apenas Executados</button>
                </div>
                
                {/* O GRID EM SI */}
                <div className="grid grid-cols-7 bg-slate-900/80">
                    {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d, index) => (
                        <div key={d} className={`text-center py-3 text-[10px] sm:text-xs uppercase font-black tracking-widest border-r border-b border-slate-700/50 ${index === 0 || index === 6 ? 'text-slate-500 bg-slate-800/30' : 'text-slate-400'}`}>
                            {d}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 bg-slate-900 border-l border-slate-700/50 rounded-b-2xl overflow-hidden">
                    {renderDays()}
                </div>
            </div>

            {/* LISTA RESUMO (A GRANDE NOVIDADE) */}
            <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Icons.Layers size={16}/> Resumo em Lista - {monthName}
                </h3>
                
                <div className="space-y-3">
                    {currentMonthEvents.length === 0 ? (
                        <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-500 text-sm">
                            Nenhum serviço registrado para este mês.
                        </div>
                    ) : (
                        currentMonthEvents.map((ev, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => onDateClick(ev.date, [ev])}
                                className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-slate-500 cursor-pointer transition-all flex items-center gap-4 group shadow-md"
                            >
                                {/* Data em Quadrado */}
                                <div className="bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center w-14 shrink-0 border border-slate-700 group-hover:border-slate-500 transition-colors">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-1">
                                        {new Date(ev.date).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                                    </span>
                                    <span className="text-lg font-black text-white leading-none">
                                        {ev.date.split('-')[2]}
                                    </span>
                                </div>

                                {/* Info do Evento */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider
                                            ${ev.type === 'report' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}
                                        `}>
                                            {ev.type === 'report' ? 'Realizado' : 'Agendado'}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono hidden sm:inline">{ev.time}</span>
                                    </div>
                                    <h4 className="font-bold text-white text-base truncate uppercase tracking-tight">{ev.title}</h4>
                                    {ev.description && <p className="text-xs text-slate-400 truncate mt-0.5">{ev.description}</p>}
                                </div>

                                {/* Ícone de Ação */}
                                <div className="text-slate-500 group-hover:text-white transition-colors shrink-0 pr-2">
                                    <Icons.ChevronRight size={20}/>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; } 
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};
