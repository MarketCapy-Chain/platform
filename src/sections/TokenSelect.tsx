import { PublicKey } from '@solana/web3.js'
import { FAKE_TOKEN_MINT, GambaPlatformContext, GambaUi, PoolToken, TokenValue, useCurrentToken, useTokenBalance, useTokenMeta } from 'gamba-react-ui-v2'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Dropdown } from '../components/Dropdown'
import { Modal } from '../components/Modal'
import { POOLS } from '../constants'
import { useUserStore } from '../hooks/useUserStore'

const StyledToken = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 0;

  img {
    height: 22px;
    width: 22px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
  }
`

const StyledTokenImage = styled.img`
  height: 22px;
  width: 22px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
`

const StyledTokenButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px 16px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.04);
  color: inherit;

  transition:
    background 0.25s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 4px 16px rgba(0, 0, 0, 0.35);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 10px 28px rgba(0, 0, 0, 0.45);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 2px 6px rgba(0, 0, 0, 0.5);
  }
`

function TokenImage({ mint, ...props }: {mint: PublicKey}) {
  const meta = useTokenMeta(mint)
  return (
    <StyledTokenImage src={meta.image} {...props} />
  )
}

function TokenSelectItem({ mint }: {mint: PublicKey}) {
  const balance = useTokenBalance(mint)
  return (
    <>
      <TokenImage mint={mint} /> <TokenValue mint={mint} amount={balance.balance} />
    </>
  )
}

export default function TokenSelect() {
  const [visible, setVisible] = React.useState(false)
  const [warning, setWarning] = React.useState(false)
  // Allow real plays override via query param/localStorage for deployed testing
  const [allowRealPlays, setAllowRealPlays] = React.useState(false)
  const context = React.useContext(GambaPlatformContext)
  const selectedToken = useCurrentToken()
  const userStore = useUserStore()
  const balance = useTokenBalance()

  // Update the platform context with the last selected token from localStorage
  useEffect(() => {
    if (userStore.lastSelectedPool) {
      context.setPool(userStore.lastSelectedPool.token, userStore.lastSelectedPool.authority)
    }
  }, [])

  // Read real-play override – enables SOL selection on deployed builds when needed
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('allowReal') || params.get('real') || params.get('realplays')
      if (q != null) {
        const v = q === '1' || q === 'true'
        localStorage.setItem('allowRealPlays', v ? '1' : '0')
      }
      const saved = localStorage.getItem('allowRealPlays')
      setAllowRealPlays(saved === '1')
    } catch {}
  }, [])

  const selectPool = (pool: PoolToken) => {
    setVisible(false)
    // Check if platform has real plays disabled
    const realDisabled = Boolean(import.meta.env.VITE_REAL_PLAYS_DISABLED) && !allowRealPlays
    if (realDisabled && !pool.token.equals(FAKE_TOKEN_MINT)) {
      setWarning(true)
      return
    }
    // Update selected pool
    context.setPool(pool.token, pool.authority)
    userStore.set({
      lastSelectedPool: {
        token: pool.token.toString(),
        authority: pool.authority?.toString(),
      },
    })
  }

  const click = () => {
    setVisible(!visible)
  }

  return (
    <>
      {warning && (
        <Modal>
          <h1>Real plays disabled</h1>
          <p>
            This platform only allows you to play with fake tokens.
          </p>
          <GambaUi.Button
            main
            onClick={() => setWarning(false)}
          >
            Okay
          </GambaUi.Button>
        </Modal>
      )}
      <div style={{ position: 'relative' }}>
        <GambaUi.Button onClick={click}>
          {selectedToken && (
            <StyledToken>
              <TokenImage mint={selectedToken.mint} />
              <TokenValue amount={balance.balance} />
            </StyledToken>
          )}
        </GambaUi.Button>
        <Dropdown visible={visible}>
          {/* Mount balances for list items only when dropdown is visible to avoid unnecessary watchers */}
          {visible && POOLS.map((pool, i) => (
            <StyledTokenButton onClick={() => selectPool(pool)} key={i}>
              <TokenSelectItem mint={pool.token} />
            </StyledTokenButton>
          ))}
        </Dropdown>
      </div>
    </>
  )
}
