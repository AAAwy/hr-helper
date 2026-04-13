import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Trash2, Users, AlertCircle, Sparkles } from 'lucide-react';
import Papa from 'papaparse';
import { Person } from '@/src/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ListManagerProps {
  people: Person[];
  onUpdate: (people: Person[]) => void;
}

const MOCK_DATA = [
  "陳小明", "林美玲", "張大同", "王婉婷", "李志豪", 
  "吳淑芬", "劉建宏", "蔡依林", "楊丞琳", "周杰倫",
  "郭台銘", "張忠謀", "黃仁勳", "蘇姿丰", "馬斯克"
];

export function ListManager({ people, onUpdate }: ListManagerProps) {
  const [rawInput, setRawInput] = useState('');

  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    people.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [people]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const newPeople: Person[] = results.data
          .map((row: any) => {
            const name = Array.isArray(row) ? row[0] : row.name || Object.values(row)[0];
            return name ? { id: Math.random().toString(36).substr(2, 9), name: String(name).trim() } : null;
          })
          .filter((p): p is Person => p !== null && p.name !== '');
        
        onUpdate([...people, ...newPeople]);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleManualAdd = () => {
    const names = rawInput
      .split('\n')
      .map(n => n.trim())
      .filter(n => n !== '');
    
    const newPeople: Person[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...people, ...newPeople]);
    setRawInput('');
  };

  const loadMockData = () => {
    const mockPeople: Person[] = MOCK_DATA.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...people, ...mockPeople]);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniquePeople = people.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniquePeople);
  };

  const removePerson = (id: string) => {
    onUpdate(people.filter(p => p.id !== id));
  };

  const clearAll = () => {
    onUpdate([]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              新增名單
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadMockData} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
              <Sparkles className="w-4 h-4 mr-1" /> 載入模擬名單
            </Button>
          </div>
          <CardDescription>
            上傳 CSV 檔案或直接貼上姓名（每行一個）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">上傳 CSV</label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">或</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">貼上姓名</label>
            <Textarea
              placeholder="王小明&#10;李小華&#10;張大同"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="min-h-[150px] font-sans"
            />
            <Button 
              onClick={handleManualAdd} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!rawInput.trim()}
            >
              加入名單
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              目前名單 ({people.length})
            </CardTitle>
            <CardDescription>
              管理已加入的成員
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {duplicates.size > 0 && (
              <Button variant="outline" size="sm" onClick={removeDuplicates} className="text-amber-600 border-amber-200 hover:bg-amber-50">
                <Trash2 className="w-4 h-4 mr-1" /> 移除重複
              </Button>
            )}
            {people.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-1" /> 清空
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px] pr-4">
            {people.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>尚未加入任何成員</p>
              </div>
            ) : (
              <div className="space-y-2">
                {people.map((person) => (
                  <div 
                    key={person.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${
                      duplicates.has(person.name) 
                        ? 'bg-amber-50 border-amber-200 hover:border-amber-300' 
                        : 'bg-white border-gray-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{person.name}</span>
                      {duplicates.has(person.name) && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                          <AlertCircle className="w-3 h-3" /> 重複
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removePerson(person.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for input file
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
