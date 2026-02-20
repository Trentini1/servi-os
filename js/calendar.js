// --- LÓGICA DO CALENDÁRIO (js/calendar.js) ---

const { useState, useMemo } = React;

// Salvamos o componente no objeto global window para o app.js conseguir enxergar
window.CalendarView = ({ reports, schedules, onDateClick, onAddSchedule }) => {
    // Puxa os ícones que foram declarados no app.js
    const Icons = window.Icons; 

    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Mescla Relatórios (Verde) e Agendamentos (Laranja)
    const events = useMemo(() => {
        const all = [];
        // Relatórios (Já feitos)
        reports.forEach(r => {
            if(r.startDate) all.push({ 
                date: r.startDate, 
                title: r.vesselName, 
                time: `${r.startTime || '08:00'} - ${r.endTime || '18:00'}`,
                type: 'report', 
                id: r.id,
                data: r
            });
        });
        // Agendamentos (Futuros)
        schedules.forEach(s => {
            if(s.date) all.push({ 
                date: s.date, 
                title: s.vesselName, 
                time: 'Previsão',
                type: 'schedule', 
                id: s.id, 
                ...s 
            });
        });
        return all;
    }, [reports, schedules]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(<div key={`empty-${i}`} className="calendar-day bg-slate-800/30"></div>);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            
            days.push(
                <div key={day} onClick={() => onDateClick(dateStr, dayEvents)} className="calendar-day cursor-pointer hover:bg-slate-700 transition-colors h-24 p-1 border border-slate-700/50 relative">
                    <span className={`absolute top-1 right-1 text-xs font-bold ${dayEvents.length > 0 ? 'text-white' : 'text-slate-500'}`}>{day}</span>
                    <div className="flex flex-col gap-1 mt-5 overflow-hidden">
                        {dayEvents.map((ev, idx) => (
                            <div key={idx} className={`text-[8px] px-1 py-0.5 rounded truncate font-bold border-l-2 ${ev.type === 'report' ? 'bg-green-900/40 text-green-200 border-green-500' : 'bg-orange-900/40 text-orange-200 border-orange-500'}`}>
                                <div className="truncate">{ev.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300"><Icons.ChevronLeft/></button>
                <h2 className="text-lg font-bold text-white capitalize">{monthName}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300"><Icons.ChevronRight/></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
                {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d} className="text-center py-2 bg-slate-800 text-[10px] uppercase text-slate-400 font-bold rounded-t-lg">{d}</div>)}
                {renderDays()}
            </div>
            
            <div className="flex gap-4 text-xs text-slate-400 justify-center pt-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Relatórios Feitos</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Agendamentos</span>
            </div>

            <button onClick={onAddSchedule} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-slate-600">
                <Icons.Plus size={16}/> Agendar Serviço Futuro
            </button>
        </div>
    );
};
