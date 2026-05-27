import * as React from 'react';
import { motion } from 'framer-motion';
import { FaBirthdayCake, FaTrophy } from 'react-icons/fa';
import TeamsWishButton from './TeamsWishButton';
import { IEmployeeCelebration } from '../../../models/IEmployeeCelebration';
import { BirthdayWishes } from '../../../Constants/BirthdayWishes';
import { AnniversaryWishes } from '../../../Constants/AnniversaryWishes';
import styles from './CelebCards.module.scss';

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
  const cardClass = isBirthday ? styles.birthdayCard : styles.anniversaryCard;

  const getGreeting = (): string => {
    if (celebration?.CustomMessage && celebration?.CustomMessage.trim()) {
      return celebration?.CustomMessage;
    }
 
    if (isBirthday) {
      return BirthdayWishes.getRandomWish();
    }

    // const years = celebration.YearsCompleted || 1;
    // const anniversaryGreeting = `Congratulations on completing ${years} wonderful year${years > 1 ? 's' : ''} with the team.`;
    return AnniversaryWishes.getRandomWish();
  };

  return (

    <motion.div
      className={`${styles.celebrationCard} ${cardClass}`}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
    >
      <div className={styles.cardBackground}>
        <div className={styles.bgGradient}></div>
        {isBirthday ? (
          <div>
            <div className={styles.balloon}></div>
            <div className={styles.ribbon}></div>
          </div>
        ) : (
          <div className={styles.goldParticle}></div>
        )}
      </div>

      <div className={styles.cardContent}>
        <motion.div
          className={styles.cardLabel}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isBirthday ? (
            <>
              <FaBirthdayCake size={18} />
              <span>HAPPY BIRTHDAY</span>
              <FaBirthdayCake size={18} />
            </>
          ) : (
            <>
              <FaTrophy size={18} />
              <span>ANNIVERSARY</span>
              <FaTrophy size={18} />
            </>
          )}
        </motion.div>

        <motion.div
          className={styles.photoContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={celebration?.EmployeePhoto || ''}
            alt={celebration?.Title}
            className={styles.employeePhoto}
            onError={(e) => (e.currentTarget.src = '')}
          />
          <div className={styles.photoGlow}></div>
        </motion.div>

        <motion.div
          className={styles.nameSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.employeeName}>{celebration?.Title}</h3>
          {showDesignation && (
            <p className={styles.designation}>{celebration?.Designation}</p>
          )}
        </motion.div>

        <motion.p
          className={styles.greeting}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getGreeting()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TeamsWishButton
            email={celebration?.EmployeeEmail as string }
            // eventType={celebration.EventType}
            onWish={onWish}
            isBirthday={isBirthday}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(CelebrationCard);