import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

const WelcomeWrapper = styled.div`
  position: relative;
  background: rgba(15, 15, 20, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  /* Subtle animated glow edge */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
    opacity: 0.6;
  }

  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 3fr 1.2fr;
    align-items: center;
    text-align: left;
    padding: 48px;
    gap: 48px;
  }
`;

const WelcomeContent = styled.div`
  h1 {
    font-size: 1.9rem;
    margin: 0 0 10px 0;
    color: #ffffff;
    letter-spacing: -0.02em;
    font-weight: 700;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    line-height: 1.6;
    max-width: 520px;
  }

  @media (min-width: 800px) {
    h1 {
      font-size: 2.4rem;
    }
    p {
      font-size: 1.05rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 8px;

  @media (min-width: 800px) {
    margin-top: 0;
  }
`;

const ActionButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 14px;
  padding: 14px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  cursor: pointer;
  text-align: center;
  transition:
    background 0.25s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.35);

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 10px 28px rgba(0, 0, 0, 0.45);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.4);
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore(); // Destructure for cleaner access

  const handleCopyInvite = () => {
    setUserModal({ userModal: true });
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  const openLink = (url) => () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <WelcomeWrapper>
      <WelcomeContent>
        <h1>Welcome to CapyBet</h1>
        <p>A fair, simple and decentralized casino on Solana.</p>
      </WelcomeContent>
      <ButtonGroup>
        <ActionButton onClick={handleCopyInvite}>
          Invite and earn
        </ActionButton>
        <ActionButton onClick={openLink('#')}>
          Buy $CAPY
        </ActionButton>
        <ActionButton onClick={openLink('https://t.me')}>
          Telegram
        </ActionButton>
      </ButtonGroup>
    </WelcomeWrapper>
  );
}
