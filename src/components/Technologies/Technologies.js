import React from 'react';
import { DiDatabase, DiReact } from 'react-icons/di';
import { Section, SectionDivider, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import { List, ListContainer, ListItem, ListParagraph, ListTitle } from './TechnologiesStyles';

const Technologies = () =>  (
  <Section id="tech">
    <SectionDivider />
    <SectionTitle>Technologies</SectionTitle>
    <SectionText>
    These are the technologies I've worked on. From the Back-end to Front-end.
    </SectionText>
    <List>
      <ListItem>
      <DiReact size="3rem" />
        <ListContainer>
          <ListTitle>Front-End</ListTitle>
          <ListParagraph>
            Experience with <br />
            ReactJs <br />
            Typescript <br />
            Bootstrap <br />
            Tailwind UI <br />
            Razor <br />
            Haml
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
      <DiDatabase size="3rem" />
        <ListContainer>
          <ListTitle>Back-End</ListTitle>
          <ListParagraph>
            Experience with <br />
            Ruby On Rails <br />
            Sidekiq <br />
            .NET Core<br />
            Entity Framework Core <br />
            RabbitMQ <br />
            MassTransit <br />
            Ocelot <br />
            PostgreSQL <br />
            MongoDB <br />
            Redis <br />
          </ListParagraph>
        </ListContainer>
      </ListItem>
    </List>
  </Section>
);

export default Technologies;
