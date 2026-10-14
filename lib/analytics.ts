// GA 事件追蹤。只有在頁面上載入 gtag 時才會送出；目前 CSP 未放行 GA，呼叫皆為 no-op。

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

// Track custom events
export const trackEvent = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// CTA 點擊；label 標出位置與目的地，例如 'hero_business'
export const trackCTA = (label: string) => {
    trackEvent({ action: 'click', category: 'CTA', label });
};
