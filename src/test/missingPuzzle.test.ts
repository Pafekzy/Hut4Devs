import { describe, it, expect } from 'vitest';
import {
  puzzleFeedbackStore,
  MissingPuzzleReport,
} from '../services/puzzleFeedbackStore';

describe('H4D-DEMO-004: Missing Puzzle Feedback Flow & Store', () => {
  it('1. retrieves seeded reports from puzzleFeedbackStore', () => {
    const reports = puzzleFeedbackStore.getReports();
    expect(reports.length).toBeGreaterThanOrEqual(2);
    expect(reports.some((r) => r.category === 'Accommodation Flow')).toBe(true);
    expect(reports.some((r) => r.category === 'Visual / UI Glitch')).toBe(true);
  });

  it('2. saves a new missing puzzle report with attribution and initial OPEN status', () => {
    const saved = puzzleFeedbackStore.saveReport({
      title: 'Dark mode tactile contrast on metric buttons',
      description: 'The amber borders should be 2px with higher luminance against chocolate brown background.',
      category: 'Visual / UI Glitch',
      locationContext: 'Accommodation Command Center',
      loggedBy: {
        id: 'mem-test-01',
        displayName: 'Chukwudi Eze',
        h4dMemberId: 'H4D-00033',
        email: 'chukwudi@infinitegrace.local',
      },
      puzzleCompleted: true,
      involvement: 'HELP_TEST',
    });

    expect(saved.id).toBeDefined();
    expect(saved.status).toBe('OPEN');
    expect(saved.title).toBe('Dark mode tactile contrast on metric buttons');
    expect(saved.puzzleCompleted).toBe(true);
    expect(saved.involvement).toBe('HELP_TEST');

    const fetched = puzzleFeedbackStore.getReportById(saved.id);
    expect(fetched).toBeDefined();
    expect(fetched?.loggedBy.displayName).toBe('Chukwudi Eze');
  });

  it('3. updates member involvement preference for a submitted report', () => {
    const reports = puzzleFeedbackStore.getReports();
    const target = reports[0];

    const updated = puzzleFeedbackStore.updateInvolvement(target.id, 'CONTRIBUTE_FIX');
    expect(updated).not.toBeNull();
    expect(updated?.involvement).toBe('CONTRIBUTE_FIX');
  });
});
