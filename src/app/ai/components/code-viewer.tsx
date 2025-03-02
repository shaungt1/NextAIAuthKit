import { Button } from '@/registry/new-york/ui/button';
import Link from "next/link";

export default function MutedLink() {
  return (
    <Link
      href="https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html#langchain_openai.chat_models.base.ChatOpenAI"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      LangChain OpenAI Chat Models API
    </Link>
  );
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/registry/new-york/ui/dialog';

interface CodeViewerProps {
    model: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
}

export function CodeViewer({
    model,
    prompt,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty
}: CodeViewerProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>View code</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[625px]'>
                <DialogHeader>
                    <DialogTitle>View code</DialogTitle>
                    <DialogDescription>
                        This Project uses LangChain, You can use the following code to start integrating your project. Install the following package.
                        {' '}
                        <div className='my-3'></div>
                        
                        <code>Install: </code>
                        <code className='text-sky-300'><i>pip install -U langchain-openai</i></code>
                    
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4'>
                    <div className='rounded-md bg-black p-6'>
                        <pre>
                            <code className='grid gap-1 text-sm text-muted-foreground [&_span]:h-4'>
                                <span>
                                <span className='text-violet-500'>from</span><span className='text-sky-300'> langchain_openai <span className='text-violet-500'>import </span></span><span className='text-red-500'>ChatOpenAI</span> 
                                </span>
                                <span />
                                <span>
                                    openai.api_key = os.getenv(
                                    <span className='text-green-300'>&quot;OPENAI_API_KEY&quot;</span>)
                                </span>
                                <span />
                                <span>llm = ChatOpenAI(</span>
                                <span>
                                    {' '}
                                    model=<span className='text-green-300'>&quot;{model}&quot;</span>,
                                </span>
                                <span>
                                    {' '}
                                    prompt=<span className='text-amber-300'>&quot;{prompt}&quot;</span>,
                                </span>
                                <span>
                                    {' '}
                                    temperature=<span className='text-amber-300'>{temperature}</span>,
                                </span>
                                <span>
                                    {' '}
                                    max_tokens=<span className='text-amber-300'>{maxTokens}</span>,
                                </span>
                                <span>
                                    {' '}
                                    top_p=<span className='text-amber-300'>{topP}</span>,
                                </span>
                                <span>
                                    {' '}
                                    frequency_penalty=<span className='text-amber-300'>{frequencyPenalty}</span>,
                                </span>
                                <span>
                                    {' '}
                                    presence_penalty=<span className='text-green-300'>{presencePenalty}</span>,
                                </span>
                                <span>)</span>
                            </code>
                        </pre>
                    </div>
                    <div>
                        <p className='text-sm text-muted-foreground'>
                         You should use environment variables or a secret management tool to expose your key to your applications.
                        </p>
                        <div className='my-3'></div>
                        <DialogDescription> 
                        <Link
                            href="https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html#langchain_openai.chat_models.base.ChatOpenAI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-gray-300 transition-colors"
                            >
                           Source: LangChain OpenAI Chat Models API
                            </Link>
                    </DialogDescription>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
