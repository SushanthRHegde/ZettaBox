import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  reminder: boolean;
  reminderTime: '5' | '10' | '15' | '30' | '60';
}

const TaskScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState<'5' | '10' | '15' | '30' | '60'>('15');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        date: selectedDate,
        time: selectedTime,
        reminder,
        reminderTime,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setReminder(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(`${format(a.date, 'yyyy-MM-dd')}T${a.time}`);
    const dateB = new Date(`${format(b.date, 'yyyy-MM-dd')}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar and Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
          <form onSubmit={handleAddTask} className="space-y-4">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task title..."
            />
            <div className="flex gap-2">
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant={reminder ? 'default' : 'outline'}
                size="icon"
                onClick={() => setReminder(!reminder)}
                className={cn(
                  'h-10 w-10',
                  reminder && 'bg-primary text-primary-foreground'
                )}
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
            {reminder && (
              <Select
                value={reminderTime}
                onValueChange={(value: '5' | '10' | '15' | '30' | '60') =>
                  setReminderTime(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button type="submit" className="w-full">
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tasks List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No tasks scheduled yet
              </p>
            ) : (
              sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(task.date, 'MMM dd, yyyy')}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{task.time}</span>
                      {task.reminder && (
                        <>
                          <Bell className="h-4 w-4 ml-2" />
                          <span>{task.reminderTime}m before</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskScheduler; 