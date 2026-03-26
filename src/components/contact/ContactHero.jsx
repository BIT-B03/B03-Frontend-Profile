import React from 'react';

export default function ContactHero() {
    return (
        <div className="text-center mb-8 mt-32">
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-3">
                Connect With{' '}
                <span
                    className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-24e1c9 to-brand-1f4c74"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                    BIT
                </span>
            </h1>

            <p className="text-muted-gray mt-5 mb-16 text-base md:text-lg max-w-5xl mx-auto">
                Whether you are a prospective collaborator, a visiting scholar, or a member of the press, we welcome your inquiry. Our team is committed to open and responsive communication.
            </p>
        </div>
    );
}
