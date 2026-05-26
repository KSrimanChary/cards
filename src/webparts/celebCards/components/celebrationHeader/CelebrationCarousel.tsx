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
import { AnniversaryWishes } from '../../../../Constants/AnniversaryWishes';
import { BirthdayWishes } from '../../../../Constants/BirthdayWishes';


interface ICelebrationCarouselProps {
    context?: any;
    cardsToShow?: number;
    celebrationService?: ICelebrationService;
}

const AUTO_PLAY_INTERVAL = 2000; 


const CelebrationCarousel: React.FC<ICelebrationCarouselProps> = ({
    context, 
    cardsToShow = 3,
    celebrationService
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [celebrations, setCelebrations] = React.useState<IEmployeeCelebration[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);


    const getUserImage = (item: IEmployeeCelebration, webUrl: string): string => {
    const email = item.Employee?.Email || item.EmployeeEmail;

    const spUserPhoto = 
        email
            ? `${webUrl}/_layouts/15/userphoto.aspx?size=M&username=${email}`
            : '';
        return spUserPhoto;
    };

    // Load celebrations only on mount
    React.useEffect(() => {
        const loadCelebrations = async () => {
            try {
                setIsLoading(true);
                
                let data: IEmployeeCelebration[] = [];

                if (celebrationService) {
                    data = await celebrationService.getTodaysCelebrations();
                    console.log(`Loaded ${data.length} celebrations from service`);
                } else if (context) {
                    const listUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Employee Celebration Details')/items?$select=ID,Title,Designation,Employee/Title,Employee/EMail,Employee/Id,Employee_x0020_Photo,Event_x0020_Type,Event_x0020_Date,Is_x0020_Active,Custom_x0020_Message,Date_x0020_of_x0020_Join&$expand=Employee&$filter=Is_x0020_Active eq 1`;
                    const response = await fetch(listUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json;odata=nometadata',
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
                            EmployeePhoto: item.Employee_x0020_Photo?.Url || getUserImage(item, context.pageContext.web.absoluteUrl),
                            Designation: item.Designation || '',
                            EventType: item.Event_x0020_Type || 'Birthday',
                            EventDate: item.Event_x0020_Date || new Date().toISOString(),
                            IsActive: item.Is_x0020_Active ?? true,
                            CustomMessage: item.Custom_x0020_Message || '',
                            Employee: item.Employee,
                            EmployeeEmail: item.Employee?.EMail || '',
                            YearsCompleted: 0
                        }));
                        console.log(`Loaded ${data.length} celebration items`);
                    }
                }

                setCelebrations(data);
                setCurrentIndex(0); // Reset index when celebrations load
            } catch (error) {
                console.error("Error loading celebrations:", error);
                setCelebrations([]);
            } finally {
                setIsLoading(false);
            }
        };

        void loadCelebrations();
    }, []); // Empty dependency array - load only on mount

    // Memoize celebrations array to prevent unnecessary re-renders of CelebrationCard components
    const memoizedCelebrations = React.useMemo(
        () => celebrations,
        [celebrations]
    );
    const actualCardsToShow = React.useMemo(
        () => Math.min(memoizedCelebrations.length, cardsToShow) || 1,
        [memoizedCelebrations.length, cardsToShow]
    );
    
    // Calculate card width percentage based on actual visible cards
    const cardWidthPercentage = React.useMemo(
        () => 100 / actualCardsToShow,
        [actualCardsToShow]
    );

    // Calculate the maximum slide index we can scroll to
    const maxSlideIndex = React.useMemo(
        () => Math.max(0, memoizedCelebrations.length - actualCardsToShow),
        [memoizedCelebrations.length, actualCardsToShow]
    );

    // Reset currentIndex if it exceeds maxSlideIndex when cardsToShow changes
    React.useEffect(() => {
        if (currentIndex > maxSlideIndex) {
            setCurrentIndex(Math.max(0, maxSlideIndex));
        }
    }, [maxSlideIndex, currentIndex]);

    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev >= maxSlideIndex ? 0 : prev + 1
        );
    }, [maxSlideIndex]);

    const prevSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? maxSlideIndex : prev - 1
        );
    }, [maxSlideIndex]);

    React.useEffect(() => {
        if (isPaused || celebrations.length === 0) return;

        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(timer);
    }, [isPaused, nextSlide, celebrations.length]);

    const handleWish = React.useCallback((email: string, eventType: string): void => {
        if (!email) {
            console.warn('No email address found for sending wishes');
            alert('Unable to send wishes - email not available');
            return;
        }       

        const message =
            eventType === 'Anniversary' ? AnniversaryWishes.getRandomWish() : BirthdayWishes.getRandomWish();
        const encodedMessage = encodeURIComponent(message);
        const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}&message=${encodedMessage}`;

        window.open(teamsUrl, '_blank');
    }, []);

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
                                    x: `-${currentIndex * cardWidthPercentage}%`
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: 'easeInOut'
                                }}
                            >
                                {memoizedCelebrations.map((item) => (
                                    <div
                                        key={item.Id}
                                        className={styles.carouselItem}
                                        style={{
                                            minWidth: `${cardWidthPercentage}%`
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
                            {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.paginationBullet} ${currentIndex === index
                                        ? styles.paginationBulletActive
                                        : ''
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to slide group ${index + 1}`}
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