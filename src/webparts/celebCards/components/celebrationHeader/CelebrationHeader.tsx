import * as React from 'react';
import { motion } from 'framer-motion';

export interface ICelebrationHeaderProps {
  count: number;
}

const CelebrationHeader: React.FC<ICelebrationHeaderProps> = ({ count }) => {
  return (
    <motion.div
      className="d-flex align-items-center justify-content-between gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#ff6b9d',
          margin: '0',
          letterSpacing: '-0.3px',
        }}>
          🎉 Today's Celebrations
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#666',
          margin: '2px 0 0 0',
          fontWeight: 400,
        }}>
          Let's make their day special 💜
        </p>
      </div>

      <motion.div
        className="text-white p-2"
        style={{
          background: 'linear-gradient(135deg, #ff6b9d 0%, #ff1493 100%)',
          borderRadius: '50px',
          fontSize: '11px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 3px 8px rgba(255, 107, 157, 0.3)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
      >
        🎊 {count} Celebration{count !== 1 ? 's' : ''}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(CelebrationHeader);