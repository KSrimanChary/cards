import * as React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IEmployeeCelebration } from '../../../../models/IEmployeeCelebration';
import CelebrationCard from '../CelebrationCard';
import EmptyState from '../EmptyState';
import { ICelebrationService } from '../../../../services/CelebrationService-GraphAPI';
import { AnniversaryWishes } from '../../../../Constants/AnniversaryWishes';
import { BirthdayWishes } from '../../../../Constants/BirthdayWishes';
import styles from '../CelebCards.module.scss';


interface ICelebrationCarouselProps {
    context?: any;
    celebrationService?: ICelebrationService;
}

const AUTO_PLAY_INTERVAL = 3000;
const CARD_WIDTH = 180;
const CONTAINER_PADDING = 24;


const CelebrationCarousel: React.FC<ICelebrationCarouselProps> = ({
    context,
    celebrationService
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [celebrations, setCelebrations] = React.useState<IEmployeeCelebration[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Fetch user profile picture from REST API
    const getUserProfilePicture = async (userEmail: string): Promise<string> => {
        try {
            if (!context || !userEmail) return '';
            
            const userProfileUrl = `${context.pageContext.web.absoluteUrl}/_api/web/SiteUserInfoList/Items?$filter=EMail eq '${userEmail}'&$select=ID`;
            const response = await fetch(userProfileUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            if (responseData.value && responseData.value.length > 0) {
                // const userId = responseData.value[0].ID;
                // Return user profile picture URL
                return `${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?size=M&username=${userEmail}`;
            }
            return '';
        } catch (error) {
            console.error("Error fetching user profile picture:", error);
            return '';
        }
    };

    React.useEffect(() => {
        const loadCelebrations = async () => {
            try {
                setIsLoading(true);
                let data: IEmployeeCelebration[] = [];

                if (celebrationService) {
                    data = await celebrationService.getTodaysCelebrations();
                } 
                else if (context) {
                    const listUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Employee Celebration Details')/RenderListDataAsStream`;
                    const response = await fetch(listUrl, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json;odata=nometadata',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            parameters: {
                                ViewXml: `
                                    <View>
                                        <ViewFields>
                                            <FieldRef Name='ID'/>
                                            <FieldRef Name='Title'/>
                                            <FieldRef Name='Designation'/>
                                            <FieldRef Name='Employee'/>
                                            <FieldRef Name='Employee_x0020_Photo'/>
                                            <FieldRef Name='Event_x0020_Type'/>
                                            <FieldRef Name='Event_x0020_Date'/>
                                            <FieldRef Name='Is_x0020_Active'/>
                                            <FieldRef Name='Custom_x0020_Message'/>
                                        </ViewFields>
                                        <RowLimit>100</RowLimit>
                                    </View>`
                            }
                        })
                    });

                    const responseData = await response.json();
                    data = (responseData.Row || [])
                        .filter((item: any) => item["Is_x0020_Active.value"] === "1")
                        .map((item: any) => {
                            let photoUrl = '';
                            const photo = item.Employee_x0020_Photo;
                            
                            // Use uploaded photo if available
                            if (photo?.fileName) {
                                photoUrl = `${context.pageContext.web.absoluteUrl}/Lists/Employee Celebration Details/Attachments/${item.ID}/${photo.fileName}`;
                            }
                            
                            const employeeEmail = item.Employee?.[0]?.email || '';
                            
                            return {
                                Id: item.ID,
                                Title: item.Title || '',
                                EmployeePhoto: photoUrl,
                                Designation: item.Designation || '',
                                EventType: item.Event_x0020_Type || 'Birthday',
                                EventDate: item.Event_x0020_Date,
                                IsActive: item.Is_x0020_Active,
                                CustomMessage: item.Custom_x0020_Message || '',
                                EmployeeEmail: employeeEmail,
                                EmployeeId: item.Employee?.[0]?.id || null,
                            };
                        });

                    // Fetch profile pictures for items without photos
                    const celebrationsWithPhotos = await Promise.all(
                        data.map(async (item) => {
                            if (!item.EmployeePhoto && item.EmployeeEmail) {
                                const profilePhoto = await getUserProfilePicture(item.EmployeeEmail);
                                return {
                                    ...item,
                                    EmployeePhoto: profilePhoto || item.EmployeePhoto,
                                };
                            }
                            return item;
                        })
                    );

                    data = celebrationsWithPhotos;
                }

                setCelebrations(data);
                setCurrentIndex(0);
            } catch (error) {
                console.error("Error loading celebrations:", error);
                setCelebrations([]);
            } finally {
                setIsLoading(false);
            }
        };

        void loadCelebrations();
    }, [context, celebrationService]);

    // Measure container width
    React.useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const memoizedCelebrations = React.useMemo(
        () => celebrations,
        [celebrations]
    );

    // Calculate how many cards can fit
    const cardsPerRow = React.useMemo(() => {
        if (containerWidth === 0) return 1;
        const availableWidth = containerWidth - CONTAINER_PADDING;
        const fit = Math.floor(availableWidth / CARD_WIDTH);
        return Math.max(1, fit);
    }, [containerWidth]);

    // Determine if carousel is needed
    const needsCarousel = memoizedCelebrations.length > cardsPerRow;

    React.useEffect(() => {
        if (currentIndex >= memoizedCelebrations.length) {
            setCurrentIndex(0);
        }
    }, [memoizedCelebrations.length, currentIndex]);

    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev >= memoizedCelebrations.length - 1 ? 0 : prev + 1
        );
    }, [memoizedCelebrations.length]);

    const prevSlide = React.useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? memoizedCelebrations.length - 1 : prev - 1
        );
    }, [memoizedCelebrations.length]);

    React.useEffect(() => {
        if (isPaused || memoizedCelebrations.length <= 1 || !needsCarousel) return;

        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(timer);
    }, [isPaused, nextSlide, memoizedCelebrations.length, needsCarousel]);

    const handleWish = React.useCallback((email: string, eventType: string): void => {
        if (!email) {
            alert('Unable to send wishes - email not available');
            return;
        }
        const message = eventType === 'Anniversary' 
            ? AnniversaryWishes.getRandomWish() 
            : BirthdayWishes.getRandomWish();
        const encodedMessage = encodeURIComponent(message);
        const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}&message=${encodedMessage}`;
        window.open(teamsUrl, '_blank');
    }, []);

    if (isLoading) {
        return <div className={styles.loadingText}>Loading celebrations...</div>;
    }

    return (
        <>
            {memoizedCelebrations.length > 0 ? (
                <div className={styles.celebrationContainer} ref={containerRef}>
                    <div className={styles.headerSection}>
                        <div className={styles.headerLeft}>
                            <h2 className={styles.headerTitle}>🎉 Today's Celebrations</h2>
                            <p className={styles.headerSubtitle}>Let's make their day special 💜</p>
                        </div>
                        <div className={styles.counterBadge}>
                            🎊 {memoizedCelebrations.length} Celebration{memoizedCelebrations.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Grid Layout - Show all cards that fit */}
                    {!needsCarousel && (
                        <div className={styles.gridContainer}>
                            {memoizedCelebrations.map((item) => (
                                <div key={item?.Id} className={styles.gridItem}>
                                    <CelebrationCard
                                        celebration={item}
                                        onWish={handleWish}
                                        showDesignation={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Carousel Layout - Only when cards overflow */}
                    {needsCarousel && (
                        <>
                            <div 
                                className={styles.carouselWrapper}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <button 
                                    className={styles.navButton}
                                    onClick={prevSlide}
                                    aria-label="Previous"
                                >
                                    <FaChevronLeft size={14} />
                                </button>

                                <div className={styles.carouselViewport}>
                                    <motion.div
                                        className={styles.carouselTrack}
                                        animate={{ x: `-${currentIndex * 100}%` }}
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    >
                                        {memoizedCelebrations.map((item) => (
                                            <div key={item?.Id} className={styles.carouselItem}>
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
                                    className={styles.navButton}
                                    onClick={nextSlide}
                                    aria-label="Next"
                                >
                                    <FaChevronRight size={14} />
                                </button>
                            </div>

                            <div className={styles.paginationContainer}>
                                {memoizedCelebrations.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.paginationDot} ${currentIndex === index ? styles.active : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <EmptyState />
            )}
        </>
    );
};

export default CelebrationCarousel;