import React, { useState, useMemo } from 'react';
import type { Todo, Goal, Exam, Habit, EditableContent } from '../types';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import Modal from './common/Modal';
import InlineEditable from './common/InlineEditable';
import EmptyState from './common/EmptyState';

type StudyTab = 'Todos' | 'Goals' | 'Exams' | 'Habits';

const TodoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GoalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5h16.5M20.25 12a7.5 7.5 0 00-7.5-7.5H4.5" /><circle cx="12.75" cy="12.75" r="4.5" /><path d="M15.75 12.75L18 15" /></svg>;
const ExamIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const HabitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0-4.991v4.99" /></svg>;

interface StudyProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;


const Study: React.FC<StudyProps> = ({ todos, setTodos, goals, setGoals, exams, setExams, habits, setHabits, editableContent, setEditableContent }) => {
  const [activeTab, setActiveTab] = useState<StudyTab>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentItem, setCurrentItem] = useState<Todo | Goal | Exam | Habit | null>(null);

  // --- FORM STATE ---
  const [newTodoText, setNewTodoText] = useState('');
  const [newGoalData, setNewGoalData] = useState({ title: '', target: '', unit: '' });

  // --- MODAL HANDLERS ---
  const openModal = (mode: 'add' | 'edit', item: Todo | Goal | Exam | Habit | null = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  
  // --- TODO LOGIC ---
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodoText, completed: false }]);
    setNewTodoText('');
  };
  const handleEditTodo = (formData: Partial<Todo>) => setTodos(todos.map(t => t.id === currentItem?.id ? { ...t, text: formData.text || '' } : t));
  const toggleTodo = (id: string) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  // --- GOAL LOGIC ---
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalData.title.trim() || !newGoalData.target) return;
    setGoals([...goals, { 
      id: Date.now().toString(), 
      title: newGoalData.title, 
      target: Number(newGoalData.target), 
      current: 0, 
      unit: newGoalData.unit 
    }]);
    setNewGoalData({ title: '', target: '', unit: '' });
  };
  const handleEditGoal = (formData: Partial<Goal>) => setGoals(goals.map(g => g.id === currentItem?.id ? { ...g, ...formData, target: Number(formData.target), current: Number(formData.current) } : g));
  const deleteGoal = (id: string) => setGoals(goals.filter(g => g.id !== id));
  const updateGoalProgress = (id: string, newCurrent: number) => setGoals(goals.map(g => g.id === id ? { ...g, current: Math.max(0, newCurrent) } : g));
  
  // --- EXAM LOGIC ---
  const handleExamSubmit = (formData: Partial<Exam>) => {
    if (modalMode === 'add') {
      setExams([...exams, { id: Date.now().toString(), subject: formData.subject || '', date: formData.date || '' }]);
    } else {
      setExams(exams.map(e => e.id === currentItem?.id ? { ...e, subject: formData.subject || '', date: formData.date || '' } : e));
    }
  };
  const deleteExam = (id: string) => setExams(exams.filter(e => e.id !== id));
  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Past';
    if (days === 0) return 'Today!';
    return `${days} day${days > 1 ? 's' : ''}`;
  };
  
  // --- HABIT LOGIC ---
  const todayISO = new Date().toISOString().split('T')[0];
  const handleHabitSubmit = (formData: Partial<Habit>) => {
     if (modalMode === 'add') {
      setHabits([...habits, { id: Date.now().toString(), name: formData.name || '', frequency: formData.frequency || 'daily', completedDates: [] }]);
    } else {
      setHabits(habits.map(h => h.id === currentItem?.id ? { ...h, name: formData.name || '', frequency: formData.frequency || 'daily' } : h));
    }
  };
  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));
  const isHabitCompleted = (habit: Habit) => {
    if (habit.frequency === 'daily') return habit.completedDates.includes(todayISO);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekISO = startOfWeek.toISOString().split('T')[0];
    return habit.completedDates.some(d => d >= startOfWeekISO);
  };
  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id !== id) return h;
      const completed = isHabitCompleted(h);
      let newCompletedDates = [...h.completedDates];
      if (completed) {
        if (h.frequency === 'daily') newCompletedDates = newCompletedDates.filter(d => d !== todayISO);
        else {
           const startOfWeek = new Date();
           startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
           const startOfWeekISO = startOfWeek.toISOString().split('T')[0];
           newCompletedDates = newCompletedDates.filter(d => d < startOfWeekISO);
        }
      } else {
        newCompletedDates.push(todayISO);
      }
      return {...h, completedDates: newCompletedDates};
    }));
  };
  
  const sortedExams = useMemo(() => [...exams].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [exams]);

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    const commonButtonClasses = "text-[var(--text-muted)] hover:text-[var(--accent-secondary-hover)] transition-colors";
    
    switch (activeTab) {
      case 'Todos':
        return todos.length > 0 ? (
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between bg-[var(--bg-interactive-alpha-2)] p-3 rounded-md group">
                <label className="flex items-center gap-3 cursor-pointer flex-grow">
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded bg-[var(--bg-interactive)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-secondary)]"
                  />
                  <span className={`${todo.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                    {todo.text}
                  </span>
                </label>
                <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal('edit', todo)} className={commonButtonClasses}><EditIcon/></button>
                  <button onClick={() => deleteTodo(todo.id)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)] transition-colors"><DeleteIcon/></button>
                </div>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={<TodoIcon />} title="No Tasks Yet" message="Add your first task using the form above to get started." />;
      case 'Goals':
        return goals.length > 0 ? (
           <ul className="space-y-4">
            {goals.map(goal => (
              <li key={goal.id} className="bg-[var(--bg-interactive-alpha-2)] p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[var(--text-primary)]">{goal.title}</span>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => openModal('edit', goal)} className={commonButtonClasses}><EditIcon/></button>
                    <button onClick={() => deleteGoal(goal.id)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)] transition-colors"><DeleteIcon/></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <ProgressBar current={goal.current} target={goal.target} />
                  <input type="number" value={goal.current} onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))} className="w-20 bg-[var(--bg-interactive)]/50 p-1 rounded-md border border-[var(--border-secondary)] text-center" />
                </div>
                <div className="text-right text-sm text-[var(--text-secondary)]">{goal.current} / {goal.target} {goal.unit}</div>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={<GoalIcon />} title="No Goals Set" message="Define your ambitions! Add a new goal using the form above to start tracking your progress." />;
      case 'Exams':
        return exams.length > 0 ? (
           <ul className="space-y-2">
            {sortedExams.map(exam => (
              <li key={exam.id} className="flex items-center justify-between bg-[var(--bg-interactive-alpha-2)] p-3 rounded-md group">
                <div>
                    <p className="font-medium text-[var(--text-primary)]">{exam.subject}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{new Date(exam.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[var(--accent-secondary)]">{getDaysRemaining(exam.date)}</span>
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => openModal('edit', exam)} className={commonButtonClasses}><EditIcon/></button>
                     <button onClick={() => deleteExam(exam.id)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)] transition-colors"><DeleteIcon/></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={<ExamIcon />} title="No Exams Scheduled" message="Add your upcoming exams to keep track of important deadlines and countdowns." action={{ text: 'Add Exam', onClick: () => openModal('add') }}/>;
      case 'Habits':
        return habits.length > 0 ? (
          <ul className="space-y-2">
            {habits.map(habit => (
              <li key={habit.id} className="flex items-center justify-between bg-[var(--bg-interactive-alpha-2)] p-3 rounded-md group">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleHabit(habit.id)}>
                    <input type="checkbox" readOnly checked={isHabitCompleted(habit)} className="w-5 h-5 rounded bg-[var(--bg-interactive)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-secondary)]" />
                    <span className="text-[var(--text-primary)]">{habit.name} <span className="text-xs text-[var(--text-muted)]">({habit.frequency})</span></span>
                  </div>
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={(e) => { e.stopPropagation(); openModal('edit', habit); }} className={commonButtonClasses}><EditIcon/></button>
                     <button onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)] transition-colors"><DeleteIcon/></button>
                  </div>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={<HabitIcon />} title="No Habits to Track" message="Building good habits is key to success. Add your first daily or weekly habit to get started." action={{ text: 'Add Habit', onClick: () => openModal('add') }}/>;
      default: return null;
    }
  };

  const ModalForm: React.FC<{onSave: (data: any) => void;}> = ({onSave}) => {
    const [formData, setFormData] = useState(() => {
      if (modalMode === 'edit' && currentItem) return {...currentItem};
      // Only Exams and Habits will use 'add' mode in modal now
      switch(activeTab) {
        case 'Todos': return {text: ''};
        case 'Goals': return {title: '', target: 100, current: 0, unit: ''};
        case 'Exams': return {subject: '', date: todayISO };
        case 'Habits': return {name: '', frequency: 'daily'};
        default: return {};
      }
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
      closeModal();
    }
    const inputClasses = "w-full bg-[var(--bg-interactive)]/50 p-2 rounded-md border border-[var(--border-secondary)]";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'Todos' && (<input type="text" name="text" value={(formData as Partial<Todo>).text} onChange={handleChange} placeholder="Task description" required className={inputClasses}/>)}
        {activeTab === 'Goals' && (
          <>
            <input type="text" name="title" value={(formData as Partial<Goal>).title} onChange={handleChange} placeholder="Goal Title" required className={inputClasses}/>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" name="current" value={(formData as Partial<Goal>).current} onChange={handleChange} placeholder="Current" required className={inputClasses}/>
              <input type="number" name="target" value={(formData as Partial<Goal>).target} onChange={handleChange} placeholder="Target" required className={inputClasses}/>
              <input type="text" name="unit" value={(formData as Partial<Goal>).unit} onChange={handleChange} placeholder="Unit (e.g. pages)" className={inputClasses}/>
            </div>
          </>
        )}
        {activeTab === 'Exams' && (
          <>
            <input type="text" name="subject" value={(formData as Partial<Exam>).subject} onChange={handleChange} placeholder="Subject" required className={inputClasses}/>
            <input type="date" name="date" value={(formData as Partial<Exam>).date} onChange={handleChange} required className={inputClasses}/>
          </>
        )}
        {activeTab === 'Habits' && (
          <>
            <input type="text" name="name" value={(formData as Partial<Habit>).name} onChange={handleChange} placeholder="Habit Name" required className={inputClasses}/>
            <select name="frequency" value={(formData as Partial<Habit>).frequency} onChange={handleChange} className={inputClasses}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </>
        )}
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors">Save</button>
        </div>
      </form>
    );
  };
  
  const handleSave = (formData: any) => {
    switch(activeTab) {
      case 'Todos': handleEditTodo(formData); break;
      case 'Goals': handleEditGoal(formData); break;
      case 'Exams': handleExamSubmit(formData); break;
      case 'Habits': handleHabitSubmit(formData); break;
    }
  };

  const tabs: StudyTab[] = ['Todos', 'Goals', 'Exams', 'Habits'];
  const modalTitle = `${modalMode === 'add' ? 'Add' : 'Edit'} ${activeTab.slice(0, -1)}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <InlineEditable 
            as="h1" 
            initialValue={editableContent.studyHubTitle} 
            onSave={handleContentSave('studyHubTitle')} 
            className="text-4xl font-serif text-[var(--text-header)]"
         />
         {['Exams', 'Habits'].includes(activeTab) && (
            <button onClick={() => openModal('add')} className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors">
                + Add {activeTab.slice(0,-1)}
            </button>
         )}
      </div>
      <div className="flex border-b border-[var(--border-primary)] mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-[var(--accent-secondary)] text-[var(--accent-secondary-hover)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'Todos' && (
        <Card className="mb-6">
            <form onSubmit={handleAddTodo} className="flex gap-2">
                <input 
                    type="text" 
                    value={newTodoText} 
                    onChange={(e) => setNewTodoText(e.target.value)} 
                    placeholder="Add a new task..."
                    className="flex-grow bg-[var(--bg-interactive)]/50 p-2 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
                />
                <button type="submit" className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold p-2 rounded-md aspect-square flex items-center justify-center">
                    <AddIcon />
                </button>
            </form>
        </Card>
      )}

      {activeTab === 'Goals' && (
         <Card className="mb-6">
             <form onSubmit={handleAddGoal} className="space-y-2">
                <input type="text" name="title" value={newGoalData.title} onChange={(e) => setNewGoalData({...newGoalData, title: e.target.value})} placeholder="New Goal Title" required className="w-full bg-[var(--bg-interactive)]/50 p-2 rounded-md border border-[var(--border-secondary)]"/>
                <div className="flex gap-2">
                    <input type="number" name="target" value={newGoalData.target} onChange={(e) => setNewGoalData({...newGoalData, target: e.target.value})} placeholder="Target" required min="1" className="w-1/2 bg-[var(--bg-interactive)]/50 p-2 rounded-md border border-[var(--border-secondary)]"/>
                    <input type="text" name="unit" value={newGoalData.unit} onChange={(e) => setNewGoalData({...newGoalData, unit: e.target.value})} placeholder="Unit (e.g. pages)" className="w-1/2 bg-[var(--bg-interactive)]/50 p-2 rounded-md border border-[var(--border-secondary)]"/>
                </div>
                <button type="submit" className="w-full bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors">Add Goal</button>
            </form>
         </Card>
      )}

      <Card>
        {renderContent()}
      </Card>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <ModalForm onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default Study;
