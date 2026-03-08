import React from 'react';
import { Card } from './ProfileUI';

const ProfileSkeleton = () => (
  <div className="space-y-4">
    <Card>
      <div className="flex flex-col items-center gap-5 py-6">
        <div className="w-28 h-28 rounded-full skeleton-base skeleton-shimmer" />
        <div className="space-y-3 w-full max-w-xs text-center">
          <div className="h-7 w-44 mx-auto rounded-lg skeleton-base skeleton-shimmer" />
          <div className="h-4 w-24 mx-auto rounded skeleton-base skeleton-shimmer" />
          <div className="h-5 w-32 mx-auto rounded-full skeleton-base skeleton-shimmer" />
          <div className="h-4 w-40 mx-auto rounded skeleton-base skeleton-shimmer" />
        </div>
      </div>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <div className="h-3.5 w-20 rounded skeleton-base skeleton-shimmer mb-5" />
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded skeleton-base skeleton-shimmer" />
            <div className="h-3.5 w-5/6 rounded skeleton-base skeleton-shimmer" />
            <div className="h-3.5 w-3/4 rounded skeleton-base skeleton-shimmer" />
          </div>
        </Card>
      ))}
    </div>
    <Card>
      <div className="h-3.5 w-24 rounded skeleton-base skeleton-shimmer mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl skeleton-base skeleton-shimmer" />
        ))}
      </div>
    </Card>
  </div>
);

export default ProfileSkeleton;
