'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { useConfig } from '@/app/hooks/use-config';
import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/registry/default/ui/card';
import { baseColors } from '@/registry/registry-base-colors';

import { Minus, Plus } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';

const data = [
    {
        goal: 400
    },
    {
        goal: 300
    },
    {
        goal: 200
    },
    {
        goal: 300
    },
    {
        goal: 200
    },
    {
        goal: 278
    },
    {
        goal: 189
    },
    {
        goal: 239
    },
    {
        goal: 300
    },
    {
        goal: 200
    },
    {
        goal: 278
    },
    {
        goal: 189
    },
    {
        goal: 349
    }
];

export function CardsActivityGoal() {
    const { theme: mode } = useTheme();
    const [config] = useConfig();

    const baseColor = baseColors.find((baseColor) => baseColor.name === config.theme);
    const [goal, setGoal] = React.useState(350);

    function onClick(adjustment: number) {
        setGoal(Math.max(200, Math.min(400, goal + adjustment)));
    }

    return (
        <Card>
            <CardHeader className='pb-4'>
                <CardTitle className='text-base'>Move Goal</CardTitle>
                <CardDescription>Set your daily activity goal.</CardDescription>
            </CardHeader>
            <CardContent className='pb-2'>
                <div className='flex items-center justify-center space-x-2'>
                    <Button
                        variant='outline'
                        size='icon'
                        className='size-8 shrink-0 rounded-full'
                        onClick={() => onClick(-10)}
                        disabled={goal <= 200}>
                        <Minus className='size-4' />
                        <span className='sr-only'>Decrease</span>
                    </Button>
                    <div className='flex-1 text-center'>
                        <div className='text-5xl font-bold tracking-tighter'>{goal}</div>
                        <div className='text-[0.70rem] uppercase text-muted-foreground'>Calories/day</div>
                    </div>
                    <Button
                        variant='outline'
                        size='icon'
                        className='size-8 shrink-0 rounded-full'
                        onClick={() => onClick(10)}
                        disabled={goal >= 400}>
                        <Plus className='size-4' />
                        <span className='sr-only'>Increase</span>
                    </Button>
                </div>
                <div className='my-3 h-[60px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={data}>
                            <Bar
                                dataKey='goal'
                                style={
                                    {
                                        fill: 'var(--theme-primary)',
                                        opacity: 0.2,
                                        '--theme-primary': `hsl(${
                                            baseColor?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary
                                        })`
                                    } as React.CSSProperties
                                }
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter>
                <Button className='w-full'>Set Goal</Button>
            </CardFooter>
        </Card>
    );
}
