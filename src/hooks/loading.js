export const DASHBOARD_LOADING_CONFIG = {
  cardBaseClassName:
    'rounded-2xl border border-white/10 bg-white/5 p-6 skeleton-base skeleton-shimmer',
  sections: [
    {
      key: 'top',
      wrapperClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      items: [
        { key: 'top-0', className: 'h-[170px]' },
        { key: 'top-1', className: 'h-[170px]' },
      ],
    },
    {
      key: 'bottom',
      wrapperClassName: 'grid grid-cols-1 lg:grid-cols-3 gap-4',
      items: [
        { key: 'bottom-0', className: 'h-[320px] lg:col-span-2' },
        { key: 'bottom-1', className: 'h-[320px]' },
      ],
    },
  ],
};
