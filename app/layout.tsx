import { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';


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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}