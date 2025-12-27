import React from 'react'
import styled, { css } from 'styled-components'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useToastStore, type Toast as TToast } from '../hooks/useToast'

const StyledToasts = styled.div`
  position: fixed;
  right: 16px;
  top: 72px;
  z-index: 1001;
  pointer-events: none;

  display: flex;
  flex-direction: column-reverse;
  gap: 14px;

  width: calc(100% - 32px);

  @media (min-width: 800px) {
    top: unset;
    bottom: 24px;
    right: 24px;
    width: auto;
  }
`

const StackedToast = styled.div`
  height: 52px;
  border-radius: 14px;
  background: rgba(20, 20, 28, 0.35);
  backdrop-filter: blur(12px);

  transform: scale(0.95) translateY(-6px);
  opacity: 0.6;
  pointer-events: none;
`

const StyledToast = styled.div`
  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  background: rgba(24, 24, 32, 0.85);
  color: #ffffff;

  border-radius: 16px;
  padding: 14px 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  pointer-events: auto;
  cursor: pointer;
  user-select: none;

  animation: toast-in 0.25s ease;

  box-shadow:
    0 16px 36px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &:hover {
    background: rgba(30, 30, 40, 0.92);
    transform: translateY(-2px);
    box-shadow:
      0 22px 48px rgba(0, 0, 0, 0.65),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  @media (min-width: 800px) {
    min-width: 280px;
    max-width: 360px;
  }
`

const StyledTimer = styled.div<{ $ticking: boolean }>`
  position: relative;
  height: 3px;
  width: 100%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;

  @keyframes timer {
    from { width: 100%; }
    to { width: 0%; }
  }

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      #7a6cff,
      #9b8cff
    );

    ${(props) =>
      props.$ticking &&
      css`
        animation: timer linear 10s;
      `}
  }
`

function Toast({ toast }: {toast: TToast}) {
  const timeout = React.useRef<NodeJS.Timer>()
  const discard = useToastStore((state) => state.discard)
  const [ticking, setTicking] = React.useState(true)

  React.useLayoutEffect(
    () => {
      timeout.current = setTimeout(() => {
        discard(toast.id)
      }, 10000)
      return () => clearTimeout(timeout.current)
    },
    [toast.id],
  )

  const pauseTimer = () => {
    setTicking(false)
    clearTimeout(timeout.current)
  }
  const resumeTimer = () => {
    setTicking(true)
    timeout.current = setTimeout(() => {
      discard(toast.id)
    }, 10000)
  }

  return (
    <StyledToast
      onClick={() => discard(toast.id)}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div>
        <div style={{ fontWeight: 'bold' }}>{toast.title}</div>
        <div style={{ color: 'gray', fontSize: '90%' }}>{toast.description}</div>
      </div>
      <StyledTimer $ticking={ticking} />
    </StyledToast>
  )
}

export default function Toasts() {
  const toasts = useToastStore((state) => [...state.toasts].reverse())
  const showAll = useMediaQuery('sm')

  const visible = showAll ? toasts : toasts.slice(0, 1)

  return (
    <StyledToasts>
      {visible.map((toast, i) => (
        <Toast toast={toast} key={toast.id} />
      ))}
      {!showAll && toasts.length > 1 && (
        <StackedToast />
      )}
    </StyledToasts>
  )
}
