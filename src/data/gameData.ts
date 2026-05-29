import type {
  AffinityKey,
  Archetype,
  MilestoneDefinition,
  ModulePool,
  SkillBase,
  StatDefinition,
} from '../types'

export const STAT_DEFINITIONS: StatDefinition[] = [
  {
    key: 'might',
    label: 'Might',
    summary: 'Physical force and athletic pressure.',
    attemptUses: 'Breaking obstacles, lifting, grappling, raw exertion.',
  },
  {
    key: 'vitality',
    label: 'Vitality',
    summary: 'Endurance and bodily resistance.',
    attemptUses: 'Poisons, breath, pain, harsh environments.',
  },
  {
    key: 'agility',
    label: 'Agility',
    summary: 'Movement, precision, and reflexive control.',
    attemptUses: 'Sneaking, picking locks, chasing, dodging hazards.',
  },
  {
    key: 'intellect',
    label: 'Intellect',
    summary: 'Knowledge, engineering, and analysis.',
    attemptUses: 'Research, machinery, computers, technical memory.',
  },
  {
    key: 'instinct',
    label: 'Instinct',
    summary: 'Observation, intuition, and situational reading.',
    attemptUses: 'Tracking, reading people, sensing danger, inspections.',
  },
  {
    key: 'persona',
    label: 'Persona',
    summary: 'Identity, social force, and mental pressure.',
    attemptUses: 'Negotiation, intimidation, morale, psychic resistance.',
  },
]

export const ARCHETYPES: Archetype[] = [
  { name: 'The Hopeful', complexity: 'Low', angle: 'Supportive spark and borrowed momentum.' },
  { name: 'The Expert', complexity: 'Low', angle: 'Clean competence and reliable execution.' },
  { name: 'The Sadist', complexity: 'Low', angle: 'Pressure, cruelty, and decisive finishing.' },
  { name: 'The Upgraded', complexity: 'Medium', angle: 'Augmented body with personal costs.' },
  { name: 'The Engineer', complexity: 'Very High', angle: 'Moving parts, tools, and technical plays.' },
  { name: 'The Drone', complexity: 'Low', angle: 'Corporate access and operational obedience.' },
  { name: 'The Vagrant', complexity: 'Medium', angle: 'Debts, survival, and dirty leverage.' },
  { name: 'The Modified', complexity: 'Medium', angle: 'Mutation, instability, and combat spikes.' },
  { name: 'The Loyal', complexity: 'Medium', angle: 'Devotion, coordination, and sacrifice.' },
  { name: 'The Commander', complexity: 'Low', angle: 'Orders, formation, and team tempo.' },
  { name: 'The Egoist', complexity: 'Medium', angle: 'Personal ambition and E.G.O focus.' },
  { name: 'The Vengeful', complexity: 'Medium', angle: 'Vendetta fuel and dramatic retaliation.' },
  { name: 'The Weary', complexity: 'Low', angle: 'Seen-too-much grit and stubborn survival.' },
  { name: 'The Investigator', complexity: 'Medium', angle: 'Clues, suspicion, and narrative control.' },
  { name: 'The Famed', complexity: 'Medium', angle: 'Reputation, spectacle, and social pull.' },
  { name: 'The Researcher', complexity: 'Low', angle: 'Study, preparation, and discovered answers.' },
  { name: 'The Wanderer', complexity: 'Low', angle: 'Road wisdom and flexible adaptation.' },
  { name: 'The Mastermind', complexity: 'Medium', angle: 'Schemes, contingencies, and careful tempo.' },
  { name: 'The Forgotten', complexity: 'High', angle: 'Anonymity, absence, and unnerving openings.' },
  { name: 'The Lunatic', complexity: 'High', angle: 'Risk, volatility, and unstable insight.' },
  { name: 'The Adept', complexity: 'High', angle: 'Special technique mastery.' },
  { name: 'Custom / Mixed', complexity: 'Custom', angle: 'GM-approved mix of abilities and flaws.' },
]

export const AFFINITIES: Array<{ key: AffinityKey; family: string; track: 'Damage' | 'Stagger' }> = [
  { key: 'slashDamage', family: 'Slash', track: 'Damage' },
  { key: 'slashStagger', family: 'Slash', track: 'Stagger' },
  { key: 'pierceDamage', family: 'Pierce', track: 'Damage' },
  { key: 'pierceStagger', family: 'Pierce', track: 'Stagger' },
  { key: 'bluntDamage', family: 'Blunt', track: 'Damage' },
  { key: 'bluntStagger', family: 'Blunt', track: 'Stagger' },
]

export const SKILL_BASES: SkillBase[] = [
  { name: 'Cheap Blow', cost: 0, dice: '[Any Offensive] 1d6' },
  { name: 'Panic Defense', cost: 0, dice: '[Block or Evade] 1d6' },
  { name: 'Single Strike', cost: 1, dice: '[Any Offensive] 1d8+3' },
  { name: 'Heavy Guard', cost: 1, dice: '[Block] 1d8+3' },
  { name: 'Dual Strike', cost: 1, dice: '[Any Offensive] 1d6\n[Any Other Offensive] 1d4' },
  { name: 'Mixed Defense', cost: 1, dice: '[Block or Evade] 1d8\n[Block or Evade] 1d6' },
  { name: 'Parry', cost: 1, dice: '[Block or Evade] 1d6\n[Any Offensive] 1d6' },
  { name: 'Riposte', cost: 1, dice: '[Any Offensive] 1d6\n[Block or Evade] 1d6' },
  { name: 'Strong Strike', cost: 2, dice: '[Any Offensive] 1d10+5' },
  { name: 'Double Attack', cost: 2, dice: '[Any Offensive] 1d8\n[Any Offensive] 1d8' },
  { name: 'Fake Out', cost: 2, dice: '[Any Offensive] 1d4+1\n[Any Other Offensive] 1d8+1' },
  { name: 'Lunge', cost: 2, dice: '[Any Offensive] 1d8+1\n[Evade] 1d6+1' },
  { name: 'Triple Threat', cost: 2, dice: '[Any Offensive] 1d6\n[Block or Evade] 1d6\n[Any Offensive] 1d6' },
  { name: 'Quick Jabs', cost: 2, dice: '[Any Offensive] 1d6\n[Any Offensive] 1d4\n[Any Offensive] 1d4' },
  { name: 'Delayed Strike', cost: 2, dice: '[Block] 1d6+1\n[Any Offensive] 1d8+1' },
  { name: 'Defensive Push', cost: 2, dice: '[Any Offensive] 1d10\n[Block] 1d6+2' },
  { name: 'Walled Off', cost: 2, dice: '[Block] 1d8\n[Block] 1d8\n[Any Offensive] 1d6' },
  { name: 'Wait and See', cost: 2, dice: '[Evade] 1d4\n[Block] 1d4\n[Any Offensive] 1d8+2' },
  { name: 'Massive Strike', cost: 3, dice: '[Any Offensive] 1d12+8' },
  { name: 'Full Assault', cost: 3, dice: '[Any Offensive] 1d8+1\n[Any Offensive] 1d8\n[Any Offensive] 1d6' },
  { name: 'Old Reliable', cost: 3, dice: '[Block] 1d8+1\n[Any Offensive] 1d10+3\n[Block] 1d8+1' },
  { name: 'Press On', cost: 3, dice: '[Any Offensive] 1d10\n[Any Offensive] 1d8\n[Block or Evade] 1d8' },
  { name: 'Ready for Anything', cost: 3, dice: '[Any Offensive] 1d8\n[Any Offensive] 1d6\n[Block] 1d8\n[Block or Evade] 1d6' },
  { name: 'Dodge and Weave', cost: 3, dice: '[Evade] 1d8\n[Any Offensive] 1d8\n[Evade] 1d6\n[Any Offensive] 1d6' },
  { name: 'Oldest Trick', cost: 3, dice: '[Evade] 1d8+1\n[Any Offensive] 1d10+3' },
  { name: 'Unique Skill', cost: 0, dice: 'Use the Unique Skill text from your table.' },
]

export const MILESTONES: MilestoneDefinition[] = [
  {
    stat: 'might',
    value: 6,
    options: [
      { id: 'overwhelm', name: 'Overwhelm', summary: 'One offensive die on each known skill gains +1 base power.' },
      { id: 'opening-move', name: 'Opening Move', summary: 'Begin each battle with 2 Strength.' },
    ],
  },
  {
    stat: 'might',
    value: 8,
    options: [
      { id: 'overpower', name: 'Overpower', summary: 'Requires Overwhelm; all offensive dice on known skills gain +1 base power.' },
      { id: 'oppress', name: 'Oppress', summary: 'First stagger or defeat each scene can drain Light from another opponent.' },
    ],
  },
  {
    stat: 'vitality',
    value: 6,
    options: [
      { id: 'take-up-space', name: 'Take Up Space', summary: 'Begin each battle with 3 Aggro.' },
      { id: 'still-standing', name: 'Still Standing', summary: 'Begin each battle with 2 Safeguard.' },
    ],
  },
  {
    stat: 'vitality',
    value: 8,
    options: [
      { id: 'perfect-guard', name: 'Perfect Guard', summary: 'Use as a GM-approved affinity improvement.' },
      { id: 'guard-proficiency', name: 'Guard Proficiency', summary: 'One block die on each known skill gains +1 base power.' },
    ],
  },
  {
    stat: 'agility',
    value: 4,
    options: [
      { id: 'sure-footing', name: 'Sure Footing', summary: 'Increase maximum Stagger Resist by 5.' },
      { id: 'headstart', name: 'Headstart', summary: 'First scene Speed Dice gain +2 final value.' },
    ],
  },
  {
    stat: 'agility',
    value: 6,
    options: [
      { id: 'steady-pace', name: 'Steady Pace', summary: 'Smaller Speed Dice, but +2 to their final value.' },
      { id: 'evade-expert', name: 'Evade Expert', summary: 'Evade dice on known skills increase one die size, max d12.' },
    ],
  },
  {
    stat: 'agility',
    value: 8,
    options: [
      { id: 'battle-speed', name: 'Battle Speed', summary: 'Gain a speed feat without counting against known feats.' },
    ],
  },
  {
    stat: 'instinct',
    value: 4,
    options: [
      { id: 'clever-thinking', name: 'Clever Thinking', summary: 'Start each mission with +1 Excellence.' },
      { id: 'learning', name: 'Learning', summary: 'Gain one additional spare Rank 1 module.' },
    ],
  },
  {
    stat: 'instinct',
    value: 6,
    options: [
      { id: 'light-adept', name: 'Light Adept', summary: 'Odd-numbered scenes restore 1 additional Light.' },
      { id: 'courage-trepidation', name: 'Courage and Trepidation', summary: 'Regain Light when targeted without responding once per scene.' },
    ],
  },
  {
    stat: 'instinct',
    value: 8,
    options: [
      { id: 'light-expert', name: 'Light Expert', summary: 'Replaces the Instinct 6 option and increases Light regen by 1.' },
      { id: 'packed-full', name: 'Packed Full', summary: 'Increase maximum Light by 1 and extend limited skills.' },
    ],
  },
  {
    stat: 'persona',
    value: 4,
    options: [
      { id: 'smooth-thinking', name: 'Smooth Thinking', summary: 'Start each mission with +2 Excellence.' },
      { id: 'strong-identity', name: 'Strong Identity', summary: 'Add a Rank 1 module to Base E.G.O.' },
    ],
  },
  {
    stat: 'persona',
    value: 6,
    options: [
      { id: 'inner-attunement', name: 'Inner Attunement', summary: 'Base E.G.O gains the other creation benefit.' },
      { id: 'harmonious-ego', name: 'Harmonious E.G.O', summary: 'Reduce Emotion Point costs for slotted E.G.O skills.' },
    ],
  },
  {
    stat: 'persona',
    value: 8,
    options: [
      { id: 'ego-stamina', name: 'E.G.O Stamina', summary: 'Reduce high-Light E.G.O skill costs.' },
      { id: 'ego-expert', name: 'E.G.O Expert', summary: 'Slotted E.G.O dice gain base power.' },
    ],
  },
]

export const LEVEL_CHART: Array<{
  level: number
  stat: string
  spare: ModulePool
  totalSkills: number
  improvement: string
  totalFeats: number
  ego: string
  checkAbilities: boolean
}> = [
  { level: 1, stat: 'Base', spare: { rank1: 0, rank2: 0, rank3: 0 }, totalSkills: 4, improvement: '-', totalFeats: 1, ego: 'none', checkAbilities: false },
  { level: 2, stat: '+1 max 3', spare: { rank1: 1, rank2: 0, rank3: 0 }, totalSkills: 4, improvement: '-', totalFeats: 1, ego: 'Create Base E.G.O', checkAbilities: false },
  { level: 3, stat: '+1', spare: { rank1: 0, rank2: 1, rank3: 0 }, totalSkills: 5, improvement: 'Minor', totalFeats: 1, ego: '-', checkAbilities: true },
  { level: 4, stat: '-', spare: { rank1: 1, rank2: 0, rank3: 0 }, totalSkills: 5, improvement: 'Minor', totalFeats: 2, ego: '-', checkAbilities: false },
  { level: 5, stat: '-', spare: { rank1: 1, rank2: 0, rank3: 0 }, totalSkills: 5, improvement: 'Major', totalFeats: 2, ego: '-', checkAbilities: false },
  { level: 6, stat: '+1', spare: { rank1: 0, rank2: 0, rank3: 1 }, totalSkills: 6, improvement: '+10 HP', totalFeats: 2, ego: '+1 Rank 1', checkAbilities: true },
  { level: 7, stat: '+1 max 3', spare: { rank1: 0, rank2: 1, rank3: 0 }, totalSkills: 6, improvement: 'Minor', totalFeats: 2, ego: '-', checkAbilities: false },
  { level: 8, stat: '+1', spare: { rank1: 2, rank2: 0, rank3: 0 }, totalSkills: 7, improvement: '-', totalFeats: 3, ego: '-', checkAbilities: false },
  { level: 9, stat: '-', spare: { rank1: 1, rank2: 0, rank3: 0 }, totalSkills: 7, improvement: 'Major', totalFeats: 3, ego: '-', checkAbilities: true },
  { level: 10, stat: '+1', spare: { rank1: 0, rank2: 0, rank3: 1 }, totalSkills: 8, improvement: '+10 HP', totalFeats: 3, ego: '+1 Rank 2', checkAbilities: false },
  { level: 11, stat: '+1 max 5', spare: { rank1: 0, rank2: 1, rank3: 0 }, totalSkills: 8, improvement: 'Minor', totalFeats: 3, ego: '-', checkAbilities: false },
  { level: 12, stat: '+1', spare: { rank1: 1, rank2: 1, rank3: 0 }, totalSkills: 8, improvement: '-', totalFeats: 4, ego: '-', checkAbilities: false },
  { level: 13, stat: '-', spare: { rank1: 1, rank2: 0, rank3: 0 }, totalSkills: 8, improvement: 'Major', totalFeats: 4, ego: '-', checkAbilities: true },
  { level: 14, stat: '+1', spare: { rank1: 0, rank2: 0, rank3: 1 }, totalSkills: 9, improvement: '+10 HP', totalFeats: 4, ego: '+1 Rank 3', checkAbilities: false },
  { level: 15, stat: '+1 max 5', spare: { rank1: 1, rank2: 0, rank3: 0 }, totalSkills: 9, improvement: 'Minor', totalFeats: 4, ego: '-', checkAbilities: false },
  { level: 16, stat: '+1', spare: { rank1: 0, rank2: 0, rank3: 1 }, totalSkills: 9, improvement: '-', totalFeats: 5, ego: '-', checkAbilities: true },
  { level: 17, stat: '-', spare: { rank1: 0, rank2: 1, rank3: 0 }, totalSkills: 9, improvement: 'Major', totalFeats: 5, ego: '-', checkAbilities: false },
  { level: 18, stat: '+1', spare: { rank1: 0, rank2: 0, rank3: 1 }, totalSkills: 9, improvement: '+10 HP', totalFeats: 5, ego: '-', checkAbilities: false },
  { level: 19, stat: '+1 max 5', spare: { rank1: 0, rank2: 1, rank3: 0 }, totalSkills: 9, improvement: 'Minor', totalFeats: 6, ego: '-', checkAbilities: false },
  { level: 20, stat: '+1', spare: { rank1: 0, rank2: 0, rank3: 1 }, totalSkills: 9, improvement: '-', totalFeats: 6, ego: '+1 Rank 3', checkAbilities: false },
]

export const FEAT_SUGGESTIONS = [
  'Building Speed',
  'Opening Speed',
  'Speed Expert',
  'Light Reservoir',
  'Defensive Stance',
  'Poise Training',
  'Status Specialist',
  'Team Formation',
  'E.G.O Conditioning',
  'Module Discipline',
]

export const EMPTY_AFFINITY_RESISTANCES: Record<AffinityKey, number> = {
  slashDamage: 0,
  slashStagger: 0,
  pierceDamage: 0,
  pierceStagger: 0,
  bluntDamage: 0,
  bluntStagger: 0,
}

export const STAT_ARRAY_TOTAL = 15
