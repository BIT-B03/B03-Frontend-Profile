import React from 'react';
import Navbar from '../components/Navbar';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import ContactHero from '../components/contact/ContactHero';
import ContactInfoGrid from '../components/contact/ContactInfoGrid';
import ContactMapCard from '../components/contact/ContactMapCard';

export default function Contact() {
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Project', href: '/project' },
        { label: 'People', href: '/people' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <GuestMemberBackground>
            <Navbar navItems={navItems} />
            <main className="max-w-5xl mx-auto px-6 text-white">
                <div className='pt-4'>
                    <ContactHero />
                    <ContactInfoGrid />
                    <ContactMapCard />
                </div>
            </main>
        </GuestMemberBackground>
    );
}
