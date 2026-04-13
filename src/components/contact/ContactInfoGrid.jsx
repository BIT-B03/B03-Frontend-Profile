import React from 'react';
import { contactIconMap } from '../../utils/icon';
import ContactInfoCard from './ContactInfoCard';

const CONTACT_ITEMS = [
    {
        title: 'Email',
        icon: <contactIconMap.email className="w-5 h-5" />,
        lines: ['bitlab.workspace@gmail.com'],
    },
    {
        title: 'WhatsApp',
        icon: <contactIconMap.whatsapp className="w-6 h-6" />,
        lines: ['+62 821-4337-2593'],
    },
];

export default function ContactInfoGrid() {
    return (
        <section className="pb-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CONTACT_ITEMS.map((item) => (
                    <ContactInfoCard
                        key={item.title}
                        icon={item.icon}
                        title={item.title}
                        lines={item.lines}
                        meta={item.meta}
                    />
                ))}
            </div>
        </section>
    );
}
