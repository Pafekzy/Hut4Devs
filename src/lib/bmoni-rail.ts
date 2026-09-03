import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Wallet } from "ethers";
import { BmoniError, bmoni, pickId } from "@/lib/bmoni";

const SESSION_PATH = path.join(process.cwd(), ".bmoni", "session.json");

/** KYC fields must match Bunch Dillon. Phone/email are unique per install so the shared sandbox key does not 409. */
const PERSONA = {
  firstName: "Bunch",
  lastName: "Dillon",
  dateOfBirth: "1990-01-15",
  gender: "male",
  street: "15 Admiralty Way",
  city: "Lagos",
  state: "Lagos",
  countryCode: "NGA",
  bvn: "95888168924",
};

const IDENTITY_PATH = path.join(process.cwd(), ".bmoni", "identity.json");

type LocalIdentity = {
  email: string;
  phoneNumber: string;
};

async function localIdentity(): Promise<LocalIdentity> {
  try {
    const raw = await readFile(IDENTITY_PATH, "utf8");
    const parsed = JSON.parse(raw) as LocalIdentity;
    if (parsed.email && parsed.phoneNumber) return parsed;
  } catch {
    /* create below */
  }
  const suffix = Math.random().toString(36).slice(2, 8);
  const identity: LocalIdentity = {
    email: `chamber4.${suffix}@hut4devs.dev`,
    phoneNumber: `+2348099${String(Math.floor(100000 + Math.random() * 899999))}`,
  };
  await mkdir(path.dirname(IDENTITY_PATH), { recursive: true });
  await writeFile(IDENTITY_PATH, JSON.stringify(identity, null, 2));
  return identity;
}

/** Hardhat account #1 — docs' first-send destination; Chamber 4 treats this as the cycle pot. */
const TREASURY = process.env.BMONI_TREASURY_ADDRESS ?? "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

export type BmoniSession = {
  userId: string;
  smartWalletId?: string;
  walletAddress?: string;
  email: string;
  phoneNumber?: string;
};

type WalletRow = {
  id?: string;
  smartWalletId?: string;
  address?: string;
  walletAddress?: string;
  currency?: string;
};

type BalanceRow = {
  currency?: string;
  available?: string | number;
  balance?: string | number;
  amount?: string | number;
};

type DepositAccount = {
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bankCode?: string;
};

function ownerWallet() {
  const raw = process.env.BMONI_OWNER_PRIVATE_KEY ?? "";
  if (!raw) throw new BmoniError("BMONI_OWNER_PRIVATE_KEY is missing.", 500, null);
  return new Wallet(raw.startsWith("0x") ? raw : `0x${raw}`);
}

async function readSession(): Promise<BmoniSession | null> {
  try {
    const raw = await readFile(SESSION_PATH, "utf8");
    return JSON.parse(raw) as BmoniSession;
  } catch {
    return null;
  }
}

async function writeSession(session: BmoniSession) {
  await mkdir(path.dirname(SESSION_PATH), { recursive: true });
  await writeFile(SESSION_PATH, JSON.stringify(session, null, 2));
}

function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    for (const key of ["wallets", "items", "balances", "accounts", "users", "data"]) {
      if (Array.isArray(row[key])) return row[key] as T[];
    }
  }
  return [];
}

function walletId(row: WalletRow) {
  return row.smartWalletId ?? row.id ?? "";
}

function walletAddressOf(row: WalletRow) {
  return row.walletAddress ?? row.address ?? "";
}

function isCngn(row: WalletRow) {
  const currency = (row.currency ?? "").toUpperCase();
  return currency.includes("NGN") || currency === "CNGN";
}

async function findUser(identity: LocalIdentity) {
  const queries = [
    `/v1/users?email=${encodeURIComponent(identity.email)}`,
    `/v1/users?emailAddress=${encodeURIComponent(identity.email)}`,
    `/v1/users?phoneNumber=${encodeURIComponent(identity.phoneNumber)}`,
    `/v1/users?phone=${encodeURIComponent(identity.phoneNumber)}`,
    "/v1/users",
  ];

  for (const query of queries) {
    try {
      const rows = asList<Record<string, unknown>>(await bmoni(query));
      const match = rows.find((row) => {
        const email = String(row.email ?? "").toLowerCase();
        const phone = String(row.phoneNumber ?? row.phone ?? "");
        return email === identity.email || phone === identity.phoneNumber;
      });
      const id = pickId(match);
      if (id) return id;
    } catch {
      /* listing is optional recovery */
    }
  }

  return process.env.BMONI_USER_ID ?? "";
}

export async function getRailStatus() {
  const session = await readSession();
  if (!session?.userId) {
    return {
      ready: false,
      provisioned: false,
      rail: "BMONI Embedded · NGN sandbox",
      message: "No BMONI user is linked yet. Open the sandbox wallet to pay on-rail.",
    };
  }

  let wallets: WalletRow[] = [];
  let balances: BalanceRow[] = [];
  let deposit: DepositAccount | null = null;
  let onboarding: string | undefined;
  let warning: string | undefined;

  try {
    wallets = asList<WalletRow>(await bmoni(`/v1/users/${session.userId}/smart-wallets/account/wallets`));
  } catch (error) {
    warning = error instanceof BmoniError ? error.message : "Could not list wallets.";
  }

  try {
    balances = asList<BalanceRow>(await bmoni(`/v1/users/${session.userId}/smart-wallets/account/balances`));
  } catch {
    /* optional until the rail reports */
  }

  try {
    const accounts = await bmoni<DepositAccount | DepositAccount[]>(
      `/v1/users/${session.userId}/bank-accounts/deposit-accounts/NGN`,
    );
    deposit = Array.isArray(accounts) ? accounts[0] ?? null : accounts;
  } catch {
    try {
      deposit = await bmoni<DepositAccount>(`/v1/users/${session.userId}/vba/ngn`);
    } catch {
      /* VBA lands after Nigeria onboarding */
    }
  }

  try {
    const status = await bmoni<{ status?: string; state?: string; stage?: string }>(
      `/v1/users/${session.userId}/onboarding/status`,
    );
    onboarding = status.status ?? status.state ?? status.stage;
  } catch {
    /* onboarding status is informational */
  }

  const cngn = wallets.find(isCngn) ?? wallets[0];
  const smartWalletId = session.smartWalletId || (cngn ? walletId(cngn) : "");
  const walletAddress = session.walletAddress || (cngn ? walletAddressOf(cngn) : ownerWallet().address);

  if (smartWalletId && (session.smartWalletId !== smartWalletId || session.walletAddress !== walletAddress)) {
    await writeSession({ ...session, smartWalletId, walletAddress });
  }

  const ngnBalance = balances.find((row) => String(row.currency ?? "").toUpperCase().includes("NGN"));

  return {
    ready: Boolean(smartWalletId),
    provisioned: true,
    rail: "BMONI Embedded · NGN sandbox",
    userId: session.userId,
    smartWalletId,
    walletAddress,
    ownerAddress: ownerWallet().address,
    treasuryAddress: TREASURY,
    balance: ngnBalance ? String(ngnBalance.available ?? ngnBalance.balance ?? ngnBalance.amount ?? "0") : null,
    deposit,
    onboarding,
    phoneNumber: session.phoneNumber,
    warning,
  };
}

export async function provisionRail() {
  const existing = await readSession();
  const identity = await localIdentity();
  const wallet = ownerWallet();
  let userId = existing?.userId || process.env.BMONI_USER_ID;

  if (!userId) {
    try {
      const created = await bmoni(`/v1/users`, {
        method: "POST",
        body: JSON.stringify({
          firstName: PERSONA.firstName,
          lastName: PERSONA.lastName,
          email: identity.email,
          phoneNumber: identity.phoneNumber,
        }),
      });
      userId = pickId(created);
      if (!userId) {
        const keys =
          created && typeof created === "object" ? Object.keys(created as object).join(", ") : typeof created;
        throw new BmoniError(`BMONI did not return a user id (${keys || "empty"}).`, 502, created);
      }
    } catch (error) {
      if (!(error instanceof BmoniError) || error.status !== 409) throw error;
      userId = pickId(error.body) || (await findUser(identity));
      if (!userId) {
        throw new BmoniError(
          "A BMONI user already exists for this Chamber identity. Recover it from GET /v1/users, or set BMONI_USER_ID.",
          409,
          error.body,
        );
      }
    }
  }

  if (!userId) throw new BmoniError("BMONI did not return a user id.", 502, null);

  try {
    await bmoni(`/v1/users/${userId}/kyc`, {
      method: "PATCH",
      body: JSON.stringify({
        personalInfo: {
          firstName: PERSONA.firstName,
          lastName: PERSONA.lastName,
          dateOfBirth: PERSONA.dateOfBirth,
          gender: PERSONA.gender,
        },
        addressDetails: {
          street: PERSONA.street,
          city: PERSONA.city,
          state: PERSONA.state,
          countryCode: PERSONA.countryCode,
        },
      }),
    });
  } catch {
    /* profile may already exist */
  }

  let smartWalletId = existing?.smartWalletId;
  let walletAddress = existing?.walletAddress ?? wallet.address;

  if (!smartWalletId) {
    try {
      const listed = asList<WalletRow>(await bmoni(`/v1/users/${userId}/smart-wallets/account/wallets`));
      const found = listed.find(isCngn) ?? listed[0];
      if (found && walletId(found)) {
        smartWalletId = walletId(found);
        walletAddress = walletAddressOf(found) || wallet.address;
      }
    } catch {
      /* create below */
    }
  }

  if (!smartWalletId) {
    const challenge = await bmoni<{ challengeId?: string; id?: string; message?: string }>(
      `/v1/users/${userId}/smart-wallets/owner-proof-challenges`,
      {
        method: "POST",
        body: JSON.stringify({
          currency: "CNGN",
          userOwnerAddress: wallet.address,
        }),
      },
    );
    const message = challenge.message ?? "";
    if (!message) throw new BmoniError("BMONI did not return an owner-proof message.", 502, challenge);
    const ownerProofSignature = await wallet.signMessage(message);
    const createdWallet = await bmoni(
      `/v1/users/${userId}/smart-wallets/create-managed`,
      {
        method: "POST",
        body: JSON.stringify({
          currency: "CNGN",
          userOwnerAddress: wallet.address,
          ownerProofChallengeId: challenge.challengeId ?? challenge.id,
          ownerProofSignature,
        }),
      },
    );
    smartWalletId = pickId(createdWallet, ["smartWalletId", "id"]);
    walletAddress =
      pickId(createdWallet, ["walletAddress", "address"]) || wallet.address;
  }

  if (smartWalletId) {
    try {
      await bmoni(`/v1/users/${userId}/onboarding/start-nigeria`, {
        method: "POST",
        body: JSON.stringify({
          bvn: PERSONA.bvn,
          ngnWalletAddress: walletAddress,
          ngnWalletIndex: 0,
        }),
      });
    } catch {
      /* onboarding may already be in flight */
    }

    try {
      await bmoni(`/v1/users/${userId}/smart-wallets/${smartWalletId}/onramp/vba/nigeria`, {
        method: "POST",
      });
    } catch {
      /* VBA may already be linked */
    }
  }

  const session: BmoniSession = {
    userId,
    smartWalletId,
    walletAddress,
    email: identity.email,
    phoneNumber: identity.phoneNumber,
  };
  await writeSession(session);
  return getRailStatus();
}

export async function sendOnRail(input: {
  amount: string;
  purpose: string;
  toAddress?: string;
}) {
  const status = await getRailStatus();
  if (!status.ready || !status.userId || !status.smartWalletId) {
    throw new BmoniError("Open the BMONI wallet before sending.", 409, status);
  }

  const toAddress = input.toAddress || TREASURY;
  const proposal = await bmoni(
    `/v1/users/${status.userId}/smart-wallets/${status.smartWalletId}/proposals`,
    {
      method: "POST",
      body: JSON.stringify({
        proposal: {
          type: "TRANSFER",
          toAddress,
          amount: input.amount,
          currency: "CNGN",
          description: input.purpose.slice(0, 120),
        },
      }),
    },
  );

  const proposalId = pickId(proposal, ["proposalId", "id"]);
  if (!proposalId) throw new BmoniError("BMONI did not return a proposal id.", 502, proposal);

  try {
    await bmoni(`/v1/users/${status.userId}/smart-wallets/proposals/${proposalId}/approve`, {
      method: "POST",
    });
  } catch {
    /* already approved */
  }

  const payload = await bmoni<Record<string, unknown>>(
    `/v1/users/${status.userId}/smart-wallets/proposals/${proposalId}/sign-payload`,
  );
  const nested = payload.payload && typeof payload.payload === "object" ? (payload.payload as Record<string, unknown>) : null;
  const hashToSign = String(
    payload.hashToSign ?? payload.hash ?? payload.digest ?? payload.userOpHash ?? nested?.hashToSign ?? nested?.hash ?? "",
  );
  if (!hashToSign) {
    throw new BmoniError(
      `BMONI did not return a hash to sign (${Object.keys(payload).join(", ") || "empty"}). The sandbox wallet may still be unfunded.`,
      502,
      payload,
    );
  }

  const wallet = ownerWallet();
  const signature = wallet.signingKey.sign(hashToSign).serialized;

  const signed = await bmoni<{ status?: string }>(
    `/v1/users/${status.userId}/smart-wallets/proposals/${proposalId}/sign`,
    {
      method: "POST",
      body: JSON.stringify({ signature }),
    },
  );

  return {
    provider: "bmoni" as const,
    proposalId,
    status: signed.status ?? "PENDING_SIGNATURES",
    amount: input.amount,
    currency: "CNGN",
    purpose: input.purpose,
    toAddress,
    walletAddress: status.walletAddress,
  };
}
