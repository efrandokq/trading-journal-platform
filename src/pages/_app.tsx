import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize app
    console.log('Trading Journal Platform initialized');
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <Component {...pageProps} />
    </div>
  );
}
