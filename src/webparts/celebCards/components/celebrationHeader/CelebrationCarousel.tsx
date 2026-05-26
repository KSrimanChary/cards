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
    context? : any;
    cardsToShow?: number;
}

const AUTO_PLAY_INTERVAL = 1000;


const CelebrationCarousel: React.FC<ICelebrationCarouselProps> = ({
    context, cardsToShow = 3
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    let _celebrations: IEmployeeCelebration[] = [];
 
    const loadCelebrations = async () => {
        try {
          // CORRECTED: Updated list name to match Elements.xml
          const listUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Employee Celebration Details')/items`;
          
          const response = await fetch(listUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) {
            console.warn(`List not found or error: ${response.status}`);
            console.warn(`Attempted to fetch from: ${listUrl}`);
            _celebrations = [];
            return;
          }
    
          const data = await response.json();
          _celebrations = (data.value || []) as IEmployeeCelebration[];
          console.log(`Loaded ${_celebrations.length} celebration items`);
          
        } catch (error) {
          console.error("Error loading celebrations:", error);
          _celebrations = [];
        }
      }
    

    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev >= _celebrations.length - cardsToShow
                ? 0
                : prev + 1
        );
    }, [_celebrations.length, cardsToShow]);


    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0
                ? _celebrations.length - cardsToShow
                : prev - 1
        );
    };
    
    React.useEffect(() => {
        if (isPaused) return;
        loadCelebrations();
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
            {_celebrations.length > 0 ? (
                <div className={styles.celebrationHub}>
                <CelebrationHeader count={_celebrations.length} />
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
                                {_celebrations.map((item) => (
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
                        {_celebrations.map((_, index) => (
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