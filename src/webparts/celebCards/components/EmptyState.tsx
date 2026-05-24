import * as React from 'react';
import { motion } from 'framer-motion';
import { MdEventNote } from 'react-icons/md';
import styles from './CelebCards.module.scss';
const EmptyState: React.FC = () => {
  return (
    <motion.div
      className={styles.emptyState}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <MdEventNote size={80} className={styles.emptyIcon} />
      </motion.div>
      <h2 className={styles.emptyTitle}>🎉 No celebrations today</h2>
      <p className={styles.emptySubtitle}>Stay tuned for upcoming celebrations.</p>
      <motion.div
        className={styles.emptyConfetti}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ✨ ✨ ✨
      </motion.div>
    </motion.div>
  );
};

export default React.memo(EmptyState);
