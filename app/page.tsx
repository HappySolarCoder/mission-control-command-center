'use client';

import { useState } from 'react';
import Link from 'next/link';

type AgentStatus = 'working' | 'chatting' | 'walking' | 'idle';

interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  x: number;
  y: number;
  color: string;
}

const initialAgents: Agent[] = [
  { id: '1', name: 'Alex', status: 'working', x: 3, y: 4, color: '#FCD34D' },
  { id: '2', name: 'Henry', status: 'working', x: 6, y: 2, color: '#60A5FA' },
  { id: '3', name: 'Scout', status: 'working', x: 5, y: 5, color: '#9CA3AF' },
  { id: '4', name: 'Quill', status: 'chatting', x: 2, y: 5, color: '#C084FC' },
  { id: '5', name: 'Echo', status: 'working', x: 4, y: 5, color: '#34D399' },
  { id: '6', name: 'Codex', status: 'working', x: 6, y: 5, color: '#F87171' },
  { id: '7', name: 'Pixel', status: 'idle', x: 7, y: 6, color: '#FB923C' },
  { id: '8', name: 'Benedict', status: 'working', x: 1, y: 6, color: '#8B5CF6' },
  { id: '9', name: 'Boris', status: 'working', x: 2, y: 2, color: '#EF4444' },
  { id: '10', name: 'Beane', status: 'working', x: 8, y: 4, color: '#10B981' },
];

const statusColors = {
  working: '#10B981',
  chatting: '#3B82F6',
  walking: '#F59E0B',
  idle: '#9CA3AF',
};

export default function MissionControl() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const setAllWorking = () => {
    setAgents(agents.map(a => ({ ...a, status: 'working' })));
  };

  const gather = () => {
    // Move all agents to conference area (center)
    setAgents(agents.map((a, i) => ({
      ...a,
      x: 4 + (i % 3),
      y: 4 + Math.floor(i / 3),
      status: 'walking',
    })));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-2xl">🎯</div>
          <h1 className="text-xl font-bold">Mission Control</h1>
        </div>
        
        <nav className="space-y-2">
          <Link href="/tasks" className="block px-3 py-2 rounded hover:bg-gray-800">Tasks</Link>
          <Link href="/content" className="block px-3 py-2 rounded hover:bg-gray-800">Content</Link>
          <Link href="/approvals" className="block px-3 py-2 rounded hover:bg-gray-800">Approvals</Link>
          <Link href="/council" className="block px-3 py-2 rounded hover:bg-gray-800">Council</Link>
          <Link href="/calendar" className="block px-3 py-2 rounded hover:bg-gray-800">Calendar</Link>
          <Link href="/projects" className="block px-3 py-2 rounded hover:bg-gray-800">Projects</Link>
          <Link href="/memory" className="block px-3 py-2 rounded hover:bg-gray-800">Memory</Link>
          <Link href="/docs" className="block px-3 py-2 rounded hover:bg-gray-800">Docs</Link>
          <Link href="/people" className="block px-3 py-2 rounded hover:bg-gray-800">People</Link>
          <Link href="/" className="block px-3 py-2 rounded bg-gray-800">Office</Link>
          <Link href="/team" className="block px-3 py-2 rounded hover:bg-gray-800">Team</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#111111] border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search ⌘K"
              className="bg-[#1a1a1a] border border-gray-700 rounded px-4 py-2 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">Pause</button>
            <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">Ping Henry</button>
            <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">🔄</button>
          </div>
        </div>

        {/* Office View */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">The Office</h2>
            <p className="text-gray-400">AI team headquarters — live view</p>
          </div>

          {/* Status Legend */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.working }}></div>
              <span>Working</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.chatting }}></div>
              <span>Chatting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.walking }}></div>
              <span>Walking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.idle }}></div>
              <span>Idle</span>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-[#1e1b3a] rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              <span className="font-semibold">Demo Controls</span>
            </div>
            <div className="flex gap-2">
              <button onClick={setAllWorking} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                All Working
              </button>
              <button onClick={gather} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                Gather
              </button>
              <button className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">
                Run Meeting
              </button>
              <button className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700">
                Watercooler
              </button>
            </div>
          </div>

          {/* Office Canvas */}
          <div className="bg-[#2a2520] rounded-lg p-8 relative" style={{ height: '500px' }}>
            {/* Grid floor */}
            <div className="grid grid-cols-10 grid-rows-8 gap-1 h-full">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="bg-[#3a3020] rounded-sm"></div>
              ))}
            </div>

            {/* Agents */}
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="absolute transition-all duration-300"
                style={{
                  left: `${agent.x * 10}%`,
                  top: `${agent.y * 12.5}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.name[0]}
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2a2520]"
                    style={{ backgroundColor: statusColors[agent.status] }}
                  ></div>
                  <div className="text-center mt-1 text-xs font-semibold">{agent.name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-[#111111] rounded-lg p-4 text-center hover:bg-gray-800 cursor-pointer">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.name[0]}
                </div>
                <div className="font-semibold">{agent.name}</div>
                <div className="text-xs text-gray-400">Click for details</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Activity Feed */}
      <div className="w-80 bg-[#111111] border-l border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">⚡ Live Activity</h3>
          <span className="text-sm text-gray-400">Last hour</span>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-[#1a1a1a] rounded">
            <div className="flex items-start gap-2">
              <span className="text-red-400">🚀</span>
              <div>
                <div className="font-semibold text-sm">quill - approval item submitted</div>
                <div className="text-xs text-gray-400 mt-1">HIGH approval needed: I Gave Claude...</div>
                <div className="text-xs text-gray-500 mt-1">41 minutes ago</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-[#1a1a1a] rounded">
            <div className="flex items-start gap-2">
              <span className="text-red-400">🚀</span>
              <div>
                <div className="font-semibold text-sm">echo - approval item submitted</div>
                <div className="text-xs text-gray-400 mt-1">HIGH approval needed: Agent Teams...</div>
                <div className="text-xs text-gray-500 mt-1">42 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
