// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'

const Bonus = styled.button`
  all: unset;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 4px 12px;
  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  color: #ffd84d;
  background: rgba(255, 216, 77, 0.12);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 4px 14px rgba(0, 0, 0, 0.35);

  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: rgba(255, 216, 77, 0.2);
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 8px 22px rgba(0, 0, 0, 0.45);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 2px 6px rgba(0, 0, 0, 0.4);
  }
`

const StyledHeader = styled.div`
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);

  width: calc(100% - 28px);
  max-width: 1400px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 16px;

  background: rgba(20, 20, 28, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  z-index: 1000;
`

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;

  height: 36px;
  padding: 0 8px;

  border-radius: 12px;

  transition:
    background 0.2s ease,
    transform 0.15s ease;

  & > img {
    height: 110%;
    object-fit: contain;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-1px);
  }
`

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg') 
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b>
              <TokenValue amount={balance.bonusBalance} />
            </b>{' '}
            worth of free plays. This bonus will be applied automatically when you
            play.
          </p>
          <p>Note that a fee is still needed from your wallet for each play.</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            There&apos;s <TokenValue amount={pool.jackpotBalance} /> in the
            Jackpot.
          </p>
          <p>
            The Jackpot is a prize pool that grows with every bet made. As it
            grows, so does your chance of winning. Once a winner is selected,
            the pool resets and grows again from there.
          </p>
          <p>
            You pay a maximum of{' '}
            {(PLATFORM_JACKPOT_FEE * 100).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            % of each wager for a chance to win.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? 'DISABLED' : 'ENABLED'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked) =>
                context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
              }
            />
          </label>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <StyledHeader>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Logo to="/">
            <img alt="Capy logo" src="https://i.postimg.cc/NfgnGjJz/IMG-0552.png" />
          </Logo>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {pool.jackpotBalance > 0 && (
            <Bonus onClick={() => setJackpotHelp(true)}>
              💰 <TokenValue amount={pool.jackpotBalance} />
            </Bonus>
          )}

          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {/* Leaderboard shows only on desktop */}
          {isDesktop && (
            <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
              Leaderboard
            </GambaUi.Button>
          )}

          <TokenSelect />
          <UserButton />
        </div>
      </StyledHeader>
    </>
  )
}
