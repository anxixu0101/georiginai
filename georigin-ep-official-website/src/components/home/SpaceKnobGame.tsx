import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'

type GameMode = 'idle' | 'running' | 'gameover'
type LevelNumber = 1 | 2 | 3
type EnemyTier = 1 | 2 | 3
type Bullet = { x: number; y: number; vy: number; enemy: boolean }
type Enemy = {
  x: number
  y: number
  speed: number
  size: number
  drift: number
  tier: EnemyTier
  hp: number
  score: number
  fireTimer: number
}
type Explosion = { x: number; y: number; age: number }

const WIDTH = 320
const HEIGHT = 240
const MAX_KNOB_ANGLE = 60
const LEVELS: LevelNumber[] = [1, 2, 3]
const LEVEL_NAMES = ['BLACK HOLE RING', 'ASTEROID ORBIT', 'GAS GIANT']
const assetKey = (level: LevelNumber, name: string) => `${level}:${name}`

const IMAGE_SOURCES = LEVELS.reduce<Record<string, string>>((sources, level) => {
  const folder = `/assets/space-battle/level_0${level}`
  sources[assetKey(level, 'background')] = `${folder}/background/background_320x240.png`
  sources[assetKey(level, 'player')] = `${folder}/player/player_idle.png`
  sources[assetKey(level, 'playerHit')] = `${folder}/player/player_shield_hit.png`
  sources[assetKey(level, 'enemy1')] = `${folder}/enemies/enemy_tier_1.png`
  sources[assetKey(level, 'enemy2')] = `${folder}/enemies/enemy_tier_2.png`
  sources[assetKey(level, 'enemy3')] = `${folder}/enemies/enemy_tier_3.png`
  sources[assetKey(level, 'bulletPlayer')] = `${folder}/effects/bullet_player.png`
  sources[assetKey(level, 'bulletEnemy')] = `${folder}/effects/bullet_enemy.png`
  sources[assetKey(level, 'lifeFull')] = `${folder}/ui/life_full.png`
  sources[assetKey(level, 'lifeEmpty')] = `${folder}/ui/life_empty.png`
  for (let frame = 1; frame <= 4; frame += 1) {
    sources[assetKey(level, `explosion${frame}`)] = `${folder}/effects/explosion_0${frame}.png`
  }
  return sources
}, {})

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value))

export default function SpaceKnobGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const directionRef = useRef(0)
  const playerXRef = useRef(WIDTH / 2)
  const bulletsRef = useRef<Bullet[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const explosionsRef = useRef<Explosion[]>([])
  const imagesRef = useRef<Record<string, HTMLImageElement>>({})
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const levelRef = useRef<LevelNumber>(1)
  const levelElapsedRef = useRef(0)
  const modeRef = useRef<GameMode>('idle')
  const assetsReadyRef = useRef(false)
  const hitFlashRef = useRef(0)
  const levelBannerRef = useRef(0)
  const draggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartAngleRef = useRef(0)
  const releaseTimerRef = useRef<number | undefined>(undefined)
  const knobAnimationRef = useRef<{ stop: () => void } | null>(null)
  const knobAngle = useMotionValue(0)
  const [mode, setMode] = useState<GameMode>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState<LevelNumber>(1)
  const [knobDegrees, setKnobDegrees] = useState(0)
  const [assetsReady, setAssetsReady] = useState(false)

  const resetGame = () => {
    if (!assetsReadyRef.current) return
    modeRef.current = 'running'
    playerXRef.current = WIDTH / 2
    bulletsRef.current = []
    enemiesRef.current = []
    explosionsRef.current = []
    scoreRef.current = 0
    livesRef.current = 3
    levelRef.current = 1
    levelElapsedRef.current = 0
    levelBannerRef.current = 1.4
    setScore(0)
    setLives(3)
    setLevel(1)
    setMode('running')
  }

  const setKnobPosition = (angle: number) => {
    const next = clamp(angle, -MAX_KNOB_ANGLE, MAX_KNOB_ANGLE)
    knobAnimationRef.current?.stop()
    knobAngle.set(next)
    if (Math.abs(next) > 3 && modeRef.current !== 'running') resetGame()
  }

  const releaseKnob = useCallback(() => {
    draggingRef.current = false
    knobAnimationRef.current?.stop()
    knobAnimationRef.current = animate(knobAngle, 0, {
      type: 'spring',
      stiffness: 390,
      damping: 28,
      mass: 0.72,
    })
  }, [knobAngle])

  const pulseKnob = (direction: -1 | 1) => {
    window.clearTimeout(releaseTimerRef.current)
    setKnobPosition(direction * 46)
    releaseTimerRef.current = window.setTimeout(releaseKnob, 170)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    knobAnimationRef.current?.stop()
    draggingRef.current = true
    dragStartXRef.current = event.clientX
    dragStartAngleRef.current = knobAngle.get()
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    setKnobPosition(dragStartAngleRef.current + (event.clientX - dragStartXRef.current) * 0.9)
  }

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    if (delta !== 0) pulseKnob(delta < 0 ? -1 : 1)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    setKnobPosition(event.key === 'ArrowLeft' ? -52 : 52)
  }

  const onKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') releaseKnob()
  }

  useEffect(() => {
    const unsubscribe = knobAngle.on('change', (value) => {
      directionRef.current = clamp(value / MAX_KNOB_ANGLE, -1, 1)
      setKnobDegrees(Math.round(value))
    })
    return unsubscribe
  }, [knobAngle])

  useEffect(() => {
    let cancelled = false
    const loadImages = async () => {
      const entries = await Promise.all(
        Object.entries(IMAGE_SOURCES).map(
          ([key, source]) =>
            new Promise<[string, HTMLImageElement]>((resolve, reject) => {
              const image = new Image()
              image.onload = () => resolve([key, image])
              image.onerror = () => reject(new Error(`Unable to load ${source}`))
              image.src = source
            }),
        ),
      )
      if (cancelled) return
      imagesRef.current = Object.fromEntries(entries)
      assetsReadyRef.current = true
      setAssetsReady(true)
    }
    void loadImages()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.imageSmoothingEnabled = false

    let animationFrame = 0
    let previous = performance.now()
    let spawnClock = 0
    let fireClock = 0

    const sprite = (name: string, requestedLevel = levelRef.current) =>
      imagesRef.current[assetKey(requestedLevel, name)]

    const drawCentered = (
      image: HTMLImageElement | undefined,
      x: number,
      y: number,
      scale = 1,
    ) => {
      if (!image) return
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      context.drawImage(image, x - width / 2, y - height / 2, width, height)
    }

    const addExplosion = (x: number, y: number) => {
      explosionsRef.current.push({ x, y, age: 0 })
    }

    const loseLife = () => {
      if (modeRef.current !== 'running') return
      livesRef.current -= 1
      hitFlashRef.current = 0.28
      setLives(livesRef.current)
      if (livesRef.current <= 0) {
        modeRef.current = 'gameover'
        setMode('gameover')
        releaseKnob()
      }
    }

    const updateLevel = () => {
      const nextLevel: LevelNumber =
        levelRef.current === 1 && scoreRef.current >= 1800 && levelElapsedRef.current >= 24
          ? 2
          : levelRef.current === 2 && scoreRef.current >= 4800 && levelElapsedRef.current >= 20
            ? 3
            : levelRef.current
      if (nextLevel === levelRef.current) return
      levelRef.current = nextLevel
      levelElapsedRef.current = 0
      levelBannerRef.current = 1.5
      enemiesRef.current = []
      bulletsRef.current = bulletsRef.current.filter((bullet) => !bullet.enemy)
      setLevel(nextLevel)
    }

    const spawnEnemy = () => {
      const activeLevel = levelRef.current
      const roll = Math.random()
      const tier: EnemyTier =
        activeLevel === 1
          ? roll > 0.88
            ? 2
            : 1
          : activeLevel === 2
            ? roll > 0.8
              ? 3
              : roll > 0.45
                ? 2
                : 1
            : roll > 0.58
              ? 3
              : roll > 0.2
                ? 2
                : 1
      const settings = {
        1: { hp: 1, score: 100, size: 12 },
        2: { hp: 2, score: 300, size: 16 },
        3: { hp: 4, score: 800, size: 20 },
      }[tier]
      enemiesRef.current.push({
        x: 24 + Math.random() * (WIDTH - 48),
        y: -settings.size - 4,
        speed: 29 + activeLevel * 7 + Math.random() * 17,
        size: settings.size,
        drift: (Math.random() - 0.5) * (12 + activeLevel * 4),
        tier,
        hp: settings.hp,
        score: settings.score,
        fireTimer: 1.1 + Math.random() * 1.8,
      })
    }

    const update = (delta: number) => {
      for (const explosion of explosionsRef.current) explosion.age += delta
      explosionsRef.current = explosionsRef.current.filter((explosion) => explosion.age < 0.44)
      hitFlashRef.current = Math.max(0, hitFlashRef.current - delta)
      levelBannerRef.current = Math.max(0, levelBannerRef.current - delta)

      if (modeRef.current !== 'running') return

      levelElapsedRef.current += delta
      playerXRef.current += directionRef.current * 126 * delta
      playerXRef.current = clamp(playerXRef.current, 18, WIDTH - 18)

      fireClock += delta
      if (fireClock > 0.27) {
        fireClock = 0
        bulletsRef.current.push({ x: playerXRef.current, y: HEIGHT - 48, vy: -208, enemy: false })
      }

      spawnClock += delta
      const spawnDelay = 0.79 - levelRef.current * 0.1
      if (spawnClock > spawnDelay) {
        spawnClock = 0
        spawnEnemy()
      }

      for (const bullet of bulletsRef.current) bullet.y += bullet.vy * delta
      bulletsRef.current = bulletsRef.current.filter(
        (bullet) => bullet.y > -20 && bullet.y < HEIGHT + 20,
      )

      for (const enemy of enemiesRef.current) {
        enemy.y += enemy.speed * delta
        enemy.x += enemy.drift * delta
        if (enemy.x < enemy.size || enemy.x > WIDTH - enemy.size) enemy.drift *= -1
        if (levelRef.current > 1) {
          enemy.fireTimer -= delta
          if (enemy.fireTimer <= 0 && enemy.y > 10 && enemy.y < HEIGHT - 70) {
            enemy.fireTimer = 1.25 + Math.random() * 1.4
            bulletsRef.current.push({ x: enemy.x, y: enemy.y + enemy.size, vy: 90, enemy: true })
          }
        }
      }

      const spentBullets = new Set<number>()
      const destroyedEnemies = new Set<number>()
      bulletsRef.current.forEach((bullet, bulletIndex) => {
        if (bullet.enemy) {
          if (
            Math.abs(bullet.x - playerXRef.current) < 12 &&
            Math.abs(bullet.y - (HEIGHT - 31)) < 17
          ) {
            spentBullets.add(bulletIndex)
            addExplosion(playerXRef.current, HEIGHT - 31)
            loseLife()
          }
          return
        }
        enemiesRef.current.forEach((enemy, enemyIndex) => {
          if (destroyedEnemies.has(enemyIndex)) return
          const dx = bullet.x - enemy.x
          const dy = bullet.y - enemy.y
          if (dx * dx + dy * dy < (enemy.size + 3) ** 2) {
            spentBullets.add(bulletIndex)
            enemy.hp -= 1
            if (enemy.hp <= 0) {
              destroyedEnemies.add(enemyIndex)
              addExplosion(enemy.x, enemy.y)
              scoreRef.current += enemy.score
              setScore(scoreRef.current)
            }
          }
        })
      })

      bulletsRef.current = bulletsRef.current.filter((_, index) => !spentBullets.has(index))
      enemiesRef.current = enemiesRef.current.filter((enemy, index) => {
        if (destroyedEnemies.has(index)) return false
        const collided =
          Math.abs(enemy.x - playerXRef.current) < enemy.size + 10 &&
          Math.abs(enemy.y - (HEIGHT - 31)) < enemy.size + 15
        if (collided || enemy.y > HEIGHT + enemy.size) {
          addExplosion(enemy.x, Math.min(enemy.y, HEIGHT - 20))
          loseLife()
          return false
        }
        return true
      })
      updateLevel()
    }

    const draw = () => {
      context.fillStyle = '#000000'
      context.fillRect(0, 0, WIDTH, HEIGHT)

      if (!assetsReadyRef.current) {
        context.fillStyle = '#FFD21F'
        context.font = 'bold 9px monospace'
        context.textAlign = 'center'
        context.fillText('LOADING GAME ASSETS', WIDTH / 2, HEIGHT / 2)
        context.textAlign = 'left'
        return
      }

      const background = sprite('background')
      if (background) context.drawImage(background, 0, 0, WIDTH, HEIGHT)

      for (const bullet of bulletsRef.current) {
        drawCentered(sprite(bullet.enemy ? 'bulletEnemy' : 'bulletPlayer'), bullet.x, bullet.y)
      }

      for (const enemy of enemiesRef.current) {
        const scale = enemy.tier === 1 ? 0.82 : enemy.tier === 2 ? 0.68 : 0.58
        drawCentered(sprite(`enemy${enemy.tier}`), enemy.x, enemy.y, scale)
      }

      for (const explosion of explosionsRef.current) {
        const frame = Math.min(4, Math.floor((explosion.age / 0.44) * 4) + 1)
        drawCentered(sprite(`explosion${frame}`), explosion.x, explosion.y, 1.05)
      }

      const playerSprite = hitFlashRef.current > 0 ? sprite('playerHit') : sprite('player')
      drawCentered(playerSprite, playerXRef.current, HEIGHT - 31, hitFlashRef.current > 0 ? 0.62 : 0.72)

      for (let index = 0; index < 3; index += 1) {
        const lifeSprite = sprite(index < livesRef.current ? 'lifeFull' : 'lifeEmpty')
        if (lifeSprite) context.drawImage(lifeSprite, 8 + index * 14, HEIGHT - 21, 10, 13)
      }

      context.font = 'bold 8px "Space Mono", monospace'
      context.fillStyle = '#ffffff'
      context.fillText(`LEVEL 0${levelRef.current}`, 7, 12)
      context.textAlign = 'right'
      context.fillText(`SCORE ${String(scoreRef.current).padStart(6, '0')}`, WIDTH - 7, 12)
      context.textAlign = 'left'

      if (levelBannerRef.current > 0 && modeRef.current === 'running') {
        context.fillStyle = 'rgba(0,0,0,0.64)'
        context.fillRect(83, 96, 154, 34)
        context.fillStyle = '#FFD21F'
        context.font = 'bold 10px "Space Mono", monospace'
        context.textAlign = 'center'
        context.fillText(`LEVEL 0${levelRef.current}`, WIDTH / 2, 109)
        context.fillStyle = '#ffffff'
        context.font = 'bold 7px "Space Mono", monospace'
        context.fillText(LEVEL_NAMES[levelRef.current - 1], WIDTH / 2, 121)
        context.textAlign = 'left'
      }
    }

    const frame = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.034)
      previous = now
      update(delta)
      draw()
      animationFrame = window.requestAnimationFrame(frame)
    }

    animationFrame = window.requestAnimationFrame(frame)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [releaseKnob])

  useEffect(
    () => () => {
      window.clearTimeout(releaseTimerRef.current)
      knobAnimationRef.current?.stop()
    },
    [],
  )

  return (
    <div data-space-game data-game-mode={mode} className="w-[min(650px,94vw)]">
      <div className="rounded-[20px] bg-white p-4 shadow-[0_28px_60px_rgba(0,0,0,0.17)]">
        <div className="relative select-none">
          <img
            src="/assets/device-yellow-cut.png"
            alt="Playable Signal Yellow Easing-Point simulator"
            className="w-full"
            draggable={false}
          />

          <div
            data-space-screen
            className="absolute overflow-hidden rounded-[5px] bg-black ring-1 ring-black"
            style={{ left: '8.2%', top: '13.5%', width: '57.2%', height: '73%' }}
          >
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              className="h-full w-full"
              aria-label="Space battle game screen using official EP game artwork"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_50%,transparent_50%)] bg-[length:100%_4px]" />
            {mode !== 'running' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/62 px-4 text-center">
                <p className="font-pixel text-[clamp(9px,1.15vw,13px)] leading-[1.8] text-ep-accent">
                  {mode === 'idle' ? 'EP SPACE BATTLE' : 'MISSION OVER'}
                </p>
                <p className="mt-2 font-mono text-[clamp(7px,0.85vw,10px)] tracking-[0.16em] text-white/80">
                  {mode === 'idle' ? 'PULL THE KNOB TO STEER' : `FINAL SCORE ${score}`}
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  disabled={!assetsReady}
                  className="pointer-events-auto mt-4 border border-ep-accent bg-ep-accent px-4 py-2 font-mono text-[clamp(8px,0.85vw,10px)] font-bold tracking-[0.14em] text-ep-ink transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-55"
                >
                  {!assetsReady ? 'LOADING' : mode === 'idle' ? 'START MISSION' : 'TRY AGAIN'}
                </button>
              </div>
            )}
          </div>

          <div
            data-space-control
            role="slider"
            tabIndex={0}
            aria-label="Spring-loaded game knob, sixty degrees left or right"
            aria-valuemin={-MAX_KNOB_ANGLE}
            aria-valuemax={MAX_KNOB_ANGLE}
            aria-valuenow={knobDegrees}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={releaseKnob}
            onPointerCancel={releaseKnob}
            onWheel={onWheel}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            className="group absolute cursor-ew-resize touch-none rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ep-accent/70"
            style={{ left: '68.4%', top: '8.4%', width: '22.5%', aspectRatio: '1' }}
          >
            <motion.span
              style={{ rotate: knobAngle, left: '19%', right: '-5%' }}
              className="absolute bottom-[7%] top-[7%] rounded-full"
            >
              <span className="absolute left-1/2 top-0 h-[23%] w-[5px] -translate-x-1/2 rounded-full bg-ep-accent shadow-[0_0_7px_rgba(255,210,31,0.8)]" />
            </motion.span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-4 font-mono text-[9px] tracking-[0.13em] text-ep-muted sm:text-[10px]">
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${mode === 'running' ? 'bg-ep-success' : 'bg-ep-accent'}`} />
            {mode === 'running' ? `MISSION ACTIVE / LEVEL 0${level}` : 'READY TO LAUNCH'}
          </span>
          <span>SCORE {String(score).padStart(6, '0')} / LIVES {lives}</span>
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-[10px] leading-relaxed tracking-[0.13em] text-ep-muted">
        PULL LEFT OR RIGHT / RELEASE TO SPRING BACK / ARROW KEYS ALSO WORK
      </p>
    </div>
  )
}
