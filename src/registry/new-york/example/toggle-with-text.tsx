import { Toggle } from '@/registry/new-york/ui/toggle';
import { FontItalicIcon } from '@radix-ui/react-icons';

export default function ToggleWithText() {
    return (
        <Toggle aria-label='Toggle italic'>
            <FontItalicIcon />
            Italic
        </Toggle>
    );
}
