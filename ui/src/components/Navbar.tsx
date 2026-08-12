import React from 'react';
import { LayoutDashboard, Table, ArrowUpDown, GitCompare, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'explorer', label: 'Benchmark Explorer', icon: Table },
    { id: 'reranking', label: 'Reranking Lab (3.5)', icon: ArrowUpDown },
    { id: 'framework', label: 'So sánh Framework (3.4)', icon: GitCompare },
    { id: 'failures', label: 'Failure Analysis (5 Whys)', icon: ShieldAlert },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 16px',
      marginBottom: '24px'
    }}>
      <nav style={{
        backgroundColor: 'rgba(45, 40, 32, 0.92)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: 'var(--shadow-overlay)',
        border: '1px solid rgba(184, 170, 141, 0.4)',
        maxWidth: '1000px',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingRight: '12px',
          borderRight: '1px solid rgba(255, 255, 255, 0.15)',
          marginRight: '6px'
        }}>
          <span style={{
            fontSize: '14px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-soft-gold)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            letterSpacing: '0.5px'
          }}>
            RAG EVAL LAB
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: isActive ? 'rgba(246, 217, 155, 0.2)' : 'transparent',
                color: isActive ? 'var(--color-soft-gold)' : 'rgba(255, 255, 255, 0.85)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(246, 217, 155, 0.4)' : 'none'
              }}
            >
              <Icon size={15} color={isActive ? '#F6D99B' : '#B8AA8D'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
