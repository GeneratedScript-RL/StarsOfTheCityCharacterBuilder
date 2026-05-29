export type StatKey =
  | 'might'
  | 'vitality'
  | 'agility'
  | 'intellect'
  | 'instinct'
  | 'persona'

export type AffinityKey =
  | 'slashDamage'
  | 'slashStagger'
  | 'pierceDamage'
  | 'pierceStagger'
  | 'bluntDamage'
  | 'bluntStagger'

export type ModuleRank = 'rank1' | 'rank2' | 'rank3'

export interface StatDefinition {
  key: StatKey
  label: string
  summary: string
  attemptUses: string
}

export interface MilestoneOption {
  id: string
  name: string
  summary: string
}

export interface MilestoneDefinition {
  stat: StatKey
  value: number
  options: MilestoneOption[]
}

export interface Archetype {
  name: string
  complexity: 'Low' | 'Medium' | 'High' | 'Very High' | 'Custom'
  angle: string
}

export interface SkillBase {
  name: string
  cost: number
  dice: string
}

export interface SkillSlot {
  id: string
  name: string
  base: string
  isUnique: boolean
  spareRank1: number
  spareRank2: number
  spareRank3: number
  tags: string
  notes: string
}

export interface CharacterSheet {
  name: string
  alias: string
  pronouns: string
  player: string
  faction: string
  district: string
  level: number
  archetype: string
  customArchetype: string
  storyAbilityOne: string
  storyAbilityTwo: string
  battleAbility: string
  tragicFlaw: string
  stats: Record<StatKey, number>
  milestoneChoices: Record<string, string>
  affinityResistances: Record<AffinityKey, number>
  feats: string[]
  skills: SkillSlot[]
  egoName: string
  egoNotes: string
  appearance: string
  background: string
  treasures: string
  campaignNotes: string
}

export interface ModulePool {
  rank1: number
  rank2: number
  rank3: number
}
