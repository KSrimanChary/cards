import * as React from 'react';
import { motion } from 'framer-motion';
import { FaBirthdayCake, FaTrophy } from 'react-icons/fa';
import { IEmployeeCelebration } from '../../../models/IEmployeeCelebration';
import { BirthdayWishes } from '../../../Constants/BirthdayWishes';
import { AnniversaryWishes } from '../../../Constants/AnniversaryWishes';

export interface ICelebrationCardProps {
  celebration: IEmployeeCelebration;
  onWish: (email: string, eventType: string) => void;
  showDesignation?: boolean;
}

const CelebrationCard: React.FC<ICelebrationCardProps> = ({
  celebration,
  onWish,
  showDesignation = true,
}) => {
  const isBirthday = celebration?.EventType === 'Birthday';
  
  const bgGradient = isBirthday 
    ? 'linear-gradient(135deg, #ffc0d9 0%, #ffb3d9 50%, #ff99cc 100%)'
    : 'linear-gradient(135deg, #fff8dc 0%, #ffe680 50%, #ffd700 100%)';
  
  const textColor = isBirthday ? '#ff1493' : '#b8860b';
  const btnGradient = isBirthday
    ? 'linear-gradient(135deg, #ff6b9d 0%, #ff1493 100%)'
    : 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)';
  const btnColor = isBirthday ? 'white' : '#b8860b';
  const btnBorder = isBirthday ? '#ff1493' : '#b8860b';

  const getGreeting = (): string => {
    if (celebration?.CustomMessage?.trim()) {
      return celebration.CustomMessage;
    }
    return isBirthday
      ? BirthdayWishes.getRandomWish()
      : AnniversaryWishes.getRandomWish();
  };

  return (
    <motion.div
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        background: bgGradient,
        width: '180px',
        height: '340px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        flexShrink: 0,
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        flex: 1,
        gap: '8px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          color: textColor,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
        }}>
          {isBirthday ? (
            <>
              <FaBirthdayCake size={12} />
              <span>BIRTHDAY</span>
              <FaBirthdayCake size={12} />
            </>
          ) : (
            <>
              <FaTrophy size={12} />
              <span>ANNIVERSARY</span>
              <FaTrophy size={12} />
            </>
          )}
        </div>

        <img
          src={celebration?.EmployeePhoto || ''}
          alt={celebration?.Title}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            flexShrink: 0,
          }}
          onError={(e) => (e.currentTarget.src = '')}
        />

        <div style={{ textAlign: 'center', minWidth: 0, width: '100%' }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '0',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            wordBreak: 'break-word',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {celebration?.Title}
          </h3>
          {showDesignation && (
            <p style={{
              fontSize: '9px',
              color: '#666',
              margin: '2px 0 0 0',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {celebration?.Designation}
            </p>
          )}
        </div>

        <p style={{
          fontSize: '10px',
          color: '#333',
          textAlign: 'center',
          lineHeight: 1.3,
          margin: '0',
          fontWeight: 500,
          width: '100%',
        }}>
          {getGreeting()}
        </p>

        <button
          onClick={() => onWish(celebration?.EmployeeEmail as string, celebration?.EventType)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 14px',
            border: `2px solid ${btnBorder}`,
            borderRadius: '50px',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            background: btnGradient,
            color: btnColor,
            transition: 'all 0.3s',
            marginTop: 'auto',
            flexShrink: 0,
            width: '100%',
            boxSizing: 'border-box',
            maxWidth: '140px',
          }}
        >
          💬 Wish
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(CelebrationCard);