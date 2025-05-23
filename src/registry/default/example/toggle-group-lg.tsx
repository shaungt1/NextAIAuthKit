import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/toggle-group';

import { Bold, Italic, Underline } from 'lucide-react';

export default function ToggleGroupDemo() {
    return (
        <ToggleGroup size={'lg'} type='multiple'>
            <ToggleGroupItem value='bold' aria-label='Toggle bold'>
                <Bold className='size-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='italic' aria-label='Toggle italic'>
                <Italic className='size-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='underline' aria-label='Toggle underline'>
                <Underline className='size-4' />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
