import React from 'react';

import { Section, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import { LeftSection } from './HeroStyles';

const Hero = () => (
  <Section row nopadding>
    <LeftSection>
      <SectionTitle main center>
        Welcome to <br/>
        My Personal Portfolio
      </SectionTitle>
        <SectionText>
          My name is Rian Negreiros, i am a web developer, focusing on backend development.
        </SectionText>
    </LeftSection>
  </Section>
);

export default Hero;