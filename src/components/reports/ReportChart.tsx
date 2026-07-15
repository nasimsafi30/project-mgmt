'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'];

export function ReportChart({ type, data, title }: { type: 'area'|'bar'|'pie'; data: any[]; title: string }) {
  const renderChart = () => {
    switch(type) {
      case 'area':
        return <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2}/></AreaChart>;
      case 'bar':
        return <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" radius={[4,4,0,0]}>{data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart>;
      case 'pie':
        return <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>{data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart>;
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><ResponsiveContainer width="100%" height={300}>{renderChart()}</ResponsiveContainer></CardContent>
    </Card>
  );
}