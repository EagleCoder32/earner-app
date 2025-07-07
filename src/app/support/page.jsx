// src/app/support/page.jsx
'use client';

export default function SupportPage() {
    return (
        <div>
            <div>
                {/* Page Title */}
                <h1 className="text-white text-2xl font-bold p-6">Send Message</h1>

                {/* Embedded Google Form */}
                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdJwjnZ9qMJRPNn8efZDnghWRaGSjfqhbzZCkD7y2Tg968y-Q/viewform?embedded=true" width="640" height="687">Loading…</iframe>

            </div>
        </div>
    );
}