import { Metadata } from 'next';
import Image from 'next/image';
import AIChatWindow from './ai-chat-window';
import { Button } from '@/registry/new-york/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/new-york/ui/hover-card';
import { Label } from '@/registry/new-york/ui/label';
import { Separator } from '@/registry/new-york/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { Textarea } from '@/registry/new-york/ui/textarea';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';

import { CodeViewer } from './components/code-viewer';
import { MaxLengthSelector } from './components/maxlength-selector';
import { ModelSelector } from './components/model-selector';
import { PresetActions } from './components/preset-actions';
import { PresetSave } from './components/preset-save';
import { PresetSelector } from './components/preset-selector';
import { PresetShare } from './components/preset-share';
import { TemperatureSelector } from './components/temperature-selector';
import { TopPSelector } from './components/top-p-selector';
import { models, types } from '../../data/llm-models/models';
import { presets } from '../../data/presets/presets';
import AIPlaygroundPage from './ai-playground-page';

export const metadata: Metadata = {
    title: 'Playground',
    description: 'The OpenAI Playground built using the components.'
};

export default function AIPlaygroundLayout() {
    
    return (
        <>
        <div>
        <AIPlaygroundPage /> 
        </div>
        </>
    );
}
