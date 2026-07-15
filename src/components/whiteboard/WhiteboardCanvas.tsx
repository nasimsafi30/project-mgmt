'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Square, Circle, Type, Eraser, Undo, Redo, Download, Trash2, Grid, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Element { id: string; type: string; points?: {x:number;y:number}[]; x?:number; y?:number; width?:number; height?:number; text?:string; color: string; strokeWidth: number; }

export function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#3B82F6');
  const [width, setWidth] = useState(3);
  const [elements, setElements] = useState<Element[]>([]);
  const [undoStack, setUndoStack] = useState<Element[][]>([]);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const c = canvasRef.current; if(!c) return;
    const resize = () => { const p = containerRef.current; if(!p) return; c.width=p.clientWidth; c.height=p.clientHeight; redraw(); };
    resize(); window.addEventListener('resize',resize);
    return () => window.removeEventListener('resize',resize);
  },[]);

  useEffect(() => { redraw(); }, [elements, zoom, showGrid]);

  const redraw = () => {
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext('2d'); if(!ctx) return;
    ctx.clearRect(0,0,c.width,c.height); ctx.save(); ctx.scale(zoom,zoom);
    if(showGrid) { ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=0.5; for(let x=0;x<c.width/zoom;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height/zoom);ctx.stroke();} for(let y=0;y<c.height/zoom;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width/zoom,y);ctx.stroke();} }
    elements.forEach(e=>{
      ctx.save(); ctx.strokeStyle=e.color; ctx.fillStyle=e.color; ctx.lineWidth=e.strokeWidth; ctx.lineCap='round';
      if(e.type==='pen'&&e.points){ ctx.beginPath(); ctx.moveTo(e.points[0].x,e.points[0].y); e.points.forEach(p=>ctx.lineTo(p.x,p.y)); ctx.stroke(); }
      else if(e.type==='rect'&&e.x!==undefined){ ctx.strokeRect(e.x,e.y!,e.width||0,e.height||0); }
      else if(e.type==='circle'&&e.x!==undefined){ ctx.beginPath(); ctx.ellipse(e.x,e.y!,Math.abs((e.width||0)/2),Math.abs((e.height||0)/2),0,0,Math.PI*2); ctx.stroke(); }
      else if(e.type==='text'&&e.text){ ctx.font=`${e.strokeWidth*5}px Arial`; ctx.fillText(e.text,e.x!,e.y!); }
      ctx.restore();
    });
    ctx.restore();
  };

  const getPoint = (e: React.MouseEvent) => { const c = canvasRef.current!; const r = c.getBoundingClientRect(); return { x:(e.clientX-r.left)/zoom, y:(e.clientY-r.top)/zoom }; };

  const handleDown = (e: React.MouseEvent) => {
    if(tool==='eraser') return;
    const p = getPoint(e); setDrawing(true); setUndoStack([...undoStack, elements]);
    if(tool==='pen') setElements([...elements, { id:crypto.randomUUID(), type:'pen', points:[p], color, strokeWidth:width }]);
    else if(tool==='text') { const t = prompt('Text:'); if(t) setElements([...elements, { id:crypto.randomUUID(), type:'text', x:p.x, y:p.y, text:t, color, strokeWidth:width }]); }
    else setElements([...elements, { id:crypto.randomUUID(), type:tool==='rect'?'rect':'circle', x:p.x, y:p.y, width:0, height:0, color, strokeWidth:width }]);
  };

  const handleMove = (e: React.MouseEvent) => {
    if(!drawing) return;
    const p = getPoint(e);
    setElements(prev => { const last = prev[prev.length-1];
      if(last.type==='pen') return [...prev.slice(0,-1), {...last, points:[...(last.points||[]),p]}];
      return [...prev.slice(0,-1), {...last, width:p.x-last.x!, height:p.y-last.y!}];
    });
  };

  const handleUp = () => setDrawing(false);
  const undo = () => { if(undoStack.length) { setElements(undoStack[undoStack.length-1]); setUndoStack(undoStack.slice(0,-1)); } };
  const clear = () => { if(confirm('Clear?')) { setUndoStack([...undoStack, elements]); setElements([]); } };
  const export_ = () => { const c=canvasRef.current!; const a=document.createElement('a'); a.download='whiteboard.png'; a.href=c.toDataURL(); a.click(); };

  const tools = [
    { id:'pen', icon:Pencil, label:'Pen' }, { id:'rect', icon:Square, label:'Rectangle' },
    { id:'circle', icon:Circle, label:'Circle' }, { id:'text', icon:Type, label:'Text' }, { id:'eraser', icon:Eraser, label:'Eraser' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2 p-2 bg-white rounded-xl border">
        <div className="flex items-center gap-1">
          {tools.map(t=> <Button key={t.id} variant={tool===t.id?'default':'ghost'} size="icon" onClick={()=>setTool(t.id)} title={t.label} className="h-9 w-9"><t.icon className="w-4 h-4"/></Button> )}
          <div className="w-px h-6 bg-gray-200 mx-1"/>
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer"/>
          <input type="range" min="1" max="10" value={width} onChange={e=>setWidth(+e.target.value)} className="w-20"/>
          <div className="w-px h-6 bg-gray-200 mx-1"/>
          <Button variant="ghost" size="icon" onClick={undo}><Undo className="w-4 h-4"/></Button>
          <Button variant="ghost" size="icon" onClick={clear} className="text-red-500"><Trash2 className="w-4 h-4"/></Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={()=>setZoom(z=>Math.max(0.1,z-0.1))}><Minus className="w-4 h-4"/></Button>
          <span className="text-sm w-12 text-center">{Math.round(zoom*100)}%</span>
          <Button variant="ghost" size="icon" onClick={()=>setZoom(z=>Math.min(3,z+0.1))}><Plus className="w-4 h-4"/></Button>
          <Button variant={showGrid?'default':'ghost'} size="icon" onClick={()=>setShowGrid(!showGrid)}><Grid className="w-4 h-4"/></Button>
          <Button variant="outline" size="sm" onClick={export_}><Download className="w-4 h-4 mr-2"/>Export</Button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 bg-gray-50 rounded-xl border overflow-hidden relative">
        <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" onMouseDown={handleDown} onMouseMove={handleMove} onMouseUp={handleUp} onMouseLeave={handleUp}/>
      </div>
    </div>
  );
}