import * as React from 'react';
import { motion } from 'framer-motion';
import styles from '../CelebCards.module.scss';

export interface ICelebrationHeaderProps {
  count: number;
  enableCounter?: boolean;
}

const CelebrationHeader: React.FC<ICelebrationHeaderProps> = ({ count, enableCounter = true }) => {
  return (
    <motion.div
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>
          <span className={styles.emoji}>🎉</span>
          Today's Celebrations
        </h1>
        <p className={styles.subtitle}>Let's make their day even more special 💜</p>
      </div>

      {enableCounter && (
        <motion.div
          className={styles.counterBadge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <span className={styles.counterEmoji}>🎊</span>
          <span className={styles.counterText}>{count} Celebration{count !== 1 ? 's' : ''} Today</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(CelebrationHeader);
