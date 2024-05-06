export default function SearchIcon({ onClick, className }) {
  return (
    <svg
      onClick={onClick}
      className={`icon ${className && className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#c0c2cc" />
      <path
        d="M9 9.51001L12 6.51001L15 9.51001"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.51001V14.51"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// <svg
    //   onClick={onClick}
    //   className={`icon ${className && className}`}
    //   width="20"
    //   height="20"
    //   viewBox="0 0 20 20"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M2.5 17.5L6.83058 13.1694M6.83058 13.1694C5.69956 12.0384 5 10.4759 5 8.75C5 5.29822 7.79822 2.5 11.25 2.5C14.7018 2.5 17.5 5.29822 17.5 8.75C17.5 12.2018 14.7018 15 11.25 15C9.52411 15 7.96161 14.3004 6.83058 13.1694Z"
    //     stroke="#A3A7B5"
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>