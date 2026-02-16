'use client';

import { useState } from 'react';
import Link from 'next/link';

type AgentStatus = 'working' | 'chatting' | 'walking' | 'idle';

interface Agent {
  id: string;
  name: string;
  title: string;
  status: AgentStatus;
  x: number;
  y: number;
  emoji: string;
  isLeader?: boolean;
}

const statusColors = {
  working: '#10B981',
  chatting: '#3B82F6',
  walking: '#F59E0B',
  idle: '#9CA3AF',
};

// Office layout positions
const DESK_POSITIONS = {
  evan: { x: 8, y: 1 }, // Top right - Evan's office
  benedict: { x: 2, y: 3 }, // Left workspace
  boris: { x: 4, y: 3 }, // Center workspace
  beane: { x: 6, y: 3 }, // Right workspace
};

const CONFERENCE_AREA = { x: 4, y: 6 };
const WATERCOOLER_AREA = { x: 7, y: 5 };

const initialAgents: Agent[] = [
  { 
    id: '1', 
    name: 'Evan', 
    title: 'CEO',
    status: 'working', 
    x: DESK_POSITIONS.evan.x, 
    y: DESK_POSITIONS.evan.y, 
    emoji: '👔',
    isLeader: true,
  },
  { 
    id: '2', 
    name: 'Benedict', 
    title: 'Chief of Staff',
    status: 'working', 
    x: DESK_POSITIONS.benedict.x, 
    y: DESK_POSITIONS.benedict.y, 
    emoji: '🎩',
  },
  { 
    id: '3', 
    name: 'Boris', 
    title: 'Developer',
    status: 'working', 
    x: DESK_POSITIONS.boris.x, 
    y: DESK_POSITIONS.boris.y, 
    emoji: '💻',
  },
  { 
    id: '4', 
    name: 'Beane', 
    title: 'Data Analyst',
    status: 'working', 
    x: DESK_POSITIONS.beane.x, 
    y: DESK_POSITIONS.beane.y, 
    emoji: '📊',
  },
];

export default function MissionControl() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const setAllWorking = () => {
    setAgents(agents.map(a => ({
      ...a,
      status: 'working',
      x: DESK_POSITIONS[a.name.toLowerCase() as keyof typeof DESK_POSITIONS].x,
      y: DESK_POSITIONS[a.name.toLowerCase() as keyof typeof DESK_POSITIONS].y,
    })));
  };

  const gather = () => {
    // Move all agents to conference area
    setAgents(agents.map((a, i) => ({
      ...a,
      x: CONFERENCE_AREA.x + (i % 2) - 0.5,
      y: CONFERENCE_AREA.y + Math.floor(i / 2) - 0.5,
      status: 'walking',
    })));
  };

  const runMeeting = () => {
    // Gather at conference table and set to chatting
    setAgents(agents.map((a, i) => ({
      ...a,
      x: CONFERENCE_AREA.x + (i % 2) - 0.5,
      y: CONFERENCE_AREA.y + Math.floor(i / 2) - 0.5,
      status: 'chatting',
    })));
  };

  const watercooler = () => {
    // Move to water cooler area
    setAgents(agents.map((a, i) => ({
      ...a,
      x: WATERCOOLER_AREA.x + (i % 2) * 0.5,
      y: WATERCOOLER_AREA.y + Math.floor(i / 2) * 0.5,
      status: 'chatting',
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
              <button onClick={runMeeting} className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">
                Run Meeting
              </button>
              <button onClick={watercooler} className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700">
                Watercooler
              </button>
            </div>
          </div>

          {/* Office Canvas */}
          <div className="bg-[#2a2520] rounded-lg p-8 relative" style={{ height: '600px' }}>
            {/* Grid floor - improved texture */}
            <div className="grid grid-cols-10 grid-rows-8 gap-1 h-full">
              {Array.from({ length: 80 }).map((_, i) => {
                const col = i % 10;
                const row = Math.floor(i / 10);
                // Evan's office area (top right)
                const isEvansOffice = col >= 7 && row <= 2;
                // Conference area
                const isConference = col >= 3 && col <= 5 && row >= 5 && row <= 7;
                
                return (
                  <div 
                    key={i} 
                    className={`rounded-sm ${
                      isEvansOffice ? 'bg-[#4a3830]' : 
                      isConference ? 'bg-[#3a3530]' : 
                      'bg-[#3a3020]'
                    }`}
                  ></div>
                );
              })}
            </div>

            {/* Office Furniture */}
            {/* Evan's Office */}
            <div 
              className="absolute bg-[#5a4a3a] border-2 border-[#6a5a4a] rounded"
              style={{ left: '70%', top: '5%', width: '25%', height: '25%' }}
            >
              <div className="p-2 text-xs text-gray-300 font-bold">EVAN'S OFFICE</div>
              <div className="absolute bottom-2 left-2 text-2xl">🪴</div>
              <div className="absolute bottom-2 right-2 text-2xl">📚</div>
            </div>

            {/* Desks */}
            {/* Benedict's Desk */}
            <div 
              className="absolute bg-[#4a4a4a] border border-gray-600 rounded flex items-center justify-center text-xs"
              style={{ left: '20%', top: '35%', width: '12%', height: '8%' }}
            >
              💼
            </div>

            {/* Boris's Desk */}
            <div 
              className="absolute bg-[#4a4a4a] border border-gray-600 rounded flex items-center justify-center text-xs"
              style={{ left: '40%', top: '35%', width: '12%', height: '8%' }}
            >
              🖥️
            </div>

            {/* Beane's Desk */}
            <div 
              className="absolute bg-[#4a4a4a] border border-gray-600 rounded flex items-center justify-center text-xs"
              style={{ left: '60%', top: '35%', width: '12%', height: '8%' }}
            >
              📈
            </div>

            {/* Conference Table */}
            <div 
              className="absolute bg-[#5a5a5a] border-2 border-gray-500 rounded flex items-center justify-center"
              style={{ left: '35%', top: '70%', width: '25%', height: '20%' }}
            >
              <div className="text-xs text-gray-300">CONFERENCE TABLE</div>
            </div>

            {/* Water Cooler */}
            <div 
              className="absolute flex items-center justify-center text-3xl"
              style={{ left: '70%', top: '60%' }}
            >
              🚰
            </div>

            {/* Plants */}
            <div className="absolute text-2xl" style={{ left: '10%', top: '10%' }}>🌿</div>
            <div className="absolute text-2xl" style={{ left: '10%', top: '80%' }}>🌿</div>

            {/* Agents */}
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="absolute transition-all duration-500"
                style={{
                  left: `${agent.x * 10}%`,
                  top: `${agent.y * 12.5}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  <div
                    className={`${agent.isLeader ? 'w-16 h-16 text-4xl' : 'w-14 h-14 text-3xl'} rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br from-gray-700 to-gray-800 border-2`}
                    style={{ borderColor: agent.isLeader ? '#FFD700' : '#666' }}
                  >
                    {agent.emoji}
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2a2520]"
                    style={{ backgroundColor: statusColors[agent.status] }}
                  ></div>
                  <div className="text-center mt-1">
                    <div className="text-xs font-bold">{agent.name}</div>
                    <div className="text-[10px] text-gray-400">{agent.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {agents.map((agent) => (
              <div key={agent.id} className={`bg-[#111111] rounded-lg p-4 text-center hover:bg-gray-800 cursor-pointer ${agent.isLeader ? 'border-2 border-yellow-600' : ''}`}>
                <div className={`${agent.isLeader ? 'text-5xl' : 'text-4xl'} mb-2`}>
                  {agent.emoji}
                </div>
                <div className="font-semibold">{agent.name}</div>
                <div className="text-xs text-gray-400">{agent.title}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: statusColors[agent.status] }}
                  ></div>
                  <span className="text-xs capitalize">{agent.status}</span>
                </div>
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
              <span className="text-2xl">{agents.find(a => a.name === 'Boris')?.emoji}</span>
              <div>
                <div className="font-semibold text-sm">Boris - Office redesign</div>
                <div className="text-xs text-gray-400 mt-1">Updated team roster and office layout</div>
                <div className="text-xs text-gray-500 mt-1">Just now</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-[#1a1a1a] rounded">
            <div className="flex items-start gap-2">
              <span className="text-2xl">{agents.find(a => a.name === 'Benedict')?.emoji}</span>
              <div>
                <div className="font-semibold text-sm">Benedict - QA review</div>
                <div className="text-xs text-gray-400 mt-1">Testing new office features</div>
                <div className="text-xs text-gray-500 mt-1">5 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
