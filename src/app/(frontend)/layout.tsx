import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext'; // Алиас @ указывает на папку src

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}