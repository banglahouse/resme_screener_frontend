import { ReactNode } from 'react';
interface MatchCardProps {
    title: string;
    items?: string[];
    emptyFallback?: string;
    icon?: ReactNode;
    accent?: string;
}
export declare function MatchCard({ title, items, emptyFallback, icon, accent }: MatchCardProps): import("react/jsx-runtime").JSX.Element;
export {};
