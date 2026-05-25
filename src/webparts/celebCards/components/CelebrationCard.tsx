import * as React from 'react';
import { motion } from 'framer-motion';
import { FaBirthdayCake, FaTrophy } from 'react-icons/fa';
import TeamsWishButton from './TeamsWishButton';
import { IEmployeeCelebration } from '../../../models/IEmployeeCelebration';
import styles from './CelebCards.module.scss';

export interface ICelebrationCardProps {
  celebration: IEmployeeCelebration;
  onWish: (email: string) => void;
  showDesignation?: boolean;
}

const CelebrationCard: React.FC<ICelebrationCardProps> = ({
  celebration,
  onWish,
  showDesignation = true,
}) => {
  const isBirthday = celebration.EventType === 'Birthday';
  const cardClass = isBirthday ? styles.birthdayCard : styles.anniversaryCard;




  const getGreeting = (): string => {
    if (isBirthday) {
      return 'Wishing you happiness, success and wonderful memories today.';
    }
    const years = celebration.YearsCompleted || 1;
    return `Congratulations on completing ${years} wonderful year${years > 1 ? 's' : ''} with the team.`;
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
            src={celebration.EmployeePhoto || 'https://via.placeholder.com/200'}
            alt={celebration.Title}
            className={styles.employeePhoto}
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200')}
          />
          <div className={styles.photoGlow}></div>
        </motion.div>

        <motion.div
          className={styles.nameSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.employeeName}>{celebration.Title}</h3>
          {showDesignation && (
            <p className={styles.designation}>{celebration.Designation}</p>
          )}
        </motion.div>

        <motion.p
          className={styles.greeting}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {celebration.CustomMessage || getGreeting()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TeamsWishButton
            email={celebration?.EmployeeEmail}
            onWish={onWish}
            isBirthday={isBirthday}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(CelebrationCard);