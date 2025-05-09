import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Check,
  Trash2,
  GripVertical,
  Plus,
  Tag,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
}

const priorityColors = {
  low: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-red-500/10 text-red-500',
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('personal');
  const [categories] = useState(['personal', 'work', 'shopping', 'health', 'other']);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        priority: newPriority,
        category: newCategory,
        createdAt: new Date(),
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <form onSubmit={handleAddTodo} className="flex gap-2 items-start">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Select
          value={newPriority}
          onValueChange={(value: 'low' | 'medium' | 'high') => setNewPriority(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={newCategory}
          onValueChange={setNewCategory}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        'flex items-center gap-2 p-3 bg-card rounded-lg border',
                        todo.completed && 'opacity-60'
                      )}
                    >
                      <div {...provided.dragHandleProps} className="cursor-grab">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-5 w-5 p-0 rounded-full',
                          todo.completed && 'bg-primary text-primary-foreground'
                        )}
                        onClick={() => handleToggleComplete(todo.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <span className={cn('flex-1', todo.completed && 'line-through text-muted-foreground')}>
                        {todo.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={cn('flex items-center gap-1', priorityColors[todo.priority])}>
                          <AlertCircle className="h-3 w-3" />
                          {todo.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {todo.category}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList; 