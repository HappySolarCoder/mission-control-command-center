'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Card {
  id: string;
  title: string;
  column: 'backlog' | 'ready' | 'in-progress' | 'done';
}

interface Project extends Card {
  tasks?: Card[];
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'ready', title: 'Ready' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
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
        column: 'in-progress',
        tasks: [
          { id: 't1', title: 'Fix navigation', column: 'done' },
          { id: 't2', title: 'Build kanban board', column: 'in-progress' },
          { id: 't3', title: 'Add agent details', column: 'ready' },
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
        column: 'backlog',
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

  const moveItem = (itemId: string, newColumn: typeof COLUMNS[number]['id'], isProject: boolean) => {
    if (isProject) {
      setProjects(projects.map(p => 
        p.id === itemId ? { ...p, column: newColumn } : p
      ));
    } else if (selectedProject) {
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

  const deleteItem = (itemId: string, isProject: boolean) => {
    if (isProject) {
      setProjects(projects.filter(p => p.id !== itemId));
    } else if (selectedProject) {
      setProjects(projects.map(p => {
        if (p.id === selectedProject) {
          return { ...p, tasks: p.tasks?.filter(t => t.id !== itemId) };
        }
        return p;
      }));
    }
  };

  const currentProject = projects.find(p => p.id === selectedProject);
  const items = selectedProject ? (currentProject?.tasks || []) : projects;
  const isProjectView = !selectedProject;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedProject && (
            <button
              onClick={() => setSelectedProject(null)}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              ← Back to Projects
            </button>
          )}
          <h1 className="text-4xl font-bold">
            {selectedProject ? currentProject?.title : 'Projects'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            Back to Office
          </Link>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            + Add {isProjectView ? 'Project' : 'Task'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-[#111111] p-4 rounded">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder={`Enter ${isProjectView ? 'project' : 'task'} title...`}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 mb-2"
            onKeyDown={(e) => e.key === 'Enter' && addItem(isProjectView)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => addItem(isProjectView)}
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
          <div key={column.id} className="bg-[#111111] rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">{column.title}</h2>
            <div className="space-y-3">
              {items
                .filter((item) => item.column === column.id)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] p-4 rounded cursor-pointer hover:bg-gray-800"
                    onClick={() => isProjectView && setSelectedProject(item.id)}
                  >
                    <div className="font-semibold mb-2">{item.title}</div>
                    {isProjectView && 'tasks' in item && (item as Project).tasks && (
                      <div className="text-xs text-gray-400 mb-2">
                        {(item as Project).tasks?.length || 0} tasks
                      </div>
                    )}
                    <div className="flex gap-1 text-xs">
                      {COLUMNS.filter(c => c.id !== column.id).map((col) => (
                        <button
                          key={col.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveItem(item.id, col.id, isProjectView);
                          }}
                          className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                        >
                          → {col.title}
                        </button>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this item?')) {
                            deleteItem(item.id, isProjectView);
                          }
                        }}
                        className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 ml-auto"
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
