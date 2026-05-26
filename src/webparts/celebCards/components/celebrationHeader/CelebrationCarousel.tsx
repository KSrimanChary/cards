import * as React from 'react';
import {
    motion,
} from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IEmployeeCelebration } from '../../../../models/IEmployeeCelebration';
import styles from '../CelebCards.module.scss';
import CelebrationCard from '../CelebrationCard';
import EmptyState from '../EmptyState';
import CelebrationHeader from './CelebrationHeader';
import { ICelebrationService } from '../../../../services/CelebrationService-GraphAPI';


interface ICelebrationCarouselProps {
    context?: any;
    cardsToShow?: number;
    celebrationService?: ICelebrationService;
}

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds


const CelebrationCarousel: React.FC<ICelebrationCarouselProps> = ({
    context, 
    cardsToShow = 3,
    celebrationService
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [celebrations, setCelebrations] = React.useState<IEmployeeCelebration[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const loadCelebrations = React.useCallback(async () => {
        try {
            setIsLoading(true);
            
            let data: IEmployeeCelebration[] = [];

            if (celebrationService) {
                data = await celebrationService.getTodaysCelebrations();
                console.log(`Loaded ${data.length} celebrations from service`);
            } else if (context) {
                // ✅ Fallback to direct API call
                const listUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Employee Celebration Details')/items?$select=ID,Title,Designation,Employee_x0020_Photo,Event_x0020_Type,Event_x0020_Date,Is_x0020_Active,Custom_x0020_Message,Date_x0020_of_x0020_Join`;
                
                const response = await fetch(listUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    console.warn(`List not found or error: ${response.status}`);
                    data = [];
                } else {
                    const responseData = await response.json();
                    data = (responseData.value || []).map((item: any) => ({
                        Id: item.ID,
                        Title: item.Title || '',
                        EmployeeEmail: item.Employee || '',
                        EmployeePhoto: item.Employee_x0020_Photo?.Url || '',
                        Designation: item.Designation || '',
                        EventType: item.Event_x0020_Type || 'Birthday',
                        EventDate: item.Event_x0020_Date || new Date().toISOString(),
                        IsActive: item.Is_x0020_Active ?? true,
                        CustomMessage: item.Custom_x0020_Message || '',
                        YearsCompleted: 0
                    }));
                    console.log(`Loaded ${data.length} celebration items`);
                }
            }

            setCelebrations(data);
        } catch (error) {
            console.error("Error loading celebrations:", error);
            setCelebrations([]);
        } finally {
            setIsLoading(false);
        }
    }, [context, celebrationService]);

    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev >= celebrations.length - cardsToShow
                ? 0
                : prev + 1
        );
    }, [celebrations.length, cardsToShow]);

    const prevSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0
                ? Math.max(celebrations.length - cardsToShow, 0)
                : prev - 1
        );
    }, [celebrations.length, cardsToShow]);

    // Load celebrations on mount
    React.useEffect(() => {
        void loadCelebrations();
    }, [loadCelebrations]);

    // Auto-play carousel
    React.useEffect(() => {
        if (isPaused || celebrations.length === 0) return;

        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(timer);
    }, [isPaused, nextSlide, celebrations.length]);

    const handleWish = (email: string): void => {
        alert(`Wish sent to ${email}`);
    };

    if (isLoading) {
        return <div className={styles.loadingContainer}>Loading celebrations...</div>;
    }

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
                            aria-label="Previous celebration"
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
                            aria-label="Next celebration"
                        >
                            <FaChevronRight />
                        </button>
                    </div>

                    {celebrations.length > 1 && (
                        <div className={styles.paginationContainer}>
                            {celebrations.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.paginationBullet} ${currentIndex === index
                                        ? styles.paginationBulletActive
                                        : ''
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState />
            )}
        </>
    );
};

export default CelebrationCarousel;