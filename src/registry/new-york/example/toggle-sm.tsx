import { Toggle } from '@/registry/new-york/ui/toggle';
import { FontItalicIcon } from '@radix-ui/react-icons';

export default function ToggleSm() {
    return (
        <Toggle size='sm' aria-label='Toggle italic'>
            <FontItalicIcon className='size-4' />
        </Toggle>
    );
}
