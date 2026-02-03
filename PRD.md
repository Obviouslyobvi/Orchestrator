# California Data Brokers Database - Product Requirements Document

## Project Overview
A web-based database application to track California data brokers and identify key decision-makers who would be potential buyers of new mover data files. This project pivots from the legal-500-tracker and uses similar architecture.

## Business Objective
Build a prospecting database to identify and track:
- Data brokers operating in California
- CEOs and key decision-makers at these companies
- Complete contact information for outreach
- Connection status for sales pipeline management

## Target Users
- Palmer (primary user) - Solo entrepreneur managing direct response marketing and data services
- Future sales team members (potential expansion)

## Core Features

### 1. Data Broker Management
**Fields to Track:**
- Company Name (required)
- CEO/Key Contact Name (required)
- Title/Role
- Industry/Vertical
- Company Address
- Phone Number
- Email Address
- LinkedIn Profile URL
- Company Website
- Company LinkedIn Page
- Additional Decision Makers (notes field)
- Company Size/Revenue (estimated)
- Data Products They Buy (categories)
- Connection Status (Not Contacted, In Progress, Partnered, Closed)
- Notes
- Last Contact Date
- Next Follow-up Date

### 2. Contact Enrichment
- Manual entry with validation
- Google Gemini AI-assisted research for finding contact details
- LinkedIn profile scraping guidance
- Batch enrichment capability

### 3. Pipeline Management
- Visual status tracking (Not Contacted → In Progress → Partnered → Closed)
- Filter by connection status
- Sort by any field
- Search across all fields
- Bulk status updates

### 4. Data Export
- CSV export of all records
- Filtered export options
- Copy individual records for email templates

### 5. Analytics Dashboard
- Total brokers tracked
- Connection status breakdown
- Recent activity summary
- Conversion funnel metrics

## Technical Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications

### Backend/Storage
- Browser localStorage for data persistence (Phase 1)
- Future: Supabase PostgreSQL (Phase 2 - when scaling needed)

### AI Integration
- Google Gemini API for contact research assistance
- Manual data enrichment with AI suggestions

### Key Components
1. **BrokerForm** - Add/edit data broker records
2. **BrokerList** - Searchable, sortable table view
3. **StatsCard** - Dashboard metrics
4. **BulkEditModal** - Mass status updates
5. **ResearchAssistant** - AI-powered contact finder
6. **ExportModal** - Data export functionality

## Data Model

```typescript
interface DataBroker {
  id: string;
  companyName: string;
  ceoName: string;
  title?: string;
  industry?: string;
  address?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  companyLinkedin?: string;
  website?: string;
  additionalContacts?: string;
  companySize?: string;
  dataProducts?: string;
  status: ConnectionStatus;
  notes?: string;
  lastContact?: string;
  nextFollowup?: string;
  dateAdded: string;
  lastModified: string;
}

enum ConnectionStatus {
  NOT_CONTACTED = 'Not Contacted',
  IN_PROGRESS = 'In Progress',
  PARTNERED = 'Partnered',
  CLOSED = 'Closed'
}
```

## User Stories

### Data Entry
- As a user, I want to quickly add new data broker companies with key contact info
- As a user, I want to validate email addresses and LinkedIn URLs on entry
- As a user, I want to add multiple decision-makers per company

### Research & Enrichment
- As a user, I want AI assistance to find CEO contact details when I only have a company name
- As a user, I want to enrich multiple records at once
- As a user, I want to track when records were last enriched

### Pipeline Management
- As a user, I want to see all prospects organized by connection status
- As a user, I want to update status in bulk after a campaign
- As a user, I want to set follow-up reminders
- As a user, I want to filter by "needs follow-up this week"

### Data Export
- As a user, I want to export "Not Contacted" leads for a cold email campaign
- As a user, I want to copy all emails for BCC in email client
- As a user, I want a CSV backup of my entire database

### Analytics
- As a user, I want to see my pipeline health at a glance
- As a user, I want to track conversion rates from contact to partnership
- As a user, I want to see which industries respond best

## MVP Scope (Phase 1)

**Must Have:**
- Add/edit/delete data broker records
- All core fields (company, CEO, contact details)
- Connection status tracking
- Search and filter
- Sort by any column
- Basic AI research assistant
- CSV export
- localStorage persistence
- Responsive design

**Should Have:**
- Bulk edit functionality
- Stats dashboard
- Email validation
- LinkedIn URL validation
- Follow-up date reminders

**Could Have (Future):**
- Chrome extension for LinkedIn scraping
- Email verification API integration
- Automated follow-up sequences
- CRM integrations (HubSpot, Salesforce)

**Won't Have (Phase 1):**
- Multi-user support
- Supabase backend
- Email sending from app
- Calendar integration

## Success Metrics
- Database populated with 100+ California data brokers
- 50%+ have complete contact information (email + phone)
- 20+ active conversations (In Progress status)
- 5+ partnerships established
- Sub-2-second load time
- Zero data loss

## Development Phases

### Phase 1: MVP (2-3 weeks)
- Core CRUD operations
- Basic UI with Tailwind
- localStorage persistence
- CSV export
- AI research assistant

### Phase 2: Enhancement (1-2 weeks)
- Advanced filtering
- Bulk operations
- Analytics dashboard
- Follow-up reminders
- LinkedIn integration guide

### Phase 3: Scale (Future)
- Migrate to Supabase
- Multi-user support
- API integrations
- Chrome extension

## Repository Structure
```
ca-data-brokers/
├── src/
│   ├── components/
│   │   ├── BrokerForm.tsx
│   │   ├── BrokerList.tsx
│   │   ├── StatsCard.tsx
│   │   ├── BulkEditModal.tsx
│   │   ├── ResearchAssistant.tsx
│   │   └── ExportModal.tsx
│   ├── services/
│   │   ├── storageService.ts
│   │   └── geminiService.ts
│   ├── types.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
├── .env.local
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.263.1",
  "react-hot-toast": "^2.4.1",
  "@google/generative-ai": "^0.1.0",
  "date-fns": "^2.30.0"
}
```

## API Requirements
- Google Gemini API key (free tier sufficient for MVP)
- Environment variable: `VITE_GEMINI_API_KEY`

## Security Considerations
- API keys stored in .env.local (not committed)
- No sensitive data transmission (localStorage only in Phase 1)
- Input validation for all user entries
- XSS prevention via React's built-in escaping

## Browser Support
- Chrome 100+ (primary)
- Firefox 100+
- Safari 16+
- Edge 100+

## Performance Requirements
- Initial load: < 2 seconds
- Search/filter response: < 300ms
- AI enrichment: < 5 seconds per record
- Handle 1000+ records without degradation

## Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Color contrast WCAG AA compliant
- Focus indicators on all interactive elements

## Open Questions
1. Should we include a "warm/cold" lead temperature field?
2. Do we need integration with your existing mailing list system?
3. Should we track deal value/estimated contract size?
4. Do you want automated LinkedIn profile enrichment or manual only?

## Future Considerations
- Integration with your new mover data fulfillment system
- Automated proposal generation
- Email campaign tracking
- Meeting scheduler integration
- Revenue forecasting

---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Owner:** Palmer  
**Status:** Ready for Development
