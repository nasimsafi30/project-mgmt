'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronLeft, ChevronRight, Rocket, Users, Layout, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id:'welcome', title:'Welcome!', desc:'Lets get you set up', icon: Rocket },
  { id:'team', title:'Your Team', desc:'Tell us about your team', icon: Users },
  { id:'project', title:'First Project', desc:'Create your first project', icon: Layout },
  { id:'done', title:'All Set!', desc:'Youre ready to go', icon: PartyPopper },
];

export function OnboardingWizard({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ company:'', teamSize:'', projectName:'' });
  const progress = ((step+1)/steps.length)*100;

  const next = () => step < steps.length-1 ? setStep(step+1) : onComplete(data);
  const back = () => step > 0 && setStep(step-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8">
          <Progress value={progress} className="h-2 mb-6" />
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Rocket className="w-8 h-8 text-blue-500" /></div>
                <h2 className="text-2xl font-bold">{steps[step].title}</h2>
                <p className="text-gray-500">{steps[step].desc}</p>
              </div>
              {step===1 && <div className="space-y-4">
                <div className="space-y-2"><Label>Company Name</Label><Input value={data.company} onChange={e=>setData({...data,company:e.target.value})} placeholder="Acme Corp" /></div>
                <div className="space-y-2"><Label>Team Size</Label><Input value={data.teamSize} onChange={e=>setData({...data,teamSize:e.target.value})} placeholder="5-10" /></div>
              </div>}
              {step===2 && <div className="space-y-4">
                <div className="space-y-2"><Label>Project Name</Label><Input value={data.projectName} onChange={e=>setData({...data,projectName:e.target.value})} placeholder="My First Project" /></div>
              </div>}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={back} disabled={step===0}><ChevronLeft className="w-4 h-4 mr-2"/>Back</Button>
            <Button onClick={next}>{step===steps.length-1?<>Get Started<PartyPopper className="w-4 h-4 ml-2"/></>:<>Continue<ChevronRight className="w-4 h-4 ml-2"/></>}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}