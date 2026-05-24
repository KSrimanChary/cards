// import * as React from 'react';
// import styles from './CelebCards.module.scss';
// import type { ICelebCardsProps } from '../../../models/ICelebCardsProps';
// import CelebrationCard from './CelebrationCard';
// import { IEmployeeCelebration } from '../../../models/IEmployeeCelebration';

// export default class CelebCards extends React.Component<ICelebCardsProps> {
//   public render(): React.ReactElement<ICelebCardsProps> {
//     const {
//       hasTeamsContext,
//     } = this.props;

//   const dummyCelebrations: IEmployeeCelebration[] = [
//   {
//     Id: 1,
//     Title: 'John Doe',
//     EmployeeEmail: 'john.doe@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=1',
//     Designation: 'Software Engineer',
//     EventType: 'Birthday',
//     EventDate: '2026-05-22',
//     IsActive: true,
//     CustomMessage: 'Have an amazing birthday filled with joy and success!',
//     YearsCompleted: undefined
//   },
//   {
//     Id: 2,
//     Title: 'Sarah Williams',
//     EmployeeEmail: 'sarah.williams@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=5',
//     Designation: 'Project Manager',
//     EventType: 'Work Anniversary',
//     EventDate: '2026-05-22',
//     IsActive: true,
//     CustomMessage: 'Congratulations on another successful year with the team!',
//     YearsCompleted: 5
//   },
//   {
//     Id: 3,
//     Title: 'Michael Johnson',
//     EmployeeEmail: 'michael.johnson@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=8',
//     Designation: 'UI/UX Designer',
//     EventType: 'Birthday',
//     EventDate: '2026-05-23',
//     IsActive: true,
//     YearsCompleted: undefined
//   },
//   {
//     Id: 4,
//     Title: 'Emily Davis',
//     EmployeeEmail: 'emily.davis@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=12',
//     Designation: 'HR Manager',
//     EventType: 'Work Anniversary',
//     EventDate: '2026-05-23',
//     IsActive: true,
//     CustomMessage: 'Thank you for being an invaluable part of our organization!',
//     YearsCompleted: 3
//   },
//   {
//     Id: 5,
//     Title: 'David Brown',
//     EmployeeEmail: 'david.brown@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=15',
//     Designation: 'DevOps Engineer',
//     EventType: 'Birthday',
//     EventDate: '2026-05-24',
//     IsActive: true,
//     YearsCompleted: undefined
//   },
//   {
//     Id: 6,
//     Title: 'Sophia Miller',
//     EmployeeEmail: 'sophia.miller@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=20',
//     Designation: 'Business Analyst',
//     EventType: 'Work Anniversary',
//     EventDate: '2026-05-24',
//     IsActive: true,
//     CustomMessage: 'Celebrating your dedication and contributions over the years!',
//     YearsCompleted: 7
//   },
//   {
//     Id: 7,
//     Title: 'Daniel Wilson',
//     EmployeeEmail: 'daniel.wilson@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=25',
//     Designation: 'QA Engineer',
//     EventType: 'Birthday',
//     EventDate: '2026-05-25',
//     IsActive: true,
//     YearsCompleted: undefined
//   },
//   {
//     Id: 8,
//     Title: 'Olivia Taylor',
//     EmployeeEmail: 'olivia.taylor@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=30',
//     Designation: 'Marketing Specialist',
//     EventType: 'Work Anniversary',
//     EventDate: '2026-05-25',
//     IsActive: true,
//     CustomMessage: 'Wishing you continued success in your journey with us!',
//     YearsCompleted: 2
//   },
//   {
//     Id: 9,
//     Title: 'James Anderson',
//     EmployeeEmail: 'james.anderson@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=35',
//     Designation: 'Product Owner',
//     EventType: 'Birthday',
//     EventDate: '2026-05-26',
//     IsActive: true,
//     CustomMessage: 'Hope your birthday is as awesome as you are!',
//     YearsCompleted: undefined
//   },
//   {
//     Id: 10,
//     Title: 'Isabella Martinez',
//     EmployeeEmail: 'isabella.martinez@company.com',
//     EmployeePhoto: 'https://i.pravatar.cc/200?img=40',
//     Designation: 'Data Scientist',
//     EventType: 'Work Anniversary',
//     EventDate: '2026-05-26',
//     IsActive: true,
//     CustomMessage: 'Cheers to another milestone and many more achievements ahead!',
//     YearsCompleted: 4
//   }
// ];

//     return (
//       <section className={`${styles.celebCards} ${hasTeamsContext ? styles.teams : ''}`}>
//         <div className={styles.welcome}>
//           <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//       {dummyCelebrations.map((item) => (
//         <CelebrationCard
//           key={item.Id}
//           celebration={item}
//           onWish={(email: string) => {
//             alert(`Wish sent to ${email}`);
//           }}
//           showDesignation={true}
//         />
//       ))}
//     </div>
    
//         </div>
//       </section>
//     );
//   }
// }
