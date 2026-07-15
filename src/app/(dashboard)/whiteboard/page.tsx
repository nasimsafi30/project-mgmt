'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Undo,
  Redo,
  Download,
  Share2,
  Users,
  MousePointer,
  Minus,
  Plus,
  Move,
  StickyNote,
  Palette,
  Grid,
  Trash2,
  Image,
  Save,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Highlighter,
  PenTool,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DrawingElement {
  id: string;
  type: 'pen' | 'rectangle' | 'circle' | 'text' | 'sticky' | 'highlighter';
  points?: Array<{ x: number; y: number }>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
  opacity: number;
}

interface WhiteboardUser {
  id: string;
  name: string;
  color: string;
  avatar: string;
  cursor: { x: number; y: number } | null;
}

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>('pen');
  const [color, setColor] = useState('#3B82F6');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingElement[][]>([]);
  const [users] = useState<WhiteboardUser[]>([
    { id: '1', name: 'John D.', color: '#3B82F6', avatar: 'JD', cursor: null },
    { id: '2', name: 'Jane S.', color: '#10B981', avatar: 'JS', cursor: null },
    { id: '3', name: 'Alex K.', color: '#F59E0B', avatar: 'AK', cursor: null },
  ]);
  const [isPanning, setIsPanning] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeColorTab, setActiveColorTab] = useState<'preset' | 'custom'>('preset');
  
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const presetColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#000000', '#FFFFFF', '#6B7280', '#DC2626', '#059669',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [elements, zoom, offset, showGrid]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    
    // Grid
    if (showGrid) {
      const gridSize = 25;
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      for (let x = -offset.x / zoom; x < canvas.width / zoom; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -offset.y / zoom);
        ctx.lineTo(x, (canvas.height - offset.y) / zoom);
        ctx.stroke();
      }
      for (let y = -offset.y / zoom; y < canvas.height / zoom; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-offset.x / zoom, y);
        ctx.lineTo((canvas.width - offset.x) / zoom, y);
        ctx.stroke();
      }
      
      // Major grid lines
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      for (let x = -offset.x / zoom; x < canvas.width / zoom; x += gridSize * 4) {
        ctx.beginPath();
        ctx.moveTo(x, -offset.y / zoom);
        ctx.lineTo(x, (canvas.height - offset.y) / zoom);
        ctx.stroke();
      }
      for (let y = -offset.y / zoom; y < canvas.height / zoom; y += gridSize * 4) {
        ctx.beginPath();
        ctx.moveTo(-offset.x / zoom, y);
        ctx.lineTo((canvas.width - offset.x) / zoom, y);
        ctx.stroke();
      }
    }
    
    // Draw elements
    elements.forEach(element => {
      ctx.save();
      ctx.globalAlpha = element.type === 'highlighter' ? 0.3 : element.opacity;
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = element.type === 'highlighter' ? element.strokeWidth * 3 : element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      switch (element.type) {
        case 'pen':
        case 'highlighter':
          if (element.points && element.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            
            if (element.points.length === 2) {
              ctx.lineTo(element.points[1].x, element.points[1].y);
            } else {
              for (let i = 1; i < element.points.length - 2; i++) {
                const xc = (element.points[i].x + element.points[i + 1].x) / 2;
                const yc = (element.points[i].y + element.points[i + 1].y) / 2;
                ctx.quadraticCurveTo(element.points[i].x, element.points[i].y, xc, yc);
              }
              ctx.lineTo(element.points[element.points.length - 1].x, element.points[element.points.length - 1].y);
            }
            ctx.stroke();
          }
          break;
        case 'rectangle':
          if (element.x !== undefined && element.y !== undefined && element.width && element.height) {
            // Rounded rectangle
            const radius = 4;
            const x = element.x;
            const y = element.y;
            const w = element.width;
            const h = element.height;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.stroke();
          }
          break;
        case 'circle':
          if (element.x !== undefined && element.y !== undefined && element.width) {
            ctx.beginPath();
            ctx.ellipse(
              element.x, 
              element.y, 
              Math.abs(element.width / 2), 
              Math.abs((element.height || element.width) / 2), 
              0, 0, Math.PI * 2
            );
            ctx.stroke();
          }
          break;
        case 'text':
          if (element.text && element.x !== undefined && element.y !== undefined) {
            const fontSize = element.strokeWidth * 6;
            ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
            ctx.fillText(element.text, element.x, element.y + fontSize * 0.8);
          }
          break;
        case 'sticky':
          if (element.x !== undefined && element.y !== undefined && element.width && element.height) {
            // Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Sticky note body
            ctx.fillStyle = '#FEF3C7';
            ctx.fillRect(element.x, element.y, element.width, element.height);
            
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 2;
            ctx.strokeRect(element.x, element.y, element.width, element.height);
            
            // Fold effect
            ctx.fillStyle = '#FDE68A';
            ctx.beginPath();
            ctx.moveTo(element.x + element.width - 20, element.y);
            ctx.lineTo(element.x + element.width, element.y);
            ctx.lineTo(element.x + element.width, element.y + 20);
            ctx.closePath();
            ctx.fill();
            
            if (element.text) {
              ctx.fillStyle = '#1F2937';
              ctx.font = '500 14px Inter, system-ui, sans-serif';
              const words = element.text.split(' ');
              const lines: string[] = [];
              let currentLine = '';
              words.forEach(word => {
                const testLine = currentLine + word + ' ';
                if (ctx.measureText(testLine).width > element.width! - 20) {
                  lines.push(currentLine);
                  currentLine = word + ' ';
                } else {
                  currentLine = testLine;
                }
              });
              lines.push(currentLine);
              
              lines.forEach((line, i) => {
                ctx.fillText(line.trim(), element.x! + 10, element.y! + 30 + i * 20);
              });
            }
          }
          break;
      }
      ctx.restore();
    });
    
    ctx.restore();
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }
    
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    lastPoint.current = point;
    setUndoStack(prev => [...prev, elements]);
    setRedoStack([]);
    
    if (currentTool === 'pen' || currentTool === 'highlighter') {
      const newElement: DrawingElement = {
        id: crypto.randomUUID(),
        type: currentTool as 'pen' | 'highlighter',
        points: [point],
        color: currentTool === 'highlighter' ? '#FEF08A' : color,
        strokeWidth,
        opacity: 1,
      };
      setElements(prev => [...prev, newElement]);
    } else if (['rectangle', 'circle', 'sticky'].includes(currentTool)) {
      const newElement: DrawingElement = {
        id: crypto.randomUUID(),
        type: currentTool as any,
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        color: currentTool === 'sticky' ? '#F59E0B' : color,
        strokeWidth,
        opacity: 1,
      };
      setElements(prev => [...prev, newElement]);
    } else if (currentTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement: DrawingElement = {
          id: crypto.randomUUID(),
          type: 'text',
          x: point.x,
          y: point.y,
          text,
          color,
          strokeWidth,
          opacity: 1,
        };
        setElements(prev => [...prev, newElement]);
        setIsDrawing(false);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }
    if (!isDrawing) return;
    
    const point = getCanvasPoint(e);
    
    if (currentTool === 'pen' || currentTool === 'highlighter') {
      setElements(prev => {
        const last = prev[prev.length - 1];
        if (last && (last.type === 'pen' || last.type === 'highlighter')) {
          const updated = { ...last, points: [...(last.points || []), point] };
          return [...prev.slice(0, -1), updated];
        }
        return prev;
      });
    } else if (['rectangle', 'circle', 'sticky'].includes(currentTool)) {
      setElements(prev => {
        const last = prev[prev.length - 1];
        if (last && last.x !== undefined) {
          return [...prev.slice(0, -1), {
            ...last,
            width: point.x - (last.x || 0),
            height: point.y - (last.y || 0),
          }];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
    lastPoint.current = null;
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      setRedoStack(prev => [...prev, elements]);
      setElements(undoStack[undoStack.length - 1]);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      setUndoStack(prev => [...prev, elements]);
      setElements(redoStack[redoStack.length - 1]);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (confirm('Clear the entire whiteboard? This cannot be undone.')) {
      setUndoStack(prev => [...prev, elements]);
      setElements([]);
      toast.success('Whiteboard cleared');
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Whiteboard exported as PNG!');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.25, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.25, 0.1));
  const handleResetZoom = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  const tools = [
    { id: 'pan', icon: Move, label: 'Pan', shortcut: 'H' },
    { id: 'select', icon: MousePointer, label: 'Select', shortcut: 'V' },
    { id: 'pen', icon: PenTool, label: 'Pen', shortcut: 'P' },
    { id: 'highlighter', icon: Highlighter, label: 'Highlighter', shortcut: '⇧P' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'O' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
    { id: 'sticky', icon: StickyNote, label: 'Sticky Note', shortcut: 'S' },
    { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
              <PenTool className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Whiteboard</h1>
              <p className="text-slate-300 text-sm">Collaborative drawing & planning</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {users.map(user => (
                <Avatar 
                  key={user.id} 
                  className="border-2 border-slate-700 h-9 w-9 ring-2 ring-white/10 transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: user.color }}
                >
                  <AvatarFallback className="text-white text-xs font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
              ))}
              <div className="h-9 w-9 rounded-full bg-white/10 border-2 border-slate-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
                +2
              </div>
            </div>
            <Badge className="bg-white/10 text-white border-0 gap-1.5 backdrop-blur-sm">
              <Users className="w-3 h-3" />{users.length + 2}
            </Badge>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 shadow-lg">
        <div className="p-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            {tools.map(tool => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentTool(tool.id)}
                title={`${tool.label} (${tool.shortcut})`}
                className={cn(
                  'h-9 px-3 gap-2 rounded-xl transition-all duration-200',
                  currentTool === tool.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <tool.icon className="w-4 h-4" />
                <span className="hidden lg:inline text-xs font-medium">{tool.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {presetColors.slice(0, 8).map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-7 h-7 rounded-lg transition-all duration-200 hover:scale-110',
                      color === c && 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                className="w-7 h-7 rounded-lg cursor-pointer border-0"
              />
            </div>
            
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            
            {/* Stroke Width */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-2 min-w-[60px]">
                <div 
                  className="rounded-full bg-gray-900 dark:bg-white"
                  style={{ width: strokeWidth * 2, height: strokeWidth * 2 }}
                />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6">{strokeWidth}px</span>
              </div>
              <button 
                onClick={() => setStrokeWidth(Math.min(20, strokeWidth + 1))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            
            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleUndo} className="h-9 w-9 rounded-xl" title="Undo (Ctrl+Z)">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} className="h-9 w-9 rounded-xl" title="Redo (Ctrl+Y)">
                <Redo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClear} className="h-9 w-9 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Clear All">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-9 w-9 rounded-xl">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-14 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-9 w-9 rounded-xl">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResetZoom} className="rounded-xl text-xs">
                <RotateCcw className="w-3 h-3 mr-1" />Reset
              </Button>
            </div>
            
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            
            <Button 
              variant={showGrid ? 'default' : 'ghost'} 
              size="icon" 
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                'h-9 w-9 rounded-xl',
                showGrid && 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              )}
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl gap-2">
                <Download className="w-4 h-4" />Export
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl gap-2">
                <Share2 className="w-4 h-4" />Share
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="flex-1 overflow-hidden relative dark:bg-gray-900 dark:border-gray-800 shadow-xl">
        <div ref={containerRef} className="absolute inset-0 bg-[#fafafa] dark:bg-gray-950 rounded-xl overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
              cursor: currentTool === 'pan' 
                ? (isPanning ? 'grabbing' : 'grab') 
                : currentTool === 'text' 
                  ? 'text' 
                  : 'crosshair' 
            }}
          />
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 shadow-lg border border-gray-200 dark:border-gray-700">
            {Math.round(zoom * 100)}% • {elements.length} objects
          </div>
          
          {/* Tool indicator */}
          {isDrawing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
              Drawing {currentTool}...
            </div>
          )}
        </div>
      </Card>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 px-2">
        <div className="flex items-center gap-4">
          <span>🎨 {elements.length} elements</span>
          <span>💾 Auto-saved</span>
        </div>
        <div className="flex items-center gap-4">
          <span>🖱️ Click + drag to draw</span>
          <span>🔄 Scroll to zoom</span>
          <span>⌨️ Space + drag to pan</span>
        </div>
      </div>
    </div>
  );
}

