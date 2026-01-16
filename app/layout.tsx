import { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SettingsProvider } from '@/Context/SettingsContext';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'GitInsights | GitHub Analytics Dashboard',
  description: 'Professional analytics dashboard for monitoring GitHub repositories, commit history, and code frequency metrics.',
  
  icons: {
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    shortcut: 'https://github.githubassets.com/favicons/favicon.svg',
    apple: 'https://github.githubassets.com/apple-touch-icon-180x180.png',
  },
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
              color="#3b82f6"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
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