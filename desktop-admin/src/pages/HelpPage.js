import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchContainer = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 50px;
  font-size: 1rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }

  &.active {
    color: #667eea;
    border-bottom-color: #667eea;
  }
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// FAQ Components
const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQIcon = styled.span`
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.3s ease;
`;

// Guides Components
const GuidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const GuideCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

const GuideTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const GuideDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const StepsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const StepText = styled.span`
  color: #333;
  line-height: 1.5;
  margin-left: 1rem;
`;

// Contact Components
const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const ContactIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #667eea;
`;

// Form Components
const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;

  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s ease;
  resize: vertical;

  &:focus {
    border-color: #667eea;
  }
`;

// Quick Links Components
const QuickLinkButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #5a6fd8;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  margin-bottom: 1.5rem;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding: 1rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.div`
  font-weight: 500;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;

  &:hover {
    color: #667eea;
  }
`;

const FAQAnswer = styled.div`
  color: #666;
  line-height: 1.6;
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 3px solid #667eea;
`;

const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const QuickLinkCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const QuickLinkIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const QuickLinkTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const QuickLinkDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const ContactForm = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  justify-self: start;

  &:hover {
    background: #5a6fd8;
  }
`;

const GuideStep = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const faqData = [
    {
      id: 1,
      question: 'How do I create a new account?',
      answer: 'To create a new account, click on "Sign Up" on the login page, fill in your information and follow the instructions sent to your email.'
    },
    {
      id: 2,
      question: 'How do I reset my password?',
      answer: 'On the login page, click "Forgot Password", enter your email and follow the instructions sent to your inbox.'
    },
    {
      id: 3,
      question: 'How do I edit my profile?',
      answer: 'Go to the "Profile" page in the main menu, click "Edit Profile" and update your information as needed.'
    },
    {
      id: 4,
      question: 'How do I add a new product?',
      answer: 'On the "Products" page, click the "Add Product" button and fill in the product information in the form that appears.'
    },
    {
      id: 5,
      question: 'How do I generate reports?',
      answer: 'Go to the "Reports" page, select the desired filters and click "Generate Report" to view the data.'
    },
    {
      id: 6,
      question: 'How do I change notification settings?',
      answer: 'Go to "Settings" > "Notifications" and adjust your preferences for email and push notifications.'
    }
  ];

  const guides = [
    {
      id: 1,
      title: 'Getting Started',
      description: 'Learn the basics of using the platform',
      steps: [
        'Create your account',
        'Complete your profile',
        'Explore the main features',
        'Configure your preferences'
      ]
    },
    {
      id: 2,
      title: 'Product Management',
      description: 'How to manage your products effectively',
      steps: [
        'Add new products',
        'Edit product information',
        'Organize by categories',
        'Monitor performance'
      ]
    },
    {
      id: 3,
      title: 'Reports and Analytics',
      description: 'Understanding data and generating reports',
      steps: [
        'Access the reports page',
        'Select filters and date range',
        'Generate custom reports',
        'Export data'
      ]
    }
  ];

  const quickLinks = [
    { title: 'User Manual', url: '#', description: 'Complete documentation' },
    { title: 'Video Tutorials', url: '#', description: 'Step-by-step videos' },
    { title: 'API Documentation', url: '#', description: 'For developers' },
    { title: 'System Status', url: '#', description: 'Service availability' }
  ];

  const handleFaqToggle = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    try {
      // Here you would make the call to send the contact message
      // await sendContactMessage(contactForm);
      
      setFormMessage({ 
        type: 'success', 
        text: 'Message sent successfully! We will respond soon.' 
      });
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormMessage({ 
        type: 'error', 
        text: 'Error sending message. Please try again.' 
      });
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const renderFAQ = () => (
    <Section>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <FAQContainer>
        {faqData.map(faq => (
          <FAQItem key={faq.id}>
            <FAQQuestion 
              onClick={() => handleFaqToggle(faq.id)}
              className={expandedFaq === faq.id ? 'active' : ''}
            >
              {faq.question}
              <FAQIcon>{expandedFaq === faq.id ? '−' : '+'}</FAQIcon>
            </FAQQuestion>
            {expandedFaq === faq.id && (
              <FAQAnswer>{faq.answer}</FAQAnswer>
            )}
          </FAQItem>
        ))}
      </FAQContainer>
    </Section>
  );

  const renderGuides = () => (
    <Section>
      <SectionTitle>Step-by-Step Guides</SectionTitle>
      <GuidesGrid>
        {guides.map(guide => (
          <GuideCard key={guide.id}>
            <GuideTitle>{guide.title}</GuideTitle>
            <GuideDescription>{guide.description}</GuideDescription>
            <StepsList>
              {guide.steps.map((step, index) => (
                <StepItem key={index}>
                  <StepNumber>{index + 1}</StepNumber>
                  <StepText>{step}</StepText>
                </StepItem>
              ))}
            </StepsList>
          </GuideCard>
        ))}
      </GuidesGrid>
    </Section>
  );

  const renderContact = () => (
    <Section>
      <SectionTitle>Contact Support</SectionTitle>
      <ContactContainer>
        <ContactInfo>
          <h3>Need more help?</h3>
          <p>Our support team is ready to help you. Send us a message and we will respond as soon as possible.</p>
          
          <ContactMethods>
            <ContactMethod>
              <ContactIcon>📧</ContactIcon>
              <div>
                <strong>Email</strong>
                <p>support@example.com</p>
              </div>
            </ContactMethod>
            <ContactMethod>
              <ContactIcon>💬</ContactIcon>
              <div>
                <strong>Live Chat</strong>
                <p>Available Monday to Friday, 9am to 6pm</p>
              </div>
            </ContactMethod>
            <ContactMethod>
              <ContactIcon>📞</ContactIcon>
              <div>
                <strong>Phone</strong>
                <p>+1 (555) 123-4567</p>
              </div>
            </ContactMethod>
          </ContactMethods>
        </ContactInfo>

        <ContactForm onSubmit={handleContactSubmit}>
          <h3>Send us a message</h3>
          
          {formMessage.text && (
            <Message className={formMessage.type}>
              {formMessage.text}
            </Message>
          )}

          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={contactForm.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={contactForm.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Subject</Label>
            <Input
              type="text"
              name="subject"
              value={contactForm.subject}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Message</Label>
            <Textarea
              name="message"
              value={contactForm.message}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </FormGroup>

          <Button type="submit">Send Message</Button>
        </ContactForm>
      </ContactContainer>
    </Section>
  );

  const renderQuickLinks = () => (
    <Section>
      <SectionTitle>Quick Links</SectionTitle>
      <QuickLinksGrid>
        {quickLinks.map((link, index) => (
          <QuickLinkCard key={index}>
            <QuickLinkTitle>{link.title}</QuickLinkTitle>
            <QuickLinkDescription>{link.description}</QuickLinkDescription>
            <QuickLinkButton href={link.url}>Access</QuickLinkButton>
          </QuickLinkCard>
        ))}
      </QuickLinksGrid>
    </Section>
  );

  return (
    <Container>
      <Title>Help Center</Title>

      <TabContainer>
        <Tab 
          className={activeSection === 'faq' ? 'active' : ''}
          onClick={() => setActiveSection('faq')}
        >
          FAQ
        </Tab>
        <Tab 
          className={activeSection === 'guides' ? 'active' : ''}
          onClick={() => setActiveSection('guides')}
        >
          Guides
        </Tab>
        <Tab 
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={() => setActiveSection('contact')}
        >
          Contact
        </Tab>
        <Tab 
          className={activeSection === 'links' ? 'active' : ''}
          onClick={() => setActiveSection('links')}
        >
          Quick Links
        </Tab>
      </TabContainer>

      {activeSection === 'faq' && renderFAQ()}
      {activeSection === 'guides' && renderGuides()}
      {activeSection === 'contact' && renderContact()}
      {activeSection === 'links' && renderQuickLinks()}
    </Container>
  );
} 