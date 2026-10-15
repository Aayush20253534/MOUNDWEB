import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'MOUNDWEB | Digital Growth', template: '%s | MOUNDWEB' },
  description: 'Digital marketing, brand growth, and career-focused training.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
