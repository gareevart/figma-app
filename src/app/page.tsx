"use client";
import { Filters } from '@/components/Filters/Filters';
import { ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';

export default function Home() {
    return (
        <div>
            <ToasterProvider>
                <Filters />
                <ToasterComponent />
            </ToasterProvider>
        </div>
    );
}
