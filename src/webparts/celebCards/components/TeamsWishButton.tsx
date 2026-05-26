import * as React from 'react';
import { motion } from 'framer-motion';
import { SiMicrosoftteams } from 'react-icons/si';
import styles from './CelebCards.module.scss';

interface ITeamsWishButtonProps {
  email: string | undefined;
  onWish: (email: string, eventType: string) => void;
  isBirthday: boolean;
}

const TeamsWishButton: React.FC<ITeamsWishButtonProps> = ({ email, onWish, isBirthday }) => {
  const handleClick = (): void => {
    if (email) {
      onWish(email, isBirthday ? 'Birthday' : 'Anniversary');
    }
  };

  return (
    <motion.button
      className={`${styles.wishButton} ${isBirthday ? styles.birthdayButton : styles.anniversaryButton}`}
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <SiMicrosoftteams size={18} />
      <span>Send Wishes</span>
    </motion.button>
  );
};

export default React.memo(TeamsWishButton);
