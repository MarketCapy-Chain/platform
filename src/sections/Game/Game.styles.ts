// src/sections/Game/Game.styles.ts
import styled, { css, keyframes } from 'styled-components'

const splashAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.98); }
  20% { opacity: 1; transform: scale(1); }
  80% { opacity: 1; }
  100% { opacity: 0; }
`

export const loadingAnimation = keyframes`
  0% { transform: translateX(-120%); }
  100% { transform: translateX(420%); }
`

export const Container = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  gap: 10px;
`

export const SettingControls = styled.div`
  display: flex;
  gap: 4px;

  & > button {
    all: unset;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    opacity: 0.35;
    transition:
      opacity 0.2s ease,
      background 0.2s ease,
      transform 0.15s ease;

    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-1px);
    }
  }
`

export const Splash = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;

  background:
    radial-gradient(
      circle at center,
      rgba(150, 100, 255, 0.25),
      rgba(12, 12, 18, 0.95) 60%
    );

  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.02em;

  animation: ${splashAnimation} 0.9s ease;
`

export const Screen = styled.div`
  position: relative;
  flex-grow: 1;

  height: 600px;
  background: linear-gradient(
    180deg,
    #0f0f18,
    #0a0a12
  );

  border-radius: 18px;
  overflow: hidden;

  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  transition: height 0.25s ease;

  @media (max-width: 700px) {
    height: 600px;
  }
`

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: translateY(-1px);
  }
`

export const StyledLoadingIndicator = styled.div<{ $active: boolean }>`
  position: relative;
  height: 4px;
  width: 100%;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    width: 25%;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      transparent,
      #9b8cff,
      transparent
    );
    opacity: 0;
    animation: ${loadingAnimation} 0.6s linear infinite;
    transition: opacity 0.4s ease;

    ${(props) => props.$active && css`
      opacity: 1;
    `}
  }
`

export const Controls = styled.div`
  width: 100%;
  z-index: 6;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  padding: 18px 22px;

  background: rgba(22, 22, 32, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  color: white;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 12px;
    padding: 14px;
  }

  @media (min-width: 800px) {
    height: 82px;
  }
`

export const MetaControls = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;

  display: flex;
  align-items: center;
  gap: 10px;

  z-index: 7;
`

export const spinnerAnimation = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

export const Spinner = styled.div<{ $small?: boolean }>`
  --spinner-size: ${(p) => (p.$small ? '0.9em' : '1.1em')};
  --spinner-border: 2px;
  --color: #9b8cff;

  height: var(--spinner-size);
  aspect-ratio: 1 / 1;

  border-radius: 50%;
  border-top: var(--spinner-border) solid var(--color);
  border-right: var(--spinner-border) solid var(--color);
  border-bottom: var(--spinner-border) solid var(--color);
  border-left: var(--spinner-border) solid transparent;

  animation: ${spinnerAnimation} 0.9s linear infinite;
`
