import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  FileUp,
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  UserRound,
} from 'lucide-react'
import './App.css'
import attackIcon from './assets/dice/attack.png'
import counterIcon from './assets/dice/counter.png'
import defenseIcon from './assets/dice/defense.png'
import {
  AFFINITIES,
  ARCHETYPES,
  EMPTY_AFFINITY_RESISTANCES,
  FEAT_SUGGESTIONS,
  LEVEL_CHART,
  MILESTONES,
  SKILL_BASES,
  STAT_ARRAY_TOTAL,
  STAT_DEFINITIONS,
} from './data/gameData'
import type { AffinityKey, CharacterSheet, ModulePool, SkillSlot, StatKey } from './types'

type TabKey = 'basics' | 'stats' | 'affinities' | 'skills' | 'notes'
type DiceKind = 'attack' | 'defense' | 'counter'

const STORAGE_KEY = 'sotc-character-sheet-builder:v1'

const TABS: Array<{ key: TabKey; label: string; icon: typeof UserRound }> = [
  { key: 'basics', label: 'Identity', icon: UserRound },
  { key: 'stats', label: 'Stats', icon: ClipboardList },
  { key: 'affinities', label: 'Affinities', icon: Shield },
  { key: 'skills', label: 'Skills', icon: Swords },
  { key: 'notes', label: 'Notes', icon: FileText },
]

const MODULE_ZERO: ModulePool = { rank1: 0, rank2: 0, rank3: 0 }
const DICE_ICONS: Record<DiceKind, string> = {
  attack: attackIcon,
  defense: defenseIcon,
  counter: counterIcon,
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2)
}

function createSkill(index: number, baseName = SKILL_BASES[index % 4]?.name ?? 'Cheap Blow'): SkillSlot {
  return {
    id: createId(),
    name: `Known Skill ${index + 1}`,
    base: baseName,
    isUnique: false,
    spareRank1: 0,
    spareRank2: 0,
    spareRank3: 0,
    tags: '',
    notes: '',
  }
}

function createDefaultSheet(): CharacterSheet {
  return {
    name: '',
    alias: '',
    pronouns: '',
    player: '',
    faction: '',
    district: '',
    level: 1,
    archetype: 'The Hopeful',
    customArchetype: '',
    storyAbilityOne: '',
    storyAbilityTwo: '',
    battleAbility: '',
    tragicFlaw: '',
    stats: {
      might: 4,
      vitality: 3,
      agility: 3,
      intellect: 2,
      instinct: 2,
      persona: 1,
    },
    milestoneChoices: {},
    affinityResistances: { ...EMPTY_AFFINITY_RESISTANCES },
    feats: [''],
    skills: [createSkill(0), createSkill(1), createSkill(2), createSkill(3)],
    egoName: '',
    egoNotes: '',
    appearance: '',
    background: '',
    treasures: '',
    campaignNotes: '',
  }
}

function getTotalSkillsForLevel(level: number) {
  return LEVEL_CHART.find((row) => row.level === level)?.totalSkills ?? 4
}

function normalizeSheet(candidate: Partial<CharacterSheet>): CharacterSheet {
  const fallback = createDefaultSheet()
  const level = clamp(Number(candidate.level ?? fallback.level), 1, 20)
  const stats = { ...fallback.stats, ...candidate.stats }
  const affinityResistances = {
    ...fallback.affinityResistances,
    ...candidate.affinityResistances,
  }
  const skills: SkillSlot[] = Array.isArray(candidate.skills) && candidate.skills.length > 0
    ? candidate.skills.map((skill, index) => ({
        ...createSkill(index),
        ...skill,
        id: skill.id || createId(),
      }))
    : fallback.skills
  while (skills.length < getTotalSkillsForLevel(level)) {
    skills.push(createSkill(skills.length))
  }

  return {
    ...fallback,
    ...candidate,
    level,
    stats,
    affinityResistances,
    feats: Array.isArray(candidate.feats) ? candidate.feats : fallback.feats,
    skills,
    milestoneChoices: { ...fallback.milestoneChoices, ...candidate.milestoneChoices },
  }
}

function loadSheet() {
  if (typeof window === 'undefined') {
    return createDefaultSheet()
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return createDefaultSheet()
  }

  try {
    return normalizeSheet(JSON.parse(saved) as Partial<CharacterSheet>)
  } catch {
    return createDefaultSheet()
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function addPools(a: ModulePool, b: ModulePool): ModulePool {
  return {
    rank1: a.rank1 + b.rank1,
    rank2: a.rank2 + b.rank2,
    rank3: a.rank3 + b.rank3,
  }
}

function getLevelProgress(level: number) {
  const rows = LEVEL_CHART.filter((row) => row.level <= level)
  const current = LEVEL_CHART.find((row) => row.level === level) ?? LEVEL_CHART[0]
  const sparePool = rows.reduce((pool, row) => addPools(pool, row.spare), MODULE_ZERO)
  const statIncreases = rows.filter((row) => row.stat.startsWith('+1')).length
  const hpBonus = rows.filter((row) => row.improvement === '+10 HP').length * 10

  return {
    ...current,
    sparePool,
    statBudget: STAT_ARRAY_TOTAL + statIncreases,
    hpBonus,
  }
}

function getIntellectModules(intellect: number): ModulePool {
  const byPoint: ModulePool[] = [
    { rank1: 2, rank2: 0, rank3: 0 },
    { rank1: 1, rank2: 0, rank3: 0 },
    { rank1: 1, rank2: 0, rank3: 0 },
    { rank1: 0, rank2: 1, rank3: 0 },
    { rank1: 0, rank2: 1, rank3: 0 },
    { rank1: 0, rank2: 1, rank3: 0 },
    { rank1: 0, rank2: 1, rank3: 0 },
    { rank1: 0, rank2: 0, rank3: 1 },
  ]

  return byPoint
    .slice(0, clamp(intellect, 1, 8))
    .reduce((pool, point) => addPools(pool, point), MODULE_ZERO)
}

function getSpeedDie(agility: number) {
  if (agility >= 7) return 'd12'
  if (agility >= 5) return 'd10'
  if (agility >= 3) return 'd8'
  return 'd6'
}

function formatPool(pool: ModulePool) {
  return `R1 ${pool.rank1} / R2 ${pool.rank2} / R3 ${pool.rank3}`
}

function formatRange(line: string) {
  const match = line.match(/(\d+)d(\d+)([+-]\d+)?/i)
  if (!match) {
    return null
  }

  const diceCount = Number(match[1])
  const dieSize = Number(match[2])
  const modifier = Number(match[3] ?? 0)
  const min = diceCount + modifier
  const max = diceCount * dieSize + modifier

  return `${min}-${max}`
}

function getDiceKind(line: string): DiceKind {
  const lower = line.toLowerCase()
  if (lower.includes('counter')) {
    return 'counter'
  }

  if (lower.includes('block') || lower.includes('evade') || lower.includes('defensive')) {
    return 'defense'
  }

  return 'attack'
}

function getDiceLabel(line: string) {
  return line.match(/\[([^\]]+)\]/)?.[1] ?? 'Dice'
}

function App() {
  const [sheet, setSheet] = useState<CharacterSheet>(loadSheet)
  const [activeTab, setActiveTab] = useState<TabKey>('basics')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const levelProgress = useMemo(() => getLevelProgress(sheet.level), [sheet.level])
  const selectedArchetype = useMemo(
    () => ARCHETYPES.find((archetype) => archetype.name === sheet.archetype) ?? ARCHETYPES[0],
    [sheet.archetype],
  )
  const selectedMilestones = useMemo(
    () => new Set(Object.values(sheet.milestoneChoices).filter(Boolean)),
    [sheet.milestoneChoices],
  )
  const statTotal = useMemo(
    () => Object.values(sheet.stats).reduce((total, value) => total + value, 0),
    [sheet.stats],
  )

  const derived = useMemo(() => {
    const hasMilestone = (id: string) => selectedMilestones.has(id)
    const maxLight =
      3 +
      [3, 5, 7].filter((threshold) => sheet.stats.instinct >= threshold).length +
      (hasMilestone('packed-full') ? 1 : 0)
    const excellence =
      1 +
      (hasMilestone('clever-thinking') ? 1 : 0) +
      (hasMilestone('smooth-thinking') ? 2 : 0)
    const milestoneModules = hasMilestone('learning')
      ? { rank1: 1, rank2: 0, rank3: 0 }
      : MODULE_ZERO
    const modulePool = addPools(
      addPools(getIntellectModules(sheet.stats.intellect), levelProgress.sparePool),
      milestoneModules,
    )
    const allocatedModules = sheet.skills.reduce(
      (pool, skill) =>
        addPools(pool, {
          rank1: skill.spareRank1,
          rank2: skill.spareRank2,
          rank3: skill.spareRank3,
        }),
      MODULE_ZERO,
    )

    return {
      hp: 30 + sheet.stats.might * 10 + levelProgress.hpBonus,
      staggerResist: 15 + sheet.stats.vitality * 5 + (hasMilestone('sure-footing') ? 5 : 0),
      speedDie: getSpeedDie(sheet.stats.agility),
      maxLight,
      excellence,
      startingEmotion: sheet.stats.persona,
      modulePool,
      allocatedModules,
    }
  }, [levelProgress.hpBonus, levelProgress.sparePool, selectedMilestones, sheet.skills, sheet.stats])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet))
  }, [sheet])

  const setField = <Key extends keyof CharacterSheet>(key: Key, value: CharacterSheet[Key]) => {
    setSheet((current) => ({ ...current, [key]: value }))
  }

  const setLevel = (level: number) => {
    setSheet((current) => {
      const nextLevel = clamp(level, 1, 20)
      const totalSkills = getTotalSkillsForLevel(nextLevel)
      const skills = [...current.skills]
      while (skills.length < totalSkills) {
        skills.push(createSkill(skills.length))
      }

      return { ...current, level: nextLevel, skills }
    })
  }

  const updateStat = (key: StatKey, delta: number) => {
    setSheet((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [key]: clamp(current.stats[key] + delta, 1, 8),
      },
    }))
  }

  const setStat = (key: StatKey, value: number) => {
    setSheet((current) => ({
      ...current,
      stats: {
        ...current.stats,
        [key]: clamp(value, 1, 8),
      },
    }))
  }

  const updateSkill = (id: string, patch: Partial<SkillSlot>) => {
    setSheet((current) => ({
      ...current,
      skills: current.skills.map((skill) => (skill.id === id ? { ...skill, ...patch } : skill)),
    }))
  }

  const updateFeat = (index: number, value: string) => {
    const feats = [...sheet.feats]
    feats[index] = value
    setField('feats', feats)
  }

  const removeFeat = (index: number) => {
    const feats = sheet.feats.filter((_, featIndex) => featIndex !== index)
    setField('feats', feats.length > 0 ? feats : [''])
  }

  const exportSheet = () => {
    const fileName = `${sheet.name || sheet.alias || 'sotc-character'}-sheet.json`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const blob = new Blob([JSON.stringify(sheet, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const importSheet = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const text = await file.text()
    setSheet(normalizeSheet(JSON.parse(text) as Partial<CharacterSheet>))
    event.target.value = ''
  }

  const resetSheet = () => {
    if (window.confirm('Reset the current character sheet?')) {
      setSheet(createDefaultSheet())
      setActiveTab('basics')
    }
  }

  const setAffinityValue = (key: AffinityKey, value: number) => {
    setSheet((current) => ({
      ...current,
      affinityResistances: {
        ...current.affinityResistances,
        [key]: Number.isFinite(value) ? value : 0,
      },
    }))
  }

  const checklist = [
    { label: 'Archetype', done: Boolean(sheet.archetype) },
    { label: 'Stat budget', done: statTotal <= levelProgress.statBudget },
    { label: 'Affinities', done: AFFINITIES.every((affinity) => Number.isFinite(sheet.affinityResistances[affinity.key])) },
    { label: 'Feat slots', done: sheet.feats.filter(Boolean).length >= levelProgress.totalFeats },
    {
      label: 'Known skills',
      done: sheet.skills.filter((skill) => skill.name.trim()).length >= levelProgress.totalSkills,
    },
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src="/favicon.svg" alt="" aria-hidden="true" />
          <div>
            <p className="eyebrow">Stars of the City</p>
            <h1>Character Sheet Builder</h1>
          </div>
        </div>

        <div className="top-actions">
          <button type="button" className="icon-button" title="Import JSON" onClick={() => fileInputRef.current?.click()}>
            <FileUp size={18} aria-hidden="true" />
          </button>
          <input ref={fileInputRef} className="hidden-input" type="file" accept="application/json,.json" onChange={importSheet} />
          <button type="button" className="icon-button" title="Export JSON" onClick={exportSheet}>
            <Download size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" title="Print sheet" onClick={() => window.print()}>
            <Printer size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button danger" title="Reset sheet" onClick={resetSheet}>
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="builder-grid">
        <aside className="left-rail" aria-label="Builder sections">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                type="button"
                key={tab.key}
                className={`rail-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </aside>

        <main className="workspace">
          {activeTab === 'basics' && (
            <section className="panel">
              <PanelTitle icon={UserRound} eyebrow="Identity" title="Character Core" />
              <div className="form-grid two">
                <TextField label="Name" value={sheet.name} onChange={(value) => setField('name', value)} />
                <TextField label="Alias" value={sheet.alias} onChange={(value) => setField('alias', value)} />
                <TextField label="Pronouns" value={sheet.pronouns} onChange={(value) => setField('pronouns', value)} />
                <TextField label="Player" value={sheet.player} onChange={(value) => setField('player', value)} />
                <TextField label="Faction" value={sheet.faction} onChange={(value) => setField('faction', value)} />
                <TextField label="District" value={sheet.district} onChange={(value) => setField('district', value)} />
              </div>

              <div className="form-grid two">
                <label className="field">
                  <span>Level</span>
                  <select value={sheet.level} onChange={(event) => setLevel(Number(event.target.value))}>
                    {LEVEL_CHART.map((row) => (
                      <option key={row.level} value={row.level}>
                        Level {row.level}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Archetype</span>
                  <select value={sheet.archetype} onChange={(event) => setField('archetype', event.target.value)}>
                    {ARCHETYPES.map((archetype) => (
                      <option key={archetype.name} value={archetype.name}>
                        {archetype.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="archetype-strip">
                <div>
                  <strong>{selectedArchetype.name}</strong>
                  <span>{selectedArchetype.complexity}</span>
                </div>
                <p>{selectedArchetype.angle}</p>
              </div>

              {sheet.archetype === 'Custom / Mixed' && (
                <TextField label="Custom archetype" value={sheet.customArchetype} onChange={(value) => setField('customArchetype', value)} />
              )}

              <div className="form-grid two">
                <TextArea label="Story Ability 1" value={sheet.storyAbilityOne} onChange={(value) => setField('storyAbilityOne', value)} />
                <TextArea label="Story Ability 2" value={sheet.storyAbilityTwo} onChange={(value) => setField('storyAbilityTwo', value)} />
                <TextArea label="Battle Ability" value={sheet.battleAbility} onChange={(value) => setField('battleAbility', value)} />
                <TextArea label="Tragic Flaw" value={sheet.tragicFlaw} onChange={(value) => setField('tragicFlaw', value)} />
              </div>

              <div className="section-heading">
                <h2>Feats</h2>
                <button
                  type="button"
                  className="small-button"
                  onClick={() => setField('feats', [...sheet.feats, ''])}
                >
                  <Plus size={16} aria-hidden="true" />
                  Add
                </button>
              </div>
              <datalist id="feat-suggestions">
                {FEAT_SUGGESTIONS.map((feat) => (
                  <option key={feat} value={feat} />
                ))}
              </datalist>
              <div className="stack">
                {Array.from({ length: Math.max(levelProgress.totalFeats, sheet.feats.length) }, (_, index) => (
                  <div className="inline-row" key={`feat-${index}`}>
                    <label className="field grow">
                      <span>Feat {index + 1}</span>
                      <input
                        list="feat-suggestions"
                        value={sheet.feats[index] ?? ''}
                        onChange={(event) => updateFeat(index, event.target.value)}
                      />
                    </label>
                    <button type="button" className="icon-button ghost" title="Remove feat" onClick={() => removeFeat(index)}>
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'stats' && (
            <section className="panel">
              <PanelTitle icon={ClipboardList} eyebrow="Creation Array" title="Stats and Milestones" />
              <div className={`budget-bar ${statTotal > levelProgress.statBudget ? 'warning' : ''}`}>
                <span>Stats {statTotal}</span>
                <strong>Budget {levelProgress.statBudget}</strong>
              </div>

              <div className="stat-list">
                {STAT_DEFINITIONS.map((stat) => (
                  <article className="stat-row" key={stat.key}>
                    <div>
                      <h2>{stat.label}</h2>
                      <p>{stat.summary}</p>
                      <small>{stat.attemptUses}</small>
                    </div>
                    <div className="stepper" aria-label={`${stat.label} value`}>
                      <button type="button" title={`Decrease ${stat.label}`} onClick={() => updateStat(stat.key, -1)}>
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={sheet.stats[stat.key]}
                        onChange={(event) => setStat(stat.key, Number(event.target.value))}
                      />
                      <button type="button" title={`Increase ${stat.label}`} onClick={() => updateStat(stat.key, 1)}>
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="metric-grid">
                <Metric label="HP" value={derived.hp} />
                <Metric label="Stagger Resist" value={derived.staggerResist} />
                <Metric label="Speed Die" value={derived.speedDie} />
                <Metric label="Max Light" value={derived.maxLight} />
                <Metric label="Emotion Start" value={derived.startingEmotion} />
                <Metric label="Excellence" value={derived.excellence} />
              </div>

              <div className="section-heading">
                <h2>Milestones</h2>
                <span className="pill">4 / 6 / 8</span>
              </div>
              <div className="milestone-grid">
                {MILESTONES.map((milestone) => {
                  const unlocked = sheet.stats[milestone.stat] >= milestone.value
                  const statLabel = STAT_DEFINITIONS.find((stat) => stat.key === milestone.stat)?.label
                  const choiceKey = `${milestone.stat}-${milestone.value}`

                  return (
                    <article className={`milestone-card ${unlocked ? '' : 'locked'}`} key={choiceKey}>
                      <div className="milestone-head">
                        <strong>
                          {statLabel} {milestone.value}
                        </strong>
                        <span>{unlocked ? 'Open' : 'Locked'}</span>
                      </div>
                      {milestone.options.map((option) => (
                        <label className="radio-row" key={option.id}>
                          <input
                            type="radio"
                            name={choiceKey}
                            value={option.id}
                            disabled={!unlocked}
                            checked={sheet.milestoneChoices[choiceKey] === option.id}
                            onChange={() =>
                              setSheet((current) => ({
                                ...current,
                                milestoneChoices: {
                                  ...current.milestoneChoices,
                                  [choiceKey]: option.id,
                                },
                              }))
                            }
                          />
                          <span>
                            <strong>{option.name}</strong>
                            <small>{option.summary}</small>
                          </span>
                        </label>
                      ))}
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {activeTab === 'affinities' && (
            <section className="panel">
              <PanelTitle icon={Shield} eyebrow="Damage Response" title="Affinities" />
              <div className="affinity-grid">
                {AFFINITIES.map((affinity) => {
                  return (
                    <article className="affinity-cell" key={affinity.key}>
                      <div>
                        <strong>{affinity.family}</strong>
                        <span>{affinity.track}</span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={sheet.affinityResistances[affinity.key]}
                        onChange={(event) => setAffinityValue(affinity.key, Number(event.target.value))}
                        aria-label={`${affinity.family} ${affinity.track} affinity`}
                      />
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {activeTab === 'skills' && (
            <section className="panel">
              <PanelTitle icon={Swords} eyebrow="Combat Pages" title="Known Skills" />
              <div className="module-ledger">
                <Metric label="Spare Pool" value={formatPool(derived.modulePool)} />
                <Metric label="Allocated" value={formatPool(derived.allocatedModules)} />
                <Metric label="Skill Slots" value={`${sheet.skills.length} / ${levelProgress.totalSkills}`} />
              </div>

              <div className="skill-list">
                {sheet.skills.map((skill, index) => {
                  const base = SKILL_BASES.find((skillBase) => skillBase.name === skill.base) ?? SKILL_BASES[0]
                  return (
                    <article className="skill-card" key={skill.id}>
                      <div className="skill-card-head">
                        <div>
                          <span>Skill {index + 1}</span>
                          <input value={skill.name} onChange={(event) => updateSkill(skill.id, { name: event.target.value })} />
                        </div>
                        <label className="check-row">
                          <input
                            type="checkbox"
                            checked={skill.isUnique}
                            onChange={(event) => updateSkill(skill.id, { isUnique: event.target.checked })}
                          />
                          Unique
                        </label>
                      </div>

                      <div className="form-grid two">
                        <label className="field">
                          <span>Base</span>
                          <select value={skill.base} onChange={(event) => updateSkill(skill.id, { base: event.target.value })}>
                            {SKILL_BASES.map((skillBase) => (
                              <option key={skillBase.name} value={skillBase.name}>
                                {skillBase.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="base-readout">
                          <span>Cost {base.cost}</span>
                          <DiceBlock dice={base.dice} />
                        </div>
                      </div>

                      <div className="module-row">
                        <NumberField label="Spare R1" value={skill.spareRank1} onChange={(value) => updateSkill(skill.id, { spareRank1: value })} />
                        <NumberField label="Spare R2" value={skill.spareRank2} onChange={(value) => updateSkill(skill.id, { spareRank2: value })} />
                        <NumberField label="Spare R3" value={skill.spareRank3} onChange={(value) => updateSkill(skill.id, { spareRank3: value })} warning={skill.spareRank3 > 2} />
                      </div>

                      <TextField label="Tags" value={skill.tags} onChange={(value) => updateSkill(skill.id, { tags: value })} />
                      <TextArea label="Skill notes" value={skill.notes} onChange={(value) => updateSkill(skill.id, { notes: value })} />
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {activeTab === 'notes' && (
            <section className="panel">
              <PanelTitle icon={BookOpen} eyebrow="Campaign Sheet" title="Narrative and E.G.O" />
              <div className="form-grid two">
                <TextField label="Base E.G.O name" value={sheet.egoName} onChange={(value) => setField('egoName', value)} />
                <div className="ego-status">
                  <Sparkles size={18} aria-hidden="true" />
                  <span>{sheet.level >= 2 ? 'Available' : 'Planned'}</span>
                </div>
              </div>
              <TextArea label="Base E.G.O notes" value={sheet.egoNotes} onChange={(value) => setField('egoNotes', value)} />
              <div className="form-grid two">
                <TextArea label="Appearance" value={sheet.appearance} onChange={(value) => setField('appearance', value)} />
                <TextArea label="Background" value={sheet.background} onChange={(value) => setField('background', value)} />
                <TextArea label="Treasures" value={sheet.treasures} onChange={(value) => setField('treasures', value)} />
                <TextArea label="Campaign notes" value={sheet.campaignNotes} onChange={(value) => setField('campaignNotes', value)} />
              </div>
            </section>
          )}
        </main>

        <aside className="summary-panel">
          <div className="summary-card identity-card">
            <p className="eyebrow">Current Sheet</p>
            <h2>{sheet.name || sheet.alias || 'Unnamed Fixer'}</h2>
            <span>{sheet.archetype}</span>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              <Sparkles size={18} aria-hidden="true" />
              <h2>Derived</h2>
            </div>
            <div className="summary-stats">
              <Metric label="HP" value={derived.hp} />
              <Metric label="Stagger" value={derived.staggerResist} />
              <Metric label="Speed" value={derived.speedDie} />
              <Metric label="Light" value={derived.maxLight} />
              <Metric label="Emotion" value={derived.startingEmotion} />
              <Metric label="Excellence" value={derived.excellence} />
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              <CheckCircle2 size={18} aria-hidden="true" />
              <h2>Checklist</h2>
            </div>
            <ul className="checklist">
              {checklist.map((item) => (
                <li key={item.label} className={item.done ? 'done' : ''}>
                  <span aria-hidden="true"></span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              <ClipboardList size={18} aria-hidden="true" />
              <h2>Progression</h2>
            </div>
            <dl className="progress-list">
              <div>
                <dt>Level</dt>
                <dd>{sheet.level}</dd>
              </div>
              <div>
                <dt>Improvement</dt>
                <dd>{levelProgress.improvement}</dd>
              </div>
              <div>
                <dt>Feats</dt>
                <dd>{levelProgress.totalFeats}</dd>
              </div>
              <div>
                <dt>Base E.G.O</dt>
                <dd>{levelProgress.ego}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}

function PanelTitle({ icon: Icon, eyebrow, title }: { icon: typeof UserRound; eyebrow: string; title: string }) {
  return (
    <div className="panel-title">
      <Icon size={20} aria-hidden="true" />
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  warning = false,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  warning?: boolean
}) {
  return (
    <label className={`field number-field ${warning ? 'warning' : ''}`}>
      <span>{label}</span>
      <input type="number" min={0} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value)))} />
    </label>
  )
}

function DiceBlock({ dice }: { dice: string }) {
  const lines = dice.split('\n').map((line) => line.trim()).filter(Boolean)

  return (
    <div className="dice-lines">
      {lines.map((line, index) => {
        const range = formatRange(line)
        if (!range) {
          return (
            <p className="dice-note" key={`${line}-${index}`}>
              {line}
            </p>
          )
        }

        const kind = getDiceKind(line)
        return (
          <div className={`dice-line ${kind}`} key={`${line}-${index}`}>
            <img className="dice-icon" src={DICE_ICONS[kind]} alt="" aria-hidden="true" />
            <strong>{range}</strong>
            <span>{getDiceLabel(line)}</span>
          </div>
        )
      })}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default App
