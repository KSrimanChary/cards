import * as React from 'react';
import {
    motion,
    // AnimatePresence 
} from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IEmployeeCelebration } from '../../../../models/IEmployeeCelebration';
import styles from '../CelebCards.module.scss';
import CelebrationCard from '../CelebrationCard';
import EmptyState from '../EmptyState';
import CelebrationHeader from './CelebrationHeader';


interface ICelebrationCarouselProps {
    celebrations: IEmployeeCelebration[];
    cardsToShow?: number;
}

const AUTO_PLAY_INTERVAL = 1000;

const CelebrationCarousel: React.FC<ICelebrationCarouselProps> = ({
    celebrations, cardsToShow = 3
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
 

    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev >= celebrations.length - cardsToShow
                ? 0
                : prev + 1
        );
    }, [celebrations.length, cardsToShow]);


    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0
                ? celebrations.length - cardsToShow
                : prev - 1
        );
    };
    
    React.useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(timer);
    }, [isPaused, nextSlide]);

    const handleWish = (email: string): void => {
        alert(`Wish sent to ${email}`);
    };

    return (
        <>
            {celebrations.length > 0 ? (
                <div className={styles.celebrationHub}>
                <CelebrationHeader count={celebrations.length} />
                    <div
                        className={styles.carouselWrapper}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <button
                            className={styles.navPrev}
                            onClick={prevSlide}
                        >
                            <FaChevronLeft />
                        </button>
                        <div className={styles.carouselViewport}>
                            <motion.div
                                className={styles.carouselTrack}
                                animate={{
                                    x: `-${currentIndex * (100 / cardsToShow)}%`
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: 'easeInOut'
                                }}
                            >
                                {celebrations.map((item) => (
                                    <div
                                        key={item.Id}
                                        className={styles.carouselItem}
                                        style={{
                                            minWidth: `${100 / cardsToShow}%`
                                        }}
                                    >
                                        <CelebrationCard
                                            celebration={item}
                                            onWish={handleWish}
                                            showDesignation={true}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <button
                            className={styles.navNext}
                            onClick={nextSlide}
                        >
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className={styles.paginationContainer}>
                        {celebrations.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.paginationBullet} ${currentIndex === index
                                        ? styles.paginationBulletActive
                                        : ''
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <EmptyState />
            )}
        </>
    );
};

export default CelebrationCarousel;