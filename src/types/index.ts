export interface User { id: string; email: string; created_at: string }
export interface PersonProfile { id: string; user_id: string | null; first_name: string; last_name: string; birthday: string | null; phone: string | null; email: string | null; avatar_url: string | null; created_at: string }
export interface Household { id: string; name: string; created_by: string; created_at: string }
export interface HouseholdMember { id: string; household_id: string; person_profile_id: string; role: 'admin' | 'member'; status: 'active' | 'invited' | 'pending'; invited_by: string | null; joined_at: string | null; created_at: string; person_profile?: PersonProfile }
export interface HouseholdInvite { id: string; household_id: string; token: string; created_by: string; expires_at: string; max_uses: number | null; uses: number; created_at: string; household?: Household }
export interface Circle { id: string; name: string; household_id: string | null; created_by: string; created_at: string }