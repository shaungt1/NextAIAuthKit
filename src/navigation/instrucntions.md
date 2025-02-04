# Nav List Registry

## Instructions on How to Use the Navigation List

1. **Define Navigation Items:**
   - Open the `examples-nav.tsx` file.
   - Define your navigation items in the `examples` array.
   - Each item should have a `name`, `href`, and `code` property.
   ```tsx
   const examples = [
       {
           name: 'Mailz',
           href: '/examples/mail',
           code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/mail'
       },
       {
           name: 'Dashboard',
           href: '/examples/dashboard',
           code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard'
       },
       {
           name: 'Cards',
           href: '/examples/cards',
           code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/cards'
       }
   ];