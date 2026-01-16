import { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SettingsProvider } from '@/Context/SettingsContext';
import NextTopLoader from 'nextjs-toploader';


export const metadata: Metadata = {
  title: 'Analytical Dashboard',
  description: 'Interactive analytical dashboard for monitoring key metrics and KPI using Github Rest API.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
        <SettingsProvider>
          <Providers>

            <NextTopLoader 
            color="#3b82f6" // The exact blue of your charts
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false} // We don't need a mini spinner, just the bar
            easing="ease"
            speed={200}
            shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
          />
            {children}
          </Providers>
        </SettingsProvider>
      </body>
    </html>
  );
}