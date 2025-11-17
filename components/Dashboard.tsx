import React from 'react';
import type { Todo, Goal, Exam, View, EditableContent } from '../types';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import InlineEditable from './common/InlineEditable';

interface DashboardProps {
  userName: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  goals: Goal[];
  exams: Exam[];
  setView: (view: View) => void;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, todos, setTodos, goals, exams, setView, editableContent, setEditableContent }) => {
  const upcomingExams = exams
    .map(exam => ({...exam, dateObj: new Date(exam.date)}))
    .filter(exam => exam.dateObj >= new Date())
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 3);
  
  const incompleteTodos = todos.filter(t => !t.completed).slice(0, 5);
  
  const goalsInProgress = goals.slice(0, 3);

  const getTimeDifference = (date: Date) => {
    const diff = date.getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Today!';
  };
  
  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif text-[var(--text-header)] mb-2">Welcome back, {userName}</h1>
        <InlineEditable
            as="p"
            initialValue={editableContent.dashboardGreeting}
            onSave={handleContentSave('dashboardGreeting')}
            className="text-[var(--text-secondary)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-4">
          <InlineEditable as="h2" initialValue={editableContent.dashboardQuickActionsTitle} onSave={handleContentSave('dashboardQuickActionsTitle')} className="text-xl font-serif text-[var(--text-header)]" />
          <div className="flex flex-col space-y-2">
            <button onClick={() => setView('Pomodoro')} className="w-full text-left p-3 rounded-md bg-[var(--bg-interactive)]/50 hover:bg-[var(--bg-interactive)] transition-colors">Start Focus Session</button>
            <button onClick={() => setView('Journal')} className="w-full text-left p-3 rounded-md bg-[var(--bg-interactive)]/50 hover:bg-[var(--bg-interactive)] transition-colors">New Journal Entry</button>
            <button onClick={() => setView('Study')} className="w-full text-left p-3 rounded-md bg-[var(--bg-interactive)]/50 hover:bg-[var(--bg-interactive)] transition-colors">Manage Studies</button>
          </div>
        </Card>

        <Card className="lg:col-span-2 space-y-4">
          <InlineEditable as="h2" initialValue={editableContent.dashboardDeadlinesTitle} onSave={handleContentSave('dashboardDeadlinesTitle')} className="text-xl font-serif text-[var(--text-header)]" />
          {upcomingExams.length > 0 ? (
            <ul className="space-y-2">
              {upcomingExams.map(exam => (
                <li key={exam.id} className="flex justify-between items-center bg-[var(--bg-primary)]/50 p-3 rounded">
                  <span className="font-medium text-[var(--text-primary)]">{exam.subject}</span>
                  <span className="text-sm font-mono text-[var(--accent-secondary)]">{getTimeDifference(exam.dateObj)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-[var(--text-muted)]">No upcoming exams. Time to relax or get ahead!</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <InlineEditable as="h2" initialValue={editableContent.dashboardFocusTitle} onSave={handleContentSave('dashboardFocusTitle')} className="text-xl font-serif text-[var(--text-header)]" />
          {incompleteTodos.length > 0 ? (
            <ul className="space-y-2">
              {incompleteTodos.map(todo => (
                <li key={todo.id} className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={todo.completed} 
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 rounded bg-[var(--bg-interactive)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-secondary)] cursor-pointer"
                    />
                    <span className={`text-[var(--text-primary)] ${todo.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>{todo.text}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-[var(--text-muted)]">All tasks completed. Well done!</p>}
        </Card>

        <Card className="space-y-4">
          <InlineEditable as="h2" initialValue={editableContent.dashboardGoalsTitle} onSave={handleContentSave('dashboardGoalsTitle')} className="text-xl font-serif text-[var(--text-header)]" />
          {goalsInProgress.length > 0 ? (
            <ul className="space-y-4">
              {goalsInProgress.map(goal => (
                <li key={goal.id}>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium text-[var(--text-primary)]">{goal.title}</span>
                        <span className="text-[var(--text-secondary)]">{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                  <ProgressBar current={goal.current} target={goal.target} />
                </li>
              ))}
            </ul>
          ) : <p className="text-[var(--text-muted)]">No goals set yet. Aim for something great!</p>}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;