import React from 'react';
import { FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ContactInfoCard from './ContactInfoCard';

const CONTACT_ITEMS = [
    {
        title: 'Email',
        icon: <FiMail className="w-5 h-5" />,
        lines: ['bitlab.workspace@gmail.com'],
    },
    {
        title: 'WhatsApp',
        icon: <FaWhatsapp className="w-6 h-6" />,
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
