/**
 * Puzzle Feedback Store
 * Persistent storage for "Fix a Missing Puzzle" issue reports and community involvement choices.
 */

export type MissingPuzzleInvolvement =
  | 'JUST_LOG'
  | 'CONTACT_ME'
  | 'HELP_TEST'
  | 'CONTRIBUTE_FIX'
  | 'CONSULT_DESIGN';

export interface MissingPuzzleReport {
  id: string;
  title: string;
  description: string;
  category: string;
  locationContext?: string;
  loggedBy: {
    id: string;
    displayName: string;
    h4dMemberId: string;
    email?: string;
  };
  timestamp: string;
  puzzleCompleted: boolean;
  involvement?: MissingPuzzleInvolvement;
  status: 'OPEN' | 'UNDER_REVIEW' | 'SOLVED';
}

const STORAGE_KEY = 'h4d_missing_puzzles';

const INITIAL_SEEDED_REPORTS: MissingPuzzleReport[] = [
  {
    id: 'puz-001',
    title: 'Offline receipts download should support PDF formatting',
    description: 'When downloading accommodation verification receipts on mobile, text format works but a structured PDF would look cleaner for chamber records.',
    category: 'Accommodation Flow',
    locationContext: 'Responsibility Detail View',
    loggedBy: {
      id: 'mem-1',
      displayName: 'Emmanuel Ukom',
      h4dMemberId: 'H4D-00021',
      email: 'emmanuel.ukom@infinitegrace.local',
    },
    timestamp: '2026-09-08T14:30:00.000Z',
    puzzleCompleted: true,
    involvement: 'HELP_TEST',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'puz-002',
    title: 'Mesh Wi-Fi shared campaign progress bar contrast in Dark Mode',
    description: 'In dark mode, the green progress fill on the chamber inverter campaign card needs slightly higher luminance against the dark brown shell.',
    category: 'Visual / UI Glitch',
    locationContext: 'Peer Support Hub',
    loggedBy: {
      id: 'mem-2',
      displayName: 'Nonso Okafor',
      h4dMemberId: 'H4D-00045',
      email: 'nonso.okafor@bedrock.local',
    },
    timestamp: '2026-09-09T09:15:00.000Z',
    puzzleCompleted: true,
    involvement: 'CONTRIBUTE_FIX',
    status: 'OPEN',
  },
];

class PuzzleFeedbackStore {
  private reports: MissingPuzzleReport[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(STORAGE_KEY);
        if (data) {
          this.reports = JSON.parse(data);
          return;
        }
      }
    } catch {
      // Fallback to memory on storage error
    }
    this.reports = [...INITIAL_SEEDED_REPORTS];
    this.save();
  }

  private save(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reports));
      }
    } catch {
      // Ignore write errors
    }
  }

  public getReports(): MissingPuzzleReport[] {
    return [...this.reports];
  }

  public getReportById(id: string): MissingPuzzleReport | undefined {
    return this.reports.find((r) => r.id === id);
  }

  public saveReport(
    report: Omit<MissingPuzzleReport, 'id' | 'timestamp' | 'status'>
  ): MissingPuzzleReport {
    const newReport: MissingPuzzleReport = {
      ...report,
      id: `puz-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'OPEN',
    };
    this.reports.unshift(newReport);
    this.save();
    return newReport;
  }

  public updateInvolvement(
    reportId: string,
    involvement: MissingPuzzleInvolvement
  ): MissingPuzzleReport | null {
    const report = this.reports.find((r) => r.id === reportId);
    if (report) {
      report.involvement = involvement;
      this.save();
      return report;
    }
    return null;
  }
}

export const puzzleFeedbackStore = new PuzzleFeedbackStore();
