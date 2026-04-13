import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Users, Shuffle, LayoutGrid, User, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { Person, Group } from '@/src/types';
import Papa from 'papaparse';

interface AutoGroupingProps {
  people: Person[];
}

export function AutoGrouping({ people }: AutoGroupingProps) {
  const [groupSize, setGroupSize] = useState(3);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    if (people.length === 0) return;

    const shuffled = [...people].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      const members = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `第 ${newGroups.length + 1} 組`,
        members
      });
    }

    setGroups(newGroups);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    const data = groups.flatMap(group => 
      group.members.map(member => ({
        '組別': group.name,
        '姓名': member.name
      }))
    );

    const csv = Papa.unparse(data);
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                自動分組
              </CardTitle>
              <CardDescription>
                設定每組人數，系統將自動隨機分配
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {groups.length > 0 && (
                <Button variant="outline" onClick={exportToCSV} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                  <Download className="w-4 h-4 mr-2" /> 下載 CSV
                </Button>
              )}
              <Button 
                onClick={generateGroups} 
                disabled={people.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Shuffle className="w-4 h-4 mr-2" /> 開始分組
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">每組人數: {groupSize} 人</Label>
                <span className="text-xs text-gray-500">預計分為 {Math.ceil(people.length / groupSize)} 組</span>
              </div>
              <Slider
                value={[groupSize]}
                onValueChange={(val) => setGroupSize(val[0])}
                min={2}
                max={Math.max(2, Math.min(people.length, 20))}
                step={1}
                className="py-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map((group, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={group.id}
            >
              <Card className="h-full border-none shadow-sm bg-white hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-1 bg-indigo-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {group.name}
                    <span className="text-xs font-normal text-gray-400">{group.members.length} 人</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.members.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-sm text-gray-700 border border-transparent hover:border-indigo-100 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-indigo-600" />
                        </div>
                        {member.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white/30 rounded-3xl border-2 border-dashed border-gray-200">
          <Users className="w-16 h-16 mb-4 opacity-10" />
          <p>設定人數並點擊「開始分組」以查看結果</p>
        </div>
      )}
    </div>
  );
}
