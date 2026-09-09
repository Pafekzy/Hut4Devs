/**
 * Hut4Devs Authentication & Role Authorization Domain (H4D-FUNC-011)
 *
 * Architecture Rule:
 * Identity -> Authenticated Session -> Hut4Devs Member -> Role / Permission -> Authorized Server Operation
 *
 * Keeps identity-provider concerns separate from Hut4Devs authorization.
 */

export enum MemberRole {
  FELLOW = 'FELLOW',
  ACCOMMODATION_ADMIN = 'ACCOMMODATION_ADMIN',
}

export interface Member {
  id: string;
  displayName: string;
  email?: string;
  roles: MemberRole[];
  createdAt: string;
}

export interface Session {
  id: string;
  token: string;
  memberId: string;
  member: Member;
  createdAt: string;
  expiresAt: string;
}

export interface IMemberRepository {
  findById(id: string): Promise<Member | null>;
  save(member: Member): Promise<void>;
  listAll(): Promise<Member[]>;
}

export interface ISessionRepository {
  create(session: Session): Promise<void>;
  findByToken(token: string): Promise<Session | null>;
  deleteByToken(token: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
