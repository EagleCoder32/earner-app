'use client';

import { ClerkProvider} from '@clerk/nextjs';

export default function Providers({ children }) {
  return (
    <ClerkProvider>
   
      {/* Render rest of the page */}
      {children}
    </ClerkProvider>
  );
}