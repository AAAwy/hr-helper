import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListManager } from './components/ListManager';
import { LuckyDraw } from './components/LuckyDraw';
import { AutoGrouping } from './components/AutoGrouping';
import { Person } from './types';
import { Users, Trophy, LayoutGrid, ClipboardList, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-pink-100/30 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>HR 專業管理工具</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4"
          >
            HR Smart <span className="text-indigo-600">Toolkit</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg"
          >
            輕鬆管理名單、公平抽籤、快速分組。為您的企業活動提供最流暢的數位體驗。
          </motion.p>
        </header>

        {/* Main Content */}
        <main>
          <Tabs defaultValue="list" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-white/80 backdrop-blur-md border border-slate-200 p-1 h-auto shadow-sm rounded-2xl">
                <TabsTrigger value="list" className="rounded-xl px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  名單管理
                </TabsTrigger>
                <TabsTrigger value="draw" className="rounded-xl px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <Trophy className="w-4 h-4 mr-2" />
                  獎品抽籤
                </TabsTrigger>
                <TabsTrigger value="group" className="rounded-xl px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  自動分組
                </TabsTrigger>
              </TabsList>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TabsContent value="list" className="mt-0 outline-none">
                <ListManager people={people} onUpdate={setPeople} />
              </TabsContent>
              
              <TabsContent value="draw" className="mt-0 outline-none">
                {people.length === 0 ? (
                  <EmptyState message="請先在「名單管理」中加入成員" />
                ) : (
                  <LuckyDraw people={people} />
                )}
              </TabsContent>

              <TabsContent value="group" className="mt-0 outline-none">
                {people.length === 0 ? (
                  <EmptyState message="請先在「名單管理」中加入成員" />
                ) : (
                  <AutoGrouping people={people} />
                )}
              </TabsContent>
            </motion.div>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© 2024 HR Smart Toolkit. Designed for professional human resources.</p>
        </footer>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
      <Users className="w-16 h-16 text-slate-200 mb-4" />
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}
