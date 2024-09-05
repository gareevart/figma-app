"use client";
import { Analytics } from "@vercel/analytics/react"
import { Filters } from '@/components/Filters/Filters';
import { ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';

export default function Home() {
    return (
        <div>
            <ToasterProvider>
                <Analytics />
                <Filters />
                <ToasterComponent />
            </ToasterProvider>
        </div>
    );
}
