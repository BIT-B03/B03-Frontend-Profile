import React from 'react';

const TitleSection = () => {
    return (
        <div className="text-center mb-8 mt-16">
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-3">
                Community{' '}
                <span
                    className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-24e1c9 to-brand-1f4c74"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                    Members
                </span>
            </h1>

            <p className="text-muted-gray mt-5 mb-16 text-base md:text-lg max-w-5xl mx-auto">
                Get to know the members of the BIT Community. This section provides a clear look at the people currently active in our lab, showing the different roles and backgrounds of everyone involved in our organization.
            </p>
        </div>
    );
};

export default TitleSection;
