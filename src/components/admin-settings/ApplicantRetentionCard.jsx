import React from 'react';
import SettingsCard from './SettingsCard';

export default function ApplicantRetentionCard(props) {
  return (
    <SettingsCard
      title="Data Retention Policy"
      description="Set the number of days to retain applicant data in the system before archival."
      label="Retention Period (Days)"
      accentClass="blue"
      {...props}
    />
  );
}
