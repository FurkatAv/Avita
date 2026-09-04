import { MarketSwitcher } from "./MarketSwitcher";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="font-extrabold text-xl tracking-wider text-amber-900">
        AVITA GOLD
      </div>
      <MarketSwitcher />
    </header>
  );
}