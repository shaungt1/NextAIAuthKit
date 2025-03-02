'use client'; 
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
// import { presets } from '../../data/presets/presets';
import { useState, useEffect} from 'react';


interface Preset {
    id: any;
    name: string;
    description?: string;
}


export const metadata: Metadata = {
    title: 'Playground',
    description: 'The OpenAI Playground built using the components.'
};

export default function AIPlaygroundPage() {
    const defaultModel = models.length > 0 ? models[0] : { id: 1, name: "GPT-4o" };

    // const [modelName, setModelName] = useState<string>(models[0].name);
    // const [modelId, setModelId] = useState<number>(parseInt(models[0].id || '1'));  // Ensure it's an integer!
    const [presets, setPresets] = useState<Preset[]>([]);
    const [temperature, setTemperature] = useState(0.7);
    const [maxLength, setMaxLength] = useState(256);
    const [topP, setTopP] = useState(0.9);
    const [systemPrompt, setSystemPrompt] = useState('You are an AI assistant');
    const [streaming, setstreaming] = useState(false); 
    const [modelName, setModelName] = useState<string>(defaultModel.name);
    const [modelId, setModelId] = useState<number>(parseInt(defaultModel.id.toString()) || 1); 
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);    

    const handlePresetAdded = (newPreset: Preset) => {
        console.log("🆕 New Preset Added:", newPreset);
        setPresets((prevPresets) => [newPreset, ...prevPresets]); 
    };
    
    // Fetch presets from API
useEffect(() => {
    const fetchPresets = async () => {
        try {
            const response = await fetch("/api/presets");
            if (response.ok) {
                const data = await response.json();
                setPresets(data); // ✅ Update presets state
            } else {
                console.error("❌ Failed to fetch presets");
            }
        } catch (error) {
            console.error("❌ Error fetching presets:", error);
        }
    };
    fetchPresets();
}, []);

// Handle deletion
const handlePresetDeleted = (deletedPresetId: number) => {
    console.log("🗑️ Removing preset from UI:", deletedPresetId);
    setPresets((prevPresets) => prevPresets.filter((preset) => preset.id !== deletedPresetId)); // ✅ Remove deleted preset
};



    //  Handle Deleteing presets
    useEffect(() => {
        console.log("📌 Loading presets...");
        fetch("/api/presets")
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ Presets loaded:", data);
                setPresets(data);
            })
            .catch((error) => console.error("❌ Error loading presets:", error));
    }, []);

    useEffect(() => {
        console.log("📌 Selected preset changed in AIPlayground:", selectedPreset);
    }, [selectedPreset]);

    const handleDeletePreset = (deletedPresetId: number) => {
        console.log("🗑️ Removing preset from UI:", deletedPresetId);
        setPresets((prevPresets) => prevPresets.filter((p) => p.id !== deletedPresetId));
        if (selectedPreset?.id === deletedPresetId) {
            console.log("🔄 Resetting selectedPreset to null.");
            setSelectedPreset(null);
            handlePresetDeleted(deletedPresetId);
        }
    };

    useEffect(() => {
        // ✅ If modelId is NaN or undefined, reset it to the default model's ID
        if (!modelId || isNaN(modelId)) {
            console.warn("⚠️ Model ID is invalid. Resetting to default.");
            setModelId(parseInt(models[0]?.id?.toString() || "1"));
            setModelName(models[0]?.name || "GPT-4o");
        }

        console.log("📌 Default Model Loaded:", { modelId, modelName });
    }, []);
  
    useEffect(() => {
        console.log('Temperature:', temperature);
    }, [temperature]);

    useEffect(() => {
        console.log('Max Length:', maxLength);
    }, [maxLength]);

    useEffect(() => {
        console.log('Top P:', topP);
    }, [topP]);

    return (
        <>
            <div className='px-4 mx-4 h-full  w-full flex flex-col'>
                <div className='container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16'>
                    <h2 className='text-lg text-nowrap font-semibold'>AI Playground</h2>
                    <div className='flex items-center flex-row space-x-2'>
                     <div className='flex items-center px-4 flex-row space-x-6'>
                        <div className='text-sm text-muted-foreground'>
                        <code>
                        Developers: Add your OpenAI API key to the .env file before using the chat window. 
                        Example: <code className="bg-gray-500 opacity-50 text-zinc-100 p-1 rounded">OPENAI_API_KEY=your-api-key-here</code>.
                        </code>
                        </div>
                    </div>
                    </div>
                                          
                    <div className='ml-auto flex w-full space-x-2 sm:justify-end'>
                        <PresetSelector presets={presets} onPresetSelect={(preset) => {
                            console.log("📌 Preset selected:", preset);
                            setSelectedPreset(preset);
                        }} />
                        <PresetSave 
                         modelId={modelId}
                         prompt={systemPrompt} 
                         temperature={temperature} 
                         maxTokens={maxLength} 
                         topP={topP} 
                         frequencyPenalty={0} 
                         presencePenalty={0}
                         onPresetAdded={handlePresetAdded} 
                        />
                        <div className='space-x-2 md:flex'>
                        {/* current properties for LLM */}
                        <CodeViewer 
                            model={modelName} 
                            prompt={systemPrompt} 
                            temperature={temperature} 
                            maxTokens={maxLength} 
                            topP={topP} 
                            frequencyPenalty={0} 
                            presencePenalty={0} 
                        />

                            <PresetShare />
                        </div>
                        <PresetActions 
                            selectedPreset={selectedPreset} 
                            onDeletePreset={handleDeletePreset} 
                        />
                    </div>
                </div>
                <Separator />
                <Tabs defaultValue='complete'  className='flex-1'>
                    <div className='container max-h-full py-6'>
                        <div className='grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]'>
                            <div className='flex-col space-y-4 sm:flex md:order-2'>
                                <div className='grid gap-2'>
                                    <HoverCard openDelay={200}>
                                        <HoverCardTrigger asChild>
                                            <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                                Mode
                                            </span>
                                        </HoverCardTrigger>
                                        <HoverCardContent className='w-[320px] text-sm' side='left'>
                                            Choose the interface that best suits your task. You can provide: a simple
                                            prompt to complete, starting and ending text to insert a completion within,
                                            or some text with instructions to edit it.
                                        </HoverCardContent>
                                    </HoverCard>
                                    <TabsList className='grid grid-cols-3'>
                                        <TabsTrigger value='complete'>
                                            <span className='sr-only'>Complete</span>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='none'
                                                className='size-5'>
                                                <rect
                                                    x='4'
                                                    y='3'
                                                    width='12'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='4'
                                                    y='7'
                                                    width='12'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='4'
                                                    y='11'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='4'
                                                    y='15'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='8.5'
                                                    y='11'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='8.5'
                                                    y='15'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='13'
                                                    y='11'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                            </svg>
                                        </TabsTrigger>
                                        <TabsTrigger value='insert'>
                                            <span className='sr-only'>Insert</span>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='none'
                                                className='size-5'>
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z'
                                                    fill='currentColor'></path>
                                                <rect
                                                    x='4'
                                                    y='15'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='8.5'
                                                    y='15'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='13'
                                                    y='15'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                            </svg>
                                        </TabsTrigger>
                                        <TabsTrigger value='edit'>
                                            <span className='sr-only'>Edit</span>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='none'
                                                className='size-5'>
                                                <rect
                                                    x='4'
                                                    y='3'
                                                    width='12'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='4'
                                                    y='7'
                                                    width='12'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='4'
                                                    y='11'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='4'
                                                    y='15'
                                                    width='4'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <rect
                                                    x='8.5'
                                                    y='11'
                                                    width='3'
                                                    height='2'
                                                    rx='1'
                                                    fill='currentColor'></rect>
                                                <path
                                                    d='M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z'
                                                    fill='currentColor'></path>
                                            </svg>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <ModelSelector
                                    // models={models}
                                    onModelSelect={(model) => {
                                      
                                        setModelName(model.name);
                                        setModelId(model.id); 
                                        console.log("Model selected in AIPlaygroundPage:", model.name, model.id);  
                                    }}
                                />
                                <TemperatureSelector defaultValue={[temperature]} onValueChange={setTemperature} />
                                <MaxLengthSelector defaultValue={[maxLength]} onValueChange={setMaxLength} />
                                <TopPSelector defaultValue={[topP]} onValueChange={setTopP} />
                            </div>
                            <div className='md:order-1'>
                                <TabsContent value='complete' className='mt-0 border-0 p-0'>
                                       <div className='flex h-[32rem] flex-col space-y-4'>
                                       <AIChatWindow modelName={modelName}  systemPrompt={systemPrompt} temperature={temperature} maxLength={maxLength} topP={topP} />
                                       </div>
                                </TabsContent>
                                <TabsContent value='insert' className='mt-0 border-0 p-0'>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1'>
                                        <AIChatWindow modelName={modelName} systemPrompt={systemPrompt} temperature={temperature} maxLength={maxLength} topP={topP} />
                                            <div className='rounded-md border bg-muted'></div>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <Button>Submit</Button>
                                            <Button variant='secondary'>
                                                <span className='sr-only'>Show history</span>
                                                <CounterClockwiseClockIcon className='size-4' />
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value='edit' className='mt-0 border-0 p-0'>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='grid h-full gap-6 lg:grid-cols-2'>
                                            <div className='flex flex-col space-y-4'>
                                                <div className='flex flex-1 flex-col space-y-2'>
                                                    <Label htmlFor='input'>Input</Label>
                                                    <AIChatWindow modelName={modelName} systemPrompt={systemPrompt} temperature={temperature} maxLength={maxLength} topP={topP} />
                                                </div>
                                                <div className='flex flex-col space-y-2'>
                                                    <Label htmlFor='instructions'>Instructions</Label>
                                                    <Textarea id='instructions' placeholder='Fix the grammar.' />
                                                </div>
                                            </div>
                                            <div className='mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]' />
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <Button>Submit</Button>
                                            <Button variant='secondary'>
                                                <span className='sr-only'>Show history</span>
                                                <CounterClockwiseClockIcon className='size-4' />
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </div>
                    </div>
                </Tabs>
            </div>
        </>
    );
}


