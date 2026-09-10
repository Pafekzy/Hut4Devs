import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatActionAttribution,
  getAvailableModesForMember,
  getDefaultModeForMember,
  ACCOMMODATION_PROPERTIES,
} from './membership';
import { Member, MemberRole } from './auth';
import { MembershipStore } from '../services/membershipStore';

describe('H4D-DEMO-001: Membership, Scoped Delegation, and Mode Attribution', () => {
  let store: MembershipStore;

  beforeEach(() => {
    store = new MembershipStore();
  });

  describe('Core Product Principle: Registration vs Membership vs Authority', () => {
    it('creates a membership request without assigning authority', () => {
      const req = store.submitMembershipRequest({
        fullName: 'Amina Yusuf',
        email: 'amina@interns.local',
        phone: '+234 809 111 2233',
        programCommunity: 'L2E Dev Cohort',
        propertyId: 'prop-infinite-grace',
        roomName: 'Room 304',
      });

      expect(req.id).toBeDefined();
      expect(req.status).toBe('SUBMITTED');
      expect(req.isExistingFellowRecognized).toBe(false);
      expect(req.monthlyCommitment).toBe(66000);
    });

    it('recognizes existing Fellow on transfer request', () => {
      // Existing fellow in demo store: Emmanuel Ukom (emmanuel@infinitegrace.local)
      const transferReq = store.submitMembershipRequest({
        fullName: 'Emmanuel Ukom',
        email: 'emmanuel@infinitegrace.local',
        programCommunity: 'L2E Dev Cohort',
        propertyId: 'prop-bedrock-hostel',
        roomName: 'Room 101',
      });

      expect(transferReq.isExistingFellowRecognized).toBe(true);
      expect(transferReq.status).toBe('TRANSFER_RECOGNIZED');
      expect(transferReq.h4dMemberId).toBe('H4D-00012');
      expect(transferReq.monthlyCommitment).toBe(77000); // BedRock commitment
    });
  });

  describe('Coordinator Delegation to Room Captain', () => {
    it('allows Coordinator to delegate room occupancy verification', () => {
      const requests = store.getMembershipRequests();
      const targetReq = requests[0];

      const delegation = store.delegateRoomVerification({
        requestId: targetReq.id,
        delegatedBy: 'L2E Accommodation Fellows Coordinator (Zainab Aliyu)',
        delegatedToMemberId: 'member-chinedu-captain',
        delegatedToName: 'Chinedu Okeke',
        responsibility: 'Verify Bed 2 in Room 304',
        scope: {
          propertyId: 'prop-infinite-grace',
          propertyName: 'Infinite Grace Apartment',
          roomId: 'room-304',
          roomName: 'Room 304',
        },
      });

      expect(delegation.status).toBe('PENDING');
      expect(delegation.delegatedToMemberId).toBe('member-chinedu-captain');

      const updatedReq = store.getMembershipRequests().find((r: any) => r.id === targetReq.id);
      expect(updatedReq?.status).toBe('ROOM_VERIFICATION_DELEGATED');
    });

    it('allows Room Captain to confirm room verification', () => {
      const requests = store.getMembershipRequests();
      const targetReq = requests[0];

      store.delegateRoomVerification({
        requestId: targetReq.id,
        delegatedBy: 'L2E Accommodation Fellows Coordinator',
        delegatedToMemberId: 'member-chinedu-captain',
        delegatedToName: 'Chinedu Okeke',
        responsibility: 'Check Room',
        scope: {
          propertyId: 'prop-infinite-grace',
          propertyName: 'Infinite Grace Apartment',
          roomId: 'room-304',
          roomName: 'Room 304',
        },
      });

      const updated = store.resolveRoomVerification({
        requestId: targetReq.id,
        captainMemberId: 'member-chinedu-captain',
        decision: 'CONFIRMED',
        note: 'Space verified, fellow is in room.',
      });

      expect(updated?.delegation?.status).toBe('CONFIRMED');
      expect(updated?.delegation?.captainNote).toBe('Space verified, fellow is in room.');
    });
  });

  describe('Approval establishes Membership and active assignment', () => {
    it('approving a request activates assignment and marks previous as TRANSFERRED', () => {
      // Existing fellow with past assignment
      const transferReq = store.submitMembershipRequest({
        fullName: 'Emmanuel Ukom',
        email: 'emmanuel@infinitegrace.local',
        programCommunity: 'L2E Dev Cohort',
        propertyId: 'prop-bedrock-hostel',
        roomName: 'Room 101',
      });

      const approved = store.approveMembershipRequest({
        requestId: transferReq.id,
        approvedBy: 'L2E Accommodation Fellows Coordinator (Zainab Aliyu)',
      });

      expect(approved.status).toBe('APPROVED');

      // Check assignment in store
      const activeAssignment = store.getActiveAssignmentForMember(approved.memberId!);
      expect(activeAssignment).toBeDefined();
      expect(activeAssignment?.propertyName).toBe('BedRock Hostel');
      expect(activeAssignment?.status).toBe('ACTIVE');
    });
  });

  describe('Action Attribution: Capacity is not universal authority', () => {
    const multiRoleMember: Member = {
      id: 'member-emmanuel',
      h4dMemberId: 'H4D-00012',
      displayName: 'Emmanuel Ukom',
      email: 'emmanuel@infinitegrace.local',
      roles: [MemberRole.FELLOW, MemberRole.ROOM_CAPTAIN, MemberRole.ACCOMMODATION_FELLOWS_COORDINATOR],
      createdAt: '2026-06-01T00:00:00Z',
    };

    it('derives available modes from scoped roles without merging identities', () => {
      const modes = getAvailableModesForMember(multiRoleMember);
      expect(modes).toContain('FELLOW');
      expect(modes).toContain('ROOM_CAPTAIN');
      expect(modes).toContain('COORDINATOR');
      expect(modes).toContain('CAPTAIN_COVERAGE');
      expect(modes).toContain('FINANCIAL_COVERAGE');
    });

    it('formats attribution accurately for FELLOW mode', () => {
      const attr = formatActionAttribution(multiRoleMember, 'FELLOW');
      expect(attr.actingCapacity).toBe('Fellow');
      expect(attr.displayLabel).toBe('Emmanuel Ukom');
      expect(attr.isCoverage).toBe(false);
    });

    it('formats attribution accurately for ROOM_CAPTAIN mode with scope', () => {
      const attr = formatActionAttribution(multiRoleMember, 'ROOM_CAPTAIN', 'Room 304 (Infinite Grace)');
      expect(attr.actingCapacity).toBe('Room Captain — Room 304 (Infinite Grace)');
      expect(attr.isCoverage).toBe(false);
    });

    it('formats attribution accurately for CAPTAIN_COVERAGE mode', () => {
      const attr = formatActionAttribution(multiRoleMember, 'CAPTAIN_COVERAGE', 'Room 202');
      expect(attr.actingCapacity).toContain('Room Captain Coverage');
      expect(attr.isCoverage).toBe(true);
    });

    it('formats attribution accurately for FINANCIAL_COVERAGE mode', () => {
      const attr = formatActionAttribution(multiRoleMember, 'FINANCIAL_COVERAGE');
      expect(attr.actingCapacity).toContain('Financial Admin Coverage');
      expect(attr.isCoverage).toBe(true);
    });
  });

  describe('Multi-Property Architecture', () => {
    it('preserves distinct rates for accredited properties', () => {
      const infiniteGrace = ACCOMMODATION_PROPERTIES.find((p) => p.id === 'prop-infinite-grace');
      const bedRock = ACCOMMODATION_PROPERTIES.find((p) => p.id === 'prop-bedrock-hostel');
      const mainBase = ACCOMMODATION_PROPERTIES.find((p) => p.id === 'prop-mainbase-apt');
      const tangerine = ACCOMMODATION_PROPERTIES.find((p) => p.id === 'prop-tangerine-hotel');

      expect(infiniteGrace?.monthlyCommitment).toBe(66000);
      expect(bedRock?.monthlyCommitment).toBe(77000);
      expect(mainBase?.monthlyCommitment).toBe(70000);
      expect(tangerine?.monthlyCommitment).toBe(140000);
    });
  });
});
