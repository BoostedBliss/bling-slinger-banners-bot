## 2026-11-08 - Missing ARIA Labels on Icon-only Close Buttons
**Learning:** Icon-only close buttons (typically using `lucide-react` icons like `<X />`) frequently miss `aria-label` attributes across modals and popovers in this app, making them inaccessible to screen readers.
**Action:** Always verify that icon-only interactive elements, especially those used for dismissing or closing views (like modals, notifications, or toasts), have explicit `aria-label` attributes describing their function.
