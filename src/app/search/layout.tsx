'use client';

import TemplateWrapper from '../../components/common/TemplateWrapper/index';

export default function SearchPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TemplateWrapper>
      <div className='animated fadeIn'>{children}</div>
    </TemplateWrapper>
  );
}
