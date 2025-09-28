// components/AmenityIcons.tsx
import { AmenitiesStatus } from '../data/mockData';

interface AmenityIconsProps {
  amenitiesStatus: AmenitiesStatus;
}

const AmenityIcons = ({ amenitiesStatus }: AmenityIconsProps) => {
  const amenityIcons = [
    { 
      key: 'parking', 
      label: '停车', 
      icon: <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.28951 0H2.49951C1.39951 0 0.499512 0.9 0.499512 2V16C0.499512 17.1 1.39951 18 2.49951 18C3.59951 18 4.49951 17.1 4.49951 16V12H7.49951C11.0695 12 13.9195 8.87 13.4495 5.21C13.0595 2.19 10.3395 0 7.28951 0ZM7.69951 8H4.49951V4H7.69951C8.79951 4 9.69951 4.9 9.69951 6C9.69951 7.1 8.79951 8 7.69951 8Z" fill="#0768FD"/></svg>,
      hasAmenity: amenitiesStatus.parking === 1
    },
    { 
      key: 'wifi', 
      label: 'Wi-fi', 
      icon: <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 4.77613L2 6.77613C6.97 1.80613 15.03 1.80613 20 6.77613L22 4.77613C15.93 -1.29387 6.08 -1.29387 0 4.77613ZM8 12.7761L11 15.7761L14 12.7761C12.35 11.1161 9.66 11.1161 8 12.7761ZM4 8.77613L6 10.7761C8.76 8.01613 13.24 8.01613 16 10.7761L18 8.77613C14.14 4.91613 7.87 4.91613 4 8.77613Z" fill="#0768FD"/></svg>,
      hasAmenity: amenitiesStatus.wifi === 1
    },
    { 
      key: 'restaurant', 
      label: '餐厅', 
      icon: <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 4V12H16V20H18V0C15.24 0 13 2.24 13 4ZM8 7H6V0H4V7H2V0H0V7C0 9.21 1.79 11 4 11V20H6V11C8.21 11 10 9.21 10 7V0H8V7Z" fill="#0768FD"/></svg>,
      hasAmenity: amenitiesStatus.restaurant === 1
    },
    { 
      key: 'toilet', 
      label: '厕所', 
      icon: <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 20V12.5H0.5V7C0.5 5.9 1.4 5 2.5 5H5.5C6.6 5 7.5 5.9 7.5 7V12.5H6V20H2ZM14.5 20V14H17.5L14.96 6.37C14.68 5.55 13.92 5 13.06 5H12.94C12.08 5 11.31 5.55 11.04 6.37L8.5 14H11.5V20H14.5ZM4 4C5.11 4 6 3.11 6 2C6 0.89 5.11 0 4 0C2.89 0 2 0.89 2 2C2 3.11 2.89 4 4 4ZM13 4C14.11 4 15 3.11 15 2C15 0.89 14.11 0 13 0C11.89 0 11 0.89 11 2C11 3.11 11.89 4 13 4Z" fill="#0768FD"/></svg>,
      hasAmenity: amenitiesStatus.toilet === 1
    },
  ];

  const availableAmenities = amenityIcons.filter(amenity => amenity.hasAmenity);

  return (
    <div className="amenity-icons-container">
      {availableAmenities.map((amenity, index) => (
        <div key={index} className="amenity-item">
          <div className="icon-placeholder">{amenity.icon}</div>
          <p>{amenity.label}</p>
        </div>
      ))}
      <style jsx>{`
        .amenity-icons-container {
          display: flex;
          padding: 0 7px 0 8px;
          margin: 0;
          background-color: white;
          width: 375px;
          box-sizing: border-box;
        }
        .amenity-item { 
          text-align: center; 
          color: #1B1446; 
          display: flex;
          flex-direction: column;
          align-items: center;
          width: calc((375px - 15px) / 4);
          min-width: 0;
        }
        .icon-placeholder {
          width: 40px;
          height: 40px;
          background-color: #0768FD1A;
          border-radius: 8%;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-placeholder svg { 
          width: 24px; 
          height: 24px; 
          color: #333; 
        }
        p {
          font-size: 14px;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default AmenityIcons;