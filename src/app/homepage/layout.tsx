'use client';

import { Row } from 'reactstrap';

import TemplateWrapper from '../../components/common/TemplateWrapper/index';

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TemplateWrapper>
      <div className='homepage'>
        <Row>{children}</Row>
      </div>
    </TemplateWrapper>
  );
}
