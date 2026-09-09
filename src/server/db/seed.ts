import { SqlQueryable } from './migrator';
import { DEMO_ACCOMMODATION_RESPONSIBILITY } from '../../data/demoAccommodation';

/**
 * Deterministic Development Seed (H4D-FUNC-008)
 *
 * Seeds:
 * - Property: Infinite Grace Apartments
 * - Floor: Floor 3
 * - Room: Room 3B
 * - Fellow: Current Fellow
 * - Responsibility: September Accommodation
 * - Required Amount: ₦66,000
 * - Verified Amount: ₦0
 * - Status: Outstanding
 *
 * Does not generate large random fake datasets.
 */
export async function seedDevelopmentDatabase(client: SqlQueryable): Promise<void> {
  const resp = DEMO_ACCOMMODATION_RESPONSIBILITY;
  const ctx = resp.accommodationContext;

  await client.query(
    `
    INSERT INTO accommodation_responsibilities (
      id,
      fellow_id,
      title,
      required_amount,
      verified_amount,
      status,
      period,
      currency,
      property_id,
      property_name,
      property_address,
      floor_id,
      floor_name,
      floor_level,
      room_id,
      room_name,
      room_code,
      fellow_name,
      fellow_email,
      context_data
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    ON CONFLICT (id) DO UPDATE SET
      required_amount = EXCLUDED.required_amount,
      verified_amount = EXCLUDED.verified_amount,
      status = EXCLUDED.status,
      period = EXCLUDED.period,
      currency = EXCLUDED.currency,
      context_data = EXCLUDED.context_data,
      updated_at = NOW()
    `,
    [
      resp.id,
      resp.fellowId,
      resp.title,
      resp.requiredAmount,
      resp.verifiedAmount,
      resp.status,
      resp.period || 'September 2026',
      resp.currency || 'NGN',
      ctx.property.id,
      ctx.property.name,
      ctx.property.address || null,
      ctx.floor.id,
      ctx.floor.name,
      ctx.floor.levelNumber || 3,
      ctx.room.id,
      ctx.room.name,
      ctx.room.code || null,
      resp.fellow.name,
      resp.fellow.email || null,
      JSON.stringify(ctx),
    ]
  );
}
