import React from 'react';

export default function ContactMapCard() {
    const mapLink = 'https://www.google.com/maps?q=-7.491463280481935,112.71074178024423';
    const mapEmbed = 'https://www.google.com/maps?hl=id&q=-7.491463280481935,112.71074178024423&z=20&output=embed';

    return (
        <section className="pb-10">
            <div className="relative overflow-hidden rounded-2xl bg-[rgba(102,102,102,0.02)] backdrop-blur-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <div className="relative w-full h-44 md:h-80">
                    <iframe
                        title="Lokasi Laboratorium"
                        src={mapEmbed}
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                    <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label="Buka lokasi di Google Maps"
                    >
                        <span className="sr-only">Open Localtion in Google Maps</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
