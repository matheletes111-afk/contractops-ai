# AI Contract Risk Analyzer

A client-demo-ready MVP for analyzing legal contracts using AI. Upload a contract (PDF or DOCX) and get instant risk analysis with suggested redlines for key clauses.

## Features

- **File Upload**: Support for PDF and DOCX contract files
- **AI-Powered Analysis**: Extracts and analyzes 10 key contract clauses:
  - Term
  - Termination
  - Indemnity
  - Limitation of Liability
  - Confidentiality
  - IP Ownership
  - Governing Law
  - Data Privacy
  - Insurance
  - Payment Terms
- **Risk Scoring**: Each clause is scored as Low, Medium, or High risk
- **Suggested Redlines**: AI-generated improved versions of risky clauses
- **PDF Export**: Download a 1-page summary of the analysis
- **Clean UI**: Professional legal-tech SaaS aesthetic

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes (Node.js)
- **AI**: OpenAI API (GPT-3.5 Turbo)
- **File Parsing**: PDF (pdf-parse) + DOCX (mammoth)
- **PDF Export**: jsPDF (client-side)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Never commit your `.env.local` file to version control. It's already in `.gitignore`.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## How to Use

1. **Upload Contract**: On the home page, drag and drop or click to select a PDF or DOCX file
2. **Analyze**: Click "Analyze Contract" to start the analysis
3. **Review Results**: View the overall risk level and detailed findings for each clause
4. **Export**: Click "Export PDF" to download a summary report

## Project Structure

```
contractops-ai/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Upload screen (home)
│   ├── processing/page.tsx     # Processing screen (redirects)
│   ├── results/page.tsx        # Results dashboard
│   └── api/
│       └── analyze/route.ts    # Analysis API endpoint
├── components/
│   ├── FileUpload.tsx          # File upload component
│   ├── RiskBadge.tsx           # Risk level badge
│   ├── ClauseCard.tsx          # Clause display card
│   └── RedlineSection.tsx      # Redline display
├── lib/
│   ├── pdf-parser.ts           # PDF text extraction
│   ├── docx-parser.ts          # DOCX text extraction
│   ├── openai-client.ts        # OpenAI API wrapper
│   ├── chunker.ts              # Text chunking for long contracts
│   └── pdf-export.ts           # PDF generation
└── types/
    └── contract.ts             # TypeScript interfaces
```

## API Response Format

The analysis API returns JSON in this format:

```json
{
  "overall_risk": "Low | Medium | High",
  "clauses": [
    {
      "name": "Indemnity",
      "risk_level": "Low | Medium | High",
      "summary": "Plain-English explanation",
      "original_text": "Exact clause text from contract",
      "suggested_redline": "Improved clause text"
    }
  ]
}
```

## Error Handling

The application includes comprehensive error handling for:
- Invalid file types
- File parsing failures
- API errors
- Network failures
- Missing environment variables

All errors are displayed with user-friendly messages.

## Limitations (MVP Scope)

- No authentication (public access)
- No database (results stored in sessionStorage)
- No user accounts or history
- Single file analysis at a time
- Results are lost on page refresh (stored in sessionStorage)

## Troubleshooting

### "OpenAI API key not configured"
- Ensure `.env.local` exists with `OPENAI_API_KEY` set
- Restart the development server after adding the key

### "Failed to extract text from file"
- Ensure the file is a valid PDF or DOCX
- Check that the file is not corrupted
- Try a different file format

### Analysis takes too long
- Large contracts (>8000 tokens) are automatically chunked
- Processing time depends on contract length and OpenAI API response time
- Check your OpenAI API quota and rate limits

## Demo Flow

The application is designed for a 3-minute demo:

1. **Upload** (30 seconds): Show file upload interface
2. **Processing** (60-90 seconds): Show loading state while analyzing
3. **Results** (60 seconds): Display risk scores, findings, and export PDF

## License

This is a demo MVP. Use at your own discretion.

## Support

For issues or questions, please check:
- OpenAI API documentation: https://platform.openai.com/docs
- Next.js documentation: https://nextjs.org/docs
