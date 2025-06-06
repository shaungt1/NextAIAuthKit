import { AppSidebar } from '@/registry/new-york/block/sidebar-03/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/registry/new-york/ui/breadcrumb';
import { Separator } from '@/registry/new-york/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/registry/new-york/ui/sidebar';

export const iframeHeight = '800px';

export const description = 'A sidebar with submenus.';

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
                    <div className='flex items-center gap-2 px-3'>
                        <SidebarTrigger />
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className='hidden md:block'>
                                    <BreadcrumbLink href='#'>Building Your Application</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='hidden md:block' />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
                        <div className='aspect-video rounded bg-muted/50' />
                        <div className='aspect-video rounded bg-muted/50' />
                        <div className='aspect-video rounded bg-muted/50' />
                    </div>
                    <div className='min-h-[100vh] flex-1 rounded bg-muted/50 md:min-h-min' />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
