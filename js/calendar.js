// --- LÓGICA DO CALENDÁRIO (js/calendar.js) ---

const { useState, useMemo } = React;

window.CalendarView = ({ reports, schedules, onDateClick, onAddSchedule }) => {
    const Icons = window.Icons; 

    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState('all'); 
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 1. Processa todos os eventos (AGORA LIDANDO COM ARRAYS DE DATAS DOS LAUDOS)
    const allEvents = useMemo(() => {
        const events = [];
        if (filter === 'all' || filter === 'reports') {
            reports.forEach(r => {
                // SE É NO FORMATO NOVO COM MULTIPLOS DIAS
                if (r.executionPeriods && r.executionPeriods.length > 0) {
                    r.executionPeriods.forEach((period, pIndex) => {
                        events.push({
                            date: period.date,
                            title: r.vesselName || 'S/N',
                            time: `${period.startTime} - ${period.endTime}`,
                            type: 'report',
                            id: `${r.id}-${pIndex}`, // ID falso só pro grid não surtar
                            data: r
                        });
                    });
                } 
                // RETROCOMPATIBILIDADE: LAUDOS VELHOS
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
        return events;
    }, [reports, schedules, filter]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const renderDays = () => {
        const days = [];
        const totalCells = 42; 

        for (let i = 0; i < totalCells; i++) {
            if (i < firstDayOfMonth) {
                const prevDay = daysInPrevMonth - firstDayOfMonth + i + 1;
                days.push(
                    <div key={`prev-${i}`} className="calendar-day bg-slate-800/20 text-slate-600 p-1 border-t border-r border-slate-700/30 flex flex-col items-end opacity-50">
                        <span className="text-[10px] font-bold">{prevDay}</span>
                    </div>
                );
            } 
            else if (i >= firstDayOfMonth && i < firstDayOfMonth + daysInMonth) {
                const day = i - firstDayOfMonth + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                // Pega os eventos desse dia específico
                const dayEvents = allEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === todayStr;

                days.push(
                    <div 
                        key={`current-${day}`} 
                        onClick={() => onDateClick(dateStr, dayEvents)} 
                        className={`calendar-day cursor-pointer p-1 border-t border-r border-slate-700/50 hover:bg-slate-700/50 transition-colors flex flex-col relative group h-24 sm:h-28 overflow-hidden
                            ${isToday ? 'bg-slate-800 ring-2 ring-inset ring-[var(--rb-orange)]' : 'bg-[#1e293b]'}
                        `}
                    >
                        <div className="flex justify-between w-full items-start mb-1">
                            <div className="flex gap-0.5 mt-0.5 ml-0.5 flex-wrap w-2/3">
                                {dayEvents.length > 0 && dayEvents.slice(0, 3).map((e, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${e.type === 'report' ? 'bg-green-400' : 'bg-[var(--rb-orange)]'}`}></div>
                                ))}
                                {dayEvents.length > 3 && <span className="text-[7px] text-slate-400 leading-none">+{dayEvents.length - 3}</span>}
                            </div>

                            <span className={`text-[11px] font-black mr-1 rounded-full w-5 h-5 flex items-center justify-center
                                ${isToday ? 'bg-[var(--rb-orange)] text-white' : dayEvents.length > 0 ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300'}`
                            }>
                                {day}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 w-full flex-1 overflow-y-auto hidden-scrollbar">
                            {dayEvents.map((ev, idx) => (
                                <div 
                                    key={idx} 
                                    className={`px-1 py-0.5 rounded text-[9px] font-bold truncate border-l-2 flex items-center justify-between gap-1 shadow-sm
                                        ${ev.type === 'report' ? 'bg-green-950/40 text-green-300 border-green-500' : 'bg-orange-950/40 text-[var(--rb-orange)] border-[var(--rb-orange)]'}
                                    `}
                                >
                                    <span className="truncate flex-1 uppercase tracking-tight">{ev.title}</span>
                                    <span className="opacity-70 text-[8px] shrink-0 font-mono hidden sm:inline">{ev.time}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-10 pointer-events-none"></div>
                    </div>
                );
            } 
            else {
                const nextDay = i - (firstDayOfMonth + daysInMonth) + 1;
                days.push(
                    <div key={`next-${i}`} className="calendar-day bg-slate-800/20 text-slate-600 p-1 border-t border-r border-slate-700/30 flex flex-col items-end opacity-50">
                        <span className="text-[10px] font-bold">{nextDay}</span>
                    </div>
                );
            }
        }
        return days;
    };

    return (
        <div className="space-y-4">
            
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 border-b border-slate-700 bg-slate-900/50">
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <button onClick={prevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-[var(--rb-orange)] rounded-lg text-slate-300 transition-colors border border-slate-700"><Icons.ChevronLeft size={20}/></button>
                        <h2 className="text-xl font-bold text-white capitalize w-40 text-center">{monthName}</h2>
                        <button onClick={nextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-[var(--rb-orange)] rounded-lg text-slate-300 transition-colors border border-slate-700"><Icons.ChevronRight size={20}/></button>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={goToToday} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors uppercase tracking-wider">Hoje</button>
                    </div>
                </div>

                <div className="flex gap-2 p-3 bg-slate-800 overflow-x-auto hidden-scrollbar">
                    <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filter === 'all' ? 'bg-[var(--rb-blue)] text-white border-[var(--rb-blue)] shadow-lg' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>Visão Geral</button>
                    <button onClick={() => setFilter('reports')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${filter === 'reports' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-900/20' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Icons.Check size={12}/> Laudos Prontos</button>
                    <button onClick={() => setFilter('schedules')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${filter === 'schedules' ? 'bg-[var(--rb-orange)] text-white border-[var(--rb-orange)] shadow-lg shadow-orange-900/20' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Icons.Clock size={12}/> Agendados</button>
                </div>
            </div>
            
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900/80">
                    {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d, index) => (
                        <div key={d} className={`text-center py-2 text-[10px] sm:text-xs uppercase font-bold tracking-wider ${index === 0 || index === 6 ? 'text-slate-500' : 'text-slate-400'}`}>
                            {d}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 bg-slate-700 border-l border-b border-slate-700">
                    {renderDays()}
                </div>
            </div>

            <div className="pt-4 pb-10 sm:pb-4">
                <button 
                    onClick={onAddSchedule} 
                    className="w-full py-4 bg-[var(--rb-orange)] hover:bg-orange-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 transition-all active:scale-[0.98]"
                >
                    <Icons.Plus size={18}/> Novo Agendamento de Serviço
                </button>
            </div>

            <style dangerouslySetInnerHTML={{__html: `.hidden-scrollbar::-webkit-scrollbar { display: none; } .hidden-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
        </div>
    );
};
