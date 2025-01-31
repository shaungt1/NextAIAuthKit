import { Toggle } from '@/registry/new-york/ui/toggle';
import { FontItalicIcon } from '@radix-ui/react-icons';

export default function ToggleLg() {
    return (
        <Toggle size='lg' aria-label='Toggle italic'>
            <FontItalicIcon className='size-4' />
        </Toggle>
    );
}
