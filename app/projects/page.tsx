'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Card {
  id: string;
  title: string;
  column: 'backlog' | 'doing' | 'review' | 'done';
}

interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'doing' | 'review' | 'done';
  tasks?: Card[];
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#EF5350' },
  { id: 'doing', title: 'Doing', color: '#FDD835' },
  { id: 'review', title: 'Review', color: '#66BB6A' },
  { id: 'done', title: 'Done', color: '#42A5F5' },
] as const;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mission-control-projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // Initialize with demo project
      const demo: Project[] = [{
        id: '1',
        title: 'Mission Control Command Center',
        description: 'AI team dashboard with office view and project management',
        status: 'doing',
        tasks: [
          { id: 't1', title: 'Fix navigation', column: 'done' },
          { id: 't2', title: 'Build kanban board', column: 'doing' },
          { id: 't3', title: 'Add Team page', column: 'backlog' },
          { id: 't4', title: 'Office visual upgrades', column: 'backlog' },
        ],
      }];
      setProjects(demo);
      localStorage.setItem('mission-control-projects', JSON.stringify(demo));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('mission-control-projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addItem = (isProject: boolean) => {
    if (!newItemTitle.trim()) return;
    
    if (isProject) {
      const newProject: Project = {
        id: Date.now().toString(),
        title: newItemTitle,
        status: 'backlog',
        tasks: [],
      };
      setProjects([...projects, newProject]);
    } else if (selectedProject) {
      const updated = projects.map(p => {
        if (p.id === selectedProject) {
          const newTask: Card = {
            id: Date.now().toString(),
            title: newItemTitle,
            column: 'backlog',
          };
          return { ...p, tasks: [...(p.tasks || []), newTask] };
        }
        return p;
      });
      setProjects(updated);
    }
    
    setNewItemTitle('');
    setShowAddForm(false);
  };

  const moveItem = (itemId: string, newColumn: typeof COLUMNS[number]['id']) => {
    if (selectedProject) {
      setProjects(projects.map(p => {
        if (p.id === selectedProject) {
          return {
            ...p,
            tasks: p.tasks?.map(t => 
              t.id === itemId ? { ...t, column: newColumn } : t
            ),
          };
        }
        return p;
      }));
    }
  };

  const deleteItem = (itemId: string) => {
    if (selectedProject) {
      setProjects(projects.map(p => {
        if (p.id === selectedProject) {
          return { ...p, tasks: p.tasks?.filter(t => t.id !== itemId) };
        }
        return p;
      }));
    } else {
      setProjects(projects.filter(p => p.id !== itemId));
    }
  };

  const currentProject = projects.find(p => p.id === selectedProject);
  const items = currentProject?.tasks || [];

  // Projects list view
  if (!selectedProject) {
    const statusColors = {
      backlog: '#EF5350',
      doing: '#FDD835',
      review: '#66BB6A',
      done: '#42A5F5',
    };

    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Projects</h1>
          <div className="flex gap-2">
            <Link href="/" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
              Back to Office
            </Link>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              + Add Project
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 bg-[#111111] p-4 rounded">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Enter project title..."
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 mb-2"
              onKeyDown={(e) => e.key === 'Enter' && addItem(true)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => addItem(true)}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewItemTitle(''); }}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111111] rounded-lg p-6 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this project?')) {
                      deleteItem(project.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
              {project.description && (
                <p className="text-gray-400 text-sm mb-3">{project.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColors[project.status] }}
                  ></div>
                  <span className="text-sm capitalize">{project.status}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {project.tasks?.length || 0} tasks
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Project kanban view
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            ← Back to Projects
          </button>
          <h1 className="text-4xl font-bold">{currentProject?.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            Back to Office
          </Link>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            + Add Task
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-[#111111] p-4 rounded">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 mb-2"
            onKeyDown={(e) => e.key === 'Enter' && addItem(false)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => addItem(false)}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewItemTitle(''); }}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="rounded-lg overflow-hidden">
            <div
              className="p-3 font-bold text-center"
              style={{ backgroundColor: column.color, color: column.id === 'doing' ? '#000' : '#fff' }}
            >
              {column.title}
            </div>
            <div className="bg-[#f5f5f5] min-h-[500px] p-3 space-y-3">
              {items
                .filter((item) => item.column === column.id)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-gray-800 mb-3">{item.title}</div>
                    <div className="flex gap-1 flex-wrap">
                      {COLUMNS.filter(c => c.id !== column.id).map((col) => (
                        <button
                          key={col.id}
                          onClick={() => moveItem(item.id, col.id)}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          → {col.title}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          if (confirm('Delete this task?')) {
                            deleteItem(item.id);
                          }
                        }}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
