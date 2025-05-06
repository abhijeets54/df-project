# Digital Evidence Metadata Viewer

A client-side digital forensics tool for securely analyzing files, extracting metadata, generating cryptographic hashes, and creating forensic reports - all without sending any data to a server.

## Features

- **Secure Client-Side Processing**: All file analysis is performed entirely in the browser; no data is ever uploaded to a server
- **User Authentication**: Secure login with [Clerk](https://clerk.com/)
- **File Analysis**:
  - Metadata extraction for images, documents, and other file types
  - Cryptographic hash generation (MD5, SHA-256)
  - File signature verification
- **Case Management**: Create cases and organize multiple analyses
- **Report Generation**: Generate professional PDF reports for analyses or cases
- **Local Storage**: Analysis results stored securely in your browser using IndexedDB

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Authentication**: Clerk
- **UI**: TailwindCSS
- **File Processing**:
  - Web Crypto API for hash generation
  - ExifReader for image metadata extraction
  - jsPDF for report generation
- **Data Storage**: IndexedDB for client-side data persistence

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/df-evidence-viewer.git
cd df-evidence-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file at the root of your project with your Clerk API keys:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
CLERK_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Usage

1. **Sign In/Sign Up**: Create an account or sign in using Clerk authentication
2. **Upload Files**: Select a file to analyze on the Upload page
3. **View Analysis**: See detailed metadata, cryptographic hashes, and file integrity verification
4. **Create Cases**: Organize related files into cases
5. **Generate Reports**: Create professional PDF reports of your findings

## Privacy and Security

This application processes all files locally in your browser. At no point is your data sent to any external servers:

- Files are analyzed using client-side JavaScript APIs
- Metadata is extracted directly in the browser
- Cryptographic hashes are generated using the Web Crypto API
- All data is stored in your browser's IndexedDB
- Reports are generated client-side using jsPDF

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [ExifReader](https://github.com/mattiasw/ExifReader)
- [jsPDF](https://github.com/MrRio/jsPDF)
