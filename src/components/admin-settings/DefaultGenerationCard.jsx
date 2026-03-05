import React from 'react';
import SettingsCard from './SettingsCard';

export default function DefaultGenerationCard(props) {
  return (
    <SettingsCard
      title="Generation Settings"
      description="Configure the default generation value for new organizational entries."
      label="Default Generation"
      accentClass="yellow"
      inputType="text"
      {...props}
    />
  );
}
